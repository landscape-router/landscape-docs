# Integrating with Armbian

This page explains how to build together with Armbian.

Reference project: https://github.com/ThisSeanZhang/landscape-build

# Initial configuration file

File location:

```text
userpatches/overlay/landscape_init.toml
```

The configuration depends on the hardware of the board you are targeting.

::: warning
`version` must **equal** the version of landscape you downloaded — the check is for exact equality, and a mismatch fails at startup. If you fetch the binary via `latest`, remember to keep this in sync. For every available field see [landscape_init.toml Reference](../configuration/init-config).
:::

```toml
version = "0.22.2"   # must match the version you actually deploy

# Config Interface
[[ifaces]]
name = "eth0"
zone_type = "wan"

[[ifaces]]
name = "br_lan"
create_dev_type = "bridge"
zone_type = "lan"

[[ifaces]]
name = "eth1"
controller_name = "br_lan"

[[ipconfigs]]
iface_name = "eth0"
enable = true

[ipconfigs.ip_model]
t = "dhcpclient"

[[dhcpv4_services]]
iface_name = "br_lan"
enable = true

[dhcpv4_services.config]
server_ip_addr = "192.168.7.1"
ip_range_start = "192.168.7.100"
network_mask = 24

# MAC bindings on the LAN.
# Note: the old dhcpv4_services.config.mac_binding_records has been removed;
# bindings now live in enrolled_devices
[[enrolled_devices]]
name = "device-1"
mac = "00:11:22:33:44:55"
ipv4 = "192.168.7.50"
iface_name = "br_lan"

[[enrolled_devices]]
name = "device-2"
mac = "aa:bb:cc:dd:ee:ff"
ipv4 = "192.168.7.51"
iface_name = "br_lan"
```

# The script

Where it goes:

```text
userpatches/customize-image.sh
```

```bash
#!/bin/bash

# arguments: $RELEASE $LINUXFAMILY $BOARD $BUILD_DESKTOP
#
# This is the image customization script

# NOTE: It is copied to /tmp directory inside the image
# and executed there inside chroot environment
# so don't reference any files that are not already installed

# NOTE: If you want to transfer files between chroot and host
# userpatches/overlay directory on host is bind-mounted to /tmp/overlay in chroot
# The sd card's root path is accessible via $SDCARD variable.

RELEASE=$1
LINUXFAMILY=$2
BOARD=$3
BUILD_DESKTOP=$4

Main() {
	echo "======================== arch: $BOARD ===================================="

	systemctl disable systemd-resolved
	systemctl mask systemd-resolved

	rm -f /etc/apt/sources.list
    cat <<EOF > /etc/apt/sources.list
# Source mirrors are commented out by default to speed up apt update; uncomment if you need them
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware

# The security repositories below cover both the official source and a mirror; switch by editing the comments
deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware
EOF
	apt update -y
	apt install -y ppp tcpdump bpftool iptables zip unzip

	# docker install start
	sudo apt-get install ca-certificates curl
	sudo install -m 0755 -d /etc/apt/keyrings
	sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
	sudo chmod a+r /etc/apt/keyrings/docker.asc

	# Add the repository to Apt sources:
	echo \
	"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
	$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
	sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
	sudo apt-get update

	apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
	cat <<EOF > /etc/docker/daemon.json
{
	"bip": "172.18.1.1/24",
	"dns": ["172.18.1.1"]
}
EOF
	systemctl start docker

	if [ "$BOARD" = "uefi-x86" ]; then
		# What to do when BOARD is "uefi-x86"
		curl -L -o /root/landscape-webserver https://github.com/ThisSeanZhang/landscape/releases/latest/download/landscape-webserver-x86_64
		sudo sed -i 's/^GRUB_CMDLINE_LINUX="/GRUB_CMDLINE_LINUX="net.ifnames=0 biosdevname=0 /' /etc/default/grub
		sudo update-grub
	else
		curl -L -o /root/landscape-webserver https://github.com/ThisSeanZhang/landscape/releases/latest/download/landscape-webserver-aarch64
		# What to do for any other BOARD value
		cat /boot/armbianEnv.txt
		# Use the default naming scheme
		echo "extraargs=net.ifnames=0 biosdevname=0" | sudo tee -a /boot/armbianEnv.txt
	fi

	mkdir -p /root/.landscape-router/
	cp /tmp/overlay/landscape_init.toml /root/.landscape-router/landscape_init.toml
	chmod +x /root/landscape-webserver
	curl -L -o /root/static.zip https://github.com/ThisSeanZhang/landscape/releases/latest/download/static.zip
	unzip /root/static.zip -d /root/.landscape-router
	cat <<EOF > /etc/systemd/system/landscape-router.service
[Unit]
Description=Landscape Router

[Service]
ExecStart=/root/landscape-webserver
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF
	systemctl enable landscape-router.service

	cat <<EOF > /root/.not_logged_in_yet
# /root/.not_logged_in_yet
# Automatically configure Armbian's first-boot settings
#
# Set the root password (note: it is stored in plain text; SSH keys are recommended instead)
PRESET_ROOT_PASSWORD="123456"

# Set the system language and locale
PRESET_LOCALE="en_US.UTF-8"

# Set the system timezone
PRESET_TIMEZONE="Asia/Shanghai"

PRESET_NET_CHANGE_DEFAULTS="0"
PRESET_NET_ETHERNET_ENABLED="0"
PRESET_NET_WIFI_ENABLED="0"
PRESET_CONNECT_WIRELESS="n"
PRESET_NET_USE_STATIC="0"
SET_LANG_BASED_ON_LOCATION="n"

# Create an additional user
# PRESET_USER_NAME="test"
# PRESET_DEFAULT_REALNAME="Test"
# PRESET_USER_PASSWORD="123456"
# PRESET_USER_SHELL="bash"
EOF
} # Main


Main "$@"
```

# Build command

> Check that the kernel build options in [System Requirements](/intro/requirements) are enabled

`KERNEL_CONFIGURE=yes` has to stay on so that kernel BTF generation can be enabled.

```shell
./compile.sh \
build BOARD=uefi-x86 \
BRANCH=current \
BUILD_DESKTOP=no \
BUILD_MINIMAL=yes \
KERNEL_CONFIGURE=yes \
RELEASE=bookworm \
KERNEL_GIT=shallow \
NETWORKING_STACK="none"
```
