import _ from 'lodash'
import axios from 'axios'

import * as dnd5e from '@/assets/rules/dnd/5e'
import resources from '@/assets/utils/resources'

export default {
    namespaced: true,
    state: {
        subscriptions: {
            features: {},
            proficiencies: {},
            spells: {}
        },
        injections: {},
        async: {
            class: undefined,
            race: undefined,
            background: undefined,
            features: undefined,
            proficiencies: undefined,
            equipment: undefined,
            spells: undefined
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
                    armor: [],
                    weapons: [],
                    tools: [],
                    languages: []
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
        equipment: { // INJECTION
            treasure: [
                {
                    slug: "@coin/gp",
                    mechanics: {
                        quantity: 7
                    }
                }
            ],
            items: []
        },
        features: [], // SUBSCRIPTION
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
            console.log('CLASSE', class_name)
            return class_name
        },
        spellcasting: (state, getters) => {
            let classe = state.async.class
            if (classe == undefined) return undefined
            let spellcasting = classe.mechanics.spellcasting

            if (typeof spellcasting == 'string') {
                return _.get(classe.mechanics, spellcasting)
            } else if (typeof spellcasting == 'object') {
                throw Error('Unimplemented')
            }

            return undefined
        },
        proficiencies: (state, getters) => {
            let subs = state.subscriptions.proficiencies

            let proficiencies = {}
            for(let type of dnd5e.proficiencies.types){
                if(type.display !== false)
                    proficiencies[type.slug] = []
            }

            for(let source in subs){
                let proficiencies_from_source = subs[source]

                for(let type in proficiencies){
                    if(proficiencies_from_source[type] !== undefined)
                        proficiencies[type] = proficiencies[type].concat(proficiencies_from_source[type])
                }
            }

            return proficiencies
        },
        coins: (state, getters) => {
            let treasure = (state.async.equipment || {}).treasure || []

            let coins = treasure.filter(t => t.parent == 'coin')
            coins = coins.reduce((obj, cur) => _.merge(obj, {[cur._id]: cur.mechanics.quantity}), {})

            let _coins = dnd5e.economy.money.coins.all.reduce((obj, cur) => _.merge(obj, {[cur.slug]: 0}), {})
            _.merge(_coins, coins)

            return _coins
        },
        items_with_quantity: (state) => {
            let items = (state.async.equipment || {}).items || []

            items = items.filter(i => (i.mechanics || {quantity: 1}).quantity > 0)
            items = items.map(i => {
                let _i = _.cloneDeep(i)
                if(_i.mechanics != undefined){
                    if(_i.mechanics.composition != undefined){
                        _i.mechanics.composition = _i.mechanics.composition.filter(c => (c.mechanics || {quantity: 1}).quantity > 0)
                    }
                }
                
                return _i
            })

            return items
        }
    },
    mutations: {
        RESET: (state) => {
            state.subscriptions.features = {}
            state.subscriptions.proficiencies = {}
            state.subscriptions.spells = {}

            state.injections = {}

            state.async.class = undefined
            state.async.race = undefined
            state.async.background = undefined
            state.async.features = undefined
            state.async.proficiencies = undefined
            state.async.equipment = undefined
            state.async.spells = undefined
            
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
    },
    actions: {
        async FETCH_CLASS({commit, state, getters}){
            let name = getters.class
            if(name == undefined) return undefined
            
            try{
                let result = await axios.get(`http://localhost:3000/classes?q=${name}`)

                if(result.data.length == 0) return false

                state.async.class = result.data[0]
                // console.log(state.async.class)
                return true
            }catch(err){
                console.log('ERROR ON FETCH CLASS', name)
                console.error(err)
                return false
            }
        },
        async FETCH_BACKGROUND({commit, state, getters}){
            let name = state.misc.background
            if(name == undefined) return undefined
            
            try{
                let result = await axios.get(`http://localhost:3000/backgrounds?q=${name}`)

                if(result.data.length == 0) return false

                state.async.background = result.data[0]
                // console.log(state.async.background)
                return true
            }catch(err){
                console.log('ERROR ON FETCH BACKGROUND', name)
                console.error(err)
                return false
            }
        },
        async FETCH_RACE({commit, state, getters}){
            let name = state.misc.race
            if(name == undefined) return undefined
            
            try{
                let result = await axios.get(`http://localhost:3000/races?q=${name}`)

                if(result.data.length == 0) return false

                state.async.race = result.data[0]
                // console.log(state.async.background)
                return true
            }catch(err){
                console.log('ERROR ON FETCH RACE', name)
                console.error(err)
                return false
            }
        },

        async FETCH_RESOURCES({dispatch}, obj){
            var fetch 
            fetch = async (srcRes, search=false) => {
                let reqRes = undefined

                if(srcRes.meta == 'command'){
                    let from = srcRes.from instanceof Array ? srcRes.from : [srcRes.from]
                    let promises = from.map(r => fetch(r, true))
                    reqRes = {
                        from: await Promise.all(promises)
                    }
                }else{ // if is a regular resource
                    let slug = srcRes instanceof Object ? srcRes.slug : srcRes
                    if(slug){
                        let result = await axios.get(`http://localhost:3000/${search ? '' : 'resources'}?q=${slug.substr(1)}`)
                        reqRes = result.data[0]
                    }

                    if(((reqRes || {}).mechanics || {}).composition){ // if resource is a composition of other resources
                        let promises = reqRes.mechanics.composition.map(r => fetch(r))
                        let composition = await Promise.all(promises)
                        reqRes.mechanics.composition = composition
                    }
                }

                if(reqRes == undefined) return undefined
                else{
                    let _data = Object.assign({}, srcRes instanceof Object ? _.cloneDeep(srcRes) : {})
                    _.mergeWith(_data, reqRes, (objValue, srcValue) => {
                        if (_.isArray(objValue)) return objValue.concat(srcValue)
                    })

                    return _data
                }
            }

            let data = {}

            
            for(let source in obj){
                data[source] = {}
            
                let objeto = obj[source]
                if(obj[source] instanceof Array) objeto = {'default': objeto}
                
                for(let type in objeto){
                    data[source][type] = []
                    for(let res of objeto[type]){
                        
                        let _data = await fetch(res)
                        
                        if(_data == undefined) data[source][type].push(res)
                        else
                            data[source][type].push({
                                ..._data,
                                _source: _data._source || source,
                                _type: _data._type || type
                            })
                    }
                }
            }
            
            return data
        },
        async FETCH_FEATURES({dispatch, state, getters}){
            let subscription = state.subscriptions.features
            let custom = state.features instanceof Array ? {'custom': state.features} : state.features
            
            let obj = Object.assign({}, subscription, custom)

            try{
                let data = await dispatch('FETCH_RESOURCES', obj)
                
                let default_type = {}
                for(let source in data){
                    default_type[source] = data[source]['default']
                }

                state.async.features = default_type
                console.log('FETCH FEATURES', data)
                return true
            }catch(err){
                console.log('ERROR ON FETCH FEATURES', obj)
                console.error(err)
                return false
            }
        },
        async FETCH_PROFICIENCIES({dispatch, state, getters}){
            let subscription = state.subscriptions.proficiencies
            let custom = {'custom': state.stats.proficiencies.others}

            let obj = Object.assign({}, subscription, custom)
            
            try{
                let data = await dispatch('FETCH_RESOURCES', obj)

                let merge_sources = {}
                for(let source in data){
                    _.mergeWith(merge_sources, data[source], (objValue, srcValue) => {
                        if (_.isArray(objValue)) return objValue.concat(srcValue)
                    })
                }

                state.async.proficiencies = merge_sources
                console.log('FETCH PROFICIENCIES', state.async.proficiencies)
                return true
            }catch(err){
                console.log('ERROR ON FETCH PROFICIENCIES', obj)
                console.error(err)
                return false
            }
        },
        async FETCH_EQUIPMENT({dispatch, state, getters}){
            let obj = {'custom': state.equipment}
            
            try{
                let data = await dispatch('FETCH_RESOURCES', obj)

                let merge_sources = {}
                for(let source in data){
                    _.mergeWith(merge_sources, data[source], (objValue, srcValue) => {
                        if (_.isArray(objValue)) return objValue.concat(srcValue)
                    })
                }

                
                let treasure = (merge_sources || {treasure: []}).treasure

                let _coins = treasure.filter(t => t.parent == 'coin')
                let coins = {}
                for(let coin of _coins){
                    if(!(coin._id in coins)) coins[coin._id] = []
                    coins[coin._id].push(coin)
                }
                

                for(let slug in coins){
                    let pieces = coins[slug]
                    let piece = pieces[0]
                    for(let other_piece of pieces.splice(1)){
                        piece.mechanics.quantity += (other_piece.mechanics || {quantity: 0}).quantity
                    
                        let keys = ['_source', '_type']
                        for(let key of keys){
                            if(!_.isEqual(piece[key], other_piece[key])){
                                if(!(piece[key] instanceof Array)) piece[key] = [piece[key]]
                                piece[key] = _.concat(piece[key], other_piece[key] instanceof Array ? other_piece[key] : [other_piece[key]])
                            }
                        }
                    }
                    coins[slug] = piece
                }

                if(merge_sources.treasure){
                    merge_sources.treasure = merge_sources.treasure.filter(t => t.parent != 'coin')
                    merge_sources.treasure = Object.values(coins).concat(merge_sources.treasure)
                }
                
                state.async.equipment = merge_sources
                console.log('FETCH EQUIPMENT', state.async.equipment, 'from', state.equipment)

                dispatch('DEFRAG_DINAMIC_EQUIPMENT')

                return true
            }catch(err){
                console.log('ERROR ON FETCH EQUIPMENT', obj)
                console.error(err)
                return false
            }
        },

        // actions as mutations
        async SET_CLASS_LEVEL({ dispatch, state, getters }, value){
            state.misc.class_level = value && value.trim()
            
            await dispatch('FETCH_CLASS') && dispatch('UPDATE_ASYNC', {source: 'class'})
        },
        async SET_BACKGROUND({ dispatch, state }, value){
            state.misc.background = value && value.trim()

            await dispatch('FETCH_BACKGROUND') && dispatch('UPDATE_ASYNC', {source: 'background'})
        },
        async SET_RACE({ dispatch, state }, value){
            state.misc.race = value && value.trim()

            await dispatch('FETCH_RACE') && dispatch('UPDATE_ASYNC', {source: 'race'})
        },
        async SET_EQUIPMENT({ dispatch, state }, { value, index }){
            console.log('SET EQUIPMENT', value, index)

            if(value == undefined)
                state.equipment.items.splice(index, 1)
            else
                state.equipment.items.splice(index, 1, value)

            dispatch('DEFRAG_STATIC_EQUIPMENT')

            await dispatch('FETCH_EQUIPMENT') && dispatch('UPDATE_ASYNC', {source: 'equipment'})
        },
        async SET_COIN({ dispatch, state }, {value, key}){
            console.log('SET COIN', value, key)

            let index = state.equipment.treasure.map((v, i) => ({...v, index: i})).filter(v => v._id == 'key').index
            if(index == undefined){
                if(value !== undefined && value !== 0){
                    state.equipment.treasure.splice(state.equipment.treasure.length, 1, {
                        slug: '@coin/' + key,
                        mechanics: {
                            quantity: value
                        }
                    })

                    await dispatch('FETCH_EQUIPMENT') && dispatch('UPDATE_ASYNC', {source: 'equipment'})
                }
            }else{
                if(value == undefined) value = 0 // nao quero realmente excluir o treco

                if(value == undefined){
                    state.equipment.treasure.splice(index, 1)
                }else{
                    state.equipment.treasure[index].mechanics.quantity = value
                }
            }
        },
        async REMOVE_EQUIPMENT({ dispatch, state }, { index, parent, _id }){
            console.log('REMOVE EQUIPMENT', index, parent)

            let subtract_quantity = (item) => {  
                if('mechanics' in item){
                    if('quantity' in item.mechanics){
                        item.mechanics.quantity -= 1
                        return item.mechanics.quantity
                    }else{
                        item.mechanics.quantity = 0
                        return 0
                    }
                }else{
                    item.mechanics = {
                        quantity: 0
                    }
                    return 0
                }
            }

            if(parent == undefined){
                if(typeof state.equipment.items[index] == 'string'){
                    state.equipment.items[index] = {
                        slug: state.equipment.items[index],
                        name: state.equipment.items[index]
                    }
                    console.log('WTF, PORQUE TEM UM RES (string) AQUI???')
                }

                let quantity = subtract_quantity(state.equipment.items[index])
                if(quantity == 0) state.equipment.items.splice(index, 1)
            }else{
                
                if(typeof state.equipment.items[parent] == 'string'){
                    state.equipment.items[parent] = {
                        slug: state.equipment.items[parent],
                        mechanics: {
                            composition: [],
                            quantity: 1
                        }
                    }
                }

                if('mechanics' in state.equipment.items[parent]){
                    if('composition' in state.equipment.items[parent].mechanics){
                        if(state.equipment.items[parent].mechanics.composition[index] == undefined && !!_id){
                            state.equipment.items[parent].mechanics.composition[index] = {
                                _id,
                                mechanics: {
                                    quantity: 1
                                }
                            }
                        }else{
                            debugger
                            console.log('WTF, PORQUE TEM UM COMPOSITION SEM SLUG SENDO ATUALIZADO NUM PAI SEM COMPOSITION????')
                        }

                        let quantity = subtract_quantity(state.equipment.items[parent].mechanics.composition[index])
                        console.log('SUBTRACTED QUANTITY', state.equipment.items[parent].mechanics.composition[index], 'state.equipment.items', state.equipment.items)
                    }else{
                        debugger
                        console.log('WTF, PORQUE TEM UM COMPOSITION SENDO ATUALIZADO NUM PAI SEM COMPOSITION?????')
                    }
                }else{
                    debugger
                    console.log('WTF, PORQUE TEM UM COMPOSITION SENDO ATUALIZADO NUM PAI Q NEM TEM MECHANICS????')
                }
            }
            
            dispatch('DEFRAG_STATIC_EQUIPMENT')

            await dispatch('FETCH_EQUIPMENT') && dispatch('UPDATE_ASYNC', {source: 'equipment'})
        },
        DEFRAG_STATIC_EQUIPMENT( {state} ){
            var fn_defrag
            fn_defrag = (items) => {
                let index = {}, defrag = []
                for(let res of items){
                    let name = resources.name(res)
                    let key = res._id || res.slug || name || res
    
                    if(typeof key !== 'string'){
                        console.log('ERROR', 'Key is not a string')
                        throw new Error('Key must be a string')
                    }
    
                    if(!(key in index)) index[key] = []
                    index[key].push(res)
                }
    
                for(let key in index){
                    let list = index[key]
                    
                    let res = list[0]
                    for(let i = 1; i < list.length; i++){
                        _.mergeWith(res, list[i], (objValue, srcValue, key, _o, _s) => {
                            if (_.isArray(objValue)) return objValue.concat(srcValue)
                            if (key == 'quantity'){
                                return (_.isNumber(objValue) ? objValue : 1) + (_.isNumber(srcValue) ? 1 : srcValue)
                            }else if(key == '_source' || key == '_type'){
                                if(objValue !== srcValue && !!objValue && !!srcValue){
                                    return [objValue, srcValue]
                                }
                            }else if(key == 'mechanics'){
                                debugger
                            }
                        })
                    }

                    if(res.mechanics !== undefined){
                        if('composition' in res){
                            let defrag_composition = fn_defrag(res.mechanics.composition)
                            console.log('DEFRAGGIN STATIC COMPOSITION', defrag_composition, 'from', res.mechanics.composition)
                        }
                    }
    
                    defrag.push(res)
                }

                return defrag
            }

            let defrag = fn_defrag(state.equipment.items)


            console.log('DEFRAGGIN STATIC EQUIPMENT', defrag, 'from', state.equipment.items)

            state.equipment.items = defrag
        },
        DEFRAG_DINAMIC_EQUIPMENT( {state} ){
            var fn_defrag
            fn_defrag = (items) => {
                let index = {}, defrag = []
                for(let res of items){
                    let name = resources.name(res)
                    let key = res._id || res.slug || name || res
    
                    if(typeof key !== 'string'){
                        console.log('ERROR', 'Key is not a string')
                        throw new Error('Key must be a string')
                    }
    
                    if(!(key in index)) index[key] = []
                    index[key].push(res)
                }
    
                for(let key in index){
                    let list = index[key]
                    
                    let res = list[0]
                    for(let i = 1; i < list.length; i++){
                        _.mergeWith(res, list[i], (objValue, srcValue, key, _o, _s) => {
                            if (_.isArray(objValue)) return objValue.concat(srcValue)
                            if (key == 'quantity'){
                                return (_.isNumber(objValue) ? objValue : 1) + (_.isNumber(srcValue) ? 1 : srcValue)
                            }else if(key == '_source' || key == '_type'){
                                if(objValue !== srcValue && !!objValue && !!srcValue){
                                    return [objValue, srcValue]
                                }
                            }else if(key == 'mechanics'){
                                // debugger
                            }
                        })
                    }

                    if(res.mechanics.quantity == undefined) res.mechanics.quantity = list.length

                    if(res.mechanics !== undefined){
                        if('composition' in res.mechanics){
                            let defrag_composition = fn_defrag(res.mechanics.composition)
                            console.log('DEFRAGGIN DINAMIC COMPOSITION', defrag_composition, 'from', _.cloneDeep(res.mechanics.composition))
                            res.mechanics.composition = defrag_composition
                        }
                    }
    
                    defrag.push(res)
                }

                return defrag
            }

            let defrag = fn_defrag(state.async.equipment.items)


            console.log('DEFRAGGIN DINAMIC EQUIPMENT', defrag, 'from', state.async.equipment.items)

            state.async.equipment.items = defrag
        },
        SET_FEATURES({ dispatch, state }, { value, index }){
            console.log('SET FEATURES', value, index)

            if(value == undefined)
                state.features.splice(index, 1)
            else
                state.features.splice(index, 1, value)

            dispatch('UPDATE_ASYNC', {source: 'features'})
                .then(() => dispatch('FETCH_FEATURES'))
        },
        SET_PROFICIENCIES({ dispatch, state }, { value, index, key }){
            console.log('SET PROFS', value, index, key)

            if(value == undefined){
                state.stats.proficiencies.others[key].splice(index, 1)
            }else{
                if(!(key in state.stats.proficiencies.others)) state.stats.proficiencies.others[key] = []
                state.stats.proficiencies.others[key].splice(index, 1, value)
            }
            
            dispatch('UPDATE_ASYNC', {source: 'proficiencies'})
                .then(() => dispatch('FETCH_PROFICIENCIES'))
            
        },

        async UPDATE_SUBSCRIPTIONS({ state, getters }, { metas, source }){
            for(let meta of metas){
                let table = resources.table(meta, getters.level)

                for(let key of (meta.subscriptions || [])){
                    // state.subscriptions[key][m.meta] = m[key]
                    let obj = {}

                    obj[meta.meta] = meta.mechanics[key]

                    if(table[key]){
                        // if classe.mechanics.features is not undefined AND is array OR
                        // if classe.mechanics.features is undefined AND class.table[].features is array
                        if((obj[meta.meta] !== undefined && obj[meta.meta] instanceof Array) || (obj[meta.meta] == undefined && table[key] instanceof Array))
                            obj[meta.meta] = [...(obj[meta.meta] || []), ...(table[key] || [])] // merge arrays from mechanics and table
                        else{
                            if(obj[meta.meta] == undefined) obj[meta.meta] = {}     
                            obj[meta.meta] = _.mergeWith(obj[meta.meta], {[key]: table[key]}, (objValue, srcValue) => {
                                if (_.isArray(objValue)) return objValue.concat(srcValue)
                            }) // else just merge objects
                        }
                    }

                    _.mergeWith(state.subscriptions[key], obj, (objValue, srcValue) => {
                        if (_.isArray(objValue)) return objValue.concat(srcValue)
                    })
                }
            }

            console.log(`SUBSCRIPTIONS UPDATED (from ${source})`, state.subscriptions)
        },
        async UPDATE_INJECTIONS({ state, getters }, { metas, source }){
            for(let meta of metas){
                let table = resources.table(meta, getters.level)

                for(let key of (meta.injections || [])){
                    let obj = {}
                    let injection = []

                    obj[meta.meta] = new Date()
                    injection = meta.mechanics[key]

                    if(table[key]){
                        if((injection !== undefined && injection instanceof Array) || (injection == undefined && table[key] instanceof Array)){
                            if(injection == undefined) injection = []
                            injection = [...injection, ...(table[key] || [])]
                        }else{
                            if(injection == undefined) injection = {}     
                            injection = _.mergeWith(injection, {[key]: table[key]}, (objValue, srcValue) => {
                                if (_.isArray(objValue)) return objValue.concat(srcValue)
                            }) // else just merge objects
                        }
                    }

                    if(injection instanceof Array){
                        injection = injection.map(d => ({
                            ...d,
                            _source: source,
                            _type: 'default'
                        }))
                    }else{
                        for(let type in injection){
                            injection[type] = injection[type].map(d => {
                                if(typeof d == 'string'){
                                    let _key = 'name'
                                    if(d.charAt(0) == '@') _key = 'slug'
                                    d = {[_key]: d}
                                }
                                return {
                                    ...d,
                                    _source: source,
                                    _type: type
                                }
                            })
                        }
                    }

                    // registering the injection on sheet
                    _.mergeWith(state.injections, obj, (objValue, srcValue) => {
                        if (_.isArray(objValue)) return objValue.concat(srcValue)
                    })

                    // update relevant fields with injection data
                    let target = ({
                        equipment: 'equipment'
                    })[key]

                    let field = _.get(state, target)

                    if(field instanceof Array && injection instanceof Array){
                        field = _.concat(field, injection)
                    }else if(!(field instanceof Array) && !(injection instanceof Array)){
                        _.mergeWith(field, injection, (objValue, srcValue) => {
                            if (_.isArray(objValue)) return objValue.concat(srcValue)
                        })
                    }else{
                        console.log('ERROR: Data type inconsistency while injecting (field, injection)', field, injection)
                        throw new Error('Data type inconsistency while injecting')
                    }

                    _.set(state, target, field)
                }
            }

            console.log(`INJECTIONS UPDATED (from ${source})`, state.injections, state)
        },
        async UPDATE_ASYNC({dispatch, state}, {source}){
            let meta
            if(source == 'class'){
                meta = [state.async.class]
            }else if(source == 'features'){
                meta = [...state.async.features]
            }else if(source == 'background'){
                meta = [state.async.background]
            }else if(source == 'race'){
                meta = [state.async.race]
            }else if(source == 'equipment'){
                meta = [state.async.equipment]
            }

            if(meta == undefined) return
            
            let subscriptions = meta.reduce((arr, cur) => arr.concat(cur.subscriptions || []), [])
            let injections = meta.reduce((arr, cur) => arr.concat(cur.injections || []), [])

            if(subscriptions.length > 0) await dispatch('UPDATE_SUBSCRIPTIONS', {metas: meta.filter(m => !!m.subscriptions), source})
            if(injections.length > 0) await dispatch('UPDATE_INJECTIONS', {metas: meta.filter(m => !!m.injections), source})

            if(injections.includes('equipment')){
                dispatch('DEFRAG_EQUIPMENT')
            }

            let fetches = []
            let clusters = _.uniqBy(subscriptions.concat(injections))
            
            for(let key of clusters){
                fetches.push(dispatch('FETCH_' + key.toUpperCase()))
            }

            await Promise.all(fetches)
            dispatch('UPDATE_PROFICIENCIES', {source})
        },
        UPDATE_PROFICIENCIES({state, getters}, {source}){
            let classe = state.async.class, background = state.async.background
            if(classe){
                for(let key of ['skills', 'saves']){
                    for(let attr of ((classe.mechanics.proficiencies || {[key]: []}).key || [])){
                        state.stats.proficiencies[key][attr.replace('@', '')] = true
                    }
                }
            }else if(background){
                for(let key of ['skills', 'saves']){
                    for(let attr of ((background.mechanics.proficiencies || {[key]: []}).key || [])){
                        state.stats.proficiencies[key][attr.replace('@', '')] = true
                    }
                }
            }
        }
    }
}