# Basic Network Setup

> This guide takes you through the minimum configuration needed to get online: assign interface zones → configure how WAN connects → configure LAN and DHCP.

## Prerequisites

- You have finished [Manual Deployment](../intro/manual-deployment.md) and can reach the management interface
- At least two interfaces: one facing the modem / upstream router (WAN), one facing your internal switch or PC (LAN)

::: tip
Landscape will start with only one interface, but it cannot perform routing that way.
:::

## Step 1: Assign interface zones

In Landscape every interface must belong to a **Zone** before any service can be configured on it.

There are three zones; see [Zone](../reference/interface-zone.md) for the details:

| Zone          | Purpose                                                                           |
| ------------- | --------------------------------------------------------------------------------- |
| **WAN**       | The interface that reaches the internet                                           |
| **LAN**       | The interface that serves the internal network                                    |
| **Undefined** | Unassigned; the default for a new interface, and usable as a bridge sub-interface |

Find the zone switch button in the interface list:

![](../zh/reference/zone-switching/1.png)

Set the interface facing the modem to **WAN**, and the one facing your internal network to **LAN**.

::: warning
An interface in the WAN zone cannot be a bridge member. If you intend to bridge several internal ports into one LAN, leave those ports Undefined and attach them to the bridge — see [Creating a bridge](../reference/basic-settings.md#creating-a-bridge).
:::

## Step 2: Configure how WAN connects

The WAN interface needs an IP before it can reach the internet. Pick one of the three methods to match your line; see [Interface IP Settings](../reference/ipv4.md) for the UI details.

::: tabs
== PPPoE (most common for home broadband)

Add a PPPoE account on the WAN interface, fill in the credentials your ISP gave you, and tick the option to make it the default route.

![](../zh/reference/ipv4/pppoe_edit.png)

AC Name can normally be left empty.

== DHCP client

Use this when the upstream device is already a router. Once enabled, the address is obtained automatically.

![](../zh/reference/ipv4/dhcp_v4_client.png)

The hostname is optional and defaults to the machine's own hostname.

== Static IP

Use this when your ISP or upstream gave you a fixed address. Fill in the IP, mask and gateway.

![](../zh/reference/ipv4/static_ip.png)

Remember to tick the default route option.
:::

## Step 3: Enable the necessary WAN-side services

After getting an address, a few services still need enabling before internal traffic can get out. Find the service buttons on the WAN interface:

![](../zh/reference/zone-switching/10.png)

| Service       | Required?            | Notes                                                               |
| ------------- | -------------------- | ------------------------------------------------------------------- |
| **NAT**       | Required             | Internal addresses must be translated to the WAN address to get out |
| **Route WAN** | Required             | The forwarding service; should be enabled                           |
| **Firewall**  | Recommended          | Blocks inbound connections initiated from outside                   |
| **MSS clamp** | Recommended on PPPoE | Prevents large packets being dropped, which breaks some sites       |

Unless you have special requirements, enabling them with the defaults is fine.

## Step 4: Configure LAN

### Give the LAN interface a static IP

The LAN interface needs a fixed address, which becomes the gateway for internal devices. For example `192.168.5.1`:

![](../zh/reference/ipv4/static_ip.png)

::: tip
This address has to match the `server address` in the DHCP step below.
:::

### Enable the DHCP service

This lets internal devices obtain addresses automatically. Find the DHCPv4 service on the LAN interface:

![](../zh/reference/dhcpv4/1.png)

The configuration screen:

![](../zh/reference/dhcpv4/2.png)

The fields that matter:

| Field          | Example         | Notes                                   |
| -------------- | --------------- | --------------------------------------- |
| Pool start     | `192.168.5.100` | Allocation begins at this address       |
| Pool end       | `192.168.5.200` | Allocation stops at this address        |
| Server address | `192.168.5.1`   | The gateway address; matches the LAN IP |
| Mask           | `24`            | Equivalent to 255.255.255.0             |
| Lease time     | `43200`         | Seconds; 12 hours by default            |

### Enable LAN route forwarding

Also in the LAN interface's services, enable **Route LAN**:

![](../zh/reference/zone-switching/11.png)

## Verifying

Once connected, an internal device should be able to:

1. Obtain a `192.168.5.x` address automatically
2. Resolve domains (Landscape ships with a Cloudflare upstream DNS already configured)
3. Reach the internet normally

If domain resolution misbehaves, see [DNS Setup](./dns-setup.md) and [DNS Related](../faq/dns.md).

## Next steps

- [DNS Setup](./dns-setup.md) — change the upstream DNS, configure redirects
- [Flow Setup](./flow-setup.md) — send different devices out through different egresses
- [LAN Hostnames and the LAN Suffix](../reference/lan-hostname.md) — reach internal devices as `nas.lan`
- [IPv6 Configuration](../reference/ipv6/index.md) — enable IPv6
