---
layout: home

hero:
  name: "Landscape Router"
  text: "Configuring Linux as a Router"
  tagline: "A tool developed using eBPF / Rust / Vue"
  actions:
    - theme: brand
      text: Read Documentation
      link: "/en/introduction"
    - theme: alt
      text: Try Manual Deployment!
      link: "/en/manual"

features:
  - title: Linux Based
    details: "Freely choose your preferred distribution <br> Your router, your choice <br> (Note: Kernel 6.9.x+, musl currently only supports x86)"
  - title: eBPF Routing
    details: "All packet modifications and redirect forwarding happen in the kernel <br> No user space involvement <br> (Zero-copy, no copying!!!"
  - title: Traffic Shaping
    details: "Use IP / MAC for entry matching <br> Different Flows have independent DNS caches, can also forward to Docker containers, see documentation for details"
  - title: DNS
    details: "Control behavior of any domain traffic <br> Whether hijacking or redirecting to another flow <br> DNS traffic exit matches configuration <br> (Note: DNS must point to this routing program)"
  - title: DHCPv4
    details: "Regular ARP scanning of LAN clients <br> Display 24-hour online status of clients"
  - title: v6 Prefix Conversion
    details: "When the source IP prefix of traffic differs from the current sending interface <br> Automatically convert to current interface prefix for transmission."
---
