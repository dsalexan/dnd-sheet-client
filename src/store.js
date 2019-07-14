import Vue from 'vue'
import Vuex from 'vuex'

import _ from 'lodash'

import * as dnd5e from './assets/rules/dnd/5e'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sheet: {
      name: undefined,
      misc: {
        class_level: 'Bard 1',
        background: undefined,
        player: undefined,
        race: undefined,
        alignment: undefined,
        experience_points: undefined,
        age: undefined,
        height: undefined,
        weight: undefined,
        eye_color: undefined,
        hair_color: undefined,
        skin_color: undefined
      },
      stats: {
        attributes: {
          str: undefined,
          dex: undefined,
          con: undefined,
          int: undefined,
          wis: undefined,
          cha: 15
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
        },
        combat: {
          ac: undefined,
          initiative: undefined,
          speed: undefined,
          hp: {
            maximum: undefined,
            current: undefined,
            temporary: undefined
          },
          hit_dice: {
            total: undefined,
            current: undefined
          },
          death_saves: {
            success: [true, false, true],
            failure: [false, true, false]
          },
          attacks_spellcasting: [
            {
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            },
            {
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            },
            {
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            },{
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            },
            {
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            },
            {
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            },{
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            },
            {
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            },
            {
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            },{
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            },
            {
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            },
            {
              name: undefined,
              attack_bonus: undefined,
              damage_type: undefined
            }
          ]
        }
      },
      equipment: {
        treasure: {
          coins: {
            cp: 15,
            sp: undefined,
            ep: undefined,
            gp: undefined,
            pp: undefined
          }
        },
        items: [
          {
            name: 'Item #1',
            slug: 'item_1',
            reference: '$ref:item_1'
          }
        ]
      },
      spells: {
        by_level: {
          0: ['cantrip 1'],
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
          8: [],
          9: []
        },
        slots: {
          1: 10,
          2: undefined,
          3: undefined,
          4: undefined,
          5: undefined,
          6: undefined,
          7: undefined,
          8: undefined,
          9: undefined
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
      let bonus = dnd5e.proficiency_bonus[level]
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
    sheetPassiveProficiency: (state, getters) => {
      return (slug) => {
        let reference = dnd5e.proficiencies[slug]
        if(reference == undefined) return undefined

        let attribute = reference.slug
        if(reference.type == 'skill'){
          attribute = dnd5e.skills.map(dnd5e.skills.list)[reference.slug].attribute
        }
      
        let proficient = _.get(state.sheet.stats.proficiencies, reference.path)
        let modifier = getters.sheetProficiencyModifier(attribute, proficient)
        if(modifier == undefined) return undefined
        return parseInt(modifier) + 10
      }
    },
    sheetClass: (state, getters) => {
      let level = getters.sheetlevel
      if(level == undefined) return undefined

      let class_name = state.sheet.misc.class_level.replace(level, '').trim()
      return dnd5e.classes.name[class_name]       
    },
    sheetSpellcasting: (state, getters) => {
      let classe = getters.sheetClass
      if(classe == undefined) return undefined
      let spellcasting = classe.spellcasting

      if(typeof spellcasting == 'string'){
        return _.get(classe, spellcasting)
      }else if(typeof spellcasting == 'object'){
        throw Error('Unimplemented')
      }

      return undefined
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
      
      state.sheet.misc.age = undefined
      state.sheet.misc.height = undefined
      state.sheet.misc.weight = undefined
      state.sheet.misc.eye_color = undefined
      state.sheet.misc.hair_color = undefined
      state.sheet.misc.skin_color = undefined

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

      state.sheet.stats.combat.ac = undefined
      state.sheet.stats.combat.initiative = undefined
      state.sheet.stats.combat.speed = undefined
      state.sheet.stats.combat.hp.maximum = undefined
      state.sheet.stats.combat.hp.current = undefined
      state.sheet.stats.combat.hp.temporary = undefined
      state.sheet.stats.combat.hit_dice.total = undefined
      state.sheet.stats.combat.hit_dice.current = undefined

      state.sheet.stats.combat.death_saves.success[0] = false
      state.sheet.stats.combat.death_saves.success[1] = false
      state.sheet.stats.combat.death_saves.success[2] = false
      state.sheet.stats.combat.death_saves.failure[0] = false
      state.sheet.stats.combat.death_saves.failure[1] = false
      state.sheet.stats.combat.death_saves.failure[2] = false

      for(let item of state.sheet.stats.combat.attacks_spellcasting){
        item.name = undefined
        item.attack_bonus = undefined
        item.damage_type = undefined
      }

      for(let coin of dnd5e.economy.money.coins.list){
        state.sheet.equipment.treasure.coins[coin.slug] = undefined
      }
      state.sheet.equipment.item = []
      
      state.sheet.spells.list = []
      for(let i = 1; i <= 9; i++){
        state.sheet.spells.slots[i] = undefined
        state.sheet.spells.by_level[i] = []
      }
      
    }
  },
  actions: {

  }
})
