# DNS Setup

> This guide walks you through DNS configuration: setting upstream DNS servers and creating redirect rules, so devices on your LAN can resolve domains properly.

By default Landscape uses Cloudflare as the upstream DNS provider. You can change it.

## Configuring upstream DNS servers

An upstream DNS is the external DNS service Landscape Router uses to resolve domains.

1. Pick **DNS** in the left-hand menu
2. Find the **Upstream DNS** submenu
3. Click add to create a new upstream, or edit an existing one. Landscape ships several presets you can use to fill the form quickly.
   ![Upstream DNS configuration](./dns-setup/dns-upstream.png)
4. You can add multiple upstreams so different domains resolve through different servers. Below I added one and modified the default, which the rest of this page builds on.
   ![](./dns-setup/more-dns.png)

## Assigning domains to an upstream

The upstream configuration defines the available resolvers. DNS rules decide
which resolver handles each domain.

Click `Flow Settings` in the left-hand menu to open the `flow configuration` page, then click the `DNS` button on the `Default Flow` card.
![](./dns-setup/flow.png)

The DNS rule list opens:
![](./dns-setup/rules1.png)

The initial list contains one `default` rule. Three fields matter here:

1. The rule's priority is `10000`
2. Its upstream is `Default`
3. Its match rules are empty, so it matches every domain

At this point, every domain matches this rule.
You can use the query button at the top right to run a DNS query and check how rules are being applied.
![](./dns-setup/query-dns-btn.png)

The query panel shows:

1. The Flow used for the check; Flow 0 is the default Flow
2. The queried domain, with shortcuts for common domains
3. The rule that handled the domain
4. The response from the upstream DNS server
5. The cached response, which can be compared with the live response
   <img src="./dns-setup/query-result.png" style="width: 48%;" />

The default Flow currently handles `x.com`. The following examples show how a
new rule's numeric priority changes the result:

::: tabs
== New rule with a numeric priority below 10000

<div style="display: flex; gap: 10px;">
  <img src="./dns-setup/less-than-10000.png" style="width: 50%;" />
  <img src="./dns-setup/less-than-10000-result.png" style="width: 50%;" />
  <img src="./dns-setup/less-than-10000-other.png" style="width: 50%;" />
</div>

1. `x.com` matches rule 9999, so evaluation stops.
2. `store.steampowered.com` does not match rule 9999, so rule 10000 handles it.

== New rule with a numeric priority above 10000

<div style="display: flex; gap: 10px;">
  <img src="./dns-setup/more-than-10000.png" style="width: 50%;" />
  <img src="./dns-setup/more-than-10000-result.png" style="width: 50%;" />
  <img src="./dns-setup/more-than-10000-other.png" style="width: 50%;" />
</div>

1. `x.com` matches rule 10000 before the new rule is evaluated.
2. `store.steampowered.com` also matches rule 10000 first.

:::

DNS rules are evaluated in numeric priority order. Evaluation stops at the
first matching rule.
