# landscape_init.toml 参考

`landscape_init.toml` 是**全量配置文件**: 它既包含 `landscape.toml` 的全部内容 (放在 `[config]` 下),
也包含数据库里的所有规则配置. 用途是**一份文件重建整台机器**.

它与 `landscape.toml` 的分工:

|          | `landscape.toml`                   | `landscape_init.toml`                  |
| -------- | ---------------------------------- | -------------------------------------- |
| 读取时机 | 每次启动                           | **仅首次启动一次**                     |
| 内容     | 监听地址 / 凭据 / 日志等进程级配置 | `[config]` (即前者) **+ 所有规则配置** |
| 落到哪   | 进程运行时配置                     | 数据库                                 |

从界面导出该文件的操作步骤见 [系统配置](../advanced/settings-export), 也可直接调用 API:

```sh
curl -k -X GET https://<router>:6443/api/v1/system/config/export \
  -H "Authorization: Bearer <token>"
```

## 生效机制

首次启动 (即 `landscape_init.lock` **不存在**时) 才会读取:

1. 无 `landscape_init.lock` → 读 `landscape_init.toml`
2. 校验 `version`
3. **清空已有配置**, 按文件内容重建
4. 写入 `landscape_init.lock`, 之后启动不再读该文件

若 `landscape_init.toml` 不存在而 lock 也不存在, 则按空配置初始化.

::: danger
删除 `landscape_init.lock` 会让下次启动**清空所有现有配置**. 如果此时 `landscape_init.toml`
不存在或内容不全, 已有配置就没了. 删 lock 前先确认手上的 init 文件是完整的.
:::

## `version` 字段 (必填)

```toml
version = "0.22.2"
```

::: warning
这个字段是**严格相等**校验, 不是「大于等于」. 只要和当前程序版本不一致就**直接报错退出**
(`init_config.version_mismatch`), 不会尝试迁移. 省略该字段等价于空字符串, 同样不匹配.

所以跨版本恢复的正确顺序是: 先用**导出时的那个版本**启动完成 init 恢复 → 再换新版本启动,
让数据库自动迁移. 直接把旧 init 文件喂给新版本是不行的.
:::

## 全部配置节

除 `version` 与 `config` 外, 其余都是**数组节**, 用 `[[key]]` 重复书写. 全部可省略.

| TOML 键                  | 作用                                                                              |
| ------------------------ | --------------------------------------------------------------------------------- |
| `config`                 | 等同 `landscape.toml` 全文, 见 [配置文件介绍](./index)                            |
| `ifaces`                 | 网卡定义: 区域归属、是否开机启用、网桥/VLAN 等创建类型、XPS/RPS                   |
| `ipconfigs`              | 网卡 IP 获取方式: 静态 / DHCP 客户端 / PPPoE 等                                   |
| `pppds`                  | PPPoE 拨号服务 (依附在某张物理网卡上, 产出 `ppp` 接口)                            |
| `nats`                   | WAN 网卡的 NAT 服务与端口范围                                                     |
| `marks`                  | 在 WAN 网卡上启用流量标记服务 (分流的前置)                                        |
| `route_wans`             | WAN 侧路由服务                                                                    |
| `route_lans`             | LAN 侧路由服务与静态路由                                                          |
| `mss_clamps`             | MSS 钳制 (PPPoE / 隧道场景避免大包被丢)                                           |
| `firewalls`              | 按网卡启用入站防火墙服务                                                          |
| `firewall_rules`         | 防火墙放行/拦截规则                                                               |
| `firewall_blacklists`    | 防火墙黑名单来源                                                                  |
| `static_nat_mappings_v4` | IPv4 静态映射 (端口转发 / DMZ)                                                    |
| `static_nat_mappings_v6` | IPv6 静态映射                                                                     |
| `dhcpv4_services`        | LAN 的 DHCPv4 服务器, 见 [DHCPv4 Server](../reference/dhcpv4)                     |
| `dhcpv6pds`              | WAN 侧 DHCPv6-PD 前缀委派客户端                                                   |
| `lan_ipv6s`              | LAN 侧 IPv6 下发 (SLAAC / DHCPv6), 见 [LAN IPv6 分配](../reference/ipv6/lan-ipv6) |
| `wifi_configs`           | 无线接入点配置 (内容是 hostapd 配置文本)                                          |
| `enrolled_devices`       | 已录入设备: 静态 IP 绑定、主机名、标签、按设备的 DHCP option                      |
| `flow_rules`             | 分流规则 (flow 定义与目标), 见 [分流控制](../features/traffic-flow)               |
| `dst_ip_mark`            | 按目标 IP / GeoIP 打标记的规则                                                    |
| `dns_upstream_configs`   | 上游 DNS 服务器 (被 `dns_rules` 按 id 引用)                                       |
| `dns_rules`              | DNS 分流规则: 匹配域名 → 指定上游 + 标记 + 结果过滤                               |
| `dns_redirects`          | DNS 重定向 (split-horizon: 把域名答成指定 IP)                                     |
| `dns_provider_profiles`  | DNS 服务商凭据 (供 DDNS 与证书 DNS-01 使用)                                       |
| `ddns_jobs`              | DDNS 任务                                                                         |
| `cert_accounts`          | ACME 账户                                                                         |
| `certs`                  | 证书申请与内容, 见 [证书](../reference/certificates)                              |
| `gateway_rules`          | HTTP 反向代理的域名→上游规则                                                      |
| `geo_ips`                | GeoIP 数据源                                                                      |
| `geo_sites`              | GeoSite 数据源                                                                    |

## 通用字段约定

大部分节共用这几个字段, 下面的示例里就不重复解释了:

| 字段              | 说明                                                                                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | UUID 主键. **可以省略**, 省略时自动生成. 但若该条目要被别处按 id 引用 (如 `dns_rules.upstream_id` 指向 `dns_upstream_configs.id`), 就必须显式写出并保持一致 |
| `update_at`       | 更新时间戳 (秒, 浮点). 可省略, 省略时取当前时间                                                                                                             |
| `enable`          | 是否启用                                                                                                                                                    |
| `iface_name`      | 该配置绑定的网卡名                                                                                                                                          |
| `index`           | 优先级, 数字越小越先匹配 (规则类节)                                                                                                                         |
| `remark` / `name` | 备注 / 展示名                                                                                                                                               |

## 常用节示例

### 网卡与区域

```toml
# 物理 WAN 口
[[ifaces]]
name = "ens3"                          # 网卡名称
create_dev_type = "no_need_to_create"  # 物理网卡不需要创建
zone_type = "wan"                      # undefined / wan / lan
enable_in_boot = true                  # 启动时将此网卡也启动
wifi_mode = "undefined"                # undefined / client / ap

# xps_rps 配置, 用于 CPU 软负载, CPU 单核心较弱时需要配置
[ifaces.xps_rps]
xps = "4"
rps = "4"

# LAN 网桥 (由 landscape 创建)
[[ifaces]]
name = "br_lan"
create_dev_type = "bridge"
zone_type = "lan"
enable_in_boot = true

# 把物理口挂到网桥上: 用 controller_name 指向网桥
[[ifaces]]
name = "ens4"
create_dev_type = "no_need_to_create"
controller_name = "br_lan"
enable_in_boot = true
```

### 网卡 IP 配置

`ip_model.t` 取 `nothing` / `static` / `pppoe` / `dhcpclient`.

```toml
# 静态 IP
[[ipconfigs]]
iface_name = "ens3"
enable = true

[ipconfigs.ip_model]
t = "static"
default_router_ip = "10.1.1.10"  # 路由 IP
default_router = true            # 是否将 default_router_ip 设置为默认路由
ipv4 = "10.1.1.237"              # 当前网卡将要设置的静态 IP
ipv4_mask = 24

# DHCP 客户端
[[ipconfigs]]
iface_name = "ens3"
enable = true

[ipconfigs.ip_model]
t = "dhcpclient"
default_router = true
hostname = "landscape-router"
```

### PPPoE 拨号

PPPoE 有**两条互斥的路径**, 同一张物理网卡上只能用其中一条:

::: code-group

```toml [方式一: ipconfigs 原生]
[[ipconfigs]]
iface_name = "ens3"
enable = true

[ipconfigs.ip_model]
t = "pppoe"
default_router = true
username = "your-account"
password = "your-password"
mtu = 1492
# ac_name = "..."   # 可选, 指定 Access Concentrator
```

```toml [方式二: pppds 独立服务]
[[pppds]]
attach_iface_name = "ens3"   # 依附的物理网卡
iface_name = "ppp-wan"       # 产出的 ppp 接口名, 不能与已有网卡同名
enable = true

[pppds.pppd_config]
default_route = true
peer_id = "your-account"     # 注意字段名是 peer_id 不是 username
password = "your-password"
plugin = "rp_pppoe"          # rp_pppoe / pppoe
# ac = "..."                 # 可选
```

:::

::: warning
两条路径不能在同一张物理网卡上同时启用. 若某网卡的 `ipconfigs` 已是 `t = "pppoe"` 且启用,
再对它建启用状态的 `pppds` 会被拒绝 (`Interface ... already uses native PPPoE in IP Config`).
另外 `pppds.iface_name` 与任何已存在的网卡同名也会被拒绝.
:::

### NAT 服务

```toml
[[nats]]
iface_name = "ppp-wan"
enable = true

[nats.nat_config]
tcp_range = { start = 32768, end = 65535 }
udp_range = { start = 32768, end = 65535 }
icmp_in_range = { start = 32768, end = 65535 }
```

### DHCPv4 服务

```toml
[[dhcpv4_services]]
iface_name = "br_lan"
enable = true

[dhcpv4_services.config]
ip_range_start = "192.168.5.100"
ip_range_end = "192.168.5.255"   # 可选, 且为开区间 (不含该地址本身)
server_ip_addr = "192.168.5.1"   # 同时是下发给客户端的网关地址
network_mask = 24
address_lease_time = 43200       # 可选, 秒. 默认 12 小时
custom_options = []              # 自定义 option, 见 DHCPv4 Server 页
```

::: warning
旧版本的 `mac_binding_records` 字段**已经移除**. MAC 与 IP 的绑定现在统一写在
`enrolled_devices` 里, 旧配置由数据库迁移自动搬迁. 手写 init 文件时不要再用这个字段.
:::

### 已录入设备 (静态绑定 / 主机名)

```toml
[[enrolled_devices]]
name = "NAS"
mac = "00:11:22:33:44:55"
ipv4 = "192.168.5.10"            # 可选, 静态 IPv4
hostname = "nas"                 # 可选, 供内网 DNS 解析成 nas.<lan_suffix>
tag = ["Home"]                   # 可选, 分组标签
iface_name = "br_lan"            # 可选
```

::: tip
`hostname` 配合 `[lan_hostname]` 的后缀即可用域名访问内网设备, 见
[内网主机名与 LAN 后缀](../reference/lan-hostname).

按设备的 `dhcp_custom_options` / `dhcp_filter_options` 改动**需要重启 DHCP 服务**才生效.
:::

### DNS 上游与分流规则

`dns_rules.upstream_id` 按 id 引用 `dns_upstream_configs`, 这是**必须显式写 `id`** 的典型场景.

```toml
# 上游: 明文 DNS
[[dns_upstream_configs]]
id = "11111111-1111-1111-1111-111111111111"
remark = "运营商 DNS"
ips = ["223.5.5.5"]

[dns_upstream_configs.mode]
t = "plaintext"      # plaintext / tls / https / quic

# 上游: DoH
[[dns_upstream_configs]]
id = "22222222-2222-2222-2222-222222222222"
remark = "Cloudflare DoH"
ips = ["1.1.1.1"]

[dns_upstream_configs.mode]
t = "https"
domain = "cloudflare-dns.com"
http_endpoint = "/dns-query"

# 规则: 命中的域名走指定上游
[[dns_rules]]
name = "国外域名"
index = 1
enable = true
filter = "unfilter"                                    # unfilter / only_ipv4 / only_ipv6
upstream_id = "22222222-2222-2222-2222-222222222222"
flow_id = 0

[dns_rules.mark]
action = { t = "keep_going" }   # keep_going / direct / drop / redirect
allow_reuse_port = false
flow_id = 0

# 匹配来源: 直接写域名
[[dns_rules.source]]
t = "config"
match_type = "domain"    # plain / regex / domain / full
value = "example.com"

# 匹配来源: 引用 geosite
[[dns_rules.source]]
t = "geo_key"
name = "geosite"         # 对应 geo_sites 里的 name
key = "GEOLOCATION-!CN"
inverse = false
```

::: tip
`filter = "only_ipv4"` 会剥掉 AAAA 记录, 常用于让客户端在只有 IPv4 出口的场景回落到 IPv4.
:::

### DNS 重定向 (split-horizon)

```toml
[[dns_redirects]]
remark = "内网直连 NAS"
enable = true
answer_mode = "static_ips"      # static_ips / all_local_ips
result_info = ["192.168.5.10"]
apply_flows = [0]               # 为空时对所有 flow 生效

[[dns_redirects.match_rules]]
t = "config"
match_type = "full"
value = "nas.example.com"
```

### 静态映射 (端口转发)

```toml
[[static_nat_mappings_v4]]
enable = true
remark = "对外暴露 HTTPS"
wan_iface_name = "ppp-wan"
l4_protocols = [6]                                   # IANA 协议号: 6=TCP, 17=UDP
mapping_pair_ports = [{ wan_port = 443, lan_port = 443 }]

[static_nat_mappings_v4.lan_target]
t = "address"                                        # address / local / device
ipv4 = "192.168.5.10"
```

### Geo 数据源

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

## 其余节怎么写

`flow_rules` / `dst_ip_mark` / `lan_ipv6s` / `certs` 等节字段较多且互相引用 (flow id、设备 id、
证书 id), 手写容易出错. 推荐做法是**先在界面上配好, 再导出 init 文件**, 拿导出结果当模板改.
各功能本身的说明见 [分流控制](../features/traffic-flow)、[LAN IPv6 分配](../reference/ipv6/lan-ipv6)、
[证书](../reference/certificates).
