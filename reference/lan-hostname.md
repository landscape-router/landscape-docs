# 内网主机名与 LAN 后缀

给内网设备一个统一的域名后缀, 让 `nas` / `nas.lan` 这样的名字能直接解析到内网 IP,
同时通过 DHCP 把这个后缀告知客户端, 使客户端只输入短主机名也能补全.

对应配置是 `landscape.toml` 的 `[lan_hostname]` 节:

```toml
[lan_hostname]
enable = true
lan_suffix = "lan"
```

| 字段         | 类型   | 默认值  | 说明                                   |
| ------------ | ------ | ------- | -------------------------------------- |
| `enable`     | bool   | `true`  | 关闭后正解、反解、DHCP option 全部停止 |
| `lan_suffix` | string | `"lan"` | 域名后缀, 可以多级如 `home.arpa`       |

## 主机名从哪来

登记表有**两个来源**:

| 来源                | 怎么产生                                                           | 特点                     |
| ------------------- | ------------------------------------------------------------------ | ------------------------ |
| **已录入设备**      | 在设备管理里填 `hostname` 字段, 见 [设备管理](./device-management) | 长期有效, 优先级更高     |
| **DHCP 客户端自报** | 客户端在 DHCP 请求里带 option 12 (Host Name)                       | 随租约来去, 无需手工维护 |

::: tip 两者冲突时
**已录入设备优先**. 如果某个主机名已经由录入设备占用, DHCP 自报同名不会覆盖它;
反过来, 租约过期只会清掉 DHCP 学来的记录, 不会动录入设备的.
:::

## 正向解析

配置 `lan_suffix = "lan"` 且某设备主机名是 `nas` 时:

```sh
dig @<router> nas.lan A       # → 该设备的 IPv4
dig @<router> nas.lan AAAA    # → 该设备的 IPv6 (仅当登记了 IPv6 时)
```

::: warning
匹配的是**整个后缀**, 不是最后一个 label. `lan_suffix = "home.lan"` 时只有 `nas.home.lan` 能解析,
`nas.lan` 不能. 后缀比较忽略大小写.
:::

## 反向解析 (PTR)

反查会返回 `<hostname>.<lan_suffix>.`:

```sh
dig @<router> -x 192.168.5.10   # → nas.lan.
```

同一个 IP 上挂了多个主机名时, 取**已录入设备**里字典序最小的那个; 没有录入设备记录才回落到
DHCP 学来的名字.

::: warning PTR 只对内网地址应答
只有这些地址范围会返回 PTR, 公网地址一律不应答 (避免污染公网反解):

- IPv4: 私有地址 (10/8、172.16/12、192.168/16)、回环、链路本地 (169.254/16)、
  运营商共享段 (100.64/10)、未指定地址、广播地址
- IPv6: 唯一本地地址 (fc00::/7)、回环、链路本地 (fe80::/10)、未指定地址
  :::

## `local` 区始终本地应答

除了配置的后缀, `local` 这个区**永远由本地应答**, 与 `lan_suffix` 设成什么无关.
这是给 mDNS 留的保护: `local` 属于 mDNS 命名空间, 不应该被转发到上游 DNS.

也因此 `lan_suffix` **不允许**填 `local` (见下方保留后缀).

## DHCP 下发的 option 15 / 119

启用后, DHCP 服务会按后缀下发两个 option, 让客户端能只输入 `nas` 就访问到 `nas.lan`:

| Option | 名称          | 内容                             |
| ------ | ------------- | -------------------------------- |
| 15     | Domain Name   | 后缀本身, 如 `lan`               |
| 119    | Domain Search | 后缀的 DNS 线格式名字, 如 `lan.` |

::: warning 只在客户端点名请求时下发
这两个 option 走的是**客户端参数请求列表 (option 55)** 这条路: 客户端没在 option 55 里
要求 15 / 119, 服务端就不会塞给它. 这一点和 `custom_options` 不同, 后者是无条件注入的.

抓包核对时请确认客户端确实请求了这两个 code. 例如 `dhcpcd` 默认会请求:

```sh
dhcpcd -T <iface> | grep -E 'new_domain_name|new_domain_search'
```

:::

另外, option 119 需要后缀能解析成合法 DNS 名字. 万一不能, **只跳过 option 119**,
其余响应内容照常返回, 日志里会有一条 warn.

## 运行时修改

这一节支持热改, **不需要重启服务**:

- DNS 的正解 / 反解立刻按新后缀生效
- 下一个 DHCP 响应就会带上新的 option 15 / 119

API 是先取 hash 再带 hash 提交的乐观并发形式:

```sh
B=https://<router>:6443/api/v1/system
# 1. 读当前配置, 同时拿到 hash
H=$(curl -sk $B/config/edit/lan_hostname -H "Authorization: Bearer $TOKEN" | jq -r .data.hash)
# 2. 带 hash 提交
curl -sk -X POST $B/config/edit/lan_hostname -H "Authorization: Bearer $TOKEN" \
  -d "{\"new_lan_hostname\":{\"enable\":true,\"lan_suffix\":\"home.arpa\"},\"expected_hash\":\"$H\"}"
```

hash 不匹配说明配置已被别处改过, 会返回冲突错误, 重新取 hash 再提交即可.
另有一个只读的快速接口 `GET /config/lan_hostname` (不返回 hash).

## 后缀校验规则

提交的后缀会先归一化: 去掉首尾空格与首尾的 `.`, 转小写, 非 ASCII 走 IDNA 转 punycode
(如 `BÜCHER.` → `xn--bcher-kva`).

然后按下表校验, 不通过返回 **400**, 且**不会污染现有配置**:

| error_id                                        | 触发条件                                     |
| ----------------------------------------------- | -------------------------------------------- |
| `lan_hostname.invalid_suffix.empty_label`       | 出现空 label, 如 `home..arpa`                |
| `lan_hostname.invalid_suffix.invalid_idna`      | IDNA 转换失败                                |
| `lan_hostname.invalid_suffix.too_long`          | 总长 > 253, 或单个 label > 63                |
| `lan_hostname.invalid_suffix.invalid_hyphen`    | label 以 `-` 开头或结尾, 如 `-lan`           |
| `lan_hostname.invalid_suffix.invalid_character` | 出现字母数字和 `-` 以外的字符, 如 `lan_name` |
| `lan_hostname.invalid_suffix.reserved`          | 命中下方保留后缀                             |

后缀留空 (或只填空格) 不算错误, 会回落到默认值 `lan`.

### 保留后缀

这些后缀会被拒绝, 因为它们属于解析器自己的命名空间, 占用会导致解析行为混乱:

- **保留 TLD** (含其子域): `invalid`、`test`、`onion`、`localhost`、`local`
  —— 所以 `corp.test`、`office.local` 也不行
- **arpa 相关**: `arpa` 本身, 以及 `in-addr.arpa`、`ip6.arpa`、`resolver.arpa`、
  `ipv4only.arpa` 及其子域

::: tip
`home.arpa` 是**允许**的 —— 它正是 RFC 8375 为家庭网络指定的后缀, 不在上面的保留列表里.
`mylan.arpa`、`in-addr.home.arpa` 同样可用.
:::

## 从旧版本升级

这一节以前叫 `[hostname_registry]`. 为兼容旧配置文件, 读取时**仍然接受**这个旧键名,
但程序导出配置时一律写成 `[lan_hostname]`.

::: danger
`[hostname_registry]` 和 `[lan_hostname]` **同时出现会直接解析失败**, 程序起不来.
手工编辑配置文件时请只保留一个 —— 推荐直接改成新名字.
:::
