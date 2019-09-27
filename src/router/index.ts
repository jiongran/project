import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import setting from '@/settings'
import * as util from '@/util/cookies'

NProgress.configure({
  parent: '#app',
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: {
        name: 'home'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import(/* webpackChunkName: "search" */ '@/views/search/index.vue')
    },
    {
      path: '/categories/:id',
      name: 'categories',
      component: () => import(/* webpackChunkName: "search" */ '@/views/categories/index.vue')
    },
    {
      path: '/list/:id',
      name: 'list',
      component: () => import(/* webpackChunkName: "search" */ '@/views/list/index.vue')
    },
    {
      path: '/detail/:categoryId/:id',
      name: 'detail',
      component: () => import(/* webpackChunkName: "search" */ '@/views/detail/index.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta.requiresAuth) {
    if ((util.getToken(setting.defaultStorageState) as any)) {
      next()
      NProgress.done()
    } else {
      next({ name: 'login' })
      NProgress.done()
    }
  } else {
    next()
    NProgress.done()
  }
})

export default router
