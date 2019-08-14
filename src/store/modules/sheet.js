import _ from 'lodash'
import axios from 'axios'
const uuid = require('uuid/v4')

import * as dnd5e from '@/assets/rules/dnd/5e'
import resources from '@/assets/utils/resources'
import Die from '@/assets/utils/die'


function DEFRAG(_res, _static=true){
    var fn_defrag
    fn_defrag = (items) => {
        let index = {}, defrag = []
        
        for(let res of items){
            if(!res) continue
            
            let name = resources.name(res)
            let key = res._id || res.slug || name || res
            let version  = res._version // para itens vagamente modificados  / AINDA NAO APLICAR
            let parent = res._parent
            let injection = res._origin || 'custom'
            let source = res._source
            
            if(typeof parent !== 'string'){
                console.log('ERROR', 'Parent is not a string')
                throw new Error('Parent must be a string')
            }

            if(typeof key !== 'string'){
                console.log('ERROR', 'Key is not a string')
                throw new Error('Key must be a string')
            }

            // key = key + '___' + version
            if(_static) key += '___' + injection
            else if(source == 'equipment') key += '___' + parent

            if(!(key in index)) index[key] = []
            index[key].push(res)
        }
        
        for(let key_parent in index){
            let list = index[key_parent]

            let _quantity = list.length
            
            let res = list[0]
            if(typeof res == 'string'){
                res = {
                    slug: res
                }
            }

            if(res.mechanics){
                if(res.mechanics.quantity == undefined){
                    res.mechanics.quantity = 1
                }
            }else{
                res.mechanics = {
                    quantity: 1
                }
            }

            for(let _r of list.splice(1)){
                if(typeof _r == 'string'){
                    _r = {
                        slug: _r
                    }
                }

                if(_r.mechanics){
                    if(_r.mechanics.quantity == undefined){
                        _r.mechanics.quantity = 1
                    }
                }else{
                    _r.mechanics = {
                        quantity: 1
                    }
                }


                let _equipment = _.cloneDeep((_r.mechanics || {}).equipment);
                (_r.mechanics || {}).equipment = undefined;

                // if(_r.slug == '@adventuring/costume') console.log('MERGE WITH', JSON.stringify(res, null, 2), JSON.stringify(_r, null, 2))
                _.mergeWith(res, _r, (objValue, srcValue, key, _o, _s, _stack) => {
                    // if (_.isArray(objValue)) return objValue.concat(srcValue)
                    if (key == 'quantity'){
                        let valor = (_.isNumber(objValue) ? objValue : 1) + (_.isNumber(srcValue) ? srcValue : 1)
                        return valor
                    }else if(key == '_source' || key == '_type'){
                        if(objValue !== srcValue && !!objValue && !!srcValue){
                            return [objValue, srcValue]
                        }
                    }
                    // MERGE EQUIPMENT EXTERNALLY TO AVOID DEEP SUMMING OF QUANTITIES
                    // }else if(key == 'equipment'){
                    //     if(_.isArray(objValue) && _.isArray(srcValue))
                    //         return objValue.concat(srcValue)
                    // }
                })

                if(_equipment){
                    if(res.mechanics){
                        if(res.mechanics.equipment){
                            _.merge(res.mechanics.equipment, _equipment)
                        }else{
                            res.mechanics.equipment = _equipment
                        }
                    }else{
                        res.mechanics = {
                            equipment: _equipment
                        }
                    }
                }

            }

            if(typeof res != 'string'){
                if(_quantity != 1){
                    if(res.mechanics && res.mechanics.quantity == undefined){
                        res.mechanics.quantity = _quantity
                    }else if(res.mechanics == undefined){
                        res.mechanics = {
                            quantity: _quantity
                        }
                    }
                }
            }else{
                if(_quantity != 1)
                    debugger
            }
            
            defrag.push(res)
        }

        return defrag
    }
    
    
    let defrag = fn_defrag(_res)
    
    return defrag
}


function METADATA(dispatch, value, path, origin, parent, source, type='default', key='slug'){
    let d = {}
    if(typeof value == 'string'){
        d = {
            [key]: value
        }
    }else{
        d = value
    }

    let _uuid = uuid()

    if(dispatch)
        dispatch('SET_RESOURCE', {value: {
            _uuid,
            _path: path,
            _origin: origin, 
            _parent: parent,
            _source: source,
            _type: type
        }})

    return {
        ...d,
        _uuid,
        _path: path,
        _origin: origin, 
        _parent: parent,
        _source: source,
        _type: type
    }
}

export default {
    namespaced: true,
    state: {
        subscribed_at: {},
        subscriptions: {
            features: {},
            proficiencies: {},
            spells: {},
            stats: {}
        },
        injections: {},
        plugins: {},
        resources: {
            index: {},
            tree: {}
        },

        async: {
            stats: undefined,
            class: undefined,
            race: undefined,
            background: undefined,
            features: undefined,
            proficiencies: undefined,
            equipment: undefined,
            spells: undefined,
            spellcasting: undefined
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
                str: {value: undefined},
                dex: {value: undefined},
                con: {value: undefined},
                int: {value: undefined},
                wis: {value: undefined},
                cha: {value: undefined}
            },
            inspiration: false,
            hp: {
                rolls: [],
                current: undefined,
                temporary: undefined
            },
            hit_dice: undefined,
            death_saves: undefined
        },
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
                0: [],
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
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0
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
        attribute: function(state){
            return attr => {
                let attribute = state.stats.attributes[attr]
                let async = ((state.async.stats || {}).attributes || {})[attr] || {}

                if(attribute.value == undefined) return undefined
                
                return parseInt(attribute.value) + parseInt(async.add || 0)
            }
        },
        modifier: (state, getters) => {
            return attr => {
                let attribute = getters.attribute(attr)

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
                let reference = dnd5e.proficiencies.skills[slug]
                
                if (reference == undefined) return undefined

                let attribute = reference.slug
                if (reference.type == 'skill') {
                    attribute = dnd5e.skills[reference.slug].attribute
                }

                let proficient = _.get(state.proficiencies, reference.path)
                let modifier = getters.proficiency_modifier(attribute, proficient)
                if (modifier == undefined) return undefined
                return parseInt(modifier) + 10
            }
        },
        speed: (state, getters) => {
            let async = (state.async.stats || {}).speed || []

            let order = ['walk', 'flight']

            let speed = []

            for(let o of order){
                let s = async.filter(s => s.movement == o)[0]
                if(s)
                    speed.push(s)
            }

            speed = speed.concat(async.filter(s => !order.includes(s.movement)))

            return speed
        },
        maximum_hp: (state, getters) => {
            let level = getters.level
            let con = getters.modifier('con')
            let die = ((state.async.stats || {}).hp || {}).die

            if(level == undefined || con == undefined || die == undefined) return undefined

            let lvl_1 = parseInt(_.last(die.split('d')))

            let rolls_sum = state.stats.hp.rolls.reduce((s, cur) => s + cur, lvl_1)
            return rolls_sum + (con * level)
        },
        maximum_hit_dice: (state, getters) => {
            let level = getters.level
            let die = ((state.async.stats || {}).hit_dice || {}).die

            if(level == undefined || die == undefined) return undefined

            die = new Die(die, 1)
            die.quantity *= level

            return die.template
        },
        ac: (state) => {
            let ac = (state.async.stats || {}).ac

            if(ac == undefined) return 10

            let bonus = (ac.add || []).reduce((sum, cur) => sum + cur, 0)

            return ac.base + bonus
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
            let features = state.async.features
            if (classe == undefined || features == undefined) return undefined
            let spellcasting = classe.mechanics.spellcasting

            if (typeof spellcasting == 'string') {
                if(spellcasting[0] == '@'){
                    for(let key in features){
                        for(let feature of features[key]){
                            if(feature.slug == spellcasting){
                                return feature
                            }
                        }
                    }
                }else{
                    throw Error('Unimplemented')    
                }
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
            function list_to_tree(list) {
                var map = {}, node, roots = [], i;
                for (i = 0; i < list.length; i += 1) {
                    map[list[i]._id] = i; // initialize the map
                    list[i]._children = []; // initialize the children
                }
                for (i = 0; i < list.length; i += 1) {
                    node = list[i];
                    if (node._source == 'equipment') { // se o node não é raiz
                        // if you have dangling branches check that map[node.parentId] exists
                        list[map[node._parent]]._children.push(node);
                    } else {
                        roots.push(node);
                    }
                }
                return roots;
            }

            let items = _.cloneDeep((state.async.equipment || {items: []}).items || [])
            
            items = items.filter(i => {
                let quantity = (i.mechanics || {quantity: 1}).quantity
                return quantity == undefined ? true : (quantity > 0)
            })

            
            items = list_to_tree(items)
            return items
        },
        attacks_spellcasting: (state, getters) => {
            let items = (state.async.equipment || {items: []}).items || []

            let filtered_items = items.filter(i => {
                let quantity = (i.mechanics || {quantity: 1}).quantity
                let has_quantity = quantity == undefined ? true : (quantity > 0)

                let damage = (i.mechanics || {}).damage || []
                return has_quantity && damage.length > 0
            })

            return filtered_items                        
        },

        tree_features: (state) => {
            function list_to_tree(list) {
                var map = {}, node, roots = [], i;
                for (i = 0; i < list.length; i += 1) {
                    map[list[i]._id] = i; // initialize the map
                    list[i]._children = []; // initialize the children
                }
                for (i = 0; i < list.length; i += 1) {
                    node = list[i];
                    if (node._source == 'feature') { // se o node não é raiz
                        // if you have dangling branches check that map[node.parentId] exists
                        if(map[node._parent] !== undefined)
                            list[map[node._parent]]._children.push(node);
                    } else {
                        roots.push(node);
                    }
                }
                return roots;
            }

            let features = _.cloneDeep(state.async.features || {})

            let obj = {}
            if(features.feature){
                let from_features = features.feature
                for(let source in features){
                    if(source == 'feature') continue
                    if(features[source].length == 0) continue

                    let tree = list_to_tree([...features[source], ...from_features])
                    obj[source] = tree
                }
            }else{
                obj = features
            }

            // console.log('TREEFY FEATURES', obj, features)

            return obj
        }
    },
    mutations: {
        RESET: (state) => {
            state.subscriptions.features = {}
            state.subscriptions.proficiencies = {}
            state.subscriptions.spells = {}
            state.subscriptions.stats = {}

            state.injections = {}

            state.plugins = {}

            state.resources = {
                index: {},
                tree: {}
            }

            state.async.stats = undefined
            state.async.class = undefined
            state.async.race = undefined
            state.async.background = undefined
            state.async.features = undefined
            state.async.proficiencies = undefined
            state.async.equipment = undefined
            state.async.spells = undefined
            state.async.spellcasting = undefined
            
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

            state.stats.attributes.str = {value: undefined}
            state.stats.attributes.dex = {value: undefined}
            state.stats.attributes.con = {value: undefined}
            state.stats.attributes.int = {value: undefined}
            state.stats.attributes.wis = {value: undefined}
            state.stats.attributes.cha = {value: undefined}

            state.stats.inspiration = false

            state.proficiencies.saves.str = undefined
            state.proficiencies.saves.dex = undefined
            state.proficiencies.saves.con = undefined
            state.proficiencies.saves.int = undefined
            state.proficiencies.saves.wis = undefined
            state.proficiencies.saves.cha = undefined

            state.proficiencies.skills.acrobatics = undefined
            state.proficiencies.skills.animal_handling = undefined
            state.proficiencies.skills.arcana = undefined
            state.proficiencies.skills.athletics = undefined
            state.proficiencies.skills.deception = undefined
            state.proficiencies.skills.history = undefined
            state.proficiencies.skills.insight = undefined
            state.proficiencies.skills.intimidation = undefined
            state.proficiencies.skills.investigation = undefined
            state.proficiencies.skills.medicine = undefined
            state.proficiencies.skills.nature = undefined
            state.proficiencies.skills.perception = undefined
            state.proficiencies.skills.performance = undefined
            state.proficiencies.skills.persuasion = undefined
            state.proficiencies.skills.religion = undefined
            state.proficiencies.skills.sleight_of_hand = undefined
            state.proficiencies.skills.stealth = undefined
            state.proficiencies.skills.survival = undefined

            state.proficiencies.others = []

            state.stats.hp.rolls = []
            state.stats.hp.current = undefined
            state.stats.hp.temporary = undefined

            state.stats.hit_dice = undefined

            state.stats.death_saves = undefined

            for (let item of state.stats.attacks_spellcasting) {
                item.name = undefined
                item.attack_bonus = undefined
                item.damage_type = undefined
            }

            state.equipment.item = []
            state.equipment.treasure = []

            state.features = []

            state.spells.list = []
            for (let i = 0; i <= 9; i++) {
                state.spells.slots[i] = 0
                state.spells.by_level[i] = []
            }

        },
        DEFRAG_STATIC_EQUIPMENT( state ){
            let defrag = DEFRAG(state.equipment.items)
            
            console.log('DEFRAGGIN STATIC EQUIPMENT', defrag, 'from', state.equipment.items)

            state.equipment.items = defrag
        },
        DEFRAG_DINAMIC_EQUIPMENT( state ){
            let defrag = DEFRAG(state.async.equipment.items, false)
            
            console.log('DEFRAGGIN DINAMIC EQUIPMENT', defrag, 'from', state.async.equipment.items)

            state.async.equipment.items = defrag
        }
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

        async FETCH_RESOURCES({dispatch, state}, obj){
            var evaluate_active = (resource_active) => {
                let active = true
                if(resource_active){
                    if(typeof resource_active == 'boolean') active = resource_active
                    else{
                        let result = false

                        if(resource_active.condition){
                            if(resource_active.condition.equals){
                                let eq = resource_active.condition.equals

                                let data = eq[0]
                                let value = eq[1]
                                if(data.substr(0, 4) == '@me/'){
                                    data = data.substr(4)
                                    data = data.replace(/\/+/, '.')
                                }else{
                                    throw new Error('Comparassion not implemented for any other mention type (other than @me)')
                                }

                                let state_data = _.get(state, data)
                                if(state_data == undefined) state_data = undefined
                                else if(typeof state_data != 'string') state_data = state_data.value

                                result = state_data == value
                            }else{
                                throw new Error('Comparassion not implemented for conditional property')
                            }
                        }else{
                            throw new Error('Directive not implemented')
                        }

                        active = result
                    }
                }

                return active
            }

            var fetch 
            fetch = async (srcRes, _index, search=false) => {
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
                }

                if(reqRes == undefined) return undefined
                else{
                    let _data = srcRes instanceof Object ? _.cloneDeep(srcRes) : {}
                    
                    _.mergeWith(_data, reqRes, (objValue, srcValue, key) => {
                        // if (_.isArray(srcValue)) return srcValue.concat(objValue)
                        if(key == 'quantity'){
                            if(_.isNumber(objValue) && _.isNumber(srcValue)){
                                return objValue + srcValue
                            }
                        }else if(key == 'equipment'){
                            if(_.isArray(objValue) && _.isArray(srcValue))
                                return srcValue.concat(objValue)
                        }
                    })

                    if(_data.mechanics){
                        _data.mechanics.active = _data.mechanics.active == undefined ? true : evaluate_active(_data.mechanics.active)
                    }

                    return _data
                }
            }

            let data = {}
            
            for(let source in obj){
                data[source] = {}
            
                let objeto = obj[source]
                if(obj[source] instanceof Array) objeto = {'default': objeto}
                else if(obj[source].slug !== undefined) objeto = {'default': objeto}

                for(let type in objeto){
                    data[source][type] = []
                    
                    let _index = 0
                    
                    if(!_.isArray(objeto[type])) objeto[type] = [objeto[type]]

                    for(let res of objeto[type]){
                        
                        let _data = await fetch(res)
                        
                        if(_data == undefined) {
                            if(typeof res == 'string'){
                                if(res[0] == '@') 
                                    res = {
                                        slug: res,
                                        _index
                                    }
                                else
                                    res = {
                                        name: res,
                                        _index
                                    }
                            }

                            data[source][type].push(res)
                        }else{
                            data[source][type].push({
                                ..._data,
                                _index,
                                _source: _data._source || source,
                                _type: _data._type || type
                            })
                        }

                        _index++
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
            let custom = {'custom': state.proficiencies.others}

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
        async FETCH_EQUIPMENT({dispatch, state, commit}){
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

                commit('DEFRAG_DINAMIC_EQUIPMENT')

                return true
            }catch(err){
                console.log('ERROR ON FETCH EQUIPMENT', obj)
                console.error(err)
                return false
            }
        },
        async FETCH_STATS( {dispatch, state} ){
            let subs = state.subscriptions.stats

            let stats = {}
            for(let key in subs){
                _.mergeWith(stats, subs[key], (objValue, srcValue) => {
                    if (_.isArray(objValue)) return objValue.concat(srcValue)
                })
            }

            for(let attr in stats.attributes){
                if(stats.attributes[attr].add){
                    stats.attributes[attr].add = stats.attributes[attr].add.reduce((sum, cur) => sum + cur, 0)
                }
            }

            console.log('FETCH STATS', stats)

            state.async.stats = stats
        },
        async FETCH_SPELLS({dispatch, state, getters}){
            console.trace('FETCH SPELLS')
            let subscription = state.subscriptions.spells
            let custom = state.spells.by_level

            let obj = Object.assign({}, subscription)
            _.mergeWith(obj, custom, (obj, src) => {
                if(_.isArray(src)){
                    return [...(obj || []), ...src]
                }
            })

            try{
                let data = await dispatch('FETCH_RESOURCES', obj)

                for(let level in data){
                    data[level] = data[level].default
                }

                state.async.spells = data
                console.log('FETCH SPELLS', state.async.spells)
                return true
            }catch(err){
                console.log('ERROR ON FETCH SPELLS', obj)
                console.error(err)
                return false
            }
        },

        // actions as mutations
        SET_RESOURCE({dispatch, state, getters}, {value}){
            state.resources.index[value._uuid] = value
            
            if(!(value._origin in state.resources.tree)) state.resources.tree[value._origin] = []
            if(!state.resources.tree[value._origin].includes(value._uuid))
                state.resources.tree[value._origin].push(value._uuid)

            console.log('SET RESOURCE', state.resources.tree, state.resources.index)
        },
        REMOVE_RESOURCE({dispatch, state, getters}, {resource}){
            console.log('REMOVE RESOURCE', resource)

            function children(root){
                let _children = state.resources.tree[root]
                
                if(_children == undefined){
                    return []
                }

                let _grandchildren = _children.map(c => children(c)).reduce((arr, cur) => [...arr, ...cur], [])

                return [..._children, ..._grandchildren]
            }

            let stack = [resource._uuid, ...children(resource._uuid)]
            let paths = stack.map(r => _.toPath(state.resources.index[r]._path))

            for(let y = stack.length-1; y >= 0; y--){
                let ref = state
                let path = paths[y]
                let uuid = stack[y]

                let i
                for(i = 0; i < path.length-1; i++){
                    ref = ref[path[i]]
                }
                
                delete ref[path[i]]
                delete state.resources.index[uuid]
                if(uuid in state.resources.tree)
                    delete state.resources.tree[uuid]
            }

            // REFACTOR ARRAYS (remove empty slots and reorganize outdated paths)
            let fromPath = (arr) => {
                return arr.map(a => {
                    if(!_.isNaN(parseInt(a))){
                        return `[${a}]`
                    }
                    return `.${a}`
                }).join('').substr(1)
            }

            // console.log('REMOVED PATHS', JSON.stringify(paths, null, 2))
            for(let path of paths){
                let p = path.pop()
                while(p){
                    if(!_.isNaN(parseInt(p))){ // se é um numero
                        let array = _.get(state, path)
                        for(let i = array.length-1; i >= 0; i--){
                            if(array[i] == undefined)
                                array.splice(i, 1)
                        }

                        for(let i = 0; i < array.length; i++){
                            let item = array[i]
                            let old_path = item._path

                            item._path = fromPath([...path, i])
                            state.resources.index[item._uuid]._path = item._path

                            console.log('REFACTOR PATH', `${old_path} -> ${item._path}`)
                        }

                    }

                    p = path.pop()
                }
            }

            // RE-FETCH what was subscribed by the gone ones
            let fetches = []
            let sub_at = stack.map(r => state.subscribed_at[r]).filter(s => s !== undefined)
            let clusters = _.uniqBy(sub_at.map(r => r.meta).reduce((arr, cur) => [...arr, ...cur], []))
            
            for(let key of clusters){
                fetches.push(dispatch('FETCH_' + key.toUpperCase()))
            }
            Promise.all(fetches)

            for(let r of stack){
                delete state.subscribed_at[r]
            }

            // console.log('STATE', state)
        },
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
        async SET_EQUIPMENT({ dispatch, state, commit }, { value, index }){
            console.log('SET EQUIPMENT', value, index)


            if(value == undefined)
                state.equipment.items.splice(index, 1)
            else{
                if(index == undefined) index = state.equipment.items.length
                value = METADATA(dispatch, value, `equipment.items[${index}]`, 'input', 'sheet', 'custom', 'items')
                
                state.equipment.items.splice(index, 1, value)
            }

            commit('DEFRAG_STATIC_EQUIPMENT')

            await dispatch('FETCH_EQUIPMENT') && dispatch('UPDATE_ASYNC', {source: 'equipment'})
        },
        async SET_COIN({ dispatch, state, commit }, {value, key}){
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

                    commit('DEFRAG_STATIC_EQUIPMENT')

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
        async REMOVE_EQUIPMENT({ dispatch, state, commit }, { index, _id, _parent}){
            console.log('REMOVE EQUIPMENT', index, _id, _parent)

            let defrag_needed = false, fetch_needed = true

            var subtract
            subtract = function(i){
                // lidar com remover o _parent de um item
                // se bem que tambem falta terminar o rewind (quando trocar um recurso tipo classe ou background tem que remover os recursos subscritos)
                var remove
                remove = function(_i){
                    dispatch('REMOVE_RESOURCE', {resource: state.equipment.items[_i]})
                }

                if(state.equipment.items[i].mechanics){
                    if(state.equipment.items[i].mechanics.quantity !== undefined){
                        state.equipment.items[i].mechanics.quantity--

                        if(state.equipment.items[i].mechanics.quantity == 0){
                            remove(i)
                        }
                    }else{
                        remove(i)
                    }
                }else{
                    remove(i)
                }
            }

            subtract(index)

        
            if(defrag_needed){
                commit('DEFRAG_STATIC_EQUIPMENT')
            }

            if(fetch_needed){
                await dispatch('FETCH_EQUIPMENT') && dispatch('UPDATE_ASYNC', {source: 'equipment'})
            }else{
                dispatch('UPDATE_ASYNC', {source: 'equipment'})
            }
        },
        async SET_FEATURES({ dispatch, state }, { value, index }){
            console.log('SET FEATURES', value, index)

            if(value == undefined){
                dispatch('REMOVE_RESOURCE', {resource: state.features[index]})
            }else{
                value = METADATA(dispatch, value, `features[${index}]`, 'input', 'sheet', 'custom')

                state.features.splice(index, 1, value)
            }

            await dispatch('FETCH_FEATURES') && dispatch('UPDATE_ASYNC', {source: 'features'})
        },
        async SET_PROFICIENCIES({ dispatch, state }, { value, index, key }){
            console.log('SET PROFS', value, index, key)

            if(value == undefined){
                dispatch('REMOVE_RESOURCE', {resource: state.proficiencies.others[key][index]})
            }else{
                if(!(key in state.proficiencies.others)) state.proficiencies.others[key] = []

                value = METADATA(dispatch, value, `proficiencies.others.${key}[${index}]`, 'input', key, 'custom')

                state.proficiencies.others[key].splice(index, 1, value)
            }
            
            await dispatch('FETCH_PROFICIENCIES') && dispatch('UPDATE_ASYNC', {source: 'proficiencies'})            
        },
        async SET_SPELLS({ dispatch, state }, {value, index, level}){            
            console.log('SET SPELLS', value, index, level)    
            
            if(value == undefined){
                dispatch('REMOVE_RESOURCE', {resource: state.spells.by_level[level][index]})
            }else{
                value = METADATA(dispatch, value, `state.spells.by_level[${level}][${index}]`, 'input', level, 'custom')

                state.spells.by_level[level].splice(index, 1, value)
            }
            
            await dispatch('FETCH_SPELLS') && dispatch('UPDATE_ASYNC', {source: 'spells'})    
        },

        async UPDATE_SUBSCRIPTIONS({ dispatch, state, getters }, { metas, source }){
            
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
                    
                    let origin = meta._uuid || meta.meta
                    if(_.isString(obj[meta.meta])){                        
                        let d = obj[meta.meta]

                        if(typeof d == 'string'){
                            let _key = 'value'
                            if(d.charAt(0) == '@') _key = 'slug'
                            d = {[_key]: d}
                        }

                        obj[meta.meta] = METADATA(dispatch, d, `subscriptions.${key}.${meta.meta}`, origin, meta._id, meta.meta)
                    }else if(obj[meta.meta] instanceof Array){
                        obj[meta.meta] = obj[meta.meta].map((d, index) => {
                            if(typeof d == 'string'){
                                let _key = 'name'
                                if(d.charAt(0) == '@') _key = 'slug'
                                d = {
                                    [_key]: d
                                }
                            }
                            
                            return METADATA(dispatch, d, `subscriptions.${key}.${meta.meta}[${index}]`, origin, meta._id, meta.meta)
                        })
                    }else{
                        for(let type in obj[meta.meta]){
                            if(_.isArray(obj[meta.meta][type])){
                                obj[meta.meta][type] = obj[meta.meta][type].map((d, index) => {
                                    if(typeof d == 'string'){
                                        let _key = 'name'
                                        if(d.charAt(0) == '@') _key = 'slug'
                                        d = {[_key]: d}
                                    }

                                    return METADATA(dispatch, d, `subscriptions.${key}.${meta.meta}.${type}[${index}]`, origin, meta._id, meta.meta, type)
                                })
                            }else{
                                let d = obj[meta.meta][type]

                                if(typeof d == 'string'){
                                    let _key = 'value'
                                    if(d.charAt(0) == '@') _key = 'slug'
                                    d = {[_key]: d}
                                }

                                obj[meta.meta][type] = METADATA(dispatch, d, `subscriptions.${key}.${meta.meta}.${type}`, origin, meta._id, meta.meta, type)
                            }
                        }
                    }

                    if(!(origin in state.subscribed_at)) state.subscribed_at[origin] = {meta: []}
                    state.subscribed_at[origin].date = new Date()
                    state.subscribed_at[origin].meta.push(key)

                    _.mergeWith(state.subscriptions[key], obj, (objValue, srcValue) => {
                        if (_.isArray(objValue)) return objValue.concat(srcValue)
                    })
                }
            }

            console.log(`SUBSCRIPTIONS UPDATED (from ${source})`, state.subscriptions, state)
        },
        async UPDATE_INJECTIONS({ dispatch, state, getters }, { metas, source }){
            for(let meta of metas){
                let table = resources.table(meta, getters.level)

                for(let key of (meta.injections || [])){
                    
                    let obj = {
                        resource: meta._uuid || meta.meta,
                        meta: meta.meta,
                        timestamp: new Date(),
                        parent: meta._origin
                    }
                    let injection = []

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
                        injection = injection.map((d, index) => {
                            if(typeof d == 'string'){
                                let _key = 'name'
                                if(d.charAt(0) == '@') _key = 'slug'
                                d = {
                                    [_key]: d
                                }
                            }

                            return METADATA(dispatch, d, `${key}[${index}]`, obj.resource, meta._id, meta.meta)
                        })
                    }else{
                        for(let type in injection){
                            if(_.isArray(injection[type])){
                                injection[type] = injection[type].map((d, index) => {
                                    if(typeof d == 'string'){
                                        let _key = 'name'
                                        if(d.charAt(0) == '@') _key = 'slug'
                                        d = {[_key]: d}
                                    }

                                    return METADATA(dispatch, d, `${key}.${type}[${index}]`, obj.resource, meta._id, meta.meta, type)
                                })
                            }else{
                                let d = injection[type]

                                if(typeof d == 'string'){
                                    let _key = 'value'
                                    if(d.charAt(0) == '@') _key = 'slug'
                                    d = {[_key]: d}
                                }

                                injection[type] =  METADATA(dispatch, d, `${key}.${type}`, obj.resource, meta._id, meta.meta, type)
                            }
                        }
                    }

                    // registering the injection on sheet
                    state.injections[obj.resource] = obj
                    
                    // update relevant fields with injection data
                    let target = ({
                        equipment: 'equipment',
                        stats: 'stats'
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
        UPDATE_PLUGINS({dispatch, state, getters}, {metas, source}){
            for(let meta of metas){
                for(let plugin of meta.mechanics.plugins){
                    if(plugin.name in state.plugins) continue

                    state.plugins[plugin.name] = METADATA(dispatch, plugin, `plugins.${plugin.name}`, meta._uuid || meta.meta, meta._id, meta.meta)
                }
            }

            console.log(`PLUGINS UPDATED (from ${source})`, state.plugins, state)
        },
        async UPDATE_ASYNC({dispatch, state, commit}, {source}){
            let meta = []
            if(!_.isArray(source)) source = [source]

            if(source.includes('class')){
                meta = meta.concat([state.async.class])
            }
            if(source.includes('features')){
                let list = state.async.features

                let _meta = []
                for(let k in list){
                    _meta = _meta.concat(list[k].map(r => ({
                        ...r,
                        _type: k
                    })))
                }
                meta = meta.concat(_meta)
            }
            if(source.includes('background')){
                meta = meta.concat([state.async.background])
            }
            if(source.includes('race')){
                meta = meta.concat([state.async.race])
            }
            if(source.includes('equipment')){
                let list = state.async.equipment

                let _meta = []
                for(let k in list){
                    _meta = _meta.concat(list[k].map(r => ({
                        ...r,
                        _type: k
                    })))
                }
                meta = meta.concat(_meta)
            }

            if(meta.length == 0) return

            let subscriptions = meta.reduce((arr, cur) => arr.concat(cur.subscriptions || []), [])
            let injections = meta.reduce((arr, cur) => arr.concat(cur.injections || []), [])
            let plugins = meta.reduce((bool, cur) => bool || !!cur.plugins, false)
            
            let fetch = false
            
            if(injections.length > 0) {
                let _m = meta.filter(m => {
                    let origin = m._uuid || m.meta

                    let active = (m.mechanics || {active: true}).active
                    if(active === undefined) active = true
                    
                    let should_inject = !(origin in state.injections)
                    let has_injections = !!m.injections
                    
                    return active && has_injections && should_inject
                })

                if(_m.length > 0){
                    await dispatch('UPDATE_INJECTIONS', {metas: _m, source})
                    fetch = true
                }
            }
            if(subscriptions.length > 0) {
                let _m = meta.filter(m => {
                    let origin = m._uuid || m.meta
                    let subscribed_at = state.subscribed_at[origin]

                    let active = (m.mechanics || {active: true}).active
                    if(active === undefined) active = true
                    
                    let should_update = (subscribed_at ? subscribed_at.date < new Date(m._modified_at) : true)
                    let has_subscriptions = !!m.subscriptions

                    return active && has_subscriptions && should_update
                })
                
                if(_m.length > 0) {
                    await dispatch('UPDATE_SUBSCRIPTIONS', {metas: _m, source})
                    fetch = true
                }
            }
            if(plugins){
                let _m = meta.filter(m => {

                    let has_plugins = !!m.plugins
                    let should_update = has_plugins && (m.plugins.filter(p => !(p in state.plugins))).length > 0

                    return has_plugins && should_update
                })

                if(_m.length > 0){
                    dispatch('UPDATE_PLUGINS', {metas: _m, source})
                }
            }

            if(!fetch) return

            if(injections.includes('equipment')){
                commit('DEFRAG_STATIC_EQUIPMENT')
            }

            let fetches = []
            let clusters = _.uniqBy(subscriptions.concat(injections))
            
            for(let key of clusters){
                fetches.push(dispatch('FETCH_' + key.toUpperCase()))
            }

            await Promise.all(fetches)
            
            dispatch('UPDATE_ASYNC', {source: clusters})
            dispatch('UPDATE_PROFICIENCIES', {source})
        },
        UPDATE_PROFICIENCIES({state, getters}, {source}){
            let classe = state.async.class, background = state.async.background
            if(classe){
                for(let key of ['skills', 'saves']){
                    let _profs = ((classe.mechanics.proficiencies || {[key]: []})[key] || [])
                    for(let attr of _profs){
                        if(attr.meta == 'command') continue

                        state.proficiencies[key][(attr.slug || attr).replace('@', '')] = true
                    }
                }
            }else if(background){
                for(let key of ['skills', 'saves']){
                    let _profs = ((background.mechanics.proficiencies || {[key]: []})[key] || [])
                    for(let attr of _profs){
                        if(attr.meta == 'command') continue
                        state.proficiencies[key][(attr.slug || attr).replace('@', '')] = true
                    }
                }
            }
        }
    }
}