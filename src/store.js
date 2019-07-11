import Vue from 'vue'
import Vuex from 'vuex'

import { DnD } from './assets/rules'

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
          dex: 8,
          con: undefined,
          int: undefined,
          wis: undefined,
          cha: undefined
        },
        inspiration: false,
        proficiencies: {
          saves: {
            str: false,
            dex: false,
            con: false,
            int: false,
            wis: false,
            cha: false
          }
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
    },
    sheetModifier: state => {
      return attr => {
        let attribute = state.sheet.stats.attributes[attr]

        if(attribute !== 0 && !attribute) return undefined
        let mod = Math.floor((attribute - 10) / 2)

        return mod >= 0 ? '+' + mod : mod
      }
    },
    sheetSaveModifier: state => {
      return attr => {
        let attribute = state.sheet.stats.attributes[attr]

        if(attribute !== 0 && !attribute) return undefined
        let mod = Math.floor((attribute - 10) / 2)
        console.log('sheet save', attribute, mod)

        let proficiency = state.sheet.stats.proficiencies.saves[attr]
        let proficiency_bonus = 2

        mod = mod + (proficiency ? parseInt(proficiency_bonus) : 0)
        
        return mod >= 0 ? '+' + mod : mod
      }

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
      state.sheet.stats.attributes.con = undefined
      state.sheet.stats.attributes.int = undefined
      state.sheet.stats.attributes.wis = undefined
      state.sheet.stats.attributes.cha = undefined

      state.sheet.stats.inspiration = false
      
      state.sheet.stats.proficiencies.saves.str = undefined
      state.sheet.stats.proficiencies.saves.dex = undefined
      state.sheet.stats.proficiencies.saves.con = undefined
      state.sheet.stats.proficiencies.saves.int = undefined
      state.sheet.stats.proficiencies.saves.wis = undefined
      state.sheet.stats.proficiencies.saves.cha = undefined
    }
  },
  actions: {

  }
})
