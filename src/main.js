import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import './assets/css/normalize.css'


import { DnD } from './assets/rules'
Object.defineProperty(Vue.prototype, '$DnD', { value: DnD });


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
