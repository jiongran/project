import Vue from 'vue'
import Router from 'vue-router'
import setting from '@/settings'
import * as util from '@/util/cookies'

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
  if (to.meta.requiresAuth) {
    if ((util.getToken(setting.defaultStorageState) as any)) {
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

export default router
