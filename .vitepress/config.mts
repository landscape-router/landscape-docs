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
      label: 'English',
      lang: 'en-US',
      title: 'Landscape Router',
      description: 'Configuring Linux as a Router',
      themeConfig: {
        lastUpdatedText: 'Last Updated',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Motivation', link: '/intro/motivation' },
          { text: 'Docs', link: '/intro/requirements' },
        ],
        sidebar: [
          {
            items: [
              { text: 'Why Landscape', link: '/intro/motivation' },
              { text: 'System Requirements (Must Read)', link: '/intro/requirements' },
              { text: 'Manual Deployment', link: '/intro/manual-deployment' },
            ],
          },
          {
            text: 'Getting Started',
            items: [
              { text: 'Basic Network Setup', link: '/getting-started/basic-network-setup' },
              { text: 'DNS Setup', link: '/getting-started/dns-setup' },
              { text: 'Flow Setup', link: '/getting-started/flow-setup' },
            ],
          },
          {
            text: 'Features',
            items: [
              { text: 'Traffic Shaping', link: '/features/traffic-flow' },
              { text: 'Full Cone or Symmetric? Both!', link: '/features/nat' },
              { text: 'Full API Access', link: '/features/api' },
              { text: 'eBPF Routing Acceleration', link: '/features/ebpf-route' },
            ],
          },
          {
            text: 'Examples',
            items: [
              { text: 'Site-to-Site Networking', link: '/guides/site-to-site' },
              { text: 'See what others are doing (links)', link: '/guides/community' },
            ],
          },
          {
            text: 'Reference',
            items: [
              { text: 'Zone', link: '/reference/interface-zone' },
              { text: 'VLAN (Temporary)', link: '/reference/vlan-temp' },
              { text: 'PPPoE', link: '/reference/pppoe' },
              {
                text: 'IPv6',
                collapsed: true,
                items: [
                  { text: '(WAN) Obtain an IPv6 Prefix', link: '/reference/ipv6/ipv6-pd' },
                  { text: '(LAN) Assign IPv6 to Devices', link: '/reference/ipv6/lan-ipv6' },
                  {
                    text: '(Docker) Assign Public IPv6 to Containers',
                    link: '/reference/ipv6/docker-ipv6',
                  },
                ],
              },
              { text: 'DHCPv4 Server', link: '/reference/dhcpv4' },
              { text: 'Firewall', link: '/reference/firewall' },
              { text: 'Redirects / Ad Blocking', link: '/reference/redirect' },
              { text: 'Upstream DNS', link: '/reference/dns' },
              { text: 'LAN Hostnames', link: '/reference/lan-hostname' },
              {
                text: 'Overlay Networking',
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
                text: 'Metrics',
                link: '/monitoring/',
                collapsed: true,
                items: [
                  { text: 'Connection Info', link: '/monitoring/connection-info' },
                  { text: 'DNS Metrics', link: '/monitoring/dns-metrics' },
                ],
              },
              { text: 'Geo Database', link: '/reference/domain-ip-collection' },
              { text: 'Device Management', link: '/reference/device-management' },
              { text: 'Certificates', link: '/reference/certificates' },
              { text: 'DDNS', link: '/reference/ddns' },
              { text: 'HTTP Reverse Proxy', link: '/reference/proxy' },
              { text: 'System Configuration', link: '/advanced/settings-export' },
            ],
          },
          {
            text: 'Build',
            collapsed: true,
            items: [
              { text: 'Building', link: '/compilation/' },
              { text: 'Integrating with Armbian', link: '/compilation/armbian' },
              { text: 'Cross-compiling', link: '/compilation/cross-compile' },
            ],
          },
          {
            text: 'Directory & Configuration',
            collapsed: true,
            items: [
              { text: '.landscape-router Directory', link: '/configuration/home-path' },
              { text: 'Configuration File Guide', link: '/configuration/' },
              { text: 'landscape_init.toml Reference', link: '/configuration/init-config' },
            ],
          },
          {
            text: 'FAQ',
            items: [
              { text: 'DNS Related', link: '/faq/dns' },
              { text: 'Relationship with iptables', link: '/faq/iptables' },
              { text: 'Using Podman instead of Docker', link: '/faq/podman' },
              { text: 'Certificate Error', link: '/faq/cert-error' },
              { text: 'Slow Images After IPv6 Reboot', link: '/faq/reboot-slow' },
            ],
          },
        ],
        editLink: {
          pattern: 'https://github.com/landscape-router/landscape-docs/edit/main/:path',
          text: 'Edit this page on GitHub',
        },
      },
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      title: 'Landscape Router',
      description: 'Configuring Linux as a Router',
      themeConfig: {
        lastUpdatedText: '最后更新时间',
        nav: [
          { text: '主页', link: '/zh/' },
          { text: '动机', link: '/zh/intro/motivation' },
          { text: '文档', link: '/zh/intro/requirements' },
        ],
        sidebar: [
          {
            items: [
              { text: '为什么做 Landscape', link: '/zh/intro/motivation' },
              { text: '系统运行基本要求!!! (必读)', link: '/zh/intro/requirements' },
              { text: '手工部署', link: '/zh/intro/manual-deployment' },
            ],
          },
          {
            text: '开始配置',
            items: [
              { text: '基础上网配置', link: '/zh/getting-started/basic-network-setup' },
              { text: 'DNS 配置', link: '/zh/getting-started/dns-setup' },
              { text: '分流配置', link: '/zh/getting-started/flow-setup' },
            ],
          },
          {
            text: '功能特性',
            items: [
              { text: '分流控制', link: '/zh/features/traffic-flow' },
              { text: '只能 NAT1/4? 我全都要!', link: '/zh/features/nat' },
              { text: '可 API 控制所有行为', link: '/zh/features/api' },
              { text: 'eBPF 路由加速', link: '/zh/features/ebpf-route' },
            ],
          },
          {
            text: '使用样例',
            items: [
              {
                text: 'Site To Site 网络配置',
                link: '/zh/guides/site-to-site',
              },
              { text: '康康其他人怎么做 (链接)', link: '/zh/guides/community' },
            ],
          },
          {
            text: '功能详解',
            items: [
              { text: '区域 (Zone)', link: '/zh/reference/interface-zone' },
              { text: 'VLAN (临时)', link: '/zh/reference/vlan-temp' },
              { text: 'PPPoE 拨号', link: '/zh/reference/pppoe' },
              {
                text: 'IPv6',
                collapsed: true,
                items: [
                  { text: '(WAN) 获取前缀 IPv6 前缀', link: '/zh/reference/ipv6/ipv6-pd' },
                  { text: '(LAN) 为设备分配 IPv6', link: '/zh/reference/ipv6/lan-ipv6' },
                  { text: '(Docker) 容器分配公网 IPv6', link: '/zh/reference/ipv6/docker-ipv6' },
                ],
              },
              { text: 'DHCPv4 服务', link: '/zh/reference/dhcpv4' },
              { text: '防火墙设置', link: '/zh/reference/firewall' },
              { text: '重定向 / 广告拦截', link: '/zh/reference/redirect' },
              { text: '上游 DNS 配置', link: '/zh/reference/dns' },
              { text: '内网主机名与 LAN 后缀', link: '/zh/reference/lan-hostname' },
              {
                text: '虚拟组网',
                link: '/zh/overlay/',
                collapsed: true,
                items: [
                  { text: 'DN42', link: '/zh/overlay/dn42' },
                  { text: 'EasyTier', link: '/zh/overlay/easytier' },
                  { text: 'NetBird', link: '/zh/overlay/netbird' },
                  { text: 'Tailscale', link: '/zh/overlay/tailscale' },
                  { text: 'ZeroTier', link: '/zh/overlay/zerotier' },
                ],
              },
              {
                text: '指标监控',
                link: '/zh/monitoring/',
                collapsed: true,
                items: [
                  { text: '连接信息', link: '/zh/monitoring/connection-info' },
                  { text: 'DNS指标', link: '/zh/monitoring/dns-metrics' },
                ],
              },
              {
                text: '地理关系库管理',
                link: '/zh/reference/domain-ip-collection',
              },
              {
                text: '设备管理',
                link: '/zh/reference/device-management',
              },
              {
                text: '证书管理',
                link: '/zh/reference/certificates',
              },
              {
                text: 'DDNS',
                link: '/zh/reference/ddns',
              },
              {
                text: 'HTTP 反代',
                link: '/zh/reference/proxy',
              },
              {
                text: '系统配置导出',
                link: '/zh/advanced/settings-export',
              },
            ],
          },
          {
            text: '编译',
            collapsed: true,
            items: [
              { text: '编译', link: '/zh/compilation/' },
              { text: '与 Armbian 集成', link: '/zh/compilation/armbian' },
              { text: '交叉编译', link: '/zh/compilation/cross-compile' },
            ],
          },
          {
            text: '目录结构 & 配置',
            collapsed: true,
            items: [
              { text: '.landscape-router 目录介绍', link: '/zh/configuration/home-path' },
              { text: '配置文件介绍', link: '/zh/configuration/' },
              { text: 'landscape_init.toml 参考', link: '/zh/configuration/init-config' },
            ],
          },
          {
            text: '常见问题',
            items: [
              { text: 'DNS 服务相关', link: '/zh/faq/dns' },
              { text: '与 iptable 的关系是-没关系', link: '/zh/faq/iptables' },
              { text: '用 Podman 替换 Docker', link: '/zh/faq/podman' },
              { text: '您的连接不是私密连接', link: '/zh/faq/cert-error' },
              { text: '开启 IPv6 重启路由后, 有些图片加载缓慢', link: '/zh/reboot-slow' },
            ],
          },
        ],
        editLink: {
          pattern: 'https://github.com/landscape-router/landscape-docs/edit/main/:path',
          text: '在 GitHub 上编辑此页',
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
          zh: {
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
