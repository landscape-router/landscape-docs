# Configuration File Guide

The program's configuration sources mainly include:

- `landscape_init.toml`: Full configuration file, which not only contains all rule definitions but also includes the complete `landscape.toml`. It is read `only once` on the **_first run_**. After being read, a `landscape_init.lock` file will be created. You can export the current configuration as an `init` file from the UI, which is convenient for redeploying with the current configuration.
- `landscape.toml`: Read on every startup. It only contains configuration such as _listen addresses_, _login username_ and _password_, and _logs_.

The program can start without any file configuration.  
If you want it to be ready to use on the first boot, you can configure `landscape_init.toml`.

Settings in `landscape.toml` have lower priority than command-line arguments.

::: warning

- When the `landscape_init.lock` file is deleted, startup will clear all existing configuration, and then refresh the entire configuration from `landscape_init.toml`, including the configuration in `landscape.toml`. So delete this file carefully.
- Path configuration in config files can only use **absolute paths** or **relative paths**. Paths beginning with **~** are not supported.
- The `landscape_init.toml` file can only be used to restore the current version. Cross-version restore will fail. So you can first restore it with a `suitable version`, then start with the `new version`. The new version can `automatically migrate` old configuration. (Note: exporting versioned files is supported after `v0.6.7`)
:::

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
