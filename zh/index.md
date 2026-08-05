---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Landscape Router"
  text: "按域名与 IP 路由流量"
  tagline: "每个 Flow 独立 DNS；DNS 决策，XDP/TC 内核执行"
  actions:
    - theme: brand
      text: 开始配置
      link: "/zh/getting-started/basic-network-setup"
    - theme: alt
      text: 部署指南
      link: "/zh/intro/manual-deployment"

features:
  - title: Flow 策略组
    details: "DNS、出口和 NAT 按 Flow 统一管理，设备可通过 IP 或 MAC 加入不同策略。"
  - title: DNS 驱动分流
    details: "DNS 应答写入每个 Flow 的 eBPF Map，将域名策略直接转化为数据包转发决策。"
  - title: DNS 亲和出口
    details: "流量走哪条线路，DNS 就从哪条线路查询，让 CDN 返回与实际出口匹配的解析结果。"
  - title: 细粒度 NAT
    details: "默认严格 NAT4，并可按域名或 IP 放通 NAT1，避免对整个网络一刀切。"
  - title: IPv6 多 WAN
    details: "流量切换出口时自动切换 IPv6 前缀，NPTv6 在 eBPF 驱动层完成。"
  - title: eBPF 内核数据平面
    details: "XDP/TC 在内核态执行转发，无用户态数据路径，无需 iptables。"
  - title: 容器即出口
    details: "将指定流量导入运行 TProxy 程序的 Docker 容器；容器故障不影响未导入的直连流量。"
  - title: 标准 Linux
    details: "支持 Debian、Arch 和 openSUSE；配置集中在一个目录，替换二进制即可升级。"
