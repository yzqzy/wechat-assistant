import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/wechat-assistant/',
  title: '微信助手',
  description: 'wechat assistant for wechat management',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',

    nav: [
      { text: '指南', link: '/guide' },
      {
        text: '相关链接',
        items: [
          {
            items: [
              {
                text: 'wxhelper',
                link: 'https://github.com/ttttupup/wxhelper'
              },
              {
                text: 'Injector',
                link: 'https://github.com/nefarius/Injector'
              },
              { text: 'WeChatMsg', link: 'https://github.com/LC044/WeChatMsg' },
              {
                text: 'WeChatAPI',
                link: 'https://www.wechatsdk.com/zh'
              }
            ]
          }
        ]
      }
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '微信助手', link: '/guide' },
          { text: '快速开始', link: '/getting-started' },
          { text: '功能介绍', link: '/features' },
          { text: '聊天记录迁移', link: '/chat-history-migration' },
          { text: '常见问题', link: '/faq' }
        ]
      },
      {
        text: '开发指南',
        items: [
          { text: '如何开发', link: '/developer' },
          { text: '数据库阐述', link: '/database' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/yzqzy' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present heora'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  }
})
