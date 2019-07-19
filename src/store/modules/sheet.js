import _ from 'lodash'

import * as dnd5e from '@/assets/rules/dnd/5e'

export default {
    namespaced: true,
    state: {
        subscriptions: {
            features: {},
            equipment: {},
            proficiencies: {},
            spells: {}
        },
        name: undefined,
        misc: {
            class_level: undefined, // SUBSCRIPTION
            background: undefined, // SUBSCRIPTION
            player: undefined,
            race: undefined, // SUBSCRIPTION
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
                },
                others: {
                    order: [],
                    created: []
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
                death_saves: undefined,
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
                    }, {
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
                    }, {
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
                    }, {
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
        equipment: { // SUBSCRIPTION
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
        features: {
            order: [],
            created: []
        }, // SUBSCRIPTION
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
    },
    getters: {
        level: state => {
            let class_level = state.misc.class_level
            if (class_level == undefined) return undefined
            let result = class_level.match(/\d+/gi)
            return result != null ? result[0] : undefined
        },
        proficiency_bonus: function (state, getters) {
            let level = getters.level
            if (level == undefined) return undefined
            let bonus = dnd5e.proficiency_bonus[level]
            return bonus >= 0 ? '+' + bonus : bonus
        },
        modifier: state => {
            return attr => {
                let attribute = state.stats.attributes[attr]

                if (attribute !== 0 && !attribute) return undefined
                let mod = Math.floor((attribute - 10) / 2)

                return mod >= 0 ? '+' + mod : mod
            }
        },
        proficiency_modifier: (state, getters) => {
            return (attr, proficient) => {
                let mod = getters.modifier(attr)
                if (mod == undefined) return undefined

                let proficiency_bonus = getters.proficiency_bonus
                if (proficiency_bonus == undefined) return undefined

                mod = parseInt(mod) + (proficient ? parseInt(proficiency_bonus) : 0)

                return mod >= 0 ? '+' + mod : mod
            }
        },
        passive_proficiency: (state, getters) => {
            return (slug) => {
                let reference = dnd5e.proficiencies[slug]
                if (reference == undefined) return undefined

                let attribute = reference.slug
                if (reference.type == 'skill') {
                    attribute = dnd5e.skills[reference.slug].attribute
                }

                let proficient = _.get(state.stats.proficiencies, reference.path)
                let modifier = getters.proficiency_modifier(attribute, proficient)
                if (modifier == undefined) return undefined
                return parseInt(modifier) + 10
            }
        },
        class: (state, getters) => {
            let level = getters.level
            if (level == undefined) return undefined

            let class_name = state.misc.class_level.replace(level, '').trim()
            return dnd5e.classes.name[class_name]
        },
        race: (state, getters) => {
            let race = state.race
            if(race == undefined) return undefined

            return dnd5e.races.name[race]
        },
        background: (state, getters) => {
            let background = state.background
            if(background == undefined) return undefined
            
            return dnd5e.backgrounds.name[background]
        },
        spellcasting: (state, getters) => {
            let classe = getters.class
            if (classe == undefined) return undefined
            let spellcasting = classe.spellcasting

            if (typeof spellcasting == 'string') {
                return _.get(classe, spellcasting)
            } else if (typeof spellcasting == 'object') {
                throw Error('Unimplemented')
            }

            return undefined
        },
        features: (state, getters) => {
            let order = state.features.order || []

            let features = state.features.created || []
            let subs = state.subscriptions.features

            for(let key in subs){
                features = features.concat(subs[key])
            }

            let map_features = {}
            for(let feature of features){
                map_features[feature.slug || feature] = feature
            }

            return order.map(slug => map_features[slug])
        },
    },
    mutations: {
        RESET: (state) => {
            state.name = undefined

            state.misc.class_level = undefined
            state.misc.background = undefined
            state.misc.player = undefined
            state.misc.race = undefined
            state.misc.alignment = undefined
            state.misc.experience_points = undefined

            state.misc.age = undefined
            state.misc.height = undefined
            state.misc.weight = undefined
            state.misc.eye_color = undefined
            state.misc.hair_color = undefined
            state.misc.skin_color = undefined

            state.stats.attributes.str = undefined
            state.stats.attributes.dex = undefined
            state.stats.attributes.con = undefined
            state.stats.attributes.int = undefined
            state.stats.attributes.wis = undefined
            state.stats.attributes.cha = undefined

            state.stats.inspiration = false

            state.stats.proficiencies.saves.str = undefined
            state.stats.proficiencies.saves.dex = undefined
            state.stats.proficiencies.saves.con = undefined
            state.stats.proficiencies.saves.int = undefined
            state.stats.proficiencies.saves.wis = undefined
            state.stats.proficiencies.saves.cha = undefined

            state.stats.proficiencies.skills.acrobatics = undefined
            state.stats.proficiencies.skills.animal_handling = undefined
            state.stats.proficiencies.skills.arcana = undefined
            state.stats.proficiencies.skills.athletics = undefined
            state.stats.proficiencies.skills.deception = undefined
            state.stats.proficiencies.skills.history = undefined
            state.stats.proficiencies.skills.insight = undefined
            state.stats.proficiencies.skills.intimidation = undefined
            state.stats.proficiencies.skills.investigation = undefined
            state.stats.proficiencies.skills.medicine = undefined
            state.stats.proficiencies.skills.nature = undefined
            state.stats.proficiencies.skills.perception = undefined
            state.stats.proficiencies.skills.performance = undefined
            state.stats.proficiencies.skills.persuasion = undefined
            state.stats.proficiencies.skills.religion = undefined
            state.stats.proficiencies.skills.sleight_of_hand = undefined
            state.stats.proficiencies.skills.stealth = undefined
            state.stats.proficiencies.skills.survival = undefined

            state.stats.proficiencies.others = []

            state.stats.combat.ac = undefined
            state.stats.combat.initiative = undefined
            state.stats.combat.speed = undefined
            state.stats.combat.hp.maximum = undefined
            state.stats.combat.hp.current = undefined
            state.stats.combat.hp.temporary = undefined
            state.stats.combat.hit_dice.total = undefined
            state.stats.combat.hit_dice.current = undefined

            state.stats.combat.death_saves = undefined

            for (let item of state.stats.combat.attacks_spellcasting) {
                item.name = undefined
                item.attack_bonus = undefined
                item.damage_type = undefined
            }

            for (let coin of dnd5e.economy.money.coins.all) {
                state.equipment.treasure.coins[coin.slug] = undefined
            }
            state.equipment.item = []

            state.features = []

            state.spells.list = []
            for (let i = 0; i <= 9; i++) {
                state.spells.slots[i] = undefined
                state.spells.by_level[i] = []
            }

        },
        SET_PROFICIENCIES(state, { value, index }){
            if(value == undefined)
                state.stats.proficiencies.others.splice(index, 1)
            else
                state.stats.proficiencies.others.splice(index, 1, value)
        },
    },
    actions: {
        // actions as mutations
        SET_CLASS_LEVEL({ dispatch, state }, value){
            state.misc.class_level = value
            dispatch('UPDATE_SUBSCRIPTIONS', {source: 'getters', path: 'class'})
        },
        SET_BACKGROUND({ dispatch, state }, value){
            state.misc.background = value
            dispatch('UPDATE_SUBSCRIPTIONS', {source: 'getters', path: 'background'})
        },
        SET_RACE({ dispatch, state }, value){
            state.misc.race = value
            dispatch('UPDATE_SUBSCRIPTIONS', {source: 'getters', path: 'race'})
        },
        SET_EQUIPMENT({ dispatch, state }, { value, index }){
            if(value == undefined)
                state.equipment.items.splice(index, 1)
            else
                state.equipment.items.splice(index, 1, value)

            dispatch('UPDATE_SUBSCRIPTIONS', {source: 'state', path: 'equipment.items'})
        },
        SET_FEATURES({ dispatch, state }, { value, index }){
            if(value == undefined)
                state.features.splice(index, 1)
            else
                state.features.splice(index, 1, value)
            dispatch('UPDATE_SUBSCRIPTIONS', {source: 'state', path: 'features'})
        },

        UPDATE_SUBSCRIPTIONS({ state, getters }, { source, path }){
            // state.subscriptions 

            let meta
            if(source == 'getters'){
                meta = [_.get(getters, path)]
            }else if(source == 'state'){
                meta = [..._.get(state, path)]
            }

            for(let m of meta.filter(_ => !!_ && !!_.subscriptions)){
                for(let key of m.subscriptions){
                    // state.subscriptions[key][m.meta] = m[key]
                    let obj = {}
                    obj[m.meta] = m[key]
                    state.subscriptions[key] = Object.assign({}, state.subscriptions[key], obj)
                }
            }

            // console.log('SUBSCRIPTIONS UPDATED', state.subscriptions)
            // console.log(state.subscriptions)
        }
    }
}