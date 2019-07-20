import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
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
