# Why I Built Landscape

The idea came to me after an OpenWrt crash.

The crash itself was not an OpenWrt problem. If you only use stock OpenWrt, it is indeed quite stable; the issue was a compatibility conflict between several third-party plugins I used. After running into the same kind of problem a few times, I started looking for a different approach.

## Problems That Accumulated over Time

**NAT policy was too coarse.** In the firmware and plugin combination I used, NAT behavior was effectively a global setting. It was difficult to configure different policies for different devices or destinations. For example, network overlays might need Full Cone NAT, while other programs did not, and video platforms always seemed eager to consume uplink bandwidth.

**Plugin configuration lacked clear boundaries.** Traffic-steering plugins modified shared DNS, routing, and firewall state. They solved useful problems, but policies for different devices still lived in the same environment. A compatibility problem or configuration error could affect much more than the traffic the plugins were supposed to handle.

**Updating a custom firmware was cumbersome.** OpenWrt's `sysupgrade` can preserve standard configuration, but my custom image also contained extra plugins and files that needed to be checked and backed up separately before flashing a complete new image. Building firmware took time, and a change in the build environment or plugin combination could fail the build at the last step.

**The kernel version moved with the firmware.** The kernel and its modules had to be built as part of the complete firmware. I could not update the kernel independently as I would on a general-purpose Linux distribution, so new kernel features and security patches had to wait for the next firmware update.

## Design Choices

Because I happened to be learning Rust and eBPF, I did not choose DPDK or VPP. eBPF programs can be loaded dynamically and attached to XDP and TC, keeping packet processing in the kernel without sending every packet through userspace or assembling another forwarding pipeline around iptables.

That choice shaped the boundary of Landscape. It is not another router distribution. It runs directly on standard Linux systems such as Debian, Arch, and openSUSE. Configuration stays in one directory, an upgrade can be a binary replacement, and the program handles data migration at startup.

Flows provide the policy boundary. Devices join a Flow by IP or MAC, and each Flow has its own DNS and egress. Landscape defaults to a policy stricter than Symmetric NAT, then allows Full Cone NAT for the ports, domains, or IP addresses that need it. Traffic that needs a proxy can be sent into a container; other traffic is sent directly through the interface determined by its destination. Even if the container fails, direct traffic remains available.

These problems had bothered me for a long time, so I decided to build my own routing program. Landscape began with that decision.
