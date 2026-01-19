# eBPF Routing
Currently, for Lan / Wan to communicate, you need to enable routing forwarding functionality for the corresponding Wan and Lan network interfaces.
![](../../feature/route-img/route-1.png)

## Acceleration Principle
![](../../feature/route-img/route-2.png)
> you can find on [Wikipedia](https://en.wikipedia.org/wiki/Netfilter#/media/File:Netfilter-packet-flow.svg) under CC BY-SA 3.0 license

The diagram above shows the workflow of Netfilter. Netfilter is the packet processing framework in the Linux kernel, responsible for providing hooks mechanism and packet filtering, modification, and other operations. iptables and nftables are user-space tools based on Netfilter, used to configure and manage firewall rules.

The current program's forwarding work is done at **Ingress / Egress (qdisc)** in the diagram above, meaning before entering Netfilter, it can determine which network interface to send to and directly send to the network card. This accelerates forwarding. However, NAT connection sharing has not been integrated into the current implementation yet. So the current acceleration effect is not very obvious.

Currently, this is just a 0 to 1 implementation. More optimizations will be made in the future.

Also, determining whether to forward to Docker containers is done here as well. Therefore, direct traffic has almost no loss.

## Performance Testing

RX-PPS represents the number of packets that can be received.
RX-BPS represents the rate at which data can be received.

### Test 1
* CPU: 2700X (PVE virtualized with 4 physical cores)
* NIC: Passthrough X520-DA2

![64 small packets](../../feature/route-img/4-64.png)
![1500 large packets](../../feature/route-img/4-1500.png)


### Test 2
* CPU: 2700X (PVE virtualized with 4 physical cores / 8 threads)
* NIC: Passthrough X520-DA2

![64 small packets](../../feature/route-img/8-64.png)
![1500 large packets](../../feature/route-img/8-1500.png)
