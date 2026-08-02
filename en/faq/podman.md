# Using Podman instead of Docker

If the host does not have Docker installed, Podman can provide a compatible container interface.

Landscape currently talks to the container runtime through `docker.sock`, so `docker.sock` has to point at Podman's socket.

The example below assumes `rootful Podman`.

## Enabling `podman.socket`

```sh
systemctl enable --now podman.socket
```

Once enabled, Podman listens on `podman.sock` by default, commonly at `/run/podman/podman.sock`.

## Creating a `docker.sock` compatibility link

To let Landscape find Podman, add a `systemd` service that symlinks `/var/run/docker.sock` to `/run/podman/podman.sock` at boot.

```sh
systemctl edit --force --full podman-docker-socket
```

Write the following:

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

Then run:

```sh
systemctl daemon-reload
systemctl enable --now podman-docker-socket.service
```

## Making `landscape-router` depend on that service

If `landscape-router` is started by `systemd`, adding the dependency is recommended so Landscape does not start before `docker.sock` exists.

```ini
# /etc/systemd/system/landscape-router.service.d/override.conf
[Unit]
After=podman-docker-socket.service
Requires=podman-docker-socket.service
```

After editing, run:

```sh
systemctl daemon-reload
systemctl restart landscape-router.service
```

## Checking that it worked

```sh
ls -l /var/run/docker.sock
```

If the output shows `/var/run/docker.sock -> /run/podman/podman.sock`, the compatibility link has generally been created successfully.

Further reading: [Landscape Router: installation notes on openSUSE MicroOS — 2.1.2 Podman](https://xzllll.com/25102301/#212-podman)
