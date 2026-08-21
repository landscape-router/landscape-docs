# PPPoE 拨号

Landscape 中 PPPoE 拨号的发送一共有两种:

1. 使用 pppd 进行拨号(需要额外安装 pppd)
2. 使用 native 拨号

## pppd 方式

::: info
需要网卡处于 WAN 模式时才能看见这个图标
:::

![](./pppoe/enter-pppd-list.png)

点击后侧边将出现 pppd 配置列表

![](./pppoe/pppd-list.png)

点击列表顶部的 **添加 pppd 配置**, 将会弹出编辑弹框
![](./pppoe/edit-pppd.png)

## Native PPPoE

::: info
此方法是在 wan 网卡上直接拨号, 兼容性会稍微差点
:::

直接点击 WAN 网卡上的 IP 按钮
![](./pppoe/native-pppoe.png)

下拉框中选择 "PPPoE 原生拨号"

![](./pppoe/edit-native.png)
