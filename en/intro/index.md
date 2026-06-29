# Landscape - eBPF-based Linux Router Platform

Landscape Router is a tool built with eBPF / Rust / Vue  
that helps you turn Linux into a **router**.

<div style="display: flex;">
<a href="https://github.com/ThisSeanZhang/landscape"><img src="https://img.shields.io/github/stars/ThisSeanZhang/landscape.svg?logo=github&style=for-the-badge" alt="GitHub stars"></a>
<a href="https://github.com/ThisSeanZhang/landscape/releases/latest"><img src="https://img.shields.io/github/downloads/ThisSeanZhang/landscape/total.svg?style=for-the-badge&logo=github" alt="GitHub Releases"></a>
</div>

## Overview

![](./index/main.png)

## Core Features

- eBPF-based traffic steering. Direct traffic keeps its performance. Match entries with `(SIP-CIDR, MAC)` and targets with `(DIP, domain, Geo rules)`
- Independent DNS configuration and cache for each Flow to avoid DNS pollution and leaks
- Redirect traffic into Docker containers, so TProxy-capable programs can extend behavior
- Geo database management with DAT and TXT source support
- A stricter default NAT4 model, while still allowing specified IPs or domains to use NAT1 for scenarios such as overlay networking
- A full API. Everything available in the UI can also be done through API

## Why Landscape Exists

The most direct reason is simple: I wanted to keep using the Linux distribution I am already familiar with, instead of being locked into a single router OS. In addition to Debian, Landscape has already seen real-world use on Arch, openSUSE, and other distributions.

It is absolutely possible to build a router by combining existing Linux programs, and that approach can be stable. But those setups usually scatter configuration across many places, increase maintenance cost, and require extra work for storing and migrating configuration files. Landscape keeps those configurations in a single directory. A new version can replace the old one directly, migrate configuration automatically on startup, and still supports downgrading when needed.

Many LAN environments also contain BT/PT or similar software that needs NAT1, while you may not want other PCDN-style software quietly consuming your uplink. Landscape therefore provides finer-grained NAT control, so NAT behavior can be decided per domain or IP.

Different devices on the same LAN often need different traffic policies, and direct traffic should continue working even if a container used for diversion fails. Landscape is designed around that requirement.
