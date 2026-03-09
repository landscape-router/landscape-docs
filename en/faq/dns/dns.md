# DNS Related Questions

## Prompt: Address already in use 
Please check if `systemd-resolved` exists on the local machine. Check as follows:
1. First check if the port is already occupied
```shell
ss -ltup
```
In `Local Address:Port`, check if there is a domain or program occupying port 53.
```text
                                       
udp       UNCONN   0     0            127.0.0.54:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=15))  
udp       UNCONN   0     0         127.0.0.53%lo:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=13))  
tcp       LISTEN   0     4096         127.0.0.54:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=16))  
tcp       LISTEN   0     4096      127.0.0.53%lo:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=14))  
tcp       LISTEN   0     1024          127.0.0.1:39329            0.0.0.0:*         users:(("code-6609ac3d66",pid=196919,fd=9))
```
If you get similar results, then the local `systemd-resolved` service has occupied the port.  
Use the command `systemctl stop systemd-resolved` to stop it and then you can start.  

To completely disable the **systemd-resolved** service, please use:
```shell
systemctl stop systemd-resolved
systemctl disable systemd-resolved
systemctl mask systemd-resolved
```

> To restore configuration:
> ```shell
> systemctl unmask systemd-resolved
> systemctl enable systemd-resolved
> systemctl start systemd-resolved
> ```


