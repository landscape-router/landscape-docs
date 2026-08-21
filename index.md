---
layout: home

hero:
  name: 'Landscape Router'
  text: 'Route by Domain, Not Just IP'
  tagline: 'Per-Flow DNS. DNS decisions enforced by XDP/TC.'
  actions:
    - theme: brand
      text: Start Configuring
      link: '/getting-started/basic-network-setup'
    - theme: alt
      text: Deployment Guide
      link: '/intro/manual-deployment'

features:
  - title: Route Traffic by Domain
    details: 'Set traffic policies with domains instead of maintaining IP lists and policy-routing rules by hand; DNS answers update the eBPF maps automatically.'
  - title: Per-Flow DNS Isolation
    details: 'Each Flow has independent DNS upstreams, rules and cache, preventing cross-Flow leaks.'
  - title: eBPF Kernel Data Plane
    details: 'XDP and TC steer packets in the kernel, with no userspace datapath or iptables.'
  - title: Standard Linux, No Lock-In
    details: 'Run on Debian, Arch or openSUSE; keep configuration in one directory and upgrade by replacing the binary.'
  - title: Egress-Aware DNS
    details: 'Each Flow queries DNS through its selected egress, so CDN answers match the path traffic actually uses.'
  - title: Container Egress, Isolated Failures
    details: 'Send selected traffic through any TProxy-compatible Docker container; direct traffic remains independent if it fails.'
  - title: Full REST API
    details: 'Automate web UI operations through the REST API and the published npm types.'
  - title: Multi-Mode NAT
    details: 'Use destination-locked NAT by default and allow Full Cone NAT per domain or IP.'
---
