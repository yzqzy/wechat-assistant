import { createApp } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import router from './router'
import pinia from './store/index'
import App from './App.vue'

import './bridge/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './bridge/node'

const app = createApp(App)

// 注册 elementplus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(pinia)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
