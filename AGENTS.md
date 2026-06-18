# AGENTS

## Project Overview

Landscape Router documentation site, built with VitePress (Chinese + English locales).

## Directory Roles

| Directory          | Purpose                                                                      | Sidebar Section      |
| ------------------ | ---------------------------------------------------------------------------- | -------------------- |
| `intro/`           | Introduction, system requirements, deployment                                | (untitled top group) |
| `getting-started/` | **Guided configuration tutorials** — step-by-step walkthroughs for new users | 开始配置             |
| `features/`        | Core feature overviews (traffic shaping, NAT, API, eBPF)                     | 功能特性             |
| `reference/`       | Detailed design rationale and configuration reference for each feature       | 功能详解             |
| `overlay/`         | Overlay networking (DN42, Tailscale, etc.)                                   | 功能详解 → 虚拟组网  |
| `monitoring/`      | Metrics monitoring (connections, DNS metrics)                                | 功能详解 → 指标监控  |
| `guides/`          | Usage examples (Site-to-Site, community)                                     | 使用样例             |
| `compilation/`     | Build and integration guides                                                 | 编译                 |
| `configuration/`   | `.landscape-router` directory and config file reference                      | 目录结构 & 配置      |
| `faq/`             | Frequently asked questions                                                   | 常见问题             |
| `en/`              | English documentation mirror                                                 | English locale       |

## Documentation Design

- **开始配置 (getting-started/)** — Guided step-by-step tutorials. Written for new users, organized by operational sequence. Uses tab containers (`vitepress-plugin-tabs`) for alternative configuration paths.
- **功能详解 (reference/, overlay/, monitoring/)** — Reference documentation. Explains why each feature is designed the way it is and what configuration options are available.
- **Images** for a markdown file are stored in a same-name subdirectory (e.g., images for `basic-network-setup.md` go in `basic-network-setup/`). Use `./` relative paths to reference them.

## Configuration

Sidebar and navigation are defined in `.vitepress/config.mts`. Custom theme enhancements (image viewer, tabs plugin) are registered in `.vitepress/theme/index.ts`.

## Commit Convention

Write commit messages in English.

Run formatting before committing:

```bash
pnpm format
```
