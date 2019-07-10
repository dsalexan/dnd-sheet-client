import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sheet: {
      name: undefined,
      misc: {
        class_level: undefined,
        background: undefined,
        player: undefined,
        race: undefined,
        alignment: undefined,
        experience_points: undefined
      },
      stats: {
        attributes: {
          str: 19,
          dex: 8
        }
      }
    }
  },
  getters: {
    sheetlevel: state => {
      let result = /\d+/gm.exec(state.sheet.misc.class_level)
      if(result)
        return result[1]
      else return undefined
    }
  },
  mutations: {
    RESET_SHEET: (state) => {
      state.sheet.name = undefined
      
      state.sheet.misc.class_level = undefined
      state.sheet.misc.background = undefined
      state.sheet.misc.player = undefined
      state.sheet.misc.race = undefined
      state.sheet.misc.alignment = undefined
      state.sheet.misc.experience_points = undefined

      state.sheet.stats.attributes.str = undefined
      state.sheet.stats.attributes.dex = undefined
    }
  },
  actions: {

  }
})
