import { defineConfig } from 'vitepress';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  ignoreDeadLinks: true,
  markdown: {
    config: (md) => {
      md.use(tabsMarkdownPlugin);
    },
  },

  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      title: 'Landscape Router',
      description: 'Configuring Linux as a Router',
      themeConfig: {
        lastUpdatedText: '最后更新时间',
        nav: [
          { text: '主页', link: '/' },
          { text: '文档', link: '/intro/' },
        ],
        sidebar: [
          {
            items: [
              { text: '简介', link: '/intro/' },
              { text: '系统运行基本要求!!! (必读)', link: '/intro/requirements' },
              { text: '手工部署', link: '/intro/manual-deployment' },
            ],
          },
          {
            text: '开始配置',
            items: [
              { text: '基础上网配置', link: '/getting-started/basic-network-setup' },
              { text: 'DNS 配置', link: '/getting-started/dns-setup' },
              { text: '分流配置', link: '/getting-started/flow-setup' },
            ],
          },
          {
            text: '功能特性',
            items: [
              { text: '分流控制', link: '/features/traffic-flow' },
              { text: '只能 NAT1/4? 我全都要!', link: '/features/nat' },
              { text: '可 API 控制所有行为', link: '/features/api' },
              { text: 'eBPF 路由', link: '/features/ebpf-route' },
            ],
          },
          {
            text: '使用样例',
            items: [
              {
                text: 'Site To Site 网络配置',
                link: '/guides/site-to-site',
              },
              { text: '康康其他人怎么做 (链接)', link: '/guides/community' },
            ],
          },
          {
            text: '功能详解',
            items: [
              { text: '区域 (Zone)', link: '/reference/interface-zone' },
              {
                text: '系统基本设置',
                collapsed: true,
                items: [
                  { text: '基础操作', link: '/reference/basic-settings' },
                  { text: '区域切换', link: '/reference/zone-switching' },
                ],
              },
              { text: 'IPv4 相关', link: '/reference/ipv4' },
              { text: 'IPv6 相关', link: '/reference/ipv6/' },
              { text: 'DHCPv4 Server 相关', link: '/reference/dhcpv4' },
              { text: '防火墙设置', link: '/reference/firewall' },
              { text: 'DNS 相关', link: '/reference/dns' },
              {
                text: '虚拟组网',
                link: '/overlay/',
                collapsed: true,
                items: [
                  { text: 'DN42', link: '/overlay/dn42' },
                  { text: 'EasyTier', link: '/overlay/easytier' },
                  { text: 'NetBird', link: '/overlay/netbird' },
                  { text: 'Tailscale', link: '/overlay/tailscale' },
                  { text: 'ZeroTier', link: '/overlay/zerotier' },
                ],
              },
              {
                text: '指标监控',
                link: '/monitoring/',
                collapsed: true,
                items: [
                  { text: '连接信息', link: '/monitoring/connection-info' },
                  { text: 'DNS指标', link: '/monitoring/dns-metrics' },
                ],
              },
              {
                text: '地理关系库管理',
                link: '/monitoring/domain-ip-collection',
              },
              {
                text: '设备管理',
                link: '/reference/device-management',
              },
              {
                text: '证书管理',
                link: '/reference/certificates',
              },
              {
                text: 'HTTP 反代',
                link: '/reference/proxy',
              },
              {
                text: '系统配置导出',
                link: '/advanced/settings-export',
              },
            ],
          },
          {
            text: '编译',
            collapsed: true,
            items: [
              { text: '编译', link: '/compilation/' },
              { text: '与 Armbian 集成', link: '/compilation/armbian' },
              { text: '交叉编译', link: '/compilation/cross-compile' },
            ],
          },
          {
            text: '目录结构 & 配置',
            collapsed: true,
            items: [
              { text: '.landscape-router 目录介绍', link: '/configuration/home-path' },
              { text: '配置文件介绍', link: '/configuration/' },
            ],
          },
          {
            text: '常见问题',
            items: [
              { text: 'DNS 服务相关', link: '/faq/dns' },
              { text: '与 iptable 的关系是-没关系', link: '/faq/iptables' },
              { text: '用 Podman 替换 Docker', link: '/faq/podman' },
              { text: '您的连接不是私密连接', link: '/faq/cert-error' },
            ],
          },
        ],
        editLink: {
          pattern: 'https://github.com/landscape-router/landscape-docs/edit/main/:path',
          text: '在 GitHub 上编辑此页',
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'Landscape Router',
      description: 'Configuring Linux as a Router',
      themeConfig: {
        lastUpdatedText: 'Last Updated',
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Docs', link: '/en/intro/' },
        ],
        sidebar: [
          {
            items: [
              { text: 'Introduction', link: '/en/intro/' },
              { text: 'System Requirements (Must Read)', link: '/en/intro/requirements' },
              { text: 'Manual Deployment', link: '/en/intro/manual-deployment' },
            ],
          },
          {
            text: 'Configuration',
            items: [
              { text: '.landscape-router Directory', link: '/en/configuration/home-path' },
              { text: 'Configuration File Guide', link: '/en/configuration/' },
            ],
          },
          {
            text: 'Features',
            items: [
              { text: 'Traffic Shaping', link: '/en/features/traffic-flow' },
              { text: 'NAT Control', link: '/en/features/nat' },
              { text: 'API Access', link: '/en/features/api' },
              { text: 'eBPF Routing', link: '/en/features/ebpf-route' },
            ],
          },
          {
            text: 'FAQ',
            items: [
              { text: 'DNS Related', link: '/en/faq/dns' },
              { text: 'Relationship with iptables', link: '/en/faq/iptables' },
              { text: 'Certificate Error', link: '/en/faq/cert-error' },
            ],
          },
        ],
        editLink: {
          pattern: 'https://github.com/landscape-router/landscape-docs/edit/main/:path',
          text: 'Edit this page on GitHub',
        },
      },
    },
  },

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search docs',
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Clear query',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate',
                  closeText: 'Close',
                },
              },
            },
          },
        },
      },
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/ThisSeanZhang/landscape' }],
    footer: {
      message: '',
      copyright: 'Copyright © 2025-present Sean',
    },
  },
});
