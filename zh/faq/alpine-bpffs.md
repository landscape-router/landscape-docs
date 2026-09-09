# Alpine 下无法启动 (bpffs 未挂载)

在 Alpine Linux 上, `landscape-webserver` 可能在加载 eBPF map 时报出奇怪的
`ENOENT` 错误而无法启动.

## 原因

Landscape 启动时会将 eBPF map 固定 (pin) 到
`/sys/fs/bpf/landscape/<map_space>/`. 这要求 `/sys/fs/bpf` 上挂载了
bpf 文件系统 (bpffs).

在使用 systemd 的发行版上, systemd 会自动挂载 bpffs, 所以在那些系统上能看到
`bpf on /sys/fs/bpf type bpf (rw,...,mode=700)`. 而 Alpine 使用 OpenRC,
没有东西会自动挂载 bpffs. 此时 `/sys/fs/bpf` 只是 sysfs 里的一个空占位目录
(`dr-xr-xr-x`, 无写权限, 无法 `mkdir`), 因此创建 map pin 路径时会报出奇怪的
`ENOENT`.

## 确认

```sh
mount | grep /sys/fs/bpf       # 输出为空说明 bpffs 未挂载
grep bpf /proc/filesystems     # 应有 "nodev bpf" (内核支持)
uname -r                       # 内核版本
ls -l /sys/kernel/btf/vmlinux  # 必须存在; CO-RE 需要 BTF
```

## 修复

以 root 挂载 bpffs:

```sh
mount -t bpf bpf /sys/fs/bpf
```

要开机持久化, 在 `/etc/fstab` 中加入下面一行
(OpenRC 的 `localmount` 服务开机时会执行 `mount -a`):

```
bpf /sys/fs/bpf bpf defaults 0 0
```

之后重新运行 `landscape-webserver` 即可.
