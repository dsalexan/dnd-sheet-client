import Vue from 'vue'
import Vuex from 'vuex'


import sheet from './modules/sheet'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        sheet
    }
})
