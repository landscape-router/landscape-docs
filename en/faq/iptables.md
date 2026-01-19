# Relationship with iptables
No relationship

All DNS marking and forwarding will not change iptables rules.
The current DNS / IP marking service takes effect at the **WAN network interface**.  

That is, when **packets** enter the `EGRESS` of the **WAN network interface with marking service enabled**, they will be processed according to matching rules.

For details, see the introduction in [Features/eBPF Routing](../feature/route.md#acceleration-principle).
