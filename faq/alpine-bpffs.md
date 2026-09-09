# Fails to Start on Alpine Linux (bpffs Not Mounted)

On Alpine Linux, `landscape-webserver` may fail to start with confusing
`ENOENT` errors while loading eBPF maps.

## Cause

Landscape pins its eBPF maps to `/sys/fs/bpf/landscape/<map_space>/`.
This requires a `bpf` filesystem (bpffs) to be mounted at `/sys/fs/bpf`.

On distributions that use systemd, systemd mounts bpffs automatically, which
is why you would see something like `bpf on /sys/fs/bpf type bpf (rw,...,mode=700)`
on those systems. Alpine uses OpenRC and nothing mounts bpffs automatically.
`/sys/fs/bpf` is then just an empty placeholder directory inside sysfs
(`dr-xr-xr-x`, not writable, `mkdir` fails), which is why creating the map pin
path fails with a strange `ENOENT`.

## Verify

```sh
mount | grep /sys/fs/bpf       # empty output means bpffs is NOT mounted
grep bpf /proc/filesystems     # should contain "nodev bpf" (kernel support)
uname -r                       # kernel version
ls -l /sys/kernel/btf/vmlinux  # must exist; CO-RE requires BTF
```

## Fix

Mount bpffs as root:

```sh
mount -t bpf bpf /sys/fs/bpf
```

To make it persistent across reboots, add the following line to `/etc/fstab`
(OpenRC's `localmount` service runs `mount -a` at boot):

```
bpf /sys/fs/bpf bpf defaults 0 0
```

Then restart `landscape-webserver`.
