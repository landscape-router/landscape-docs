# Redirects and Ad Blocking

When a redirect rule has no result configured, matching requests are blocked.

## Redirects

::: info
**Block metadata** controls whether only **A/AAAA** queries are blocked. When
enabled, matching NS/SOA/TXT/MX/CAA queries are blocked as well.
:::

This example uses a specific redirect result.

![](../zh/reference/redirect/redirect.png)

## Ad blocking

This example has no redirect result, so matching requests are blocked.

![](../zh/reference/redirect/forbidden.png)
