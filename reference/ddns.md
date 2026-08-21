# DDNS

Update DNS records at a selected provider with the dynamic public IPv4 or IPv6
address obtained by a WAN interface or LAN device.

## DDNS for a WAN interface

The example below updates the IPv6 address obtained by the WAN interface in
the records for **example.com** and **ccc.example.com**.

![](../zh/reference/ddns/wan-ddns.png)

## DDNS for a LAN device

LAN devices work the same way, with one additional choice: which PD prefix to
use when creating the DNS record.

For example, suppose **WAN1** receives **PD A** and **WAN2** receives **PD B**.
If you select **WAN1** as the DDNS prefix for a LAN device, the resulting DNS
record uses **PD A** plus the suffix assigned to that device.

![](../zh/reference/ddns/lan-ddns.png)
