# Site-to-Site Networking

A site-to-site network means bridging two (or more) physically separate LANs together securely over a public network (the internet), so they behave as though they were one internal network.

> Turning two offices / two server rooms / two home networks into "one big LAN".

## Topology

Once configured, the topology looks roughly like this:

::: info
Note that the diagram does not show the LAN subnets on either side A or B.  
To make them reach each other, add each side's LAN `CIDR` with `--advertise-routes` in the tailscale startup arguments.
:::

![](../zh/guides/site-to-site/topology.png)

In the diagram, hosts on `side B`'s LAN can reach the containers on `side A` through `10.200.1.0/24`, without caring what IP tailscale itself uses.

## Deployment configuration

Starting with `side A`, the compose file:

```yaml
services:
  tailscale:
    image: ghcr.io/landscape-router/landscape-apps/tailscale:latest
    container_name: <container name>
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
      - SYS_ADMIN
      - PERFMON
    devices:
      - /dev/net/tun
    environment:
      - TS_AUTHKEY=<key>
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_EXTRA_ARGS=--accept-dns=false --advertise-routes=10.200.1.0/24,<the CIDR of side A's LAN, or another docker bridge CIDR> --accept-routes
      - TS_USERSPACE=false
      - TS_TAILSCALED_EXTRA_ARGS=--port=41641
    sysctls:
      net.ipv4.ip_forward: '1'
      net.ipv6.conf.all.forwarding: '1'
    volumes:
      - <persistent storage path>:/var/lib/tailscale
      - /root/.landscape-router/unix_link/:/ld_unix_link/:ro
    networks:
      my-tailscale-bridge:
        ipv4_address: 10.200.1.10
    dns:
      - 10.200.1.1
  # Nginx, for testing
  ng1:
    image: nginx
    container_name: ng1
    restart: unless-stopped
    networks:
      my-tailscale-bridge:
        ipv4_address: 10.200.1.11
    dns:
      - 10.200.1.1
  # A socks5 service, for testing
  sock-server:
    image: serjs/go-socks5-proxy
    container_name: sk5
    restart: unless-stopped
    environment:
      REQUIRE_AUTH: false
    networks:
      my-tailscale-bridge:
        ipv4_address: 10.200.1.12
    dns:
      - 10.200.1.1

networks:
  my-tailscale-bridge:
    driver: bridge
    driver_opts:
      # Must be set. Otherwise a dynamic interface name is used, and a restart changes it,
      # which stops the service from starting properly.
      com.docker.network.bridge.name: test_tail-br0
    ipam:
      config:
        - subnet: 10.200.1.0/24
          gateway: 10.200.1.1
```

After starting it, approve this node's routes in the tailscale admin console, exactly as in [Tailscale networking](../overlay/tailscale.md#starting-the-container).

`Side B`'s configuration:

```yaml
services:
  tailscale:
    image: ghcr.io/landscape-router/landscape-apps/tailscale:latest
    container_name: <container name>
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
      - SYS_ADMIN
      - PERFMON
    devices:
      - /dev/net/tun
    environment:
      - TS_AUTHKEY=<key>
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_EXTRA_ARGS=--accept-dns=false --advertise-routes=<the CIDR of side B's LAN> --accept-routes
      - TS_USERSPACE=false
      - TS_TAILSCALED_EXTRA_ARGS=--port=41641
    sysctls:
      net.ipv4.ip_forward: '1'
      net.ipv6.conf.all.forwarding: '1'
    volumes:
      - <persistent storage path>:/var/lib/tailscale
      - /root/.landscape-router/unix_link/:/ld_unix_link/:ro
    networks:
      my-tailscale-bridge:
        ipv4_address: 10.201.1.10
    dns:
      - 10.201.1.1

networks:
  my-tailscale-bridge:
    driver: bridge
    driver_opts:
      # Must be set. Otherwise a dynamic interface name is used, and a restart changes it,
      # which stops the service from starting properly.
      com.docker.network.bridge.name: test_tail-br0
    ipam:
      config:
        - subnet: 10.201.1.0/24
          gateway: 10.201.1.1
```

After starting it, approve this node's routes in the tailscale admin console, exactly as in [Tailscale networking](../overlay/tailscale.md#starting-the-container).

With all that in place, on top of the tailscale routes configured in [tailscale / Configuring the "route" rules](../overlay/tailscale.md#configuring-the-route-rules), you also need to add the other side's LAN.  
Side B reaches not only tailscale IPs but also the far side's Docker containers, so add the container CIDR as well. ![](../zh/guides/site-to-site/b-zone-dstip.png)

Side A likewise needs side B's LAN CIDR added.

## Appendix: using side A as a jump host to join a tailscale network on another account

![](../zh/guides/site-to-site/add-c-topology.png)

Just advertise `10.200.1.0/24` on the tailscale client connected to C as well, and B can reach C's LAN through A. The path to C can of course be any overlay tool you like.
