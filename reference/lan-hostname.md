# LAN Hostnames and the LAN Suffix

Gives devices on your LAN a shared domain suffix, so names like `nas` / `nas.lan` resolve straight to internal addresses, and tells clients about that suffix over DHCP so a short hostname alone is enough.

The matching configuration is the `[lan_hostname]` section of `landscape.toml`:

```toml
[lan_hostname]
enable = true
lan_suffix = "lan"
```

| Field        | Type   | Default | Description                                                           |
| ------------ | ------ | ------- | --------------------------------------------------------------------- |
| `enable`     | bool   | `true`  | When off, forward resolution, PTR and the DHCP options all stop       |
| `lan_suffix` | string | `"lan"` | The domain suffix; multi-label values such as `home.arpa` are allowed |

## Where hostnames come from

The registry has **two sources**:

| Source                    | How it happens                                                                                  | Notes                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **Enrolled devices**      | Fill in the `hostname` field in device management, see [Device Management](./device-management) | Long-lived, and takes priority           |
| **Self-reported by DHCP** | The client includes option 12 (Host Name) in its DHCP request                                   | Comes and goes with the lease, no upkeep |

::: tip When the two collide
**Enrolled devices win.** If a hostname is already claimed by an enrolled device, a DHCP client reporting the same name will not overwrite it. Conversely, a lease expiring only clears the DHCP-learned record and leaves the enrolled one alone.
:::

## Forward resolution

With `lan_suffix = "lan"` and a device whose hostname is `nas`:

```sh
dig @<router> nas.lan A       # → the device's IPv4
dig @<router> nas.lan AAAA    # → the device's IPv6 (only if one is registered)
```

::: warning
The match is against the **entire suffix**, not just the last label. With `lan_suffix = "home.lan"`, only `nas.home.lan` resolves — `nas.lan` does not. Suffix comparison is case-insensitive.
:::

## Reverse resolution (PTR)

A reverse lookup returns `<hostname>.<lan_suffix>.`:

```sh
dig @<router> -x 192.168.5.10   # → nas.lan.
```

When several hostnames share one IP, the lexicographically smallest **enrolled device** name wins; only if there is no enrolled record does it fall back to a DHCP-learned name.

::: warning PTR only answers for internal addresses
Only these ranges return a PTR — public addresses never do, to avoid polluting public reverse DNS:

- IPv4: private ranges (10/8, 172.16/12, 192.168/16), loopback, link-local (169.254/16), the carrier shared range (100.64/10), the unspecified address, and the broadcast address
- IPv6: unique local addresses (fc00::/7), loopback, link-local (fe80::/10), and the unspecified address
  :::

## The `local` zone is always answered locally

Besides the configured suffix, the `local` zone is **always answered locally**, no matter what `lan_suffix` is set to. This protects mDNS: `local` belongs to the mDNS namespace and should never be forwarded upstream.

That is also why `lan_suffix` **cannot** be set to `local` (see reserved suffixes below).

## DHCP options 15 / 119

Once enabled, the DHCP service advertises two options derived from the suffix, so a client can reach `nas.lan` by typing just `nas`:

| Option | Name          | Content                                           |
| ------ | ------------- | ------------------------------------------------- |
| 15     | Domain Name   | The suffix itself, e.g. `lan`                     |
| 119    | Domain Search | The suffix as a wire-format DNS name, e.g. `lan.` |

::: warning Only sent when the client asks
These two options travel via the **client parameter request list (option 55)**: if the client does not ask for 15 / 119 there, the server will not include them. This differs from `custom_options`, which are injected unconditionally.

When verifying with a capture, confirm the client really did request those codes. For instance, `dhcpcd` asks for them by default:

```sh
dhcpcd -T <iface> | grep -E 'new_domain_name|new_domain_search'
```

:::

Option 119 also requires the suffix to parse as a valid DNS name. If it does not, **only option 119 is skipped** — the rest of the response is returned as usual, with a warning in the log.

## Changing it at runtime

This section supports hot updates and **does not need a service restart**:

- Forward and reverse DNS switch to the new suffix immediately
- The very next DHCP response carries the new options 15 / 119

The API takes the current hash first, then submits with it, as an optimistic-concurrency check:

```sh
B=https://<router>:6443/api/v1/system
# 1. Read the current config, which also returns the hash
H=$(curl -sk $B/config/edit/lan_hostname -H "Authorization: Bearer $TOKEN" | jq -r .data.hash)
# 2. Submit with that hash
curl -sk -X POST $B/config/edit/lan_hostname -H "Authorization: Bearer $TOKEN" \
  -d "{\"new_lan_hostname\":{\"enable\":true,\"lan_suffix\":\"home.arpa\"},\"expected_hash\":\"$H\"}"
```

A hash mismatch means the config was changed elsewhere and a conflict error is returned; fetch the hash again and resubmit. There is also a read-only fast endpoint, `GET /config/lan_hostname`, which does not return a hash.

## Suffix validation rules

A submitted suffix is normalised first: surrounding whitespace and leading/trailing `.` are stripped, it is lowercased, and non-ASCII input goes through IDNA to punycode (e.g. `BÜCHER.` → `xn--bcher-kva`).

It is then validated against the table below. Failures return **400** and **leave the existing configuration untouched**:

| error_id                                        | Trigger                                                       |
| ----------------------------------------------- | ------------------------------------------------------------- |
| `lan_hostname.invalid_suffix.empty_label`       | An empty label, e.g. `home..arpa`                             |
| `lan_hostname.invalid_suffix.invalid_idna`      | IDNA conversion failed                                        |
| `lan_hostname.invalid_suffix.too_long`          | Total length > 253, or a single label > 63                    |
| `lan_hostname.invalid_suffix.invalid_hyphen`    | A label starts or ends with `-`, e.g. `-lan`                  |
| `lan_hostname.invalid_suffix.invalid_character` | A character other than alphanumerics and `-`, e.g. `lan_name` |
| `lan_hostname.invalid_suffix.reserved`          | Matches a reserved suffix below                               |

An empty suffix (or only whitespace) is not an error — it falls back to the default, `lan`.

### Reserved suffixes

These are rejected because they belong to the resolver's own namespace, and claiming them makes resolution behave inconsistently:

- **Reserved TLDs** (including subdomains): `invalid`, `test`, `onion`, `localhost`, `local`
  — so `corp.test` and `office.local` are out too
- **arpa-related**: `arpa` itself, plus `in-addr.arpa`, `ip6.arpa`, `resolver.arpa`, `ipv4only.arpa` and their subdomains

::: tip
`home.arpa` **is** allowed — it is precisely the suffix RFC 8375 designates for home networks, and it is not in the reserved list above. `mylan.arpa` and `in-addr.home.arpa` work as well.
:::

## Upgrading from older versions

This section used to be called `[hostname_registry]`. The old key is **still accepted** when reading, for compatibility with existing configuration files, but the program always writes `[lan_hostname]` when exporting.

::: danger
`[hostname_registry]` and `[lan_hostname]` appearing **together fails to parse outright**, and the program will not start. When editing the file by hand, keep only one — preferably just rename it to the new key.
:::
