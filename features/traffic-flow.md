# Traffic Shaping

Traffic shaping can `define` a set of target IP behaviors and `apply` them to a group of clients.

> Any ideas are welcome to be posted here: https://github.com/ThisSeanZhang/landscape/discussions/88

## Quick Navigation

- [Basic Concepts](#basic-concepts) - Understand core concepts like Flow, entry and exit
- [Flow Definition](#flow-definition) - How to create and configure a Flow
- [How Flows Divide](#how-flows-divide) - DNS and IP rules in detail
- [Rule Setting Location](#rule-setting-location) - Where to configure in the UI
- [Docker Container as Flow Exit](#how-to-use-docker-container-as-flow-exit) - Advanced usage

---

## Basic Concepts

### Core Terms

| Term             | Description                                                                       |
| ---------------- | --------------------------------------------------------------------------------- |
| **Flow (流)**    | A set of policies with entry and exit points                                      |
| **Entry (入口)** | A set of filter rules for screening clients, matching using `IP address` or `MAC` |
| **Exit (出口)**  | A Docker container or WAN network card, the final destination of the traffic      |
| **Priority**     | The smaller the value, the higher the priority (range: 0 ~ 65535)                 |

### Flow Types

#### Default Flow (Flow ID 0)

All `unmatched` traffic defaults to this flow, its exit is the `default route` set in the topology.

> **Example**: enable the "Set as default route" switch in [PPPoE configuration](../zh/reference/ipv4.md#pppoe)

#### Other Flows (Flow ID 1~255)

Matched according to entry rules, if matched successfully, enters this flow.

### Rule Matching Mechanism

::: tip
Matching logic

1. Check DNS rules and IP rules
2. When both types of rules are satisfied, select by priority (the smaller the value, the higher)
3. Once matched, send to the exit, subsequent rules are no longer matched
4. Each packet only matches one rule
   :::

::: warning
Priority conflicts: when a DNS rule and an IP rule have the same priority value, the DNS rule wins.
:::

---

## Flow Definition

### Core Questions

Traffic shaping focuses on three questions:

1. **Who**: which client does the traffic come from?
2. **Where**: which exit should the traffic go out through?
3. **How**: based on what (domain / IP) is the exit chosen?

### Creating a Flow

Click the button in the image below to create a new Flow:

![Create Flow](./traffic-flow/create-btn.png)

This configuration window will pop up:

![Flow configuration](./traffic-flow/flow-modal.png)

### Entry and Exit Configuration

**Entry**: defines which qualifying clients will use this flow

**Exit**: when traffic is handled by this flow, if the rules `have not changed` the target action, it is sent out through this exit (the flow's default exit)

::: info
Flexible configuration: not all traffic of this entry goes out through the default exit. You can use domain or IP rules to send specific traffic through other exits.
:::

### Special Configuration Scenarios

::: details
Entry / exit are optional

- **Exit only** (empty entry)
  The flow can be used as a forwarding target for other flows. Although no client enters directly, other flows' rules can reference it

- **Entry only** (empty exit)
  Traffic entering this flow is discarded by default, unless a rule specifies using another flow's exit

- **Neither configured**
  Can be used to discard traffic forwarded from other flows
  :::

---

## How Flows Divide

### DNS Rules

::: info
Independent cache: each flow has its own independent DNS cache, no need to worry about cache conflicts for the same domain across different flows.
:::

#### DNS Rule Components

Each DNS rule can define the following parts:

| Component          | Description                                                                          |
| ------------------ | ------------------------------------------------------------------------------------ |
| **Domain match**   | Which domain names trigger this rule                                                 |
| **DNS upstream**   | Which upstream server resolves the domain                                            |
| **Traffic action** | Which exit matched clients use when accessing this domain                            |
| **Priority**       | When conflicting with an IP rule, which one wins (the smaller the value, the higher) |

![DNS rule configuration](./traffic-flow/dns-rule-edit.png)

#### Fallback Rule

::: warning
Mandatory: every flow should have at least one fallback DNS rule, used for processing domains that match no rule.
:::

Fallback rule example:

![Fallback DNS rule](./traffic-flow/catch-all.png)

### Target IP Rules

IP rules are similar to DNS rules, minus the "DNS upstream" part:

- ✅ Traffic action
- ✅ Priority
- ❌ DNS upstream (not needed)

### Traffic Actions

Traffic actions are the core concept of a Flow, controlling the behavior of matched traffic.

![Traffic action options](./traffic-flow/flow-actions.png)

#### Action Types

| Action                      | Description                                      |
| --------------------------- | ------------------------------------------------ |
| **Current flow's exit**     | Use the default exit defined by the current Flow |
| **Default flow's exit**     | Use the default flow's (Flow 0) exit             |
| **Block connection**        | Discard the packet                               |
| **Use specified flow exit** | Use the exit of another specified Flow           |

#### Forwarding Example

Suppose there are Flow A and Flow B, and client C is configured to use B's exit when accessing website D:

```text
┌─────────────────────────────── Flow A (default exit) ────────────────────────────────┐
│                                                                                       │
│   [C initiates access] ───► Determine: target == D ? ───► No ───► Use A exit to send  │
│                              │                                                        │
│                              │ Yes                                                    │
│                              ▼                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────── Flow B (special exit) ─────────────────────────────────┐
│                               └──► Use B exit to send                                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

::: tip
Use cases

- C accesses website D → use B exit
- C accesses other websites → use A exit
  :::

---

## Rule Setting Location

### Default Flow (Flow 0) Destination Matching Rules

Access configuration through the **DNS card** in the upper right of the homepage:

![Default flow configuration entry](./traffic-flow/main-dns.png)

### Other Flows (Flow 1~255) Destination Matching Rules

Access configuration through **Traffic Shaping Settings** in the sidebar:

![Other flows configuration entry](./traffic-flow/other-dns.png)

---

## How to Use Docker Container as Flow Exit

### Prerequisites

Two programs are needed:

1. **Relay program** (`redirect_pkg_handler`)
   Download from [Release](https://github.com/ThisSeanZhang/landscape/releases/latest)

2. **Worker program**
   Can be any program: networking program, packet analysis program, etc.

::: danger
Important: only containers packaged with the [**relay program**](https://github.com/ThisSeanZhang/landscape/blob/main/landscape-ebpf/src/bin/redirect_pkg_handler.rs) can be used as effective flow **exit containers**!
:::

### Using the Official Image

The project provides a test relay program image: [landscape-edge](https://github.com/ThisSeanZhang/landscape/pkgs/container/landscape-edge)

#### Starting from the UI

If using the UI's image run interface, remember to check **Use as Flow exit**:

![Enable Flow exit option](./traffic-flow/docker-run.png)

#### Starting from the CLI

**Docker Run**

```shell
docker run -d \
  --name your_service \
  --sysctl net.ipv4.conf.lo.accept_local=1 \
  --cap-add=NET_ADMIN \
  --cap-add=BPF \
  --cap-add=PERFMON \
  --privileged \
  -v /root/.landscape-router/unix_link/:/ld_unix_link/:ro \ # Required mapping
  ghcr.io/thisseanzhang/landscape-edge:amd64-xx # xx needs to be modified to appropriate version
```

**Docker Compose**

```yaml
services:
  your_service:
    image: ghcr.io/thisseanzhang/landscape-edge:amd64-xx # xx needs to be modified to appropriate version
    sysctls:
      - net.ipv4.conf.lo.accept_local=1
    cap_add:
      - NET_ADMIN
      - BPF
      - PERFMON
    privileged: true
    volumes:
      - /root/.landscape-router/unix_link/:/ld_unix_link/:ro # Required mapping
      # Can mount any worker program and its startup scripts etc. required files :/app/server
```

### Worker Program

The image bundles a [**demo worker program**](https://github.com/ThisSeanZhang/landscape/blob/main/landscape-ebpf/src/bin/redirect_demo_server.rs):

- **Location**: `/app/server`
- **Function**: creates a TProxy listening on port `12345`
- **Relay program location**: `/app/redirect_pkg_handler`
- **Default forwarding port**: `12345` (changeable via the environment variable `LAND_PROXY_SERVER_PORT`)

### Custom Worker Program

#### Replacing the Worker Program

Mount your worker program to the `/app/server` directory:

```text
Local directory structure:
/xx/flow/
├── config.json
├── run.sh          # Startup script
└── server          # Your worker program
```

Mapping to the container:

```yaml
volumes:
  - /xx/flow:/app/server
```

When the container starts, `/app/server/run.sh` will be executed automatically.

::: tip
Tip: the [test relay program image](https://github.com/ThisSeanZhang/landscape/pkgs/container/landscape-edge) already includes the relay program, no need to add or mount it yourself.
:::

### Custom Image Integration

To integrate the relay program into an existing image:

1. **Download the relay program**
   Get `redirect_pkg_handler` from [Release](https://github.com/ThisSeanZhang/landscape/releases)

2. **Configure the startup script**

```bash
#!/bin/bash

# Configure routing table
ip rule add fwmark 0x1/0x1 lookup 100
ip route add local default dev lo table 100

# Start the worker program
/app/server/run.sh /app/server &

# Start the relay program
/app/redirect_pkg_handler &

wait
```

---

## Relay Program Parameters

Every argument of `redirect_pkg_handler` has a corresponding environment variable:

| Argument                    | Environment variable                 | Default   | Description                               |
| --------------------------- | ------------------------------------ | --------- | ----------------------------------------- |
| `-s`, `--saddr`             | `LAND_PROXY_SERVER_ADDR`             | `0.0.0.0` | Worker program IPv4 listen address        |
| `--saddr6`                  | `LAND_PROXY_SERVER_ADDR_V6`          | `::`      | Worker program IPv6 listen address        |
| `-p`, `--sport`             | `LAND_PROXY_SERVER_PORT`             | `12345`   | Worker program listen port                |
| `-m`, `--mode`              | `LAND_PROXY_HANDLE_MODE`             | `tproxy`  | `tproxy` / `route` / `multiple_tproxy`    |
| `--enable-icmp-passthrough` | `LAND_PROXY_ENABLE_ICMP_PASSTHROUGH` | `false`   | See ICMP passthrough below                |
| `--icmp-mark-value`         | `LAND_PROXY_ICMP_MARK_VALUE`         | `2`       | The mark applied when ICMP passes through |
| `--sock_path`               | `LAND_SOCK_PATH`                     | -         | Unix socket path for registration         |
| `--log-level`               | `LAND_REDIRECT_LOG_LEVEL`            | `INFO`    | Log level                                 |

### ICMP Passthrough

The TProxy mechanism only takes over TCP / UDP. The relay program **drops incoming ICMP packets by default**, so `ping` does not work on paths routed through a flow exit container - this is by design, not a fault.

After enabling `--enable-icmp-passthrough`, ICMP packets are marked with `--icmp-mark-value` and handed over to the local protocol stack, so `ping` works.

::: warning Enabling the flag alone is not enough
Passthrough only prevents packets from being dropped; outbound traffic still needs forwarding and NAT configured inside the container, and the **mark must match `--icmp-mark-value`**:

```sh
echo 1 > /proc/sys/net/ipv4/ip_forward
echo 1 > /proc/sys/net/ipv6/conf/all/forwarding
iptables  -t nat -A POSTROUTING -m mark --mark 0x2/0x2 -j MASQUERADE
ip6tables -t nat -A POSTROUTING -m mark --mark 0x2/0x2 -j MASQUERADE
```

The official image's `start.sh` already contains these lines but they are **commented out by default**. Uncomment them when needed, or put them in your own `/app/server/run.sh`.
:::

---

## Related Resources

- [GitHub Discussions](https://github.com/ThisSeanZhang/landscape/discussions/88)
- [Release downloads](https://github.com/ThisSeanZhang/landscape/releases)
- [Relay program source](https://github.com/ThisSeanZhang/landscape/blob/main/landscape-ebpf/src/bin/redirect_pkg_handler.rs)
- [Official image](https://github.com/ThisSeanZhang/landscape/pkgs/container/landscape-edge)
