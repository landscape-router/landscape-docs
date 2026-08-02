# Zone

A Zone is the core mechanism Landscape uses to group network interfaces logically. Every interface must belong to a zone before it can take part in routing. The zone an interface belongs to determines its traffic pipeline, the services it can run, and how it behaves in the topology.

Landscape has three zones:

## Wan

Interfaces in the Wan zone face the internet and carry upstream traffic. Landscape attaches the eBPF WAN TC pipeline to them. The following IP configuration methods are supported:

- Static IP
- DHCP Client
- PPPoE / PPPD
- DHCPv6-PD (IPv6 prefix delegation)

Services that can be enabled:

- NAT (Network Address Translation)
- Firewall
- MSS Clamp
- Route WAN

> Interfaces in the Wan zone **cannot** take part in bridging (neither as controller nor as sub-interface).

## Lan

Interfaces in the Lan zone connect to the internal network and face downstream devices. Landscape attaches the eBPF LAN TC pipeline to them.

Services that can be enabled:

- DHCP Server
- Route LAN
- LAN IPv6 address assignment
- ICMPv6 RA (Router Advertisement)

## Undefined

The default zone for a newly created physical interface. Interfaces in this zone cannot run any service, but they can:

- Act as a sub-interface of a **bridge** (only interfaces in the Undefined zone can be attached to a bridge)
- Run in WiFi AP mode (using the interface as a wireless access point)

> When you switch zones through the `ChangeZone` API, Landscape automatically tears down every service under the old zone and adjusts the bridge relationships and eBPF pipelines accordingly.
