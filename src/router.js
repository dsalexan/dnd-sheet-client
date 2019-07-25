import Vue from 'vue'
import Router from 'vue-router'
import DefaultLayout from './layouts/Default.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'

import Sheet from './views/Sheet.vue'
import SheetDev from './views/SheetDev.vue'
import Twitter from './views/Twitter.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      // component: DefaultLayout,
      // children: [
      // {
      //   path: '',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/sheet',
      name: 'sheet',
      component: Sheet
    },
    {
      path: '/sheet-dev',
      name: 'sheet-dev',
      component: SheetDev
    },
    {
      path: '/twitter',
      name: 'twitter',
      component: Twitter
    }
  ]
})
