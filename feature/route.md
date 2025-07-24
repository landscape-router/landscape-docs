# eBPF 路由
当前 Lan / Wan 要能通信， 需要将对应 Wan 和 Lan 网卡的路由转发功能开启。
![](../images/route/route-1.png)

## 加速原理
![](../images/route/route-2.png)
> you can find on [Wikipedia](https://en.wikipedia.org/wiki/Netfilter#/media/File:Netfilter-packet-flow.svg) under CC BY-SA 3.0 license

上图展示了 Netfilter 的工作流程。Netfilter 是 Linux 内核中的数据包处理框架，负责提供钩子（hooks）机制和数据包的过滤、修改等操作。iptables 和 nftables 则是基于 Netfilter 的用户空间工具，用于配置和管理防火墙规则。

当前程序的转发工作在上图的 **Ingress / Egress (qdisc)** 也就是在进入 Netfilter 之前， 就能决定发往哪个网口， 并且直接发送到网卡。以此进行加速转发。 不过目前没有将 NAT 中的连接共享到当前的实现中。 所以当前的加速效果并不是很明显。

目前只是从 0 —> 1 的实现。 之后将会做更多的优化。

而且判断是否转发到 Docker 容器， 也是在此进行的。所以对直连流量几乎是无损耗的。

