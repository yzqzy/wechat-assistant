import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'WeChat Assistant',
  description: 'wechat assistant for wechat management',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: './assets/logo.png',

    nav: [
      { text: '指引', link: '/guide' },
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
              { text: 'WeChatMsg', link: 'https://github.com/LC044/WeChatMsg' }
            ]
          }
        ]
      }
    ],

    sidebar: [
      {
        text: '指引',
        items: [
          { text: '开始', link: '/guide' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/yzqzy' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present heora'
    }
  }
})
