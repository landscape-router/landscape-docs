# AGENTS

## Project Overview

Landscape Router documentation site, built with VitePress. English is the default locale at the site root; Chinese docs live under `zh/` (URLs `/zh/...`).

## Directory Roles

English (default) docs are at the site root; each Chinese doc mirrors its path under `zh/` (e.g. Chinese `getting-started/` → `zh/getting-started/`). The table below lists the English paths.

| Directory          | Purpose                                                                      | Sidebar Section                |
| ------------------ | ---------------------------------------------------------------------------- | ------------------------------ |
| `intro/`           | Introduction, system requirements, deployment                                | (untitled top group)           |
| `getting-started/` | **Guided configuration tutorials** — step-by-step walkthroughs for new users | Getting Started                |
| `features/`        | Core feature overviews (traffic shaping, NAT, API, eBPF)                     | Features                       |
| `reference/`       | Detailed design rationale and configuration reference for each feature       | Reference                      |
| `overlay/`         | Overlay networking (DN42, Tailscale, etc.)                                   | Reference → Overlay Networking |
| `monitoring/`      | Metrics monitoring (connections, DNS metrics)                                | Reference → Metrics            |
| `guides/`          | Usage examples (Site-to-Site, community)                                     | Examples                       |
| `compilation/`     | Build and integration guides                                                 | Build                          |
| `configuration/`   | `.landscape-router` directory and config file reference                      | Directory & Configuration      |
| `faq/`             | Frequently asked questions                                                   | FAQ                            |
| `zh/`              | Chinese documentation mirror (URLs `/zh/...`)                                | 中文 locale                    |

## Documentation Design

- **开始配置 (getting-started/)** — Guided step-by-step tutorials. Written for new users, organized by operational sequence. Uses tab containers (`vitepress-plugin-tabs`) for alternative configuration paths.
- **功能详解 (reference/, overlay/, monitoring/)** — Reference documentation. Explains why each feature is designed the way it is and what configuration options are available.
- **Images** for a markdown file are stored in a same-name subdirectory (e.g., images for `basic-network-setup.md` go in `basic-network-setup/`). Use `./` relative paths to reference them.

## Configuration

Sidebar and navigation are defined in `.vitepress/config.mts`. Custom theme enhancements (image viewer, tabs plugin) are registered in `.vitepress/theme/index.ts`.

## Commit Convention

Write commit messages in English.

Run formatting and build before committing:

```bash
pnpm format && pnpm build
```
