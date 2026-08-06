# Interaction with iptables

Landscape does not modify iptables rules for DNS or destination-IP marking.

DNS and IP rules are applied by eBPF on the configured **WAN interface**.

Packets are evaluated when they reach the egress path of a WAN interface on
which the marking service is enabled.

For details, see [eBPF Routing Acceleration](../features/ebpf-route.md#how-the-acceleration-works).
