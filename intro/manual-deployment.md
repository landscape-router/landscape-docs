# Manual Deployment

## Before You Begin

::: warning Deployment assumptions

1. Confirm that the host meets the [system requirements](./requirements.md).
2. Landscape can start without a configuration, but it still changes
   `/etc/resolv.conf` to use `127.0.0.1`. If name resolution stops working
   after Landscape is stopped, restore a working resolver in this file.
3. Items marked as optional can be skipped when the corresponding feature is
   not required.

:::

::: warning
Run `ss -lutp` and check whether another DNS service is already listening on
port `53`. Landscape cannot start its DNS service while that port is in use.

Landscape expects exclusive control of the interfaces it manages. This guide
assumes a dedicated router and removes NetworkManager with
`apt remove network-manager`. Do not run that command on a host where
NetworkManager still manages unrelated interfaces.

When SELinux is enabled, configure the required permissions before starting
Landscape. SELinux policy configuration is outside the scope of this guide.
:::

## Prepare the Files

1. Download the Landscape Router executable from the
   [release page](https://github.com/ThisSeanZhang/landscape/releases/).
2. Download the static web files from the same release and extract them to
   `/root/.landscape-router/static`.
3. Optional: install PPP if the router will use PPPoE.
4. Optional: install Docker if traffic will be routed through containers.
5. Optional: download GeoSite and GeoIP files.

## Disable Automatic IP Configuration on the Host

On Debian, edit `/etc/network/interfaces`. Set LAN interfaces to manual mode and
assign a recovery address to one interface so the host remains reachable if
Landscape is not running.

```text
auto <first_network_card_name> <- For example, set as WAN
iface <first_network_card_name> inet static
    address 192.168.22.1
    netmask 255.255.255.0

auto <second_network_card_name> <- All others are LAN
iface <second_network_card_name> inet manual

auto <third_network_card_name>
iface <third_network_card_name> inet manual
```

Example:

```text
auto ens3
iface ens3 inet static
    address 192.168.22.1
    netmask 255.255.255.0

auto ens4
iface ens4 inet manual

auto ens5
iface ens5 inet manual
```

With this configuration, connect another machine directly to that interface
and assign it an address in `192.168.22.0/24`, such as `192.168.22.2/24`, to
reach the router at `192.168.22.1`.

> Deployment instructions for other distributions are welcome as pull
> requests.

## Disable the Host DNS Service

Skip this section when `systemd-resolved` is not installed.

```shell
systemctl stop systemd-resolved
systemctl disable systemd-resolved
systemctl mask systemd-resolved
```

## Manual Start Verification

Before creating the systemd service, run `/root/landscape-webserver` manually.
A successful startup prints the active authentication, logging, web, and
storage configuration:

```text
██╗      █████╗ ███╗   ██╗██████╗ ███████╗ ██████╗ █████╗ ██████╗ ███████╗
██║     ██╔══██╗████╗  ██║██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝
██║     ███████║██╔██╗ ██║██║  ██║███████╗██║     ███████║██████╔╝█████╗
██║     ██╔══██║██║╚██╗██║██║  ██║╚════██║██║     ██╔══██║██╔═══╝ ██╔══╝
███████╗██║  ██║██║ ╚████║██████╔╝███████║╚██████╗██║  ██║██║     ███████╗
╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝

██████╗  ██████╗ ██╗   ██╗████████╗███████╗██████╗
██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔══██╗
██████╔╝██║   ██║██║   ██║   ██║   █████╗  ██████╔╝
██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ██╔══██╗
██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗██║  ██║
╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝

Landscape Home Path: /root/.landscape-router

[Auth]
Admin User: admin
Admin Pass: root

[Log]
Log Path: /root/.landscape-router/logs
Debug: true
Log Output In Terminal: true
Max Log Files: 7

[Web]
Web Root Path: /root/.landscape-router/static
Listen HTTP on: http://[::]:6300
Listen HTTPS on: https://[::]:6443

[Store]
Database Connect: sqlite://./db.sqlite?mode=rwc
```

::: danger Change the default credentials
The example output shows the default administrator credentials. Change them
before exposing the web interface to an untrusted network.
:::

## Create a systemd Service

Create `/etc/systemd/system/landscape-router.service` with the following
content:

```text
[Unit]
Description=Landscape Router

[Service]
ExecStart=/root/landscape-webserver
Restart=always
User=root
LimitMEMLOCK=infinity

[Install]
WantedBy=multi-user.target
```

```shell
# Start service
systemctl start landscape-router.service
# Enable service on boot (execute after confirming everything is working)
systemctl enable landscape-router.service
# Stop service
systemctl stop landscape-router.service
```

## Upgrade Landscape Router

1. Download and extract the new `landscape-webserver` executable and static web
   files.
2. Stop `landscape-router.service`.
3. Replace the existing executable and static files.
4. Restart the service. If startup fails, inspect the service logs before
   rebooting the host.
