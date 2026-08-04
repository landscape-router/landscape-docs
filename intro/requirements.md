# Requirements

## Linux Distribution Compatibility

✅ Kernel version compatible  
🟢 Some versions have compatible kernel versions  
❌ Kernel version not compatible

| Distribution | Compatible | Version Requirements  | Notes                                                                                       |
| ------------ | ---------- | --------------------- | ------------------------------------------------------------------------------------------- |
| Debian       | ✅         | 13+                   | Debian 13's default kernel already meets the requirements. Avoid installing NetworkManager. |
| Arch         | ✅         | Rolling release       | The kernel just needs to be new enough. Avoid installing NetworkManager.                    |
| Rocky Linux  | 🟢         | Needs upgrade to 6.9+ | Also needs NetworkManager removed, `firewalld` disabled, and SELinux permissions handled.   |
| Armbian      | 🟢         | Needs upgrade to 6.9+ | Depends on the specific kernel branch.                                                      |
| OpenWRT      | 🟢         | 25+ / snapshot        | Requires compiling yourself; official prebuilt versions are not supported yet.              |
| Alpine       | ❌         | -                     | Currently incompatible.                                                                     |

<!--⚠️ Compatible after adjustment-->
<!--🟡 Unknown  -->

## Memory Size Limits

Memory usage has not been specially optimized yet. For ordinary distributions, at least 2 GiB of memory is recommended.  
If you use a self-trimmed kernel, about 1.5 GiB should be enough.

## Kernel Version

Requires kernel version `6.9.x` or higher for deployment.

## Required Kernel Configuration

Please make sure the kernel compilation configuration contains the following options:

::: warning
Mainly check whether `BTF` generation is enabled, confirm `BPF` functionality is enabled, and also enable Cgroups CPU control.
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
```

## Kernel BTF Generation Must Be Enabled

Select: **Kernel hacking**  
-> **Compile-time checks and compiler options**  
-> **Debug information (Generate DWARF Version 5 debuginfo)**  
Then in **Kernel hacking**  
-> **Compile-time checks and compiler options**  
you can find the **Generate BTF type information** option. Enable it.

## OpenWRT Build Requirements

The [configuration above](#required-kernel-configuration) needs to be enabled in the kernel build options (`make kernel_menuconfig`).  
Additionally, in the OpenWRT build options (`make menuconfig`), select:

- **Global build settings** -> **Kernel build options**
  - **Compile the kernel with BPF event support** _(KERNEL_BPF_EVENTS)_
  - **Enable kernel cgroups** _(KERNEL_CGROUPS)_
    - **Support for eBPF programs attached to cgroups** _(KERNEL_CGROUP_BPF)_
- **Network** -> **Routing and Redirection**
  - **tc-full** _Traffic control utility (full) (PACKAGE_tc-full)_ _or_
  - **tc-bpf** _Traffic control utility (bpf) (PACKAGE_tc-bpf)_

**Deselect**:

- **Global build settings** -> **Kernel build options**
  - **Compile the kernel with debug information** _(KERNEL_DEBUG_INFO)_
    - **Reduce debugging information** _(CONFIG_KERNEL_DEBUG_INFO_REDUCED)_

Then under **Global build settings**  
-> **Kernel build options**  
-> **Compile the kernel with debug information** _(KERNEL_DEBUG_INFO)_  
you can see **Enable additional BTF type information** _(CONFIG_KERNEL_DEBUG_INFO_BTF)_ and select it.
