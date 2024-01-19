import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteRecordRaw
} from 'vue-router'
import Home from '../views/home.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { checkLogin } from '../api/index'

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
        path: '/donate',
        name: 'donate',
        meta: {
          title: '鼓励作者'
        },
        component: () =>
          import(/* webpackChunkName: "donate" */ '../views/donate.vue')
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

    next()
    return
  }

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
