# DNS Questions

## Address already in use

First identify which process is listening on port 53.

```shell
ss -ltup
```

Check the `Local Address:Port` column for listeners on port 53.

```text

udp       UNCONN   0     0            127.0.0.54:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=15))
udp       UNCONN   0     0         127.0.0.53%lo:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=13))
tcp       LISTEN   0     4096         127.0.0.54:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=16))
tcp       LISTEN   0     4096      127.0.0.53%lo:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=14))
tcp       LISTEN   0     1024          127.0.0.1:39329            0.0.0.0:*         users:(("code-6609ac3d66",pid=196919,fd=9))
```

Output like this indicates that `systemd-resolved` is using the port. Stop it
before starting Landscape:

```shell
systemctl stop systemd-resolved
```

To keep `systemd-resolved` disabled after a reboot, run:

```shell
systemctl stop systemd-resolved
systemctl disable systemd-resolved
systemctl mask systemd-resolved
```

> To restore configuration:
>
> ```shell
> systemctl unmask systemd-resolved
> systemctl enable systemd-resolved
> systemctl start systemd-resolved
> ```
