# Why I Built Landscape

The project began with an OpenWrt crash.

The crash itself was not an OpenWrt problem. If you only use stock OpenWrt, it is indeed quite stable; the issue was a compatibility conflict between several third-party plugins I used. After running into the same kind of problem a few times, I started looking for a different approach.

At the time, I happened to be learning Rust and eBPF and wanted a real project that I would continue to use. That led to the idea behind Landscape: why not build a router with them?

## Problems That Accumulated over Time

**NAT policy was too coarse.** In the firmware and plugin combination I used, NAT behavior was effectively a global setting. It was difficult to give different devices and different traffic their own policies. BT/PT software might benefit from Full Cone NAT, while other programs did not need the same relaxed behavior. Peer-assisted CDN (PCDN) software, in particular, could otherwise consume too much uplink bandwidth.

**Plugin configuration lacked clear boundaries.** The traffic-steering plugins I depended on modified shared DNS, routing, and firewall state. They solved useful problems, but policies for different devices still lived in the same environment. A compatibility problem or configuration error could affect much more than the traffic the plugins were supposed to handle.

**Updating a custom firmware was cumbersome.** OpenWrt's `sysupgrade` can preserve standard configuration, but my custom image also contained extra plugins and files that needed to be checked and backed up separately before flashing a complete new image. Building firmware took time, and a change in the build environment or plugin combination could fail the build at the last step.

**The kernel version moved with the firmware.** The kernel and its modules had to be built as part of the complete firmware. I could not update the kernel independently as I would on a general-purpose Linux distribution, so newer networking features and eBPF hooks had to wait for the full stack to support them.

None of this means OpenWrt was poorly designed. It is a complete, flashable operating system for embedded routers. I had gradually realized that what I wanted was different: a set of router programs running on ordinary Linux that I could upgrade and combine independently.

## Design Choices

I first chose Rust and eBPF simply because I was learning them. Rust is used for the long-running control plane. When the kernel provides the required capabilities, eBPF programs can be loaded dynamically and attached to XDP and TC, keeping packet processing in the kernel without sending every packet through userspace or assembling another forwarding pipeline around iptables.

That choice shaped the boundary of Landscape. It is not another router distribution. It runs directly on standard Linux systems such as Debian, Arch, and openSUSE. Configuration stays in one directory, an upgrade can be a binary replacement, and the program handles data migration at startup.

Flows provide the policy boundary. Devices join a Flow by IP or MAC, and each Flow manages its own DNS, egress, and NAT policy. Landscape starts with a policy stricter than Symmetric NAT, then allows Full Cone NAT for the ports, domains, or IP addresses that need it. Selected traffic can enter a container while everything else remains on the normal Linux path, so a failed container does not take direct traffic down with it.

There was no complete design document at the beginning. These problems had bothered me for a long time, so I decided to build a router I would actually run myself. Landscape started with that thought and grew through continued use.
