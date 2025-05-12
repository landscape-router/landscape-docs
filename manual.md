# 手工部署

## 文件准备
1. Landscape Router 文件主体, 可从 [此处](https://github.com/ThisSeanZhang/landscape/releases/) 下载
2. 静态页面文件, 可从 [此处](https://github.com/ThisSeanZhang/landscape/releases/) 下载, 并且解压到 `/root/.landscape-router/static` 文件夹中
3. (可选) 安装 Docker.
4. (*假如有桌面环境, 并有浏览器时可选*) 准备初始化配置文件  
  (注意, 此配置文件只在第一次运行被读取):   
    放置在 -> `/root/.landscape-router/landscape_init.toml`
5. (可选) geosite/geoip 文件

## 关闭本机自动配置 IP 服务 / DNS 服务
1. Debian:
修改文件: `/etc/network/interfaces`
将所有网卡设置为手动配置模式.
::: warning
会导致当前主机不可被访问, 需要在可访问的情况下先在页面上配置 **DHCP** 或者 **静态 IP** 地址.
:::
```
auto <第一张网卡名>
iface <第一张网卡名> inet manual

auto <第二张网卡名>
iface <第二张网卡名> inet manual
```
效果: 
```
auto ens4
iface ens4 inet manual

auto ens5
iface ens5 inet manual
```

> 其他系统待添加... 欢迎 PR 分享部署过程

## 关闭本机 DNS 服务
```shell
systemctl stop systemd-resolved
systemctl disable systemd-resolved
systemctl mask systemd-resolved
```

## 创建 systemd 服务文件
创建 `/etc/systemd/system/landscape-router.service`
文件内容: 
```text
[Unit]
Description=Landscape Router
After=docker.service
Requires=docker.service

[Service]
ExecStart=/root/landscape-webserver <- 记得修改此处
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```


```shell
# 启动服务
systemctl start landscape-router.service
# 开机启动服务 ( 确认没有问题之后执行 )
systemctl enable landscape-router.service
```


