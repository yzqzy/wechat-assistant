import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteRecordRaw
} from 'vue-router'
import { storeToRefs } from 'pinia'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import Main from '@/views/main.vue'

import { checkLogin, getUserInfo } from '@/api/index'
import { useUserStore } from '@/store/user'
import { useHook } from '@/composables/useHook'

export const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      title: '看板',
      icon: 'HomeFilled'
    },
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '@/views/dashboard.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    meta: {
      title: '联系人管理',
      icon: 'User'
    },
    component: () =>
      import(/* webpackChunkName: "contact" */ '@/views/contact/index.vue')
  },
  {
    path: '/chatroom',
    name: 'ChatRoom',
    meta: {
      title: '群聊管理',
      icon: 'ChatSquare'
    },
    component: () =>
      import(/* webpackChunkName: "chatroom" */ '@/views/chatroom/index.vue')
  },
  {
    path: '/task',
    name: 'Task',

    meta: {
      title: '任务管理',
      icon: 'List'
    },
    children: [
      {
        path: 'contact-tag',
        name: 'ContactTag',
        meta: {
          title: '标签管理'
        },
        component: () =>
          import(/* webpackChunkName: "tag" */ '@/views/contact-tag/index.vue')
      },
      {
        path: 'cron',
        name: 'CRON',
        meta: {
          title: '定时任务'
        },
        component: () =>
          import(/* webpackChunkName: "cron" */ '@/views/cron/index.vue')
      },
      {
        path: 'trigger',
        name: 'Trigger',
        meta: {
          title: '触发任务'
        },
        component: () =>
          import(/* webpackChunkName: "trigger" */ '@/views/trigger/index.vue')
      }
    ]
  },
  {
    path: '/wx-msg',
    name: 'WxMsg',
    meta: {
      title: '聊天记录备份',
      icon: 'ChatDotRound'
    },
    component: () =>
      import(/* webpackChunkName: "wx-msg" */ '@/views/wx-msg/index.vue')
  },
  {
    path: '/tools',
    name: 'Tools',
    meta: {
      title: '工具集',
      icon: 'Tools'
    },
    children: [
      {
        path: 'ocr',
        name: 'OCR',
        meta: {
          title: '图像文字识别'
        },
        component: () => import(/* webpackChunkName: "ocr" */ '@/views/ocr.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      title: '关于作者',
      icon: 'CoffeeCup'
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/about.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      name: 'main',
      component: Main,
      children: mainRoutes
    },
    {
      path: '/injector',
      name: 'Injector',
      meta: {
        title: '微信注入页面'
      },
      component: () =>
        import(/* webpackChunkName: "injector" */ '@/views/injector.vue')
    },
    {
      path: '/403',
      name: '403',
      meta: {
        title: '没有权限'
      },
      component: () => import(/* webpackChunkName: "403" */ '@/views/403.vue')
    }
  ]
})

const redirect = (next: NavigationGuardNext) => next('/injector')

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const { messageHook } = useHook()
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
        // hook message
        await messageHook()
        // login success
        store.addUserInfo(res.data)
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
