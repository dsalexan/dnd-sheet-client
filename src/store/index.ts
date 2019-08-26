import Vue from 'vue';
import Vuex from 'vuex';

import { RootState } from './types'

import {sheet} from './sheet'

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    modules: {
        sheet
    },
    state: {
        version: '1.0.0'
    },
    mutations: {

    },
    actions: {

    },
});
