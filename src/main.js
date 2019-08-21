import Vue from 'vue'

import bus from './bus'
window.bus = bus

import App from './App.vue'
import router from './router'
import store from './store'
window.store = store

import './registerServiceWorker'

import './assets/css/normalize.css'


import { dnd } from './assets/rules'
import './quasar'
Object.defineProperty(Vue.prototype, '$dnd', { value: dnd });


Vue.config.productionTip = false

 new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')