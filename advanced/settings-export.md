# System Configuration

::: warning
An exported configuration can only be restored on the `same` version.  
If you need to upgrade after exporting, first start the `version you exported from` and let it restore the init data, then start the latest version. When Landscape starts and finds the configuration version is `lower` than its own, it upgrades automatically — no configuration is lost in the process.
:::

## Exporting / importing the configuration file

1. Export, which gives you a `landscape_init.toml` file
2. Copy the file into the `.landscape-router` directory
3. Delete the `landscape_init.lock` file
4. Restart landscape-router — the import is done

![](../zh/advanced/settings-export/1.png)

For a field-by-field description of everything in that file, see [landscape_init.toml Reference](../configuration/init-config).

---

::: tip
System configuration has been extended and now covers more ground.
:::

1. System preferences

![](../zh/advanced/settings-export/2.png)

2. Global DNS configuration

![](../zh/advanced/settings-export/3.png)

3. Metrics configuration

![](../zh/advanced/settings-export/4.png)
