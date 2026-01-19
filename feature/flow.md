# 分流控制

分流可以`定义`一组目标 IP 行为，`应用`在一组客户端。

> 有任何想法欢迎在此发布评论：https://github.com/ThisSeanZhang/landscape/discussions/88

## 快速导航

- [基础概念](#基础概念) - 了解 Flow、入口、出口等核心概念
- [流的定义](#流的定义) - 如何创建和配置 Flow
- [流怎么分](#流怎么分) - DNS 规则和 IP 规则详解
- [规则设置位置](#规则设置的位置) - 在界面中的配置位置
- [Docker 容器作为出口](#如何使用-docker-容器作为流出口) - 高级用法

---

## 基础概念

### 核心术语

| 术语 | 说明 |
|------|------|
| **Flow（流）** | 一组策略，拥有入口和出口 |
| **入口** | 一组过滤筛选客户端的规则，使用 IP 地址或 MAC 进行匹配 |
| **出口** | Docker 容器或 WAN 网卡，流量最终发送的目标 |
| **优先级** | 数值越小优先级越高（取值范围：0 ~ 65535） |

### Flow 类型

#### 默认流（Flow ID 0）
所有`未匹配`的流量默认进入此流，出口为拓扑中设置的`默认路由`。

> **示例**：在 [PPPoE 配置](../other-features/ipv4/ipv4.md#pppoe)中启用"设置默认路由"开关

#### 其他流（Flow ID 1~255）
按入口规则匹配，匹配成功则进入此流。

### 规则匹配机制

:::tip 匹配逻辑
1. 检查 DNS 规则和 IP 规则
2. 当同时满足两类规则时，按优先级选择（数值越小越高）
3. 匹配上即发送至出口，后续规则不再匹配
4. 每个数据包只会匹配一条规则
:::

:::warning 优先级冲突
当 DNS 规则和 IP 规则的优先级值相同时，优先使用 DNS 规则。
:::

---

## 流的定义

### 核心问题

分流关注三个问题：
1. **谁**：从哪个客户端来的流量？
2. **去哪**：流量要到哪个出口出去？
3. **怎么选**：根据什么（域名/IP）选择出口？

### 创建 Flow

点击下图的按钮，可以创建一个新的 Flow：

![创建 Flow](./flow-img/flow-10.png)  

将会弹出这个配置窗口：

![Flow 配置](./flow-img/flow-8.png)  

### 入口和出口配置

**入口**：定义哪些符合条件的客户端将使用这个流

**出口**：当流量被这个流处理时，如果规则`没有改变`目标动作，则使用此出口发送（流的默认出口）

:::info 灵活配置
并不是该入口的所有流量都从默认出口发出，可以通过域名或 IP 规则指定特定流量使用其他出口。
:::

### 特殊配置场景

:::details 入口/出口可选配置
- **仅配置出口**（入口为空）  
  该流可作为其他流的转发目标，虽然没有直接进入的客户端，但可以被其他流的规则引用

- **仅配置入口**（出口为空）  
  进入这个流的流量默认被丢弃，除非规则指定使用其他流的出口

- **都不配置**  
  可作为其他流转发过来的流量丢弃点
:::

---

## 流怎么分

### DNS 规则

:::info 独立缓存
每个流都有独立的 DNS 缓存，不用担心同域名在不同流中的缓存冲突。
:::

#### DNS 规则组成

每条 DNS 规则可以定义以下部分：

| 组成部分 | 说明 |
|---------|------|
| **域名匹配** | 定义什么域名触发此规则 |
| **DNS 上游** | 解析该域名时使用哪个上游服务器 |
| **流量动作** | 匹配的客户端访问此域名时，使用哪个出口 |
| **优先级** | 与 IP 规则冲突时，哪个生效（数值越小越高） |

![DNS 规则配置](./flow-img/flow-7.png)

#### 兜底规则

:::warning 必须配置
每个 Flow 应当至少有一条兜底 DNS 规则，用于处理没有匹配任何规则的域名。
:::

兜底规则示例：

![兜底 DNS 规则](./flow-img/flow-11.png)

### 目标 IP 规则

IP 规则与 DNS 规则类似，但少了"DNS 上游"配置：

- ✅ 流量动作
- ✅ 优先级
- ❌ DNS 上游（不需要）

### 流量动作

流量动作是 Flow 的核心概念，控制匹配规则的流量行为。

![流量动作选项](./flow-img/flow-3.png)  

#### 动作类型

| 动作 | 说明 |
|------|------|
| **当前流的出口** | 使用当前 Flow 定义的默认出口 |
| **默认流的出口** | 使用默认流（Flow 0）的出口 |
| **禁止连接** | 丢弃该数据包 |
| **使用指定流出口** | 使用其他指定 Flow 的出口 |

#### 流量转发示例

假设有 Flow A 和 Flow B，配置客户端 C 访问网站 D 时使用 B 的出口：

```text
┌─────────────────────────────── Flow A（默认出口）────────────────────────────────┐
│                                                                                 │
│   [C 发起访问] ───► 判断：目标 == D？───► 否 ───► 使用 A 出口发送                │
│                     │                                                           │
│                     │ 是                                                        │
│                     ▼                                                           │
└─────────────────────────────────────────────────────────────────────────────────┘
                      │
┌─────────────────────────────── Flow B（特殊出口）────────────────────────────────┐
│                     └──► 使用 B 出口发送                                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

:::tip 使用场景
- C 访问 D 网站 → 使用 B 出口
- C 访问其他网站 → 使用 A 出口
:::

---

## 规则设置的位置

### 默认流（Flow 0）目的匹配规则

通过主页右上方的 **DNS 卡片** 进入配置：

![默认流配置入口](./flow-img/flow-6.png)  

### 其他流（Flow 1~255）目的匹配规则

通过侧边栏的 **分流设置** 进入配置：

![其他流配置入口](./flow-img/flow-9.png) 

---

## 如何使用 Docker 容器作为流出口

### 前置准备

需要两个程序配合使用：

1. **接应程序**（`redirect_pkg_handler`）  
   从 [Release](https://github.com/ThisSeanZhang/landscape/releases/latest) 下载

2. **工作程序**  
   可以是任意程序：组网程序、数据包分析程序、代理程序等

:::danger 重要提示
只有搭配 [**接应程序**](https://github.com/ThisSeanZhang/landscape/blob/main/landscape-ebpf/src/bin/redirect_pkg_handler.rs) 打包的容器，才能作为有效的流出口容器！
:::

### 使用官方镜像

项目提供了测试用的接应程序镜像：[landscape-edge](https://github.com/ThisSeanZhang/landscape/pkgs/container/landscape-edge)

#### UI 界面启动

如果使用 UI 界面运行，记得勾选 **用作 Flow 出口**：

![开启 Flow 出口选项](./flow-img/flow-5.png)

#### 命令行启动

**Docker Run 方式**

```shell
docker run -d \
  --name your_service \
  --sysctl net.ipv4.conf.lo.accept_local=1 \
  --cap-add=NET_ADMIN \
  --cap-add=BPF \
  --cap-add=PERFMON \
  --privileged \
  -v /root/.landscape-router/unix_link/:/ld_unix_link/:ro \ # 必要映射
  ghcr.io/thisseanzhang/landscape-edge:amd64-xx # xx 需修改为合适版本
```

**Docker Compose 方式**

```yaml
services:
  your_service:
    image: ghcr.io/thisseanzhang/landscape-edge:amd64-xx # xx 需修改为合适版本
    sysctls:
      - net.ipv4.conf.lo.accept_local=1
    cap_add:
      - NET_ADMIN
      - BPF
      - PERFMON
    privileged: true
    volumes:
      - /root/.landscape-router/unix_link/:/ld_unix_link/:ro # 必要映射
      # 挂载 任意工作程序及其启动脚本等所需文件 :/app/server
```

### 工作程序说明

镜像内置了 [演示工作程序](https://github.com/ThisSeanZhang/landscape/blob/main/landscape-ebpf/src/bin/redirect_demo_server.rs)：

- **位置**：`/app/server`
- **功能**：创建 TProxy 监听端口 `12345`
- **接应程序位置**：`/app/redirect_pkg_handler`
- **默认转发端口**：`12345`（可通过环境变量 `LAND_PROXY_SERVER_PORT` 修改）

### 自定义工作程序

#### 替换工作程序

将你的工作程序挂载到 `/app/server` 目录：

```text
本地目录结构：
/xx/flow/
├── config.json
├── run.sh          # 启动脚本
└── server          # 你的工作程序
```

映射到容器：

```yaml
volumes:
  - /xx/flow:/app/server
```

容器启动时会自动执行 `/app/server/run.sh`。

:::tip 提示
[测试接应程序镜像](https://github.com/ThisSeanZhang/landscape/pkgs/container/landscape-edge)已包含接应程序，无需额外添加或挂载。
:::

### 自定义镜像集成

如果要在现有镜像中集成接应程序：

1. **下载接应程序**  
   从 [Release](https://github.com/ThisSeanZhang/landscape/releases) 获取 `redirect_pkg_handler`

2. **配置启动脚本**

```bash
#!/bin/bash

# 配置路由表
ip rule add fwmark 0x1/0x1 lookup 100
ip route add local default dev lo table 100

# 启动工作程序
/app/server/run.sh /app/server &

# 启动接应程序
/app/redirect_pkg_handler &

wait
```

---

## 相关资源

- [GitHub 讨论区](https://github.com/ThisSeanZhang/landscape/discussions/88)
- [Release 下载](https://github.com/ThisSeanZhang/landscape/releases)
- [接应程序源码](https://github.com/ThisSeanZhang/landscape/blob/main/landscape-ebpf/src/bin/redirect_pkg_handler.rs)
- [官方镜像](https://github.com/ThisSeanZhang/landscape/pkgs/container/landscape-edge)