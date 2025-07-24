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
将 LAN 网卡全设置为 manual 后, 将 WAN 的网卡额外在配置文件中设置一个静态 IP, 方便即使路由程序出现故障时, 使用另外一台机器设置静态 IP 后也能进行访问.

```
auto <第一张网卡名> <- 比如设置为 WAN
iface <第一张网卡名> inet static
    address 192.168.22.1
    netmask 255.255.255.0

auto <第二张网卡名> <- 以下都是 LAN
iface <第二张网卡名> inet manual

auto <第三张网卡名>
iface <第三张网卡名> inet manual
```
效果: 
```
auto ens3
iface ens3 inet static
    address 192.168.22.1
    netmask 255.255.255.0

auto ens4
iface ens4 inet manual

auto ens5
iface ens5 inet manual
```

这样即使路由出现故障后, 使用另外一台主机设置为 192.168.22.0/24 网段的任意地址 (比如: 192.168.22.2/24) , 直连这个网口, 就能连上路由器.


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

[Service]
ExecStart=/root/landscape-webserver <- 记得修改此处
Restart=always
User=root
LimitMEMLOCK=infinity

[Install]
WantedBy=multi-user.target
```


```shell
# 启动服务
systemctl start landscape-router.service
# 开机启动服务 ( 确认没有问题之后执行 )
systemctl enable landscape-router.service
```


