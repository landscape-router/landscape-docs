# IPv6 Prefix Delegation

First confirm that your ISP supports prefix delegation. If your ISP only
supports announcing IPv6 addresses with RA, the method below is unavailable.

## Configuring prefix delegation

Click the PD service on a WAN interface.

![](../../zh/reference/ipv6/pd/pd-in-wan.png)

The PD service configuration panel opens.

![](../../zh/reference/ipv6/pd/pd-edit.png)

::: info
**Expected upstream PD prefix length** does not affect the prefix received
from the upstream. Before a prefix is received, it is used as a reference for
the LAN-side configuration.
:::

::: danger
Although **expected upstream PD prefix length** does not affect the prefix
received from the upstream, it does affect LAN-side IPv6 allocation.
:::

## Viewing the delegated prefix

Open **Network Status** -> **Upstream PD Prefixes** in the sidebar.

![](../../zh/reference/ipv6/pd/pd-info.png)

::: info
If the **expected upstream PD prefix length** differs from the actual prefix,
the error is shown here.
:::
