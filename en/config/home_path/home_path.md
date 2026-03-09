# Configuration Directory Structure
When you use the command `landscape-webserver --help`, you can see the `-c, --config-dir <CONFIG_DIR>` configuration option.

This specifies the persistent configuration storage path location for the runtime project. Checking the directory, you will see the following content:
```shell
root@router:/root/.landscape-router# tree 
.
├── cert.pem # Generated self-signed certificate
├── key.pem # Generated self-signed certificate key
├── geo_tmp # Geo file cache path
│   ├── ip 
│   └── site
├── landscape_api_token # API JWT token, refreshed on each restart
├── landscape_db.sqlite # SQLite database file location
├── landscape_init.lock # Lock file, for configuration refresh control
├── landscape_init.toml # Initialization config file (read only once) - see [Configuration File Guide]
├── landscape.toml # Configuration for logs/login/ports etc - see [Configuration File Guide]
├── logs # Log file folder (default location, can be modified)
│   ├── landscape.log.yyyy-MM-dd
├── static # Web UI folder (default location, can be modified)
│   ├── assets
│   │   └── ...
│   └── index.html
└── unix_link # Socket file for Docker container communication (can be ignored)
    └── register.sock
```

