# 系统配置
::: warning
导出的配置只能用于`相同`版本的恢复.  
如导出后需要升级, 需要先在`导出时的版本`启动, 完成 init 版本的数据恢复之后, 再启动最新版本, landscape 启动时发现当前配置版本`低于`当前版本会自动升级, 升级不用担心配置丢失.
:::

## 导出/导入 配置文件
1、导出，获得 `landscape_init.toml` 文件  
2、复制文件到 `.landscape-router` 目录  
3、删除 `landscape_init.lock` 文件  
4、重启 landscape-router，导入完成  
![](./settings-img/1.png)  


<!-- ## 系统降级
当要回退之前的版本时, 可以使用 `landscape-webserver db -r` 进行配置降级, 注意降级后使用特定的版本进行启动, 使用当前的版本启动的话还是会自动升级.
```shell
root@landscape-router:~# ./landscape-webserver db  --help
Database-related operations

Usage: landscape-webserver db [OPTIONS]

Options:
  -r, --rollback       
  -t, --times <TIMES>  [default: 1]
  -h, --help           Print help
````
 -->
