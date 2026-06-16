# 注意事项

## 常见 Linux 发行版兼容性

✅ 内核版本兼容  
🟢 部分版本的内核版本兼容  
❌ 内核版本不兼容

| 发行版 | 兼容 | 版本要求 | 备注 |
| --- | --- | --- | --- |
| Debian | ✅ | 13+ | Debian 13 默认内核已满足要求。避免安装 NetworkManager。 |
| Arch | ✅ | 滚动更新 | 内核版本足够新即可。避免安装 NetworkManager。 |
| Rocky Linux | 🟢 | 需升级到 6.9+ | 还需卸载 NetworkManager、关闭 `firewalld`，并处理 SELinux 权限。 |
| Armbian | 🟢 | 需升级到 6.9+ | 具体取决于所用内核分支。 |
| OpenWRT | 🟢 | 25+ / snapshot | 需自行编译；官方预编译版本暂不支持。 |
| Alpine | ❌ | - | 当前不兼容。 |

<!--⚠️ 调整后可兼容-->
<!--🟡 未知  -->

## 内存大小限制

当前尚未针对内存占用做专项优化。普通发行版建议至少提供 2 GiB 内存。  
如果是自行裁剪过的内核, 预计 1.5 GiB 左右即可。

## 内核版本

需要使用内核版本在 `6.9.x` 以上的版本进行部署。

## 需要检查的内核配置

请确认内核编译配置中包含以下选项: ::: warning主要检查 `BTF` 信息生成是否开启, 并确认 `BPF` 功能已启用。此外还需要开启 `Cgroups` 的 CPU 控制。:::

```sh
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

## 内核 BTF 生成需要开启

选择 **Kernel hacking**  
 -> **Compile-time checks and compiler options**  
 -> **Debug information (Generate DWARF Version 5 debuginfo)**  
即可在 **Kernel hacking**  
 -> **Compile-time checks and compiler options**  
看到 **Generate BTF type information** 选项。启用即可。

## OpenWRT 编译需要开启

[上方配置](#需要检查的内核配置) 需在内核编译选项 (`make kernel_menuconfig`) 中开启  
还需要在 OpenWRT 编译选项 (`make menuconfig`) 中:  
选择:

- **Global build settings** -> **Kernel build options**
  - **Compile the kernel with BPF event support** _(KERNEL_BPF_EVENTS)_
  - **Enable kernel cgroups** _(KERNEL_CGROUPS)_
    - **Support for eBPF programs attached to cgroups** _(KERNEL_CGROUP_BPF)_
- **Network** -> **Routing and Redirection**
  - **tc-full** _Traffic control utility (full) (PACKAGE_tc-full)_ _或_
  - **tc-bpf** _Traffic control utility (bpf) (PACKAGE_tc-bpf)_

**取消**选择:

- **Global build settings** -> **Kernel build options**
  - **Compile the kernel with debug information** _(KERNEL_DEBUG_INFO)_
    - **Reduce debugging information** _(CONFIG_KERNEL_DEBUG_INFO_REDUCED)_

即可在 **Global build settings**  
 -> **Kernel build options**  
 -> **Compile the kernel with debug information** _(KERNEL_DEBUG_INFO)_  
看到 **Enable additional BTF type information** _(CONFIG_KERNEL_DEBUG_INFO_BTF)_  
选中即可
