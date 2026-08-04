---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Landscape Router"
  text: "将任意 Linux 变为路由"
  tagline: "DNS 解析就是路由规则. 域名驱动, eBPF 执行"
  actions:
    - theme: brand
      text: 阅读文档
      link: "/zh/intro/"
    - theme: alt
      text: 动手部署试试吧!
      link: "/zh/intro/manual-deployment"

features:
  - title: Flow 策略组
    details: "一个 Flow 就是一个独立策略组：DNS、出口、NAT 全部打包 <br> 设备通过 IP / MAC 一键加入，无需分别配置路由表与防火墙 <br> 一套 Flow 替代 dnsmasq + ipset + iptables + ip rule 分散管理"
  - title: DNS 亲和出口
    details: "流量走哪条线，DNS 就从哪条线查询 <br> CDN 自动分配当前出口最优 IP <br> 无需 ECS、智能 DNS、最优 IP 测速等额外方案"
  - title: DNS 驱动分流
    details: "DNS 解析结果分 Flow 存储，告别 ipset 混装导致的分流混乱 <br> 同一域名在不同 Flow 下也可以走不同出口"
  - title: Linux 为基础
    details: "仅依赖 Linux 内核 ≥ 6.9，不绑定特定发行版 <br> x86 / ARM 均支持，替换二进制即升级 <br> Debian、Arch、openSUSE 已实际验证"
  - title: eBPF 路由
    details: "NAT、防火墙、转发全在网卡驱动层处理，不用 iptables <br> 数据包不离开内核，不进用户态 <br> 线速转发，零拷贝零开销"
  - title: 多模 NAT
    details: "默认严格 NAT4，仅对指定域名或 IP 放开 NAT1"
  - title: IPv6 多线无感切换
    details: "多 WAN 场景下流出不同接口时，自动切换为对应前缀 <br> NPTv6 在 eBPF 驱动层完成，不做逐包 iptables 转换"
  - title: 容器即出口
    details: "流量可导入 Docker 容器处理后再发出 <br> 在容器中运行任意 TProxy 程序扩展路由能力 <br> 容器就是可编程的路由出口"
