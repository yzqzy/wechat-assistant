import { createApp } from 'vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

import 'element-plus/dist/index.css'

import './demos/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

const app = createApp(App)

// 注册 elementplus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
