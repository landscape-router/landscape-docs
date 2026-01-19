# Landscape - Linux Router Configuration Tool

Landscape Router is a tool developed using eBPF / Rust / Vue that helps you configure Linux as a **router**.

## Overview
![](./introduction-img/1.png)

## Core Features
* Traffic Shaping: Entry: (SIP-CIDR, MAC), Traffic target: (DIP, Domain, Geo matching rules)
* eBPF Routing
* Independent DNS configuration and caching for each Flow (avoid DNS pollution and leaks)
* Traffic routing to Docker containers
* Geo database management

## Main Features
> ✅ Implemented and tested
> ⚠ Feasible but not tested
> ❌ Not implemented

- <u>IP Configuration</u>
    - *Static IP Configuration*
        - ✅ Specify IP
        - ✅ Configure gateway with default route
    - *DHCP Client*
        - ✅ Specify host name
        - ❌ Custom options
    - *PPPoE (PPPD version)*
        - ✅ Default route specification
        - ⚠ Multi-WAN dial
        - ✅ Network interface name specification
    - *PPPoE (eBPF version)*
        - ✅ Protocol implementation
        - ❌ Packet size exceeding MTU due to NIC GRO/GSO (unresolved)
    - *DHCP Server*
        - ✅ Provides simple IP address allocation and renewal service
        - ✅ Customizable gateway and network segment access configuration for allocated IPs
        - ✅ MAC address and IP binding
        - ✅ IP allocation display
    - *IPv6 Support*
        - ✅ Use DHCPv6-PD to request prefixes from upstream routers
        - ✅ Use RA to advertise multiple prefixes to downstream devices
- <u>Traffic Shaping Module</u>
    - ✅ Support for traffic differentiation using IP/MAC values
    - ✅ Independent DNS configuration and caching for each flow
    - ✅ Route marked traffic according to marking configuration (direct/discard/port reuse allowed/redirect to Docker container or network interface)
    - ❌ Set tracking marks for specified data
    - ✅ External IP behavior control based on marked rules, with support for using `geoip.dat` for configuration
    - ✅ Conflict resolution between IP rules and DNS rules based on priority (lower values have higher priority)
- <u>Geo Database Management</u>
    - ✅ Multi-source geo database management
    - ✅ Automatic IP/Site updates
- <u>DNS</u>
    - ✅ Support for DNS over HTTPS, DNS over TLS, and DNS over QUIC upstream requests
    - ✅ Support for specifying specific upstream DNS for specific domains
    - ✅ DNS hijacking (return A/AAAA resolution)
    - ❌ DNS hijacking returning multiple records (e.g., TXT/CNAME or others)
    - ✅ IP marking for specified DNS resolution results for processing by marking modules
    - ✅ GeoSite file support
    - ❌ Support for Docker container domain labels in DNS resolution
    - ✅ Support for test domain queries
- <u>NAT (eBPF) Implementation</u>
    - ✅ Basic NAT
    - ✅ Static mapping / Open specified ports
    - ✅ NAT defaults to blocking port reuse, dynamically allowing port reuse for opened IPs based on marking module configuration
- <u>Metrics Module</u>
    - ✅ Periodic reporting every 5s of connection information (bytes/packet count)
    - ✅ Display current connections (not yet combined with NAT connection information)
    - ❌ Open metrics export API
- <u>Docker</u>
    - ✅ Support for simple Docker container operation and management
    - ⚠ Image pulling
    - ✅ Route traffic to Docker containers running TProxy
- <u>WiFi</u>
    - ✅ Use iw commands to switch wireless network interface status
    - ✅ Use hostapd to create WiFi hotspots
    - ❌ Connect to WiFi hotspots
- <u>Storage</u>
    - ✅ Use database instead of current configuration storage
    - ✅ Export all current configurations to `landscape_init.toml` file
    - ❌ UI provides configuration upload and restore component
    - ❌ Add configuration modification component
    - ❌ Separate database address specification for metrics
- <u>Miscellaneous</u>
    - ✅ Login interface
    - ❌ Add English frontend pages
    - ✅ Network interface XPS/RPS optimization, load balancing across cores to improve overall throughput, but interrupt binding is not well understood - suggestions welcome in issues

Other features are continuously being updated...

<!-- ## Tested Distributions

* Debian -->
