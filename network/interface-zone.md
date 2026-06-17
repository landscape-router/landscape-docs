# 区域 (Zone)

区域 (Zone) 是 Landscape 对网卡进行逻辑分组的核心机制。每张网卡在路由操作之前，必须先归属于一个区域。区域的设定决定了网卡的流量管道、服务能力以及拓扑行为。

Landscape 有三种区域：

## Wan（广域网区域）

Wan 区域的网卡面向互联网，负责上行流量出口。Landscape 为其挂载 eBPF WAN TC 管道，支持以下 IP 配置方式：

- 静态 IP 配置
- DHCP Client
- PPPoE / PPPD
- DHCPv6-PD（IPv6 前缀委派）

可开启的服务：

- NAT（网络地址转换）
- 防火墙 (Firewall)
- MSS 钳制 (MSS Clamp)
- WAN 路由 (Route WAN)

> Wan 区域的网卡**不能**作为桥接的成员（控制器或子接口）。

## Lan（局域网区域）

Lan 区域的网卡连接内网，面向下游设备。Landscape 为其挂载 eBPF LAN TC 管道。

可开启的服务：

- DHCP Server
- LAN 路由 (Route LAN)
- LAN IPv6 地址分配
- ICMPv6 RA（路由器通告）

## Undefined（未分配）

新建物理网卡的默认区域。该区域的网卡不能开启任何服务，但可以：

- 作为**桥接**网卡的子接口（只有 Undefined 区域的网卡才能被附加到桥接上）
- 开启 WiFi AP 模式（将网卡作为无线接入点）

> 通过 `ChangeZone` API 切换区域时，Landscape 会自动清理旧区域下的所有服务，并调整桥接关系和 eBPF 管道。
