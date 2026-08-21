# landscape_init.toml Reference

`landscape_init.toml` is the **full configuration file**: it holds everything in `landscape.toml` (under `[config]`) plus every rule stored in the database. Its purpose is to **rebuild a whole machine from one file**.

The responsibilities are divided between this file and `landscape.toml` as
follows:

|           | `landscape.toml`                                          | `landscape_init.toml`                           |
| --------- | --------------------------------------------------------- | ----------------------------------------------- |
| Read when | Every startup                                             | **Only once, on first startup**                 |
| Contents  | Process-level settings: listen address, credentials, logs | `[config]` (i.e. the former) **plus all rules** |
| Lands in  | Process runtime configuration                             | The database                                    |

For the UI steps to export this file see [System Configuration](../advanced/settings-export), or call the API directly:

```sh
curl -k -X GET https://<router>:6443/api/v1/system/config/export \
  -H "Authorization: Bearer <token>"
```

## How it takes effect

It is only read on first startup, i.e. while `landscape_init.lock` does **not** exist:

1. No `landscape_init.lock` → read `landscape_init.toml`
2. Validate `version`
3. **Clear the existing configuration** and rebuild from the file
4. Write `landscape_init.lock`; later startups no longer read the file

If `landscape_init.toml` is absent and the lock is too, it initialises with an empty configuration.

::: danger
Deleting `landscape_init.lock` makes the next startup **replace the current
configuration** with the contents of `landscape_init.toml`. If the init file is
missing or incomplete, current settings will be lost. Verify the file before
deleting the lock.
:::

## The `version` field (required)

```toml
version = "0.22.2"
```

::: warning
This field is checked for **exact equality**, not "greater than or equal". Any mismatch with the running program's version **fails and exits** (`init_config.version_mismatch`) — no migration is attempted. Omitting the field is equivalent to an empty string, which also fails to match.

So the correct order for a cross-version restore is: start **the version you exported from** and let it complete the init restore, then start the new version and let the database migrate itself. Feeding an old init file straight to a new version does not work.
:::

## All configuration sections

Apart from `version` and `config`, everything is an **array section**, written repeatedly as `[[key]]`. All are optional.

| TOML key                 | Purpose                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `config`                 | Identical to all of `landscape.toml`, see [Configuration File Guide](./index)                       |
| `ifaces`                 | Interface definitions: zone, enable-on-boot, bridge/VLAN creation type, XPS/RPS                     |
| `ipconfigs`              | How an interface gets its IP: static / DHCP client / PPPoE                                          |
| `pppds`                  | PPPoE dial-up service (attached to a physical interface, producing a `ppp` interface)               |
| `nats`                   | NAT service and port ranges on WAN interfaces                                                       |
| `marks`                  | Enables the traffic-marking service on a WAN interface (prerequisite for flows)                     |
| `route_wans`             | WAN-side routing service                                                                            |
| `route_lans`             | LAN-side routing service and static routes                                                          |
| `mss_clamps`             | MSS clamping (avoids large packets being dropped on PPPoE / tunnels)                                |
| `firewalls`              | Enables the inbound firewall service per interface                                                  |
| `firewall_rules`         | Firewall allow/deny rules                                                                           |
| `firewall_blacklists`    | Firewall blacklist sources                                                                          |
| `static_nat_mappings_v4` | IPv4 static mappings (port forwarding / DMZ)                                                        |
| `static_nat_mappings_v6` | IPv6 static mappings                                                                                |
| `dhcpv4_services`        | DHCPv4 server for the LAN, see [DHCPv4 Server](../reference/dhcpv4)                                 |
| `dhcpv6pds`              | WAN-side DHCPv6-PD prefix delegation client                                                         |
| `lan_ipv6s`              | LAN-side IPv6 advertisement (SLAAC / DHCPv6), see [LAN IPv6 allocation](../reference/ipv6/lan-ipv6) |
| `wifi_configs`           | Wireless access point configuration (the body is hostapd configuration text)                        |
| `enrolled_devices`       | Enrolled devices: static IP bindings, hostnames, tags, per-device DHCP options                      |
| `flow_rules`             | Flow rules (flow definitions and targets), see [Traffic Shaping](../features/traffic-flow)          |
| `dst_ip_mark`            | Rules that mark traffic by destination IP / GeoIP                                                   |
| `dns_upstream_configs`   | Upstream DNS servers (referenced by id from `dns_rules`)                                            |
| `dns_rules`              | DNS flow rules: match domains → pick upstream + mark + result filter                                |
| `dns_redirects`          | DNS redirects (split-horizon: answer a domain with a chosen IP)                                     |
| `dns_provider_profiles`  | DNS provider credentials (used by DDNS and certificate DNS-01)                                      |
| `ddns_jobs`              | DDNS jobs                                                                                           |
| `cert_accounts`          | ACME accounts                                                                                       |
| `certs`                  | Certificate orders and material, see [Certificates](../reference/certificates)                      |
| `gateway_rules`          | Domain → upstream rules for the HTTP reverse proxy                                                  |
| `geo_ips`                | GeoIP data sources                                                                                  |
| `geo_sites`              | GeoSite data sources                                                                                |

## Shared field conventions

Most sections share these fields, so the examples below do not explain them again:

| Field             | Description                                                                                                                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`              | UUID primary key. **Can be omitted**, in which case one is generated. But if the entry is referenced by id elsewhere (e.g. `dns_rules.upstream_id` pointing at `dns_upstream_configs.id`), it must be written out explicitly and kept consistent |
| `update_at`       | Update timestamp (seconds, float). Optional; defaults to the current time                                                                                                                                                                        |
| `enable`          | Whether the entry is enabled                                                                                                                                                                                                                     |
| `iface_name`      | The interface this configuration is bound to                                                                                                                                                                                                     |
| `index`           | Priority; lower numbers match first (rule sections)                                                                                                                                                                                              |
| `remark` / `name` | Note / display name                                                                                                                                                                                                                              |

## Examples for common sections

### Interfaces and zones

```toml
# A physical WAN port
[[ifaces]]
name = "ens3"                          # interface name
create_dev_type = "no_need_to_create"  # physical interfaces do not need creating
zone_type = "wan"                      # undefined / wan / lan
enable_in_boot = true                  # bring this interface up at startup too
wifi_mode = "undefined"                # undefined / client / ap

# xps_rps, for spreading load across CPUs; needed when single-core performance is weak
[ifaces.xps_rps]
xps = "4"
rps = "4"

# A LAN bridge (created by landscape)
[[ifaces]]
name = "br_lan"
create_dev_type = "bridge"
zone_type = "lan"
enable_in_boot = true

# Attaching a physical port to the bridge: point controller_name at the bridge
[[ifaces]]
name = "ens4"
create_dev_type = "no_need_to_create"
controller_name = "br_lan"
enable_in_boot = true
```

### Interface IP configuration

`ip_model.t` is one of `nothing` / `static` / `pppoe` / `dhcpclient`.

```toml
# Static IP
[[ipconfigs]]
iface_name = "ens3"
enable = true

[ipconfigs.ip_model]
t = "static"
default_router_ip = "10.1.1.10"  # router IP
default_router = true            # whether to set default_router_ip as the default route
ipv4 = "10.1.1.237"              # the static IP to set on this interface
ipv4_mask = 24

# DHCP client
[[ipconfigs]]
iface_name = "ens3"
enable = true

[ipconfigs.ip_model]
t = "dhcpclient"
default_router = true
hostname = "landscape-router"
```

### PPPoE dial-up

PPPoE has **two mutually exclusive paths**; only one can be used per physical interface:

::: code-group

```toml [Option 1: native via ipconfigs]
[[ipconfigs]]
iface_name = "ens3"
enable = true

[ipconfigs.ip_model]
t = "pppoe"
default_router = true
username = "your-account"
password = "your-password"
mtu = 1492
# ac_name = "..."   # optional, to pin an Access Concentrator
```

```toml [Option 2: standalone pppds service]
[[pppds]]
attach_iface_name = "ens3"   # the physical interface to attach to
iface_name = "ppp-wan"       # the ppp interface produced; must not clash with an existing one
enable = true

[pppds.pppd_config]
default_route = true
peer_id = "your-account"     # note the field is peer_id, not username
password = "your-password"
plugin = "rp_pppoe"          # rp_pppoe / pppoe
# ac = "..."                 # optional
```

:::

::: warning
The two paths cannot both be enabled on the same physical interface. If an interface's `ipconfigs` is already `t = "pppoe"` and enabled, creating an enabled `pppds` for it is rejected (`Interface ... already uses native PPPoE in IP Config`). A `pppds.iface_name` that collides with any existing interface is rejected too.
:::

### NAT service

```toml
[[nats]]
iface_name = "ppp-wan"
enable = true

[nats.nat_config]
tcp_range = { start = 32768, end = 65535 }
udp_range = { start = 32768, end = 65535 }
icmp_in_range = { start = 32768, end = 65535 }
```

### DHCPv4 service

```toml
[[dhcpv4_services]]
iface_name = "br_lan"
enable = true

[dhcpv4_services.config]
ip_range_start = "192.168.5.100"
ip_range_end = "192.168.5.255"   # optional, and exclusive (the address itself is not handed out)
server_ip_addr = "192.168.5.1"   # also the gateway address advertised to clients
network_mask = 24
address_lease_time = 43200       # optional, seconds. 12 hours by default
custom_options = []              # custom options, see the DHCPv4 Server page
```

::: warning
The old `mac_binding_records` field has **been removed**. MAC-to-IP bindings now live in `enrolled_devices`, and old configurations are migrated automatically by the database. Do not use that field when writing an init file by hand.
:::

### Enrolled devices (static bindings / hostnames)

```toml
[[enrolled_devices]]
name = "NAS"
mac = "00:11:22:33:44:55"
ipv4 = "192.168.5.10"            # optional, static IPv4
hostname = "nas"                 # optional, resolves as nas.<lan_suffix> on the LAN
tag = ["Home"]                   # optional, grouping tags
iface_name = "br_lan"            # optional
```

::: tip
Combine `hostname` with the suffix from `[lan_hostname]` to reach devices by name; see [LAN Hostnames and the LAN Suffix](../reference/lan-hostname).

Changes to a device's `dhcp_custom_options` / `dhcp_filter_options` **require restarting the DHCP service**.
:::

### DNS upstreams and flow rules

`dns_rules.upstream_id` references `dns_upstream_configs` by id — the classic case where you **must** write `id` out explicitly.

```toml
# Upstream: plaintext DNS
[[dns_upstream_configs]]
id = "11111111-1111-1111-1111-111111111111"
remark = "ISP DNS"
ips = ["223.5.5.5"]

[dns_upstream_configs.mode]
t = "plaintext"      # plaintext / tls / https / quic

# Upstream: DoH
[[dns_upstream_configs]]
id = "22222222-2222-2222-2222-222222222222"
remark = "Cloudflare DoH"
ips = ["1.1.1.1"]

[dns_upstream_configs.mode]
t = "https"
domain = "cloudflare-dns.com"
http_endpoint = "/dns-query"

# Rule: matching domains go through the chosen upstream
[[dns_rules]]
name = "overseas domains"
index = 1
enable = true
filter = "unfilter"                                    # unfilter / only_ipv4 / only_ipv6
upstream_id = "22222222-2222-2222-2222-222222222222"
flow_id = 0

[dns_rules.mark]
action = { t = "keep_going" }   # keep_going / direct / drop / redirect
allow_reuse_port = false
flow_id = 0

# Match source: a domain written directly
[[dns_rules.source]]
t = "config"
match_type = "domain"    # plain / regex / domain / full
value = "example.com"

# Match source: referencing geosite
[[dns_rules.source]]
t = "geo_key"
name = "geosite"         # matches the name in geo_sites
key = "GEOLOCATION-!CN"
inverse = false
```

::: tip
`filter = "only_ipv4"` strips AAAA records, which is commonly used to make clients fall back to IPv4 when only an IPv4 egress exists.
:::

### DNS redirects (split-horizon)

```toml
[[dns_redirects]]
remark = "reach the NAS directly"
enable = true
answer_mode = "static_ips"      # static_ips / all_local_ips
result_info = ["192.168.5.10"]
apply_flows = [0]               # applies to every flow when empty

[[dns_redirects.match_rules]]
t = "config"
match_type = "full"
value = "nas.example.com"
```

### Static mappings (port forwarding)

```toml
[[static_nat_mappings_v4]]
enable = true
remark = "expose HTTPS"
wan_iface_name = "ppp-wan"
l4_protocols = [6]                                   # IANA protocol numbers: 6=TCP, 17=UDP
mapping_pair_ports = [{ wan_port = 443, lan_port = 443 }]

[static_nat_mappings_v4.lan_target]
t = "address"                                        # address / local / device
ipv4 = "192.168.5.10"
```

### Geo data sources

```toml
[[geo_sites]]
name = "geosite"
enable = true

[geo_sites.source]
t = "url"
url = "https://example.com/geosite.dat"
next_update_at = 0.0
geo_keys = []

[[geo_ips]]
name = "geoip"
enable = true

[geo_ips.source]
t = "url"
url = "https://example.com/geoip.dat"
next_update_at = 0.0
```

## Writing the remaining sections

`flow_rules` / `dst_ip_mark` / `lan_ipv6s` / `certs` and friends have many fields and cross-reference each other (flow ids, device ids, certificate ids), which makes them error-prone to write by hand. The recommended approach is to **configure them in the UI first, then export the init file** and use the result as a template. For the features themselves see [Traffic Shaping](../features/traffic-flow), [LAN IPv6 allocation](../reference/ipv6/lan-ipv6) and [Certificates](../reference/certificates).
