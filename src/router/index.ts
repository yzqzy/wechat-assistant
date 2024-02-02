import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteRecordRaw
} from 'vue-router'
import { storeToRefs } from 'pinia'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import Home from '../views/home.vue'

import { checkLogin, getUserInfo } from '../api/index'
import { useUserStore } from '../store/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: '看板',
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue')
      },
      {
        path: '/contact',
        name: 'Contact',
        meta: {
          title: '联系人'
        },
        component: () =>
          import(/* webpackChunkName: "contact" */ '../views/contact/index.vue')
      },
      {
        path: '/chatroom',
        name: 'ChatRoom',
        meta: {
          title: '群聊管理'
        },
        component: () =>
          import(
            /* webpackChunkName: "chatroom" */ '../views/chatroom/index.vue'
          )
      },
      {
        path: '/ocr',
        name: 'OCR',
        meta: {
          title: '图像文字识别 - OCR'
        },
        component: () =>
          import(/* webpackChunkName: "ocr" */ '../views/ocr.vue')
      },
      {
        path: '/cron',
        name: 'CRON',
        meta: {
          title: '定时任务'
        },
        component: () =>
          import(/* webpackChunkName: "cron" */ '../views/cron/index.vue')
      },
      {
        path: '/about',
        name: 'About',
        meta: {
          title: '关于作者'
        },
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/about.vue')
      }
    ]
  },
  {
    path: '/injector',
    name: 'Injector',
    meta: {
      title: '微信注入页面'
    },
    component: () =>
      import(/* webpackChunkName: "injector" */ '../views/injector.vue')
  },
  {
    path: '/403',
    name: '403',
    meta: {
      title: '没有权限'
    },
    component: () => import(/* webpackChunkName: "403" */ '../views/403.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const redirect = (next: NavigationGuardNext) => next('/injector')

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const store = useUserStore()
  const { isLoggedIn } = storeToRefs(store)

  console.log('isLoggedIn', isLoggedIn.value)

  if (isLoggedIn.value) {
    next()
  } else {
    if (to.path != '/injector') {
      try {
        const loginRes = await checkLogin()

        if (loginRes.code != 1) {
          redirect(next)
          return
        }
      } catch (error) {
        redirect(next)
        return
      }

      const res = await getUserInfo()

      if (res.code == 1) {
        store.setUserInfo(res.data)
      } else {
        console.log('获取用户信息失败')
      }
    }
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
