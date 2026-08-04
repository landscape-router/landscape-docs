# 可使用 Podman 替换 Docker

如果宿主机没有安装 Docker, 也可以使用 Podman 提供兼容的容器接口。

Landscape 当前主要通过 `docker.sock` 与容器运行时通信, 因此需要让 `docker.sock` 指向 Podman 的 Socket。

以下示例基于 `rootful Podman`。

## 启用 `podman.socket`

```sh
systemctl enable --now podman.socket
```

启用后, Podman 默认会监听 `podman.sock`, 常见路径为 `/run/podman/podman.sock`。

## 创建 `docker.sock` 兼容链接

为了让 Landscape 能识别到 Podman, 可以额外创建一个 `systemd` 服务, 在开机时自动把 `/var/run/docker.sock` 链接到 `/run/podman/podman.sock`。

```sh
systemctl edit --force --full podman-docker-socket
```

写入以下内容:

```ini
[Unit]
Description=Create Symlink from podman.sock to docker.sock
After=podman.socket
Requires=podman.socket

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStartPre=-/bin/rm -f /var/run/docker.sock
ExecStart=/bin/ln -s /run/podman/podman.sock /var/run/docker.sock

[Install]
WantedBy=multi-user.target
```

然后执行:

```sh
systemctl daemon-reload
systemctl enable --now podman-docker-socket.service
```

## 让 `landscape-router` 依赖该服务

如果 `landscape-router` 通过 `systemd` 启动, 建议增加依赖关系, 避免 Landscape 在 `docker.sock` 创建前启动。

```ini
# /etc/systemd/system/landscape-router.service.d/override.conf
[Unit]
After=podman-docker-socket.service
Requires=podman-docker-socket.service
```

修改完成后执行:

```sh
systemctl daemon-reload
systemctl restart landscape-router.service
```

## 检查是否生效

```sh
ls -l /var/run/docker.sock
```

若输出中可以看到 `/var/run/docker.sock -> /run/podman/podman.sock`, 一般就说明兼容链接已创建成功。

补充参考: [Landscape Router: 基于 openSUSE MicroOS 安装实践 - 2.1.2 Podman](https://xzllll.com/25102301/#212-podman)
