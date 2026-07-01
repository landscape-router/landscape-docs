# eBPF Routing Acceleration

## Overview

Landscape Router uses eBPF to implement high-performance packet forwarding in the kernel, bypassing the traditional Netfilter path and significantly improving routing performance.

## Prerequisites

For LAN and WAN to communicate normally, route forwarding must be enabled on the corresponding interfaces.

![Enable route forwarding](../../features/ebpf-route/route-1.png)

::: tip
Where to configure it Open the interface configuration page, find the relevant WAN and LAN interfaces, and enable the `Route Forwarding Service` option.
:::

---

## How the Acceleration Works

### Netfilter Packet Flow

The diagram below shows the full Netfilter packet flow:

![Netfilter packet flow](../../features/ebpf-route/route-2.png)

> Image source: [Wikipedia - Netfilter](https://en.wikipedia.org/wiki/Netfilter#/media/File:Netfilter-packet-flow.svg) (CC BY-SA 3.0)

### Traditional Routing vs eBPF Routing

#### Traditional approach (Netfilter / iptables / nftables)

Forwarded packets must pass through multiple Netfilter hook points. Taking LAN → WAN as an example:

```text
NIC receive → Pre-routing (connection tracking)
            → Routing decision
            → Forward (firewall filtering)
            → Post-routing (SNAT / Masquerade)
            → Transmit
```

The WAN → LAN direction is symmetric, except DNAT (port forwarding) occurs in the Pre-routing stage, with connection tracking ensuring reply packets are automatically restored.

#### TC (Traffic Control) layer approach

Landscape Router completes forwarding at the **Ingress / Egress (qdisc)** layer — it decides the destination **before** packets enter Netfilter and sends them directly to the target interface, completely bypassing the Netfilter processing chain.

Acceleration path:

```text
NIC receive → driver → SKB alloc → eBPF processing (TC layer) → bpf_redirect() → target NIC
```

#### XDP (eXpress Data Path) approach

XDP intercepts packets at the **earliest entry point** of the kernel network stack — the NIC driver layer — before SKB (Socket Buffer) allocation. This enables significantly higher forwarding performance than TC.

Acceleration path:

```text
NIC receive -> XDP processing (driver layer, before SKB alloc) -> bpf_redirect() to target NIC
```

### Enabling XDP

Pass the `--try-xdp` flag when starting Landscape Router:

```bash
landscape-webserver --try-xdp
```

Or restrict to specific interfaces:

```bash
landscape-webserver --try-xdp=eth0,eth1
```

If the NIC driver does not support native XDP, the system automatically falls back to the TC path.

## Performance Tests

### Metric Definitions

- **RX-PPS**: received packets per second
- **RX-BPS**: received bits per second

### Test Environment 1

**Configuration**:

- Operating system: Arch Linux (kernel 6.12.63-1-lts)
- CPU: AMD 2700X (PVE virtual machine with 4 physical cores)
- NIC: Passthrough X520-DA2 (10Gbps)

**Results**:

#### Small packet performance (64 bytes)

![64-byte packet test](../../features/ebpf-route/4-64.png)

#### Large packet performance (1500 bytes)

![1500-byte packet test](../../features/ebpf-route/4-1500.png)

---

### Test Environment 2

**Configuration**:

- Operating system: Arch Linux (kernel 6.12.63-1-lts)
- CPU: AMD 2700X (PVE virtual machine with 4 physical cores / 8 threads)
- NIC: Passthrough X520-DA2 (10Gbps)

**Results**:

#### Small packet performance (64 bytes)

![64-byte packet test](../../features/ebpf-route/8-64.png)

#### Large packet performance (1500 bytes)

![1500-byte packet test](../../features/ebpf-route/8-1500.png)

---

### Test Environment 3 (XDP + NAT Forwarding)

**Configuration**:

- Operating system: Arch Linux (ChachyOS Server)
- CPU: Intel 9100T (4 cores / 4 threads)
- NIC: Passthrough X520-DA2 (10Gbps)

**Tool**: TRex ASTF (stateful traffic)

**Result** (bidirectional 64-byte small packets):

![XDP NAT 64-byte forwarding](../../features/ebpf-route/xdp-has-nat-forward.gif)

---
