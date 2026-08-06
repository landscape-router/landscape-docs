# AGENTS

## Project Overview

Landscape Router documentation site, built with VitePress. English is the default locale at the site root; Chinese docs live under `zh/` (URLs `/zh/...`).

## Directory Roles

English (default) docs are at the site root; Chinese docs live under `zh/` and are expected to have a corresponding English doc at the same path (e.g. `zh/getting-started/` ↔ `getting-started/`). The two versions do not need to be identical in expression — each language may be written for its own audience, and differences in wording and detail are allowed. The table below lists the English paths.

| Directory          | Purpose                                                                      | Sidebar Section                  |
| ------------------ | ---------------------------------------------------------------------------- | -------------------------------- |
| `intro/`           | Introduction, system requirements, deployment                                | (untitled top group)             |
| `getting-started/` | **Guided configuration tutorials** — step-by-step walkthroughs for new users | Getting Started                  |
| `features/`        | Core feature overviews (traffic shaping, NAT, API, eBPF)                     | Features                         |
| `reference/`       | Detailed design rationale and configuration reference for each feature       | Reference                        |
| `overlay/`         | Overlay networking (DN42, Tailscale, etc.)                                   | Reference → Overlay Networking   |
| `monitoring/`      | Metrics monitoring (connections, DNS metrics)                                | Reference → Metrics              |
| `guides/`          | Usage examples (Site-to-Site, community)                                     | Examples                         |
| `advanced/`        | Advanced topics (settings export)                                            | Reference → System Configuration |
| `compilation/`     | Build and integration guides                                                 | Build                            |
| `configuration/`   | `.landscape-router` directory and config file reference                      | Directory & Configuration        |
| `faq/`             | Frequently asked questions                                                   | FAQ                              |
| `zh/`              | Chinese documentation (URLs `/zh/...`)                                       | 中文 locale                      |

## Documentation Design

- **开始配置 (getting-started/)** — Guided step-by-step tutorials. Written for new users, organized by operational sequence. Uses tab containers (`vitepress-plugin-tabs`) for alternative configuration paths.
- **功能详解 (reference/, overlay/, monitoring/)** — Reference documentation. Explains why each feature is designed the way it is and what configuration options are available.
- **Images** for a markdown file are stored in a same-name subdirectory (e.g., images for `basic-network-setup.md` go in `basic-network-setup/`). Use `./` relative paths to reference them.

## Terminology Translation

Chinese docs sometimes use terminology unique to the Chinese networking context that does not map 1:1 into English. When translating in either direction, use the corresponding term from the table below rather than translating word-for-word (e.g. Chinese `NAT1` → English `Full Cone NAT`, and English `Full Cone NAT` → Chinese `NAT1`):

| Chinese | English                  |
| ------- | ------------------------ |
| NAT1    | Full Cone NAT            |
| NAT2    | Restricted Cone NAT      |
| NAT3    | Port Restricted Cone NAT |
| NAT4    | Symmetric NAT            |

When in doubt about how a term maps between the two languages, check the source doc for context and use the standard networking terminology of the target language.

## Configuration

Sidebar and navigation are defined in `.vitepress/config.mts`. Custom theme enhancements (image viewer, tabs plugin) are registered in `.vitepress/theme/index.ts`.

## Commit Convention

Write commit messages in English.

Run formatting and build before committing:

```bash
pnpm format && pnpm build
```
