# Manual Deployment

## File Preparation
::: warning
1. Before deployment, please confirm that your system meets the requirements outlined in [System Requirements](./attention.md)  
2. The system can start without any configuration, but the only side effect is that `/etc/resolv.conf` will be modified to `127.0.0.1`. If you cannot access the network after stopping the service, please check this file
3. The following items marked as "optional" can be skipped if not needed
:::

::: warning
Remember to use ```ss -lutp``` to check if any DNS service is already occupying port `53` on the current host. If it's already in use, the service cannot start.
:::


1. Landscape Router main executable, download from [here](https://github.com/ThisSeanZhang/landscape/releases/)
2. Static page files, download from [here](https://github.com/ThisSeanZhang/landscape/releases/), and extract to `/root/.landscape-router/static` folder
3. (Optional) Install PPP for PPPoE dial-up
4. (Optional) Install Docker
5. (*Optional if you have a desktop environment with a browser*) Prepare initialization configuration file  
  (Note: This configuration file is only read on the first run):   
    Place it in -> `/root/.landscape-router/landscape_init.toml`
6. (Optional) geosite / geoip files

## Disable Automatic IP Configuration / DNS Services on Host Machine
1. Debian:
Modify file: `/etc/network/interfaces`  
Set all LAN network cards to manual, and additionally set a static IP for the WAN network card in the configuration file, so that even if the router program fails, you can still access it from another machine with a static IP.

```
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
```
auto ens3
iface ens3 inet static
    address 192.168.22.1
    netmask 255.255.255.0

auto ens4
iface ens4 inet manual

auto ens5
iface ens5 inet manual
```

This way, even if the router fails, you can use another machine set to any address in the 192.168.22.0/24 network segment (for example: 192.168.22.2/24), directly connect to this network card, and be able to connect to the router.


> Other systems to be added... PRs welcome to share deployment processes

## Disable DNS Service on Host Machine (ignore if this service doesn't exist)
```shell
systemctl stop systemd-resolved
systemctl disable systemd-resolved
systemctl mask systemd-resolved
```

## Manual Start Verification
Before configuring the systemd service, you can manually run `/root/landscape-webserver` first to confirm it can execute.
When running successfully, it will output the following content displaying the current configuration. You can verify if Auth and the corresponding Web path are correct:
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


## Create systemd Service File
Create `/etc/systemd/system/landscape-router.service`
File content: 
```text
[Unit]
Description=Landscape Router

[Service]
ExecStart=/root/landscape-webserver <- Remember to modify this path
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
## Upgrading landscape-router

1. Download new version of `landscape-webserver` and `static` and extract
2. Stop landscape-router.service
3. Replace with new version of `landscape-webserver` and `static`  
4. Reboot system (simply restarting landscape-router.service will cause traffic shaping function to be unavailable)

