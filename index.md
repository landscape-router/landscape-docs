---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Landscape Router"
  text: "将 Linux 配置成路由"
  tagline: 不想用命令行配置路由? 试试用这个 UI 进行配置吧
  actions:
    - theme: brand
      text: 阅读文档
      link: /introduction
    - theme: alt
      text: 动手部署试试吧!
      link: /manual

features:
  - title: Linux 为基础
    details: "自由选择你想要的发行版 <br> 你的路由你做主 <br> (注: 内核 6.9.x 以上, musl 暂时仅支持 x86)"
  - title: eBPF 路由
    details: 所有数据包的修改和重定向转发都在内核中进行 <br> 不进入用户空间 <br> ( 不拷贝, 就是 0 拷贝 !!!
  - title: 分流
    details: 使用 IP / MAC 进行入口匹配. <br> 不同的 Flow 拥有独立的 DNS 缓存, 也可转发到 Docker 容器中, 详见文档
  - title: DNS
    details: "控制任意域名流量的行为 <br> 无论是劫持还是重定向到另一个流中 <br> DNS 流量出口与配置中一致 <br> ( 注: 需要将 DNS 指向本路由程序 )"
  - title: DHCPv4 
    details: 定期 ARP 扫描内网客户端. <br> 展示客户端 24 小时在线状态
  - title: v6 前缀转换
    details: 当流量的源 IP 前缀与当前发送的接口不同时. <br> 将自动转换为当前接口的前缀发出。
---

