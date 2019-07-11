import Vue from 'vue'
import Vuex from 'vuex'

import * as dnd5e from './assets/rules/dnd/5e'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rules: dnd5e,
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
          },
          skills: {
            acrobatics: false,
            animal_handling: false,
            arcana: false,
            athletics: false,
            deception: false,
            history: false,
            insight: false,
            intimidation: false,
            investigation: false,
            medicine: false,
            nature: false,
            perception: false,
            performance: false,
            persuasion: false,
            religion: false,
            sleight_of_hand: false,
            stealth: false,
            survival: false,
          }
        }
      }
    }
  },
  getters: {
    sheetlevel: state => {
      let class_level = state.sheet.misc.class_level
      if(class_level == undefined) return undefined
      let result = class_level.match(/\d+/gi)
      return result != null ? result[0] : undefined
    },
    sheetProficiencyBonus: function(state, getters){
      let level = getters.sheetlevel
      if(level == undefined) return undefined
      let bonus = state.rules.proficiency_bonus[level]
      return bonus >= 0 ? '+' + bonus : bonus
    },
    sheetModifier: state => {
      return attr => {
        let attribute = state.sheet.stats.attributes[attr]

        if(attribute !== 0 && !attribute) return undefined
        let mod = Math.floor((attribute - 10) / 2)

        return mod >= 0 ? '+' + mod : mod
      }
    },
    sheetProficiencyModifier: (state, getters) => {
      return (attr, proficient) => {
        let mod = getters.sheetModifier(attr) 
        if(mod == undefined) return undefined

        let proficiency_bonus = getters.sheetProficiencyBonus
        if(proficiency_bonus == undefined) return undefined

        mod = parseInt(mod) + (proficient ? parseInt(proficiency_bonus) : 0)
        
        return mod >= 0 ? '+' + mod : mod
      }
    },
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
      
      state.sheet.stats.proficiencies.skills.acrobatics = undefined
      state.sheet.stats.proficiencies.skills.animal_handling = undefined
      state.sheet.stats.proficiencies.skills.arcana = undefined
      state.sheet.stats.proficiencies.skills.athletics = undefined
      state.sheet.stats.proficiencies.skills.deception = undefined
      state.sheet.stats.proficiencies.skills.history = undefined
      state.sheet.stats.proficiencies.skills.insight = undefined
      state.sheet.stats.proficiencies.skills.intimidation = undefined
      state.sheet.stats.proficiencies.skills.investigation = undefined
      state.sheet.stats.proficiencies.skills.medicine = undefined
      state.sheet.stats.proficiencies.skills.nature = undefined
      state.sheet.stats.proficiencies.skills.perception = undefined
      state.sheet.stats.proficiencies.skills.performance = undefined
      state.sheet.stats.proficiencies.skills.persuasion = undefined
      state.sheet.stats.proficiencies.skills.religion = undefined
      state.sheet.stats.proficiencies.skills.sleight_of_hand = undefined
      state.sheet.stats.proficiencies.skills.stealth = undefined
      state.sheet.stats.proficiencies.skills.survival = undefined
    }
  },
  actions: {

  }
})
