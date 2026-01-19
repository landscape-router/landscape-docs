
# System Requirements

## Kernel Version
Requires kernel version `6.9.x` or higher for deployment.

## Required Kernel Configuration
Check if the kernel compilation configuration file is configured as follows:
::: warning
Mainly check if `BTF file` generation is enabled and if `BPF functionality` is enabled
:::

```text
CONFIG_BPF=y
CONFIG_HAVE_EBPF_JIT=y
CONFIG_ARCH_WANT_DEFAULT_BPF_JIT=y
# BPF subsystem
CONFIG_BPF_SYSCALL=y
CONFIG_BPF_JIT=y
# CONFIG_BPF_JIT_ALWAYS_ON is not set
CONFIG_BPF_JIT_DEFAULT_ON=y
CONFIG_BPF_UNPRIV_DEFAULT_OFF=y
# CONFIG_BPF_PRELOAD is not set
CONFIG_BPF_LSM=y
# end of BPF subsystem
CONFIG_CGROUP_BPF=y
CONFIG_IPV6_SEG6_BPF=y
CONFIG_NETFILTER_BPF_LINK=y
CONFIG_NETFILTER_XT_MATCH_BPF=m
CONFIG_NET_CLS_BPF=m
CONFIG_NET_ACT_BPF=m
CONFIG_BPF_STREAM_PARSER=y
CONFIG_LWTUNNEL_BPF=y
# HID-BPF support
# CONFIG_HID_BPF is not set
# end of HID-BPF support
CONFIG_BPF_EVENTS=y
CONFIG_TEST_BPF=m
```


## Kernel BTF Generation Must Be Enabled
Select:
**Kernel hacking**   
  -> **Compile-time checks and compiler options**   
    -> **Debug information (Generate DWARF Version 5 debuginfo)**  
Then you can find
**Kernel hacking**   
  -> **Compile-time checks and compiler options**  
and see **Generate BTF type information**
Select and install it.



## Linux Distributions Compatible with Kernel Version  
✅ Kernel version compatible  
🟢 Some versions have compatible kernel versions  
❌ Kernel version not compatible  

| Distribution | Compatible | Version Requirements | Notes |  
|---|---|---|---|  
| Debian  | ✅ | 13+ | Lower versions need kernel update to 6.9+ |  
| Armbian | 🟢 |  | Requires kernel version 6.9+|  
| OpenWRT | ❌ |  |  |  
| Alpine | ❌ |  |  |  
<!--⚠️ Compatible after adjustment-->
<!--🟡 Unknown  -->
