# Configuration File Guide

Landscape reads configuration from these files:

- `landscape_init.toml`: a complete export containing all rule definitions and
  the settings from `landscape.toml`. Landscape reads it only during
  initialization, before `landscape_init.lock` exists. See the
  [landscape_init.toml Reference](./init-config) for every available field.
- `landscape.toml`: process settings read on every startup, including listen
  addresses, administrator credentials, and logging.

Landscape can start without either file. Use `landscape_init.toml` to provide a
complete configuration on the first startup.

## Configuration priority

The same setting can come from several places. From highest priority to lowest:

1. **Command-line arguments** — e.g. `--port 6300`
2. **Environment variables** — e.g. `LANDSCAPE_WEB_HTTP_PORT=6300`
3. **`landscape.toml`**
4. **Built-in defaults** — i.e. the "Default" column in the tables below

::: warning

- Deleting `landscape_init.lock` makes the next startup replace the current
  configuration with `landscape_init.toml`. Verify the init file before
  deleting the lock.
- Configuration paths may be absolute or relative. Paths beginning with `~`
  are not supported.
- An init file can only be restored by the same Landscape version that created
  it. For a cross-version restore, restore with the original version first,
  then start the target version so its database migrations can run. Versioned
  exports are available in v0.6.7 and later.
:::

Below, `<HOME>` refers to the configuration directory, `/root/.landscape-router` by default, changeable with `-c` / `LANDSCAPE_CONF_PATH`.

## Full landscape.toml reference

Every section and field may be omitted; omitted ones take the value in the "Default" column.

### `[auth]` management credentials

| Field        | Type   | Default  | Description    |
| ------------ | ------ | -------- | -------------- |
| `admin_user` | string | `"root"` | Login user     |
| `admin_pass` | string | `"root"` | Login password |

::: danger Change the default credentials
Change both values before exposing the management interface to an untrusted
network.
:::

### `[web]` management interface

| Field        | Type | Default         | Description                                     |
| ------------ | ---- | --------------- | ----------------------------------------------- |
| `web_root`   | path | `<HOME>/static` | Frontend static file directory                  |
| `port`       | u16  | `6300`          | HTTP listen port                                |
| `https_port` | u16  | `6443`          | HTTPS listen port                               |
| `address`    | ip   | `"::"`          | Listen address. Use `0.0.0.0` for IPv4 only     |

### `[log]` logging

| Field                    | Type  | Default       | Description                                            |
| ------------------------ | ----- | ------------- | ------------------------------------------------------ |
| `log_path`               | path  | `<HOME>/logs` | Log directory                                          |
| `debug`                  | bool  | `false`       | Debug mode. Defaults to `true` in debug builds         |
| `log_output_in_terminal` | bool  | `false`       | Also log to the terminal. `true` in debug builds        |
| `max_log_files`          | usize | `7`           | Maximum number of log files kept                       |

### `[store]` database

| Field           | Type   | Default                                        | Description               |
| --------------- | ------ | ---------------------------------------------- | ------------------------- |
| `database_path` | string | `sqlite://<HOME>/landscape_db.sqlite?mode=rwc` | Database connection string |

::: warning
The environment variable for `database_path` is **`DATABASE_URL`**. If it is
already set in the shell, a repository `.env` file, or CI, it overrides the
directory supplied with `-c`. Check this variable when configuration changes
appear to be written to an unexpected database.
:::

### `[metric]` metrics collection

Metrics land in `<HOME>/metric/`. This section can also be edited from the frontend.

| Field                           | Type  | Default    | Description                                            |
| ------------------------------- | ----- | ---------- | ------------------------------------------------------ |
| `mode`                          | enum  | `"duckdb"` | `off` disabled / `memory` in-memory only / `duckdb` on disk |
| `connect_second_window_minutes` | u64   | `5`        | Retention window for per-second connection data (minutes) |
| `connect_1m_retention_days`     | u64   | `1`        | Retention for 1-minute granularity connection data (days) |
| `connect_1h_retention_days`     | u64   | `7`        | Retention for 1-hour granularity connection data (days) |
| `connect_1d_retention_days`     | u64   | `30`       | Retention for 1-day granularity connection data (days) |
| `dns_retention_days`            | u64   | `7`        | Retention for DNS query records (days)                 |
| `write_batch_size`              | usize | `20000`    | Row-count threshold for a batch write                  |
| `write_flush_interval_secs`     | u64   | `30`       | Time threshold for a batch write (seconds)             |
| `db_max_memory_mb`              | usize | `256`      | DuckDB memory ceiling (MB)                             |
| `db_max_threads`                | usize | `4`        | DuckDB thread ceiling                                  |
| `cleanup_interval_secs`         | u64   | `300`      | Interval between expiry sweeps. `60` in debug builds    |
| `cleanup_time_budget_ms`        | u64   | `2000`     | Time budget per sweep (ms); yields when exceeded         |
| `cleanup_slice_window_secs`     | u64   | `300`      | Width of the time slice handled per sweep (seconds)     |

::: tip
The `metric` directory grows while the router runs. Cleanup follows the
retention settings above. On constrained devices or small root filesystems,
reduce `connect_*_retention_days` and `dns_retention_days`, or set
`mode = "memory"`.
:::

### `[dns]` DNS service

| Field                | Type   | Default        | Description                                          |
| -------------------- | ------ | -------------- | ---------------------------------------------------- |
| `cache_capacity`     | u32    | `4096`         | Maximum cache entries                                |
| `cache_ttl`          | u32    | `86400`        | TTL ceiling for positive results (seconds), 24h default |
| `negative_cache_ttl` | u32    | `120`          | TTL for empty results (NXDOMAIN / NODATA) in seconds |
| `doh_listen_port`    | u16    | `6053`         | DoH listen port                                      |
| `doh_http_endpoint`  | string | `"/dns-query"` | HTTP path for DoH                                    |

### `[lan_hostname]` LAN hostname resolution

Serves DNS for LAN device hostnames under a shared suffix, and advertises that suffix over DHCP. See [LAN Hostnames and the LAN Suffix](../reference/lan-hostname) for the full story.

| Field        | Type   | Default | Description                                                     |
| ------------ | ------ | ------- | --------------------------------------------------------------- |
| `enable`     | bool   | `true`  | Whether LAN hostname resolution is enabled                      |
| `lan_suffix` | string | `"lan"` | LAN domain suffix; multi-label values such as `home.arpa` work    |

::: warning Upgrade note
This section used to be named `[hostname_registry]`. The old key is still
accepted for compatibility, but exports and serialization always write
`[lan_hostname]`. A configuration containing both keys is invalid, so keep
only one when editing the file manually.
:::

### `[ui]` frontend preferences

These three are written and persisted by the frontend and rarely need to be set by hand. When unset, the frontend decides.

| Field      | Type   | Description      |
| ---------- | ------ | ---------------- |
| `language` | string | Interface language |
| `timezone` | string | Timezone         |
| `theme`    | string | Theme            |

### `[time]` NTP time synchronisation

| Field                | Type     | Default                                                                 | Description                                                    |
| -------------------- | -------- | ----------------------------------------------------------------------- | -------------------------------------------------------------- |
| `enabled`            | bool     | `false`                                                                 | Whether time sync is enabled                                   |
| `servers`            | [string] | `["ntp.aliyun.com:123", "time.cloudflare.com:123", "pool.ntp.org:123"]` | NTP server list; ports required                                |
| `sync_interval_secs` | u64      | `3600`                                                                  | Sync interval (seconds)                                        |
| `timeout_secs`       | u64      | `3`                                                                     | Per-query timeout (seconds)                                    |
| `step_threshold_ms`  | u64      | `500`                                                                   | Step the clock instead of slewing when the offset exceeds this   |
| `samples_per_server` | u8       | `3`                                                                     | Samples taken per server                                       |

### `[gateway]` HTTP reverse proxy

Forwards requests on 80/443 to internal services by domain. Disabled by default, and also editable from the frontend.

| Field        | Type | Default | Description               |
| ------------ | ---- | ------- | ------------------------- |
| `enable`     | bool | `false` | Whether the proxy is on   |
| `http_port`  | u16  | `80`    | Proxy HTTP listen port    |
| `https_port` | u16  | `443`   | Proxy HTTPS listen port   |

## landscape.toml Configuration Example (configure only what you need)

```toml
[auth]
# Login username
admin_user = "root"
# Login password
admin_pass = "root"

[web]
# Web root directory path
web_root = "/root/.landscape-router/static"
# HTTP listen port
port = 6300
# HTTPS listen port
https_port = 6443
# Listen address, use 0.0.0.0 for IPv4 only
address = "::"

[log]
# Log file path
log_path = "/root/.landscape-router/logs"
# Enable debug mode
debug = false
# Output logs to terminal
log_output_in_terminal = false
# Maximum number of log files
max_log_files = 10

[store]
# Database path
database_path = "sqlite:///root/.landscape-router/landscape_db.sqlite?mode=rwc"

[gateway] # HTTP reverse proxy is disabled by default, but can be changed in the UI
enable = true
http_port = 80 # Reverse proxy HTTP listen port
https_port = 443 # Reverse proxy HTTPS listen port

[metric] # Metrics configuration, can be changed in the UI
mode = "duckdb"

```

## landscape_init.toml Configuration Example

### config Definition

Configuration details are the same as above. The only difference is that you need to add the **config.** prefix, for example:

```toml
[config.auth]
admin_user = "root"
admin_pass = "root"

[config.web]
web_root = "/root/.landscape-router/static"

[config.log]
log_path = "/root/.landscape-router/logs"

[config.store]
database_path = "sqlite:///root/.landscape-router/landscape_db.sqlite?mode=rwc"

```

### Network Interface Definition

```toml
[[ifaces]]
name = "ens3" # Interface name
create_dev_type = "no_need_to_create" # Physical interface does not need to be created
zone_type = "wan" # Zone
enable_in_boot = true # Start this interface on boot
wifi_mode = "undefined" # Whether it is a WiFi interface

# xps_rps configuration for CPU soft load balancing, useful when a single CPU core is weak
[ifaces.xps_rps]
xps = "4"
rps = "4"
```

### Interface IP Configuration Method

```toml
[[ipconfigs]]
iface_name = "ens3" # Which interface to apply to
enable = true # Whether to enable

[ipconfigs.ip_model] # Specific IP configuration method
t = "static" # Static IP configuration
default_router_ip = "10.1.1.10" # Router IP
default_router = true # Whether to set default_router_ip as the default route
ipv4 = "10.1.1.237" # Static IP to configure on the current interface
ipv4_mask = 24
```

### DHCP Service Configuration

```toml
[[dhcpv4_services]]
iface_name = "test"
enable = false

[dhcpv4_services.config]
ip_range_start = "192.168.5.2"
ip_range_end = "192.168.5.255"
server_ip_addr = "192.168.5.1"
network_mask = 24

# MAC address bindings for IPs
mac_binding_records = [
    { mac = "00:11:22:33:44:55", ip = "192.168.5.100" },
    { mac = "00:11:22:33:44:55", ip = "192.168.5.200" },
]
```

## Command Line Arguments and Environment Variables

Command line arguments take precedence over `landscape.toml`. Every argument has a corresponding environment variable, convenient for container deployment.

| Argument                     | Environment variable             | Corresponding config item      |
| ---------------------------- | -------------------------------- | ------------------------------ |
| `-c`, `--config-dir`         | `LANDSCAPE_CONF_PATH`            | Config directory (`<HOME>`)    |
| `-w`, `--web`                | `LANDSCAPE_WEB_ROOT`             | `web.web_root`                 |
| `-p`, `--port`               | `LANDSCAPE_WEB_HTTP_PORT`        | `web.port`                     |
| `-s`, `--https`              | `LANDSCAPE_WEB_HTTPS_PORT`       | `web.https_port`               |
| `-a`, `--address`            | `LANDSCAPE_WEB_ADDR`             | `web.address`                  |
| `--user`                     | `LANDSCAPE_ADMIN_USER`           | `auth.admin_user`              |
| `--pass`                     | `LANDSCAPE_ADMIN_PASS`           | `auth.admin_pass`              |
| `--log_path`                 | `LANDSCAPE_LOG_PATH`             | `log.log_path`                 |
| `--debug`                    | `LANDSCAPE_DEBUG`                | `log.debug`                    |
| `-o`, `--log-output-in-terminal` | `LANDSCAPE_LOG_TERMINAL`     | `log.log_output_in_terminal`   |
| `--max-log-files`            | `LANDSCAPE_LOG_FILE_LIMIT`       | `log.max_log_files`            |
| `--db_url`                   | `DATABASE_URL`                   | `store.database_path`          |

Command line only (no corresponding `landscape.toml` field):

| Argument             | Environment variable         | Description                                                                       |
| -------------------- | ---------------------------- | --------------------------------------------------------------------------------- |
| `--log-filter`       | `LANDSCAPE_LOG_FILTER`       | Comma-separated keywords. When set, only ERROR/WARN logs and logs matching the keywords are output, e.g. `dhcp,dns` |
| `--auto`             | `LANDSCAPE_AUTO`             | Automatically initialize the default network. Automatically assigns existing network cards to zones |
| `-e`, `--export-manager` | -                        | Allow accessing the management UI from the WAN IP                                 |
| `--try-xdp`, `--txdp` | -                            | Try native XDP attachment. No value = all network cards, or give comma-separated ifindexes like `3,5`. Defaults to TC (SKB) mode only |
| `--ebpf_map_space`    | `LANDSCAPE_EBPF_MAP_SPACE`   | eBPF map namespace, default `default`                                            |

::: danger
`--auto` will **automatically assign detected network cards to zones**. On a machine that already has a configuration, or on a machine where you only want isolated testing, it may take over the management network card in use and cause you to lose connection. Do not pass this argument unless it is the first-time initialization.
:::

### Subcommands

```sh
# Interactively roll back the database to a release boundary
landscape-webserver db rollback
# Or use the alias
landscape-webserver db rb
```
