# Basic Network Setup

> This guide covers the basic network configuration: assigning interface zones,
> configuring addresses, and establishing internet connectivity.

## The starting state

The example virtual machine has two network interfaces: `ens32` and `ens33`.
![The current initial state](./basic-network-setup/start.png)

## Switching interface zones

Assign each interface to a zone before configuring its services.

::: tip In simple terms
**WAN** = the port connected to the modem / external network  
**LAN** = the port connected to your PC / switch.

For details, see: [Zone](../reference/interface-zone)
:::

Select an interface to open its details panel, then click **ZONE** to open the
zone settings.

![Interface panel](./basic-network-setup/iface-info.png)
![Zone switching](./basic-network-setup/change-zone.png)

Confirm that both interfaces are assigned to the intended zones and show
`UP`.

![](./basic-network-setup/zone-result.png)

::: details My interface is `DOWN`, what should I do
If an interface is `DOWN`, enable **ON** to bring it up and **BOOT** to start it
automatically during boot.
![](./basic-network-setup/boot-iface.png)

If the interface is still DOWN after that, make sure the network cable is plugged in.
:::

## Configuring WAN Connectivity

Click the `IP` button below the interface card:
![](./basic-network-setup/ip.png)

The WAN interface needs an IP configuration. Choose the method that matches
the upstream network.

::: tabs
== DHCP client

Use this when the modem or upstream router provides DHCP.

1. Make sure the interface is assigned to the **WAN** zone
2. Select the **DHCP client** configuration method
3. Fill in a hostname (optional; leave empty to use the current hostname)
4. Click save

![DHCP client](./basic-network-setup/dhcp_v4_client.png)

== PPPoE dial-up

Use this when the modem is in bridge mode and the ISP provides PPPoE
credentials.

1. Make sure the interface is assigned to the **WAN** zone
2. Go to the **IPv4** section of the page and click the **PPPoE** tab
3. Add a PPPoE account on the WAN interface
4. Fill in the broadband account and password
5. Enable **Set as default route** on the PPPoE account
6. AC Name can usually be left empty

![PPPoE configuration](./basic-network-setup/pppd-intro.png)

![PPPoE account editing](./basic-network-setup/pppoe_edit.png)

== Static IP

Use this for a fixed address, such as on a dedicated business connection.

1. Make sure the interface is assigned to the **WAN** zone
2. Select the **Static IP** method
3. Fill in the IP address, subnet mask and gateway
4. If it should be the default route, enable **IPv4 default route**
5. Click save

![Static IP](./basic-network-setup/static_ip.png)

:::

The router now has an upstream connection. Next, configure address assignment
on the LAN.

## Configuring LAN Address Assignment

The LAN port connects internal devices; the DHCPv4 service is usually enabled on it.

1. Make sure the interface is assigned to the **LAN** zone

2. Click the `DHCPv4` service button below the interface
   ![](./basic-network-setup/dhcpv4-server.png)

3. Configure the subnet to use
   ![](./basic-network-setup/dhcpv4-config.png)
4. Click save

## Configuring WAN/LAN Forwarding and NAT

After the steps above, the current network state is:

1. LAN devices can reach the router via the DHCPv4 configuration
2. The router itself can get online
3. LAN-side devices cannot access the internet

::: danger Preserve remote access before enabling NAT
If the current management connection enters through the **WAN interface**,
create a **Static NAT mapping** before enabling the NAT service. Enabling NAT
first will disconnect that management session.
:::

::: details Static NAT mapping
Click **Static NAT** in the left menu to open the static NAT configuration page.
Click the add button and configure as shown below to access the router from WAN. If you connect via LAN, you can ignore this.
![](./basic-network-setup/static-nat.png)

:::

Now enable the WAN/LAN routing and forwarding services, as well as the NAT service:
![](./basic-network-setup/wr-lr.png)

## Verifying network connectivity

Verify the completed configuration:

1. Open **Metrics Monitoring → Connection Info** to view the current connection status
2. Run `ping 8.8.8.8` on an internal device to test internet connectivity
3. Run `nslookup example.com` to test DNS resolution

::: tip Next steps
After the basic network configuration, we recommend continuing with [DNS Setup](./dns-setup) and [Flow Setup](./flow-setup).
:::
