import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  ignoreDeadLinks: true,

  locales: {
    root: {
      label: "中文",
      lang: "zh-CN",
      title: "Landscape Router",
      description: "Configuring Linux as a Router",
      themeConfig: {
        lastUpdatedText: "最后更新时间",
        nav: [
          { text: "主页", link: "/" },
          { text: "文档", link: "/introduction" },
        ],
        sidebar: [
          {
            items: [
              { text: "简介", link: "/introduction" },
              { text: "系统运行基本要求!!! (必读)", link: "/attention" },
              { text: "手工部署", link: "/manual" },
            ],
          },
          {
            text: "目录结构 & 配置",
            items: [
              { text: ".landscape-router 目录介绍", link: "/config/home_path" },
              { text: "配置文件介绍", link: "/config/index" },
            ],
          },
          {
            text: "核心特性",
            items: [
              { text: "分流控制", link: "/feature/flow" },
              { text: "eBPF 路由", link: "/feature/route" },
            ],
          },
          {
            text: "使用样例",
            items: [
              {
                text: "Site To Site 网络配置",
                link: "/other-features/overlay/site-to-site",
              },
              { text: "康康其他人怎么做 (链接)", link: "/community-guides" },
            ],
          },
          {
            text: "基础功能设置",
            items: [
              {
                text: "系统基本设置",
                collapsed: true,
                items: [
                  { text: "基础操作", link: "/other-features/basic/basic" },
                  { text: "区域切换", link: "/other-features/basic/zone" },
                ],
              },
              { text: "IPv4 相关", link: "/other-features/ipv4/ipv4" },
              { text: "IPv6 相关", link: "/other-features/ipv6" },
              { text: "DHCPv4 Server 相关", link: "/other-features/dhcpv4" },
              { text: "防火墙设置", link: "/other-features/firewall" },
              { text: "DNS 相关", link: "/other-features/serverdns" },
              {
                text: "虚拟组网",
                link: "/other-features/overlay/overlay-network",
                collapsed: true,
                items: [
                  { text: "DN42", link: "/other-features/overlay/dn42" },
                  { text: "EasyTier", link: "/other-features/overlay/easytier" },
                  { text: "NetBird", link: "/other-features/overlay/netbird" },
                  { text: "Tailscale", link: "/other-features/overlay/tailscale" },
                  { text: "ZeroTier", link: "/other-features/overlay/zerotier" },
                ],
              },
              {
                text: "地理关系库管理",
                link: "/other-features/domain-ip-collection",
              },
              {
                text: "系统配置导出",
                link: "/other-features/settings",
              },
            ],
          },
          {
            text: "编译",
            collapsed: true,
            items: [
              { text: "编译", link: "/compilation/index" },
              { text: "与 Armbian 集成", link: "/compilation/armbian" },
              { text: "交叉编译", link: "/compilation/cross" },
            ],
          },
          {
            text: "常见问题",
            items: [
              { text: "DNS 服务相关", link: "/faq/dns" },
              { text: "与 iptable 的关系是-没关系", link: "/faq/iptables" },
              { text: "您的连接不是私密连接", link: "/faq/cert_error" },
            ],
          },
        ],
        editLink: {
          pattern:
            "https://github.com/landscape-router/landscape-docs/edit/main/:path",
          text: "在 GitHub 上编辑此页",
        },
      },
    },
    en: {
      label: "English",
      lang: "en-US",
      title: "Landscape Router",
      description: "Configuring Linux as a Router",
      themeConfig: {
        lastUpdatedText: "Last Updated",
        nav: [
          { text: "Home", link: "/en/" },
          { text: "Docs", link: "/en/introduction" },
        ],
        sidebar: [
          {
            items: [
              { text: "Introduction", link: "/en/introduction" },
              { text: "System Requirements (Must Read)", link: "/en/attention" },
              { text: "Manual Deployment", link: "/en/manual" },
            ],
          },
        ],
        editLink: {
          pattern:
            "https://github.com/landscape-router/landscape-docs/edit/main/:path",
          text: "Edit this page on GitHub",
        },
      },
    },
  },

  themeConfig: {
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
          en: {
            translations: {
              button: {
                buttonText: "Search",
                buttonAriaLabel: "Search docs",
              },
              modal: {
                noResultsText: "No results found",
                resetButtonTitle: "Clear query",
                footer: {
                  selectText: "Select",
                  navigateText: "Navigate",
                  closeText: "Close",
                },
              },
            },
          },
        },
      },
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/ThisSeanZhang/landscape" },
    ],
    footer: {
      message: "",
      copyright: "Copyright © 2025-present Sean",
    },
  },
});
