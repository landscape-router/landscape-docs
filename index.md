---
layout: home

hero:
  name: 'Landscape Router'
  text: 'Configuring Linux as a Router'
  tagline: 'A tool developed using eBPF / Rust / Vue'
  actions:
    - theme: brand
      text: Read Documentation
      link: '/intro/'
    - theme: alt
      text: Try Manual Deployment!
      link: '/intro/manual-deployment'

features:
  - title: Flow Policy Groups
    details: 'A Flow is an independent policy group: DNS, egress and NAT all bundled together <br> Devices join by IP / MAC in one click, no need to configure routing tables and firewalls separately <br> One Flow replaces the scattered management of dnsmasq + ipset + iptables + ip rule'
  - title: DNS Affinity Egress
    details: 'Traffic queries DNS from the same line it goes out on <br> CDN automatically assigns the optimal IP for the current egress <br> No need for ECS, smart DNS, optimal-IP speed testing or other extra solutions'
  - title: DNS-Driven Traffic Splitting
    details: 'DNS resolution results are stored per Flow, no more splitting chaos caused by mixed ipset <br> The same domain can go out through different egresses in different Flows'
  - title: Linux Based
    details: 'Only requires Linux kernel >= 6.9, not tied to a specific distribution <br> x86 / ARM both supported, upgrading means replacing the binary <br> Verified on Debian, Arch and openSUSE'
  - title: eBPF Routing
    details: 'NAT, firewall and forwarding all handled at the network card driver layer, no iptables <br> Packets never leave the kernel, never enter user space <br> Line-speed forwarding, zero-copy, zero overhead'
  - title: Multi-Mode NAT
    details: 'Strict NAT4 by default, NAT1 only opened for specified domains or IPs'
  - title: Seamless IPv6 Multi-WAN Switching
    details: 'When traffic egresses different interfaces in a multi-WAN setup, the prefix switches automatically <br> NPTv6 is done at the eBPF driver layer, no per-packet iptables conversion'
  - title: Container as Egress
    details: 'Traffic can be imported into a Docker container for processing before being sent out <br> Run any TProxy program inside the container to extend routing capabilities <br> The container is a programmable routing egress'
---
