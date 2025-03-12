# DNS 相关问题

## 提示 Address already in use 
请检查本机的 `systemd-resolved` 是否存在，检查方式如下：
1. 先检查端口是否已经被占用了
```shell
ss -ltup
```
在 `Local Address:Port` 中检查是否有类似 domain 或者程序占用了 53 端口.
```text
                                       
udp       UNCONN   0     0            127.0.0.54:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=15))  
udp       UNCONN   0     0         127.0.0.53%lo:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=13))  
tcp       LISTEN   0     4096         127.0.0.54:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=16))  
tcp       LISTEN   0     4096      127.0.0.53%lo:domain           0.0.0.0:*         users:(("systemd-resolve",pid=556,fd=14))  
tcp       LISTEN   0     1024          127.0.0.1:39329            0.0.0.0:*         users:(("code-6609ac3d66",pid=196919,fd=9))
```
如果得到类似的结果那就是由于本机的 `systemd-resolved` 服务占用了端口.  
使用命令 `systemctl stop systemd-resolved` 进行停止后就可以启动.  

如果要完全禁止 **systemd-resolved** 服务, 请使用:
```shell
systemctl stop systemd-resolved
systemctl disable systemd-resolved
systemctl mask systemd-resolved
```

> 如果要复原配置:
> ```shell
> systemctl unmask systemd-resolved
> systemctl enable systemd-resolved
> systemctl start systemd-resolved
> ```


