# Configuration Directory Structure

Run `landscape-webserver --help` to view the
`-c, --config-dir <CONFIG_DIR>` option.

This option sets Landscape's persistent configuration directory. Its contents
look similar to the following example:

```shell
.
├── geo_tmp # Geo file cache path
│   ├── ip
│   └── site
├── landscape_api_token # API JWT token, refreshed on each restart
├── landscape_db.sqlite # SQLite database file location
├── landscape_init.lock # Lock file, used when reloading configuration
├── landscape_init.toml # Initialization config file (read only once) - see [Configuration File Guide]
├── landscape.toml # Logs / login user / listen ports and related config - see [Configuration File Guide]
├── logs # Log directory (default location, can be changed)
│   ├── landscape.log.yyyy-MM-dd
├── metric # Metrics directory
│   ├── ...
├── static # Web UI directory (default location, can be changed)
│   ├── assets
│   │   └── ...
│   └── index.html
# For lkit deployments, the host path for this directory is /root/.lkit/landscape/data/unix_link/
└── unix_link # Socket file for Docker container communication; can be ignored
    └── register.sock
```
