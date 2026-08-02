# 配置文件介绍

程序的配置来源主要有以下:

- `landscape_init.toml`: 全量配置文件, 除了包含各种规则配置还包含完整的 `landscape.toml`, `仅在首次` 进行读取 **_一次_**, 读取后将会创建一个 `landscape_init.lock` 文件, 可在 UI 界面中导出当前的配置的 `init` 文件. 方便使用当前配置进行重新部署. 全部可用字段见 [landscape_init.toml 参考](./init-config)
- `landscape.toml`: 每次启动进行读取, 只包含*监听地址*. _登录用户名_ 和 _密码_, _日志_ 等配置.

启动时可以不进行任何文件的配置即可启动.  
如果第一次启动时想要达到开机即使用, 可以配置 `landscape_init.toml`.

## 配置优先级

同一项配置可能来自多处, 优先级从高到低:

1. **命令行参数** — 如 `--port 6300`
2. **环境变量** — 如 `LANDSCAPE_WEB_HTTP_PORT=6300`
3. **`landscape.toml`**
4. **内置默认值** — 即下方各表的「默认值」列

::: warning

- 当删除了 `landscape_init.lock` 文件后, 启动将会清空所有的已有配置, 然后使用 `landscape_init.toml` 中的内容刷新整个配置包含 `landscape.toml` 中的配置. 所以谨慎删除此文件.
- 配置文件中关于路径的配置只能使用 **绝对路径** 或者 **相对路径**. 不能使用 **~** 开头的地址
- `landscape_init.toml` 文件只能用于当前版本的恢复, 跨版本会导致失败. 所以可以先在`适合的版本`恢复后, 再使用`新版本启动`, 新版本的文件能`自动迁移`旧版本的配置. (注, 版本文件导出是在 `v0.6.7` 版本之后支持的)
  :::

下文的 `<HOME>` 指配置目录, 默认是 `/root/.landscape-router`, 可用 `-c` / `LANDSCAPE_CONF_PATH` 更改.

## landscape.toml 完整参考

所有节与字段都可以省略, 省略时取「默认值」列的值.

### `[auth]` 管理凭据

| 字段         | 类型   | 默认值   | 说明     |
| ------------ | ------ | -------- | -------- |
| `admin_user` | string | `"root"` | 登录用户 |
| `admin_pass` | string | `"root"` | 登录密码 |

### `[web]` 管理界面监听

| 字段         | 类型   | 默认值            | 说明                                          |
| ------------ | ------ | ----------------- | --------------------------------------------- |
| `web_root`   | path   | `<HOME>/static`   | 前端静态文件目录                              |
| `port`       | u16    | `6300`            | HTTP 监听端口                                 |
| `https_port` | u16    | `6443`            | HTTPS 监听端口                                |
| `address`    | ip     | `"::"`            | 监听地址. 仅监听 IPv4 时填 `0.0.0.0`          |

### `[log]` 日志

| 字段                     | 类型   | 默认值        | 说明                                     |
| ------------------------ | ------ | ------------- | ---------------------------------------- |
| `log_path`               | path   | `<HOME>/logs` | 日志目录                                 |
| `debug`                  | bool   | `false`       | 调试模式. debug 构建默认为 `true`        |
| `log_output_in_terminal` | bool   | `false`       | 是否同时输出到终端. debug 构建默认 `true` |
| `max_log_files`          | usize  | `7`           | 保留的日志文件数量上限                   |

### `[store]` 数据库

| 字段            | 类型   | 默认值                                             | 说明               |
| --------------- | ------ | -------------------------------------------------- | ------------------ |
| `database_path` | string | `sqlite://<HOME>/landscape_db.sqlite?mode=rwc`     | 数据库连接串       |

::: warning
`database_path` 对应的环境变量是 **`DATABASE_URL`**. 这个变量名很通用, 如果 shell 里已经存在
(例如仓库根目录的 `.env`, 或 CI 环境), 它会**覆盖 `-c` 指定的目录**, 导致数据库落到意料之外的位置.
排查「配置改了但数据没落库」时优先检查这一项.
:::

### `[metric]` 指标采集

指标数据落在 `<HOME>/metric/`. 这一节也可以在前端修改.

| 字段                             | 类型   | 默认值     | 说明                                             |
| -------------------------------- | ------ | ---------- | ------------------------------------------------ |
| `mode`                           | enum   | `"duckdb"` | `off` 完全关闭 / `memory` 仅内存 / `duckdb` 落盘 |
| `connect_second_window_minutes`  | u64    | `5`        | 秒级连接数据保留的时间窗口 (分钟)                |
| `connect_1m_retention_days`      | u64    | `1`        | 1 分钟粒度连接数据保留天数                       |
| `connect_1h_retention_days`      | u64    | `7`        | 1 小时粒度连接数据保留天数                       |
| `connect_1d_retention_days`      | u64    | `30`       | 1 天粒度连接数据保留天数                         |
| `dns_retention_days`             | u64    | `7`        | DNS 查询记录保留天数                             |
| `write_batch_size`               | usize  | `20000`    | 批量写入的条数阈值                               |
| `write_flush_interval_secs`      | u64    | `30`       | 批量写入的时间阈值 (秒)                          |
| `db_max_memory_mb`               | usize  | `256`      | DuckDB 内存上限 (MB)                             |
| `db_max_threads`                 | usize  | `4`        | DuckDB 线程数上限                                |
| `cleanup_interval_secs`          | u64    | `300`      | 过期数据清理间隔. debug 构建默认 `60`            |
| `cleanup_time_budget_ms`         | u64    | `2000`     | 单轮清理的耗时预算 (毫秒), 超时让出               |
| `cleanup_slice_window_secs`      | u64    | `300`      | 单轮清理处理的时间切片宽度 (秒)                  |

::: tip
`metric` 目录会随运行时间持续增长, 且清理只作用于上表的保留天数. 低配设备或小容量根盘上,
建议按需下调 `connect_*_retention_days` / `dns_retention_days`, 或直接 `mode = "memory"`.
:::

### `[dns]` DNS 服务

| 字段                 | 类型   | 默认值         | 说明                                     |
| -------------------- | ------ | -------------- | ---------------------------------------- |
| `cache_capacity`     | u32    | `4096`         | 缓存条目上限                             |
| `cache_ttl`          | u32    | `86400`        | 正向结果缓存 TTL 上限 (秒), 默认 24 小时 |
| `negative_cache_ttl` | u32    | `120`          | 空结果 (NXDOMAIN / NODATA) 缓存 TTL (秒) |
| `doh_listen_port`    | u16    | `6053`         | DoH 监听端口                             |
| `doh_http_endpoint`  | string | `"/dns-query"` | DoH 的 HTTP 路径                         |

### `[lan_hostname]` 内网主机名解析

把内网设备的主机名拼上统一后缀提供 DNS 解析, 并通过 DHCP 告知客户端该后缀.
完整说明见 [内网主机名与 LAN 后缀](../reference/lan-hostname).

| 字段         | 类型   | 默认值  | 说明                                     |
| ------------ | ------ | ------- | ---------------------------------------- |
| `enable`     | bool   | `true`  | 是否启用内网主机名解析                   |
| `lan_suffix` | string | `"lan"` | 内网域名后缀, 支持多级如 `home.arpa`     |

::: warning 升级注意
这一节旧名是 `[hostname_registry]`. 为兼容旧配置, 读取时仍接受该键名, 但**导出/序列化一律写
`[lan_hostname]`**. 两个键**同时出现会直接解析失败**, 手工改配置时请只保留一个.
:::

### `[ui]` 前端偏好

这三项由前端写入并持久化, 通常不需要手工配置. 未设置时由前端自行决定.

| 字段       | 类型   | 说明     |
| ---------- | ------ | -------- |
| `language` | string | 界面语言 |
| `timezone` | string | 时区     |
| `theme`    | string | 主题     |

### `[time]` NTP 时间同步

| 字段                 | 类型      | 默认值                                                              | 说明                               |
| -------------------- | --------- | ------------------------------------------------------------------- | ---------------------------------- |
| `enabled`            | bool      | `false`                                                             | 是否启用时间同步                   |
| `servers`            | [string]  | `["ntp.aliyun.com:123", "time.cloudflare.com:123", "pool.ntp.org:123"]` | NTP 服务器列表, 需带端口       |
| `sync_interval_secs` | u64       | `3600`                                                              | 同步间隔 (秒)                      |
| `timeout_secs`       | u64       | `3`                                                                 | 单次查询超时 (秒)                  |
| `step_threshold_ms`  | u64       | `500`                                                               | 偏差超过该值时直接跳变而非渐进调整 |
| `samples_per_server` | u8        | `3`                                                                 | 每台服务器采样次数                 |

### `[gateway]` HTTP 反向代理

用于把 80/443 的请求按域名转发到内网服务. 默认关闭, 也可通过前端修改.

| 字段          | 类型 | 默认值  | 说明               |
| ------------- | ---- | ------- | ------------------ |
| `enable`      | bool | `false` | 是否启用反代       |
| `http_port`   | u16  | `80`    | 反代 HTTP 监听端口 |
| `https_port`  | u16  | `443`   | 反代 HTTPS 监听端口 |

## landscape.toml 配置示例 (可以仅配置需要的)

```toml
[auth]
# 登录用户名
admin_user = "root"
# 登录密码
admin_pass = "root"

[web]
# Web 根目录路径
web_root = "/root/.landscape-router/static"
# HTTP 监听端口
port = 6300
# HTTPS 监听端口
https_port = 6443
# 监听地址 仅监听 IPV4 时使用 0.0.0.0
address = "::"

[log]
# 日志文件路径
log_path = "/root/.landscape-router/logs"
# 是否启用调试模式
debug = false
# 是否在终端输出日志
log_output_in_terminal = false
# 最大日志文件数量
max_log_files = 7

[store]
# 数据库路径
database_path = "sqlite:///root/.landscape-router/landscape_db.sqlite?mode=rwc"

[metric] # 指标配置，可通过前端修改
mode = "duckdb"
dns_retention_days = 7

[dns]
cache_capacity = 4096
negative_cache_ttl = 120

[lan_hostname]
enable = true
lan_suffix = "lan"

[time]
enabled = true
servers = ["ntp.aliyun.com:123", "pool.ntp.org:123"]

[gateway] # HTTP 反代默认为关闭，可通过前端修改
enable = true
http_port = 80 # 反代 HTTP 监听地址
https_port = 443 # 反代 HTTPS 监听地址
```

## 命令行参数与环境变量

命令行参数优先于 `landscape.toml`. 每个参数都有对应的环境变量, 方便容器部署.

| 参数                         | 环境变量                     | 对应配置项                 |
| ---------------------------- | ---------------------------- | -------------------------- |
| `-c`, `--config-dir`         | `LANDSCAPE_CONF_PATH`        | 配置目录 (`<HOME>`)        |
| `-w`, `--web`                | `LANDSCAPE_WEB_ROOT`         | `web.web_root`             |
| `-p`, `--port`               | `LANDSCAPE_WEB_HTTP_PORT`    | `web.port`                 |
| `-s`, `--https`              | `LANDSCAPE_WEB_HTTPS_PORT`   | `web.https_port`           |
| `-a`, `--address`            | `LANDSCAPE_WEB_ADDR`         | `web.address`              |
| `--user`                     | `LANDSCAPE_ADMIN_USER`       | `auth.admin_user`          |
| `--pass`                     | `LANDSCAPE_ADMIN_PASS`       | `auth.admin_pass`          |
| `--log_path`                 | `LANDSCAPE_LOG_PATH`         | `log.log_path`             |
| `--debug`                    | `LANDSCAPE_DEBUG`            | `log.debug`                |
| `-o`, `--log-output-in-terminal` | `LANDSCAPE_LOG_TERMINAL` | `log.log_output_in_terminal` |
| `--max-log-files`            | `LANDSCAPE_LOG_FILE_LIMIT`   | `log.max_log_files`        |
| `--db_url`                   | `DATABASE_URL`               | `store.database_path`      |

仅命令行可用 (无对应 `landscape.toml` 字段):

| 参数                    | 环境变量                  | 说明                                                                     |
| ----------------------- | ------------------------- | ------------------------------------------------------------------------ |
| `--log-filter`          | `LANDSCAPE_LOG_FILTER`    | 逗号分隔关键字. 指定后只输出 ERROR/WARN 及命中关键字的日志, 如 `dhcp,dns` |
| `--auto`                | `LANDSCAPE_AUTO`          | 自动初始化默认网络. 会自动把现有网卡划入区域                             |
| `-e`, `--export-manager` | -                        | 允许从 WAN IP 访问管理界面                                               |
| `--try-xdp`, `--txdp`   | -                         | 尝试 native XDP 挂载. 不带值=所有网卡, 也可给逗号分隔的 ifindex 如 `3,5`. 默认只用 TC (SKB) 模式 |
| `--ebpf_map_space`      | `LANDSCAPE_EBPF_MAP_SPACE` | eBPF map 命名空间, 默认 `default`                                       |

::: danger
`--auto` 会**自动把检测到的网卡划入区域**. 在已有配置的机器上、或在只想隔离测试的机器上使用,
可能把正在用的管理网卡一并接管导致失联. 非首次初始化场景不要带这个参数.
:::

### 子命令

```sh
# 交互式回滚数据库到某个发布边界
landscape-webserver db rollback
# 或使用别名
landscape-webserver db rb
```
