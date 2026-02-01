
# 注意事项

## 内核版本
需要使用内核版本在 `6.9.x` 以上的版本进行部署。

## 需要检查的内核配置
检查内核编译配置文件是否如下进行配置
::: warning
主要是检查 `BTF 文件` 生成是否开启, 并且 `BPF 功能` 是否开启
还需要开启 `Cgroups` 的 CPU 控制
:::

``` sh
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
选择
**Kernel hacking**   
  -> **Compile-time checks and compiler options**   
    -> **Debug information (Generate DWARF Version 5 debuginfo)**  
即可在 
**Kernel hacking**   
  -> **Compile-time checks and compiler options**  
看到 **Generate BTF type information**
选中安装即可

## OpenWRT 编译需要开启
[上方配置](#需要检查的内核配置) 需在内核编译选项 (`make kernel_menuconfig`) 中开启  
还需要在 OpenWRT 编译选项 (`make menuconfig`) 中:  
选择:  
- **Global build settings** -> **Kernel build options**  
    - **Compile the kernel with BPF event support** *(KERNEL_BPF_EVENTS)*  
    - **Enable kernel cgroups** *(KERNEL_CGROUPS)*  
      - **Support for eBPF programs attached to cgroups** *(KERNEL_CGROUP_BPF)*
- **Network** -> **Routing and Redirection**
    - **tc-full** *Traffic control utility (full) (PACKAGE_tc-full)* *或* 
    - **tc-bpf** *Traffic control utility (bpf) (PACKAGE_tc-bpf)*


**取消**选择:
- **Global build settings** -> **Kernel build options**  
  - **Compile the kernel with debug information** *(KERNEL_DEBUG_INFO)*  
    - **Reduce debugging information** *(CONFIG_KERNEL_DEBUG_INFO_REDUCED)*  

即可在
**Global build settings**  
  -> **Kernel build options**  
    -> **Compile the kernel with debug information** *(KERNEL_DEBUG_INFO)*  
看到 **Enable additional BTF type information** *(CONFIG_KERNEL_DEBUG_INFO_BTF)*  
选中即可  


## 内核版本兼容的 常见 Linux 发行版  
✅ 内核版本兼容  
🟢 部分版本的内核版本兼容  
❌ 内核版本不兼容  

| 发行版 | 兼容 | 版本要求 | 备注 |  
|---|---|---|---|  
| Debian  | ✅ | 13+ | 低版本需更新内核至6.9+ |  
| Armbian | 🟢 |  | 需内核版本6.9+|  
| OpenWRT | 🟢 | 25+ / snapshot | 自行编译, 官方编译版本不支持 |  
| Alpine | ❌ |  |  |  
<!--⚠️ 调整后可兼容-->
<!--🟡 未知  -->
