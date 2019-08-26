import './global'

import Vue from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './quasar'

import {Bus} from './bus'
window.bus = Bus

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
