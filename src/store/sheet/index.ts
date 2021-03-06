import Vue from 'vue'

// @ts-ignore
import uuid from 'uuid/v4'

import { RootState } from '../types'
import { SheetState, Sheet, Resource, AsyncResource } from './types'

import { Module } from 'vuex';

import {notify, watch, Bus} from '@/bus'
import { Mention as MentionService, Resource as ResourceService, Mention } from '@/services'
// @ts-ignore
import Resources from '@/utils/resources'

import _ from 'lodash';
// @ts-ignore
import pathToString from 'deepdash-es/pathToString'

import axios from 'axios'


import { Styles } from '@/console'
import Die from '@/utils/die';

function m(_uuid: string) {
    return _uuid.substr(0, 8) + '...' + _uuid.substr(_uuid.length - 5)
}

function delay(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}


export const empty: SheetState = {
    static: {
        name: undefined,
        misc: {
            class: undefined, // ASYNC
            level: undefined,
            background: undefined, // ASYNC
            player: undefined,
            race: undefined, // ASYNC
            alignment: undefined,
            experience_points: [],
            age: undefined,
            height: undefined,
            weight: undefined,
            eye_color: undefined,
            hair_color: undefined,
            skin_color: undefined,
            inspiration: false
        },
        attributes: {
            ability_scores: {},
            hp: {
                rolls: [],
                current: undefined,
                temporary: 0
            },
            hit_dice: undefined,
            exaustion: 0,
            death_saves: {
                successes: [],
                failures: []
            },
            spell_slots: {}
        },
        stats: {
            _: {}
        },
        proficiencies: [],
        equipment: [],
        features: [],
        spells: [],
        _block: { // stuff blocket until next rest
            unknown: [],
            short: [],
            long: []
        },
        _index: {
            subscriptions: {},
            injections: {},
            answers: {}
        }
    },
    async: {
        name: undefined,
        misc: {
            class: undefined, // ASYNC
            level: undefined,
            background: undefined, // ASYNC
            race: undefined, // ASYNC
            alignment: undefined,
            experience_points: [],
            age: undefined,
            height: undefined,
            weight: undefined,
            eye_color: undefined,
            hair_color: undefined,
            skin_color: undefined,
            inspiration: false
        },
        attributes: {
            ability_scores: {},
            hp: {
                rolls: [],
                current: undefined,
                temporary: 0
            },
            hit_dice: undefined,
            exaustion: 0,
            death_saves: {
                successes: [],
                failures: []
            },
            spell_slots: {}
        },
        stats: {},
        proficiencies: [],
        equipment: [],
        features: [],
        spells: [],
        _block: { // stuff blocket until next rest
            unknown: [],
            short: [],
            long: []
        },
        _index: {}
    },
    virtual: {
        name: undefined,
        misc: {
            class: undefined, // ASYNC
            level: undefined,
            background: undefined, // ASYNC
            race: undefined, // ASYNC
            alignment: undefined,
            experience_points: [],
            age: undefined,
            height: undefined,
            weight: undefined,
            eye_color: undefined,
            hair_color: undefined,
            skin_color: undefined,
            inspiration: false
        },
        attributes: {
            ability_scores: {},
            hp: {
                rolls: [],
                current: undefined,
                temporary: 0
            },
            hit_dice: undefined,
            exaustion: 0,
            death_saves: {
                successes: [],
                failures: []
            },
            spell_slots: {}
        },
        stats: {},
        proficiencies: [],
        equipment: [],
        features: [],
        spells: [],
        _block: { // stuff blocket until next rest
            unknown: [],
            short: [],
            long: []
        },
        _index: {}
    },
    plugins: [],
    _stack: [],
    _target: null,
    _pooling: false,
    _fetching: [],
    _nest: {
        _stack: [],
        _nesting: false
    },
    _removing: false,
    _injected: [],
    _index: {
        static: {},
        async: {},
        virtual: {
            _remove: [],
            _update: []
        },
        commands: {},
        defrag: {
            pre_stack: {},
            pos_fetch: {},
            virtual: {}
        }
    },
    _tree: {},
    _ui: {
        fetch: {
            working: false
        }
    },
    _observer: {}
}

export const sheet: Module<SheetState, RootState> = {
    namespaced: true,
    state: empty,
    getters: {
        class_level: (state) => {
            const _class = state.static.misc.class
            const level = state.static.misc.level
            if (_class === undefined && level === undefined) return undefined
            return `${_class} ${level}`
        },
        level: (state) => {
            const level = state.static.misc.level
            if (level === undefined) return undefined

            // @ts-ignore
            return parseInt(level, 10)
        },
        experience_points: (state) => {
            const xp = state.static.misc.experience_points
            return xp.reduce((sum, cur) => sum + cur.points, 0)
        },
        ability_scores: (state) => (attr: string) => {
            const character = state.static.attributes.ability_scores[attr]

            // SEMPRE QUE HOUVER ALGO NOVO ADICIONDADO NA INTERFACE DE UMA ABILITY_SCORE, ADICIONAR O COMPORTAMENTO DE MESCLA AQUI
            let bonus = (state.static.stats.ability_scores || []).filter((a: any) => a.attr === attr)
            bonus = bonus.reduce((final: any, cur: any) => ({
                add: parseInt(final.add || '0', 10) + parseInt(cur.add, 10)
            }), {
                add: undefined
            })

            return {
                ...bonus,
                value: character
            }
        },
        modifier: (state, getters) => (attr: string) => {
            const ability = getters.ability_scores(attr)
            if (!ability || ability.value === undefined) return undefined

            const mod = Math.floor(((ability.value + (ability.add || 0)) - 10) / 2)

            return mod >= 0 ? '+' + mod : mod
        },
        proficiency_bonus: (state, getters) => {
            const level = getters.level

            if (level === undefined || _.isNaN(level)) return undefined

            const bonus = [
                1, // 0
                2, 2, 2, 2, // 1-4
                3, 3, 3, 3, // 5-8
                4, 4, 4, 4, // 9-12
                5, 5, 5, 5, // 13-16
                6, 6, 6, 6 // 17-20
              ][level]

            return '+' + bonus
        },
        proficiency_modifier: (state, getters) => (attr: string, proficient: boolean) => {
            let mod = getters.modifier(attr.replace('@', ''))
            if (mod === undefined) return undefined

            const proficiency_bonus = getters.proficiency_bonus
            if (proficiency_bonus === undefined) return undefined


            mod = parseInt(mod, 10) + (proficient ? parseInt(proficiency_bonus, 10) : 0)

            return mod >= 0 ? '+' + mod : mod
        },
        proficient_save: (state, getters) => (attr: string) => {
            const statics = state.static.proficiencies.filter((r) => r._type === 'saves' && ['@' + attr, attr].includes(r.slug))

            if (statics[0] === undefined) {
                let profs = state.virtual.proficiencies
                profs = profs.filter((r) => r._type === 'saves' && ['@' + attr, attr].includes(r.slug))
                return profs[0]
            }

            return statics[0]
        },
        proficient_skill: (state, getters) => (skill: string) => {
            const statics = state.static.proficiencies.filter((r) => r._type === 'skills' && (r._id === skill || ['@' + skill, skill].includes(r.slug)))

            if (statics[0] === undefined) {
                let profs = state.virtual.proficiencies
                profs = profs.filter((r) => r._type === 'skills' && (r._id === skill || ['@' + skill, skill].includes(r.slug)))
                return profs[0]
            }

            return statics[0]
        },
        passive_proficiency: (state, getters) => (slug: string) => {
            let skill: any = state.virtual.proficiencies
            skill = skill.filter((r: any) => r._type === 'skills' && (r._id === slug || ['@' + slug, slug].includes(r.slug)))
            skill = skill[0]

            // TODO: maybe download previously all abilities and skills as reference
            if (skill === undefined) return undefined

            const proficient = !!getters.proficient_skill(slug)
            const modifier = getters.proficiency_modifier(skill.mechanics.ability, proficient)
            if (modifier === undefined) return undefined
            return parseInt(modifier, 10) + 10
        },
        speed: (state, getters) => {
            const virtual = state.static.stats.speed

            if (virtual === undefined) return []

            const order = ['walk', 'flight']

            const source = _.isArray(virtual) ? [...virtual] : [virtual]
            const speed = []

            for (const o of order) {
                const unit = source.filter((s: any) => s.movement === o)[0]
                if (unit) speed.push(unit)
            }

            return speed.concat(source.filter((s: any) => !order.includes(s.movement)))
                .map((unit) => ({
                    ...unit,
                    speed: _.isArray(unit.speed) ? unit.speed.join('') : unit.speed
                }))
        },
        maximum_hp: (state, getters) => {
            const level = getters.level

            const CON = getters.modifier('con')
            const die = state.static.stats.hit_die

            if (level === undefined || CON === undefined || die === undefined) return undefined

            const l1 = parseInt(_.last(die.split('d')) as string, 10)

            const hp = state.static.attributes.hp.rolls.reduce((sum, cur) => sum + cur, l1)
            return hp + (CON * level)
        },
        maximum_hit_dice: (state, getters) => {
            const level = getters.level
            let die = state.static.stats.hit_die

            if (level === undefined || die === undefined) return undefined

            die = new Die(die, {quantity: 1})
            die.quantity *= level

            return die.template
        },
        hit_dice: (state, getters) => {
            const dice = state.static.attributes.hit_dice
            let die = state.static.stats.hit_die

            if (dice === undefined || die === undefined) return undefined

            die = new Die(die)
            die.quantity = dice

            return die.template
        },
        ac: (state) => {
            const AC = state.static.stats.ac

            if (AC === undefined) return 10

            const bonus = (AC.add || []).reduce((sum: number, cur: number) => sum + cur, 0)

            return (AC.base || 10) + bonus
        },
        attacks_spellcasting: (state, getters) => {
            const items = state.async.equipment

            const filtered_items = items.filter((i) => {
                const quantity = (i.mechanics || {quantity: 1}).quantity
                const has_quantity = quantity === undefined ? true : (quantity > 0)

                const damage = (i.mechanics || {}).damage || []
                return has_quantity && damage.length > 0
            })

            return filtered_items
        },
        coins: (state, getters) => {
            const treasure =  state.virtual.equipment.filter((res) => res._type === 'treasure')

            let coins: any[] = treasure.filter((t) => t.parent === 'coin')
            coins = coins.reduce((obj, cur) => _.merge(obj, {[cur._id]: cur.mechanics.quantity}), {})

            // @ts-ignore
            const _coins = getters.cambio.reduce((obj, cur) => _.merge(obj, {[cur.slug]: 0}), {})
            _.merge(_coins, coins)

            return _coins
        },
        items_with_quantity: (state) => {
            function list_to_tree(list: any[]) {
                const uuids: string[] = list.map((res: Resource) => res._uuid)
                const map: any = {}
                let node
                const roots = []
                let i;

                for (i = 0; i < list.length; i += 1) {
                    map[list[i]._id] = i; // initialize the map
                    list[i]._children = []; // initialize the children
                }
                for (i = 0; i < list.length; i += 1) {
                    node = list[i];
                    if (uuids.includes(node._origin)) { // se o node não é raiz
                        // if you have dangling branches check that map[node.parentId] exists
                        list[map[node._parent]]._children.push(node);
                    } else {
                        roots.push(node);
                    }
                }
                return roots;
            }

            let items = state.virtual.equipment.filter((res) => res._type === 'items')

            items = items.filter((i) => {
                const quantity = (i.mechanics || {quantity: 1}).quantity
                return quantity === undefined ? true : (quantity > 0)
            })

            items = list_to_tree(items)
            return items
        },
        tree_features: (state) => {
            function list_to_tree(list: any[]) {
                const uuids: string[] = list.map((res) => res._uuid)
                const map: any = {}
                let node
                const roots = []
                let i;

                for (i = 0; i < list.length; i += 1) {
                    map[list[i]._id] = i; // initialize the map
                    list[i]._children = []; // initialize the children
                }
                for (i = 0; i < list.length; i += 1) {
                    node = list[i];
                    // console.log('%c NODE ', Styles.AMBAR, list, i, node, uuids)
                    if (uuids.includes(node._origin)) { // se o node não é raiz
                        // if you have dangling branches check that map[node.parentId] exists
                        if (map[node._parent] !== undefined)
                            list[map[node._parent]]._children.push(node);
                    } else {
                        roots.push(node);
                    }
                }
                return roots;
            }

            const features: Resource[] = state.virtual.features
            if (features.length === 0) return {}

            // console.log('%c TREE FEATURES RUNNING ', Styles.RED, features)
            const tree = list_to_tree([...features])

            const ref: any = {}
            for (const feature of tree) {
                if (!(feature._type in ref)) ref[feature._type] = []
                ref[feature._type].push(feature)
            }

            return ref
        },
        spellcasting: (state, getters) => {
            const classe: Resource = (state.virtual.misc.class as unknown) as Resource
            const features = state.virtual.features

            if (classe === undefined || features === undefined) return undefined
            const spellcasting = classe.mechanics.spellcasting

            if (typeof spellcasting === 'string') {
                if (spellcasting[0] === '@') {
                    for (const feature of features) {
                        if (feature.slug === spellcasting) {
                            return feature
                        }
                    }
                } else {
                    throw Error('Unimplemented')
                }
            } else if (typeof spellcasting === 'object') {
                throw Error('Unimplemented')
            }

            return undefined
        },

        abilities: () => {
            const data: Array<{
                name: string
                slug: string
            }> = [
                {
                    name: 'Strength',
                    slug: 'str'
                },
                {
                    name: 'Dexterity',
                    slug: 'dex'
                },
                {
                    name: 'Constitution',
                    slug: 'con'
                },
                {
                    name: 'Intelligence',
                    slug: 'int'
                },
                {
                    name: 'Wisdom',
                    slug: 'wis'
                },
                {
                    name: 'Charisma',
                    slug: 'cha'
                }
            ]

            return data
        },
        skills: () => {
            return [
                {
                    name: 'Acrobatics',
                    ability: 'dex',
                    slug: 'acrobatics'
                },
                {
                    name: 'Animal Handling',
                    ability: 'wis',
                    slug: 'animal_handling'
                },
                {
                    name: 'Arcana',
                    ability: 'int',
                    slug: 'arcana'
                },
                {
                    name: 'Athletics',
                    ability: 'str',
                    slug: 'athletics'
                },
                {
                    name: 'Deception',
                    ability: 'cha',
                    slug: 'deception'
                },
                {
                    name: 'History',
                    ability: 'int',
                    slug: 'history'
                },
                {
                    name: 'Insight',
                    ability: 'wis',
                    slug: 'insight'
                },
                {
                    name: 'Intimidation',
                    ability: 'cha',
                    slug: 'intimidation'
                },
                {
                    name: 'Investigation',
                    ability: 'int',
                    slug: 'investigation'
                },
                {
                    name: 'Medicine',
                    ability: 'wis',
                    slug: 'medicine'
                },
                {
                    name: 'Nature',
                    ability: 'int',
                    slug: 'nature'
                },
                {
                    name: 'Perception',
                    ability: 'wis',
                    slug: 'perception'
                },
                {
                    name: 'Performance',
                    ability: 'cha',
                    slug: 'performance'
                },
                {
                    name: 'Persuasion',
                    ability: 'cha',
                    slug: 'persuasion'
                },
                {
                    name: 'Religion',
                    ability: 'int',
                    slug: 'religion'
                },
                {
                    name: 'Sleight of Hand',
                    ability: 'dex',
                    slug: 'sleight_of_hand'
                },
                {
                    name: 'Stealth',
                    ability: 'dex',
                    slug: 'stealth'
                },
                {
                    name: 'Survival',
                    ability: 'wis',
                    slug: 'survival'
                }
            ]
        },
        cambio: () => [
            {
                name: 'Copper Piece',
                slug: 'cp',
                base_value: 10 ** -3
            }, {
                name: 'Silver Piece',
                slug: 'sp',
                base_value: 10 ** -2
            }, {
                name: 'Electrum Piece',
                slug: 'ep',
                base_value: 10 ** -1
            }, {
                name: 'Gold Piece',
                slug: 'gp',
                base_value: 10 ** 0
            }, {
                name: 'Platinum Piece',
                slug: 'pp',
                base_value: 10 ** 1
            }
        ]
    },
    mutations: {
        SET_CLASS_LEVEL: (state, value) => {
            value = value.trim()
            let level = value.match(/\d+/gi)[0]
            level = !level && level !== 0 ? undefined : parseInt(level, 10)

            const classe = value.replace(level, '').trim()

            state.static.misc.class = classe
            state.static.misc.level = level
        },
        SET_ABILITY_SCORE: (state, { value, attr }) => {
            const intValue = parseInt(value, 10)

            if (_.isNaN(intValue)) throw new Error('Trying to insert non-numeric value on attributes.ability_score')
            Vue.set(state.static.attributes.ability_scores, attr, intValue)
        }
    },
    actions: {
        _UI_NOTIFY({ state }, open: boolean) {
            if (open) {
                if (!state._ui.fetch.working) {
                    state._ui.fetch.working = true
                    notify({ message: 'Fetching content...', classes: 'text-italic text-center', icon: 'cloud_download', timeout: 0}).then((dismiss: Function) => {
                        state._ui.fetch.dismiss = dismiss
                    })
                    console.log('%c NOTIFICATION ', Styles.GRAY, 'fetching...')
                }
            } else {
                if (state._ui.fetch.working) {
                    if (state._stack.length === 0 && !state._pooling && state._fetching.length === 0 && state._nest._stack.length === 0) {
                        delay(750).then(() => {
                            if (state._ui.fetch.working) {
                                if (state._stack.length === 0 && !state._pooling && state._fetching.length === 0  && state._nest._stack.length === 0) {
                                    state._ui.fetch.working = false
                                    if (state._ui.fetch.dismiss) state._ui.fetch.dismiss()
                                    state._ui.fetch.dismiss = undefined

                                    console.log('%c NOTIFICATION (Close) ', Styles.GRAY, 'fetching stopped.')
                                }
                            }
                        })
                    }
                }
            }
        },
        RESET({ dispatch, state }) {
            console.log('RESET SHEET', state)

            // lodash merge doenst maintain things reactive
            const target = state.static
            target.name = undefined
            // misc
            dispatch('SET_MISC', { target: 'class', value: undefined })// target.misc.class = undefined
            target.misc.level = undefined
            dispatch('SET_MISC', { target: 'background', value: undefined }) // target.misc.background = data.misc.background
            target.misc.player = undefined
            dispatch('SET_MISC', { target: 'race', value: undefined }) // target.misc.race = data.misc.race
            target.misc.alignment = undefined
            target.misc.experience_points = []
            target.misc.age = undefined
            target.misc.height = undefined
            target.misc.weight = undefined
            target.misc.eye_color = undefined
            target.misc.hair_color = undefined
            target.misc.skin_color = undefined
            target.misc.inspiration = false
        },
        LOAD({dispatch, state}, value) {
            console.log('LOAD SHEET', '_id', value)
            // @ts-ignore
            MentionService.sheet(value).then((data) => {
                if (data === undefined) return notify({icon: 'warning', message: `There is no registered sheet for the _id: ${value}`})

                // lodash merge doenst maintain things reactive
                const target = state.static
                target.name = data.name
                // misc
                dispatch('SET_MISC', { target: 'class', value: data.misc.class }) // target.misc.class = data.misc.class
                target.misc.level = data.misc.level
                // dispatch('SET_MISC', { target: 'background', value: data.misc.background }) // target.misc.background = data.misc.background
                target.misc.player = data.misc.player
                // dispatch('SET_MISC', { target: 'race', value: data.misc.race }) // target.misc.race = data.misc.race
                target.misc.alignment = data.misc.alignment
                target.misc.experience_points = data.misc.experience_points
                target.misc.age = data.misc.age
                target.misc.height = data.misc.height
                target.misc.weight = data.misc.weight
                target.misc.eye_color = data.misc.eye_color
                target.misc.hair_color = data.misc.hair_color
                target.misc.skin_color = data.misc.skin_color
                target.misc.inspiration = data.misc.inspiration
                // attributes
                // ability scores
                Vue.set(target.attributes, 'ability_scores', data.attributes.ability_scores)
                // // hp
                // target.attributes.hp.rolls = data.attributes.hp.rolls
                // target.attributes.hp.current = data.attributes.hp.current
                // target.attributes.hp.temporary = data.attributes.hp.temporary
                // // exaustion
                // target.attributes.exaustion = data.attributes.exaustion
                // // death saves
                // target.attributes.death_saves.successes = data.attributes.death_saves.successes
                // target.attributes.death_saves.failures = data.attributes.death_saves.failures
                // // stats
                // target.stats = data.stats
                // target.proficiencies = data.proficiencies
                // target.equipment = data.equipment
                // target.features = data.features
                // target.spells = data.spells

                // index static assets

                // define async necessities and push them to _stack

                // fetch async assets based on stack

                console.log('LOADED', state)
            })
        },
        INDEX_RESOURCE( {state, dispatch}, { resource }) {
            // index static resource
            state._index.static[resource._uuid] = resource

            // index parenting
            if (resource._origin) {
                if (!(resource._origin in state._tree)) state._tree[resource._origin] = []
                state._tree[resource._origin].push(resource._uuid)
            }
        },
        UNINDEX_RESOURCE({ state }, resource) {
            delete state._index.static[resource._uuid]
            delete state._index.async[resource._uuid]
            state._index.virtual._remove.push(resource._uuid) // flag to remove resource
            // delete state._index.commands[resource._id]
            delete state._tree[resource._uuid]

            // const stack_defrag = resource._stack_defrag
            // const fetch_defrag = resource._fetch_defrag
            // state._index.defrag.pre_stack[stack_defrag] = state._index.defrag.pre_stack[stack_defrag].filter((u) => u !== resource._uuid)
            // if (fetch_defrag === undefined) throw new Error('UNDEFINED POS-FETCH DEFRAG ID')
            // state._index.defrag.pos_fetch[fetch_defrag] = state._index.defrag.pos_fetch[fetch_defrag].filter((u) => u !== resource._uuid)

            const y = state._tree[resource._origin].map((v, i) => ({v, i})).filter((_uuid) => _uuid.v === resource._uuid)[0].i
            state._tree[resource._origin].splice(y, 1)

            // @ts-ignore
            delete state.static._index.injections[resource._uuid]
            // @ts-ignore
            delete state.static._index.subscriptions[resource._uuid]
            // @ts-ignore
            // delete state.static._index.answers[resource._id]
        },
        async CREATE_RESOURCE( { dispatch, state }, { value, path, origin, source, type, method, parent, index }): Promise<Resource> {
            if (_.isString(value)) {
                if (value[0] === '@') {
                    value = {
                        slug: value
                    }
                } else {
                    value = {
                        name: value
                    }
                }
            }

            let _data = value._id || value.slug || value.name || value.value
            let from
            if (value._id !== undefined) from = '_id'
            else if (value.slug !== undefined) from = 'slug'
            else if (value.name !== undefined) from = 'name'
            else if (value.value !== undefined) from = 'value'

            if (from !== undefined) _data = `(${from}) ${_data} #`

            const res: Resource = {
                _active: undefined,
                _uuid: value._uuid || uuid(), // propaga UUID if already exists
                _path: path,
                _origin: origin,
                _source: source,
                _type: type || 'default',
                _method: method || 'input',
                _parent: parent,
                _index: index,
                _data
            }

            const resource: Resource = {...res, ...value}

            // active inicial é indefinido, só é definido apos o fetch

            await dispatch('INDEX_RESOURCE', {resource: res})

            return resource
        },
        STACK_RESOURCE({dispatch, state}, {resource}) {
            // // DEFRAG resources to decide if should stack
            // const copies = state._index.ids[resource._id as string]

            // if (copies === undefined) {
            //     console.log('%c WARNING ', Styles.AMBAR, 'Resource is being stacked but doesnt have a _id index entry', resource._data, resource)
            // } else if (copies.length > 1) {
            //     console.log('%c ATTENTION ', Styles.LIGHTEN_YELLOW, 'Should defrag resource', resource._data, copies, resource)
            // }

            const defrag_id = ResourceService.defrag(resource)

            if (!(defrag_id in state._index.defrag.pre_stack)) state._index.defrag.pre_stack[defrag_id] = []
            if (!state._index.defrag.pre_stack[defrag_id].includes(resource._uuid)) state._index.defrag.pre_stack[defrag_id].push(resource._uuid)

            if (state._index.defrag.pre_stack[defrag_id].length > 1) {
                console.log('DEFRAG', state._index.defrag.pre_stack)
                // merge os ultimos no primeiro
                const others = [...state._index.defrag.pre_stack[defrag_id]].splice(1)
                const first = state._index.defrag.pre_stack[defrag_id][0]

                const [static_target, static_prop, static_mention] = Mention.resolve('@me/' + state._index.static[first]._path, state, true, false)
                const static_others = others.map((res) => Mention.resolve('@me/' + state._index.static[res]._path, state, false, false))

                console.log('%c DEFRAG (Pre Stack) ', Styles.ORANGE, defrag_id, state._index.defrag.pre_stack[defrag_id], static_others.map((r) => r._path).join(', '), '->', state._index.static[first]._path)

                // esse merge tem que ser nos itens estáticos E async
                if (static_target[static_prop].mechanics) {
                    static_target[static_prop].mechanics.quantity = static_target[static_prop].mechanics.quantity === undefined ? 1 : static_target[static_prop].mechanics.quantity
                } else {
                    static_target[static_prop].mechanics = {quantity: 1}
                }

                for (const other of static_others) {
                    if (other.mechanics) {
                        other.mechanics.quantity = other.mechanics.quantity === undefined ? 1 : other.mechanics.quantity
                    } else {
                        other.mechanics = {quantity: 1}
                    }

                    _.mergeWith(static_target[static_prop], other, ResourceService.merge)
                }

                // atualizar qtd in async
                const [async_target, async_prop, async_mention] = Mention.resolve('@me/' + state._index.static[first]._path, state, true, true)
                if (async_target[async_prop] !== undefined)
                    if (static_target[static_prop].mechanics.quantity !== 1) {
                        if (!('mechanics' in async_target[async_prop])) async_target[async_prop].mechanics = {quantity: 1}
                        async_target[async_prop].mechanics.quantity = static_target[static_prop].mechanics.quantity
                    }

                // remover os ultimos (inclusive esse aqui que provavelmente é o ultimo)
                for (const other of _.reverse(static_others)) {
                    state._index.defrag.pre_stack[defrag_id] = state._index.defrag.pre_stack[defrag_id].filter((_uuid: string) => _uuid !== other._uuid)
                    // @ts-ignore
                    dispatch(`SET_${other._source.toUpperCase()}`, { res: other, value: undefined })
                }

                dispatch('REFACTOR_SIBLINGS', static_target[static_prop])
            } else {
                state._stack.push(resource)
                // if (state._target == null) dispatch('FETCH_RESOURCE')
                if (!state._pooling) dispatch('POOL_RESOURCES')
            }
        },
        async POOL_RESOURCES({ dispatch, state }) {
            if (state._stack.length === 0) return

            function extract(srcRes: Resource, search: boolean = false, as_object: boolean = true) {
                let obj: any

                if (srcRes.meta === 'plugin') {
                    const content = srcRes.content instanceof Array ? srcRes.content : [srcRes.content]

                    // @ts-ignore
                    obj = content.map((r) => extract(r, false, false)).reduce((arr, cur) => [...arr, ...cur], [])
                } else if (srcRes.meta === 'command') {
                    const from = srcRes.from instanceof Array ? srcRes.from : [srcRes.from]
                    // @ts-ignore
                    obj = from.map((r) => extract(r, true, false)).reduce((arr, cur) => [...arr, ...cur], [])
                } else { // if is a regular resource
                    const slug = srcRes.slug
                    const path = (srcRes.path || [])[0] || srcRes.path
                    const value = (_.isString(srcRes) ? srcRes : undefined)
                    let q: string = slug || path || value

                    if (q !== undefined && q[0] !== '@') {
                        if (slug === undefined && path !== undefined) {
                            // OK, path nao tem @
                        } else if (slug === undefined && path === undefined && value !== undefined) {
                            // NOK, value nao pode ser pesquisado no banco se nao tive "@" no inicio
                            console.log('%c ATTENTION ', Styles.LIGHTEN_YELLOW, `Mention <${q}> (from 'value') not fetching due to not being really a mention (doesnt have @ and is not a object, but a string)`, srcRes)
                            obj = []
                        }
                    }

                    if (obj === undefined)
                        if (srcRes._source === 'stats')
                            obj = []
                        else {
                            if (q === undefined) {
                                console.log('%c WARNING ', Styles.AMBAR, srcRes._data, `Resource not fetching due to not having slug/path`, srcRes)
                                obj = []
                            } else {
                                q = q[0] === '@' ? q.substr(1) : q
                                obj = [{
                                    q,
                                    search
                                }]
                            }
                        }
                }

                if (as_object)
                    return {
                        [srcRes._uuid]: obj
                    }

                return obj
            }

            dispatch('_UI_NOTIFY', true)

            const POOL_SIZE = 70
            state._pooling = true

            if (state._stack.length <= POOL_SIZE) {
                await delay(250)
            }

            const pool = state._stack.splice(0, POOL_SIZE)

            const query = pool
                            .map((r) => extract(r))
                            .reduce((obj, cur) => ({...obj, ...cur}), {})

            state._pooling = false
            dispatch('POOL_RESOURCES')

            dispatch('FETCH_RESOURCES', {query, pool})
        },
        async FETCH_RESOURCES({state, dispatch}, {query, pool}) {
            const self = uuid()

            state._fetching.push(self)

            const request = (await axios.post(`http://localhost:3000/pool`, {data: query})).data

            console.log('%c FETCH ', Styles.GREEN, request, self)

            const resources: AsyncResource[] = []
            for (const source of pool as Resource[]) {
                let result = request[source._uuid]

                if (source.meta === 'command') {
                    const arr = []

                    for (const entry of result) {
                        arr[entry.__at__] = entry
                    }

                    result = [{
                        from: arr
                    }]
                    // TODO: Lidar com commands e answers
                    // let _id = request._id
                    // let answers = (state.async.answers || {})[_id]

                    // if(answers){
                    //     block = answers.map((a, i) => ({
                    //         ...a,
                    //         _index: _index + i,
                    //         _source: _data._source || source,
                    //         _type: _data._type || type
                    //     }))
                    //     debugger
                    // }
                }

                if (result.length > 1) {
                    console.log('ERROR', source, result)
                    throw new Error('Unimplemented how to deal with multiple resources for the same slug')
                }

                const resource: AsyncResource = ResourceService.extend(source, result[0], state)

                // find equivalent path at async
                Mention.set(resource, state.async)

                // index async
                state._index.async[resource._uuid] = resource

                // index command _id
                if (resource.meta === 'command')
                    state._index.commands[resource._id] = resource._uuid

                // CALCULAR ACTIVENESS
                const targets = ResourceService.active(resource, {state})

                console.log('    (Resource)', m(resource._uuid), resource._id, '->', resource._path, source, '->', resource, resource._active)

                // para cada variavel respons que e condicao para o active, adicionar um watcher para refazer o calculo
                for (const arr of targets) {
                    // [target, property, path]
                    const [target, property, pathtarget] = arr

                    console.log('%c WATCHING ', Styles.LIGHTEN_BLUE, pathtarget, 'by', resource._data)

                    watch(resource._uuid, 'static.' + pathtarget, (newValue, oldValue) => {
                        const self = uuid()

                        const oldActive = resource._active
                        console.log(`%c WATCH (${self.substr(0, 8)}) `, Styles.BLUE, `static.${pathtarget} (${oldValue} -> ${newValue})`, resource._data, oldActive, '-> ???')
                        ResourceService.active(resource, {state, dispatch})
                        if (oldActive !== resource._active)
                            console.log(`%c WATCH (${self.substr(0, 8)}) `, Styles.BLUE, resource._data, oldActive, '->', resource._active)
                    })
                }

                // index _id for defragging
                const defrag_id = ResourceService.defrag(resource)

                if (!(defrag_id in state._index.defrag.pos_fetch)) state._index.defrag.pos_fetch[defrag_id] = []
                if (!state._index.defrag.pos_fetch[defrag_id].includes(resource._uuid)) state._index.defrag.pos_fetch[defrag_id].push(resource._uuid)

                if (state._index.defrag.pos_fetch[defrag_id].length > 1) {
                    // merge os ultimos no primeiro
                    const others = [...state._index.defrag.pos_fetch[defrag_id]].splice(1)
                    const first = state._index.defrag.pos_fetch[defrag_id][0]

                    const [static_target, static_prop, static_mention] = Mention.resolve('@me/' + state._index.static[first]._path, state, true, false)
                    const static_others = others.map((res) => Mention.resolve('@me/' + state._index.static[res]._path, state, false, false))

                    console.log('%c DEFRAG (Pos Fetch) ', Styles.ORANGE, defrag_id, state._index.defrag.pos_fetch[defrag_id], static_others.map((r) => r._path), '->', state._index.static[first]._path)

                    // E ASYNC
                    const [async_target, async_prop, async_mention] = Mention.resolve('@me/' + state._index.async[first]._path, state, true, true)
                    const async_others = others.map((res) => Mention.resolve('@me/' + state._index.async[res]._path, state, false, true))

                    if (async_target[async_prop].mechanics) {
                        async_target[async_prop].mechanics.quantity = async_target[async_prop].mechanics.quantity === undefined ? 1 : async_target[async_prop].mechanics.quantity
                    } else {
                        async_target[async_prop].mechanics = {quantity: 1}
                    }

                    for (const other of async_others) {
                        if (other.mechanics) {
                            other.mechanics.quantity = other.mechanics.quantity === undefined ? 1 : other.mechanics.quantity
                        } else {
                            other.mechanics = {quantity: 1}
                        }

                        _.mergeWith(async_target[async_prop], other, ResourceService.merge)
                    }

                    // esse merge tem que ser nos itens estáticos E async
                    if (static_target[static_prop].mechanics) {
                        static_target[static_prop].mechanics.quantity = static_target[static_prop].mechanics.quantity === undefined ? 1 : static_target[static_prop].mechanics.quantity
                    } else {
                        static_target[static_prop].mechanics = {quantity: 1}
                    }

                    for (const other of static_others) {
                        if (other.mechanics) {
                            other.mechanics.quantity = other.mechanics.quantity === undefined ? 1 : other.mechanics.quantity
                        } else {
                            other.mechanics = {quantity: 1}
                        }

                        _.mergeWith(static_target[static_prop], other, ResourceService.merge)
                    }

                    // remover os ultimos (inclusive esse aqui que provavelmente é o ultimo)
                    for (const other of _.reverse(static_others)) {
                        // @ts-ignore
                        await dispatch(`SET_${other._source.toUpperCase()}`, { res: other, value: undefined })
                    }
                } else { // se houver um defrag nesse recurso, ele nao sobrevive
                    resources.push(resource)
                }
            }

            state._fetching = state._fetching.filter((u) => u !== self)

            dispatch('NEST_RESOURCES', resources)
        },
        async NEST_RESOURCES({state, dispatch}, resources: AsyncResource[]) {
            console.log(`ADDING ${resources.length} RESOURCES TO NEST`, `(${state._nest._stack.length})`)
            state._nest._stack = [...state._nest._stack, ...resources]
            if (!state._nest._nesting) dispatch('NEST_RESOURCE')
        },
        async NEST_RESOURCE( { state, dispatch }) {
            if (state._nest._nesting) {
                debugger
                return
            }

            if (state._nest._stack.length === 0) {
                // acabou uma leva de fetches
                dispatch('_UI_NOTIFY', false)

                if (state._stack.length === 0 && !state._pooling && state._fetching.length === 0 && state._nest._stack.length === 0) {
                    delay(750).then(() => {
                        if (state._stack.length === 0 && !state._pooling && state._fetching.length === 0  && state._nest._stack.length === 0) {
                            dispatch('NORMALIZE_RESOURCES')
                        }
                    })
                }

                return
            }

            state._nest._nesting = true
            const resource: AsyncResource = state._nest._stack.splice(0, 1)[0]

            if (resource._active === false) {
                console.log('> SKIPPING NEST RESOURCE', resource._data, `<${resource._path}>`, resource, `(of ${state._nest._stack.length})`)
            } else {
                console.log('NESTING RESOURCE', resource._data, `<${resource._path}>`, `from ${resource._parent} (${m(resource._origin)})`, resource, `(of ${state._nest._stack.length})`)
                // debugger
                const subscriptions = resource.subscriptions
                const injections = resource.injections
                const plugins = resource.plugins

                const table = ResourceService.table(resource) // a funcao da table é injetar um _active baseado em level automaticamente

                if (subscriptions !== undefined || injections !== undefined || plugins !== undefined) {

                    const methods = {
                        subscriptions, injections
                    }
                    for (const method_name of Object.keys(methods)) {
                        // @ts-ignore
                        const method = methods[method_name]

                        if (method && method.length > 0) {
                            const order = {
                                stats: 0,
                                proficiencies: 1,
                                equipment: 2,
                                features: 3,
                                spells: 4,
                            }
                            // @ts-ignore
                            method.sort((a: string, b: string) => order[a] - order[b])

                            if (resource._uuid in (state.static._index[method_name] || {})) {
                                console.log('%c WARNING ', Styles.AMBAR, 'Resource already ' + (method_name === 'injections' ? 'injected' : 'subscripted'), resource._data, resource)
                            } else {
                                for (const sub of method as string[]) { // equipment
                                    let _from_mechanics = resource.mechanics[sub]
                                    let _from_table = (table[sub] || {})

                                    if (_.isArray(_from_mechanics)) _from_mechanics = {default: _from_mechanics}
                                    if (_.isArray(_from_table)) _from_table = {default: _from_table}

                                    const objeto = {..._from_mechanics, ..._from_table} // mechanics.proficiencies

                                    if (['stats', 'misc'].includes(sub)) {
                                        for (const key of Object.keys(objeto) as string[]) { // items
                                            const options = {
                                                path: `${sub}.${key}`,
                                                origin: resource._uuid,
                                                source: sub,
                                                type: key,
                                                method: method_name,
                                                parent: resource._id
                                            }

                                            // INJECT RESOURCE
                                            await dispatch(`SET_${sub.toUpperCase()}`, { target: key, value: objeto[key], base: options }) // automatically push to stack and index
                                        }
                                    } else {
                                        for (const key of Object.keys(objeto)) { // items
                                            for (const value of objeto[key]) { // @longsword
                                                const options = {
                                                    origin: resource._uuid,
                                                    source: sub,
                                                    type: key,
                                                    method: method_name,
                                                    parent: resource._id
                                                }
                                                // INJECT RESOURCE
                                                await dispatch(`SET_${sub.toUpperCase()}`, { value, base: options }) // automatically push to stack and index
                                            }
                                        }
                                    }
                                }

                                state.static._index[method_name][resource._uuid] = new Date()
                            }
                        }
                    }

                    if (plugins && plugins.length > 0) {
                        let index = state.plugins.length
                        for (const plugin of resource.mechanics.plugins) {
                            if (plugin.name in state.plugins) continue

                            const options = {
                                path: `plugins[${index}]`,
                                origin: resource._uuid,
                                source: 'plugins',
                                type: plugin.name,
                                method: 'plugin',
                                parent: resource._id,
                                index
                            }

                            // INJECT RESOURCE
                            await dispatch(`SET_PLUGINS`, { index, value: plugin, base: options }) // automatically push to stack and index

                            index++
                        }
                    }
                }
            }

            state._nest._nesting = false
            dispatch('NEST_RESOURCE')
        },
        async NORMALIZE_RESOURCES({ state, dispatch }, { self } = {}) {
            if (!(state._stack.length === 0 && !state._pooling && state._fetching.length === 0  && state._nest._stack.length === 0)) {
                return
            }

            if (state._removing && state._removing !== self) return

            console.log('%c NORMALIZE ', Styles.GRAY, state._index.async, '(removing block)', state._removing, '<>', self)

            const _uuids = Object.keys(state._index.async)

            console.log('CLEAR VIRTUAL DEFRAG', state._index.defrag.virtual, '->', {})
            state._index.defrag.virtual = {}

            // how to remove from virtual after removal from async (and subsequentlly removal form static)
            let _uuid = state._index.virtual._remove.pop()
            while (_uuid !== undefined) {
                const virtual = state._index.virtual[_uuid]

                if (virtual === undefined) {
                    console.log('    REMOVE ', 'Resource doesnt exists as virtual', _uuid, virtual)
                    _uuid = state._index.virtual._remove.pop()
                    continue
                }

                console.log('%c     REMOVE ', Styles.LIGHTEN_RED, 'Remove resource from virtual cluster', _uuid, virtual._uuid, virtual)

                let ref: any = state.virtual
                const virtual_path = _.toPath(virtual._path)
                const final_path = virtual_path.pop()
                for (const path of virtual_path) {
                    ref = ref[path]
                }

                if (_.isArray(ref)) {
                    ref.splice(parseInt(final_path as string, 10), 1)

                    let index = 0
                    for (const sibling of ref) {
                        const oldIndex = sibling._index
                        const oldPath = sibling._path

                        if (oldIndex !== index) {
                            sibling._index = index

                            const sib_path = _.toPath(sibling._path)
                            sib_path[sib_path.length - 1] = index.toString()
                            sibling._path = pathToString(sib_path)

                            console.log('%c     REMOVE - Refactor sibling\'s index and path ', Styles.LIGHTEN_RED, `(${oldIndex}) (${oldPath}) -> (${index}) (${sibling._path})`, sibling)
                        }

                        index++
                    }
                } else {
                    ref[final_path as string] = undefined
                }

                for (const res of virtual._resources) {
                    delete state._index.virtual[res]
                }

                _uuid = state._index.virtual._remove.pop()
            }

            let defrag_order = []

            // defining what and how to defrag
            for (const _uuid of _uuids) {
                const resource = state._index.async[_uuid]

                if (resource._method === 'plugin') continue // nope

                // index _id for virtual defragging
                let defrag_id = ResourceService.defrag(resource, true)
                if (!resource._active) defrag_id = `inactive_resource` // inactive_resources should not show up on virtual, their virtual index should be undefined

                if (!(defrag_id in state._index.defrag.virtual)) state._index.defrag.virtual[defrag_id] = []
                if (!state._index.defrag.virtual[defrag_id].includes(resource._uuid)) state._index.defrag.virtual[defrag_id].push(resource._uuid)

                defrag_order.push([..._.toPath(resource._path), defrag_id])
            }

            function i(value: string) {return _.isNaN(parseInt(value, 10)) ? value : parseInt(value, 10)}
            defrag_order = _.sortBy(defrag_order, [(o: string[]) => i(o[0]), (o: string[]) => i(o[1]), (o: string[]) => i(o[2])]) // sorted by path ids

            const defrag_list = Array.from(new Set(defrag_order.map((o: string[]) => o.splice(-1)[0])))

            // virtualize resources and set them in place
            for (const id of defrag_list) {
                const uuids = state._index.defrag.virtual[id]
                const should_update = _.intersection(state._index.virtual._update, uuids).length > 0

                if (uuids.length === 1) {
                    const resource = state._index.async[uuids[0]]
                    const index = state._index.virtual[resource._uuid]

                    if (should_update) {
                        console.log('%c    SHOULD UPDATE VIRTUAL ', Styles.LIGHTEN_YELLOW, uuids[0], id, resource, '->', state._index.virtual[uuids[0]])
                    }

                    if (index !== undefined && !should_update) {
                        // console.log('    VIRTUAL POSITION CORRECT', id, resource._data, index._uuid, index)
                    } else {
                        const virtual = ResourceService.virtual([resource], state, false)

                        // refactor path, if necessary
                        if (virtual._index !== undefined) {
                            let _path: any = _.toPath(virtual._path)
                            _path.splice(-1) // path to insert

                            // get current size (and runtime index if necessary)
                            let target: any = state.virtual
                            for (const p of _path) {
                                target = target[p]
                            }

                            let _index: number = target.length
                            if (should_update) {
                                _index = virtual._index
                            }

                            _path = pathToString([..._path, _index])

                            virtual._path = _path
                            virtual._index = _index
                        }

                        if (virtual._index === undefined) {
                            const _index = _.toPath(virtual._path).splice(-1)
                            virtual._index = _index
                        }

                        // deal with filling empty spots
                        if (['equipment', 'features', 'spells', 'plugins', 'proficiencies'].includes(virtual._source)) {
                            const empties = (arr: any[]) => arr.reduce((x, y) => x - 1, arr.length)
                            // @ts-ignore
                            const parent_size = state.virtual[virtual._source].length - empties(state.virtual[virtual._source])

                            if (virtual._index > parent_size) {
                                console.log(`        READJUST INDEX BASE ON PARENT SIZE: ${parent_size} x _INDEX: ${virtual._index}`)

                                virtual._index = parent_size
                                const _path: any = _.toPath(virtual._path)
                                _path[_path.length - 1] = virtual._index
                                virtual._path = pathToString(_path)
                            }
                        }

                        Mention.set(virtual, state.virtual)
                        state._index.virtual[resource._uuid] = virtual

                        console.log('    CORRECTING VIRTUAL POSITION', resource._data, resource._uuid, '->', virtual._uuid, resource._path, '->', virtual._path, virtual, `${should_update ? '(should_update)' : ''}`)
                    }
                } else if (uuids.length > 1) {
                    if (id !== 'inactive_resource') {
                        const resources = uuids.map((uid) => state._index.async[uid])
                        const index = state._index.virtual[uuids[0]]

                        if (should_update) {
                            console.log('%c    SHOULD UPDATE VIRTUAL ', Styles.LIGHTEN_YELLOW, uuids[0], id, resources, '->', state._index.virtual[uuids[0]])
                        }

                        if (index !== undefined && !should_update) {
                            // console.log('    VIRTUAL POSITION CORRECT', id, uuids, index._uuid, index)
                        } else {
                            // how to merge
                            const virtual = ResourceService.virtual(resources, state)

                            // refactor path, if necessary
                            if (virtual._index !== undefined) {
                                let _path: any = _.toPath(virtual._path)
                                _path.splice(-1) // path to insert

                                // get current size (and runtime index if necessary)
                                let target: any = state.virtual
                                for (const p of _path) {
                                    target = target[p]
                                }

                                let _index: number = target.length
                                if (should_update) {
                                    _index = virtual._index
                                }

                                _path = pathToString([..._path, _index])

                                virtual._path = _path
                                virtual._index = _index
                            }

                            if (virtual._index === undefined) {
                                const _index = _.toPath(virtual._path).splice(-1)
                                virtual._index = _index
                            }
    
                            // deal with filling empty spots
                            if (['equipment', 'features', 'spells', 'plugins', 'proficiencies'].includes(virtual._source)) {
                                const empties = (arr: any[]) => arr.reduce((x, y) => x - 1, arr.length)
                                // @ts-ignore
                                const parent_size = state.virtual[virtual._source].length - empties(state.virtual[virtual._source])
    
                                if (virtual._index > parent_size) {
                                    console.log(`        READJUST INDEX BASE ON PARENT SIZE: ${parent_size} x _INDEX: ${virtual._index}`)
    
                                    virtual._index = parent_size
                                    const _path: any = _.toPath(virtual._path)
                                    _path[_path.length - 1] = virtual._index
                                    virtual._path = pathToString(_path)
                                }
                            }

                            Mention.set(virtual, state.virtual)

                            for (const resource of resources) {
                                state._index.virtual[resource._uuid] = virtual
                            }

                            console.log('%c DEFRAG (Virtual) ', Styles.ORANGE, id, uuids, virtual._uuid, `${resources[0]._path}|${resources[resources.length - 1]._path}`, '->', virtual._path, virtual)
                        }
                    } else {
                        console.log('    SKIPPING INACIVE RESOURCES', uuids)
                    }
                }
            }

            if (state._removing) {
                console.log('%c NORMALIZED FROM REMOVE ', Styles.GRAY, 'Remove stack finished, normalization post-removal too', self)
                state._removing = false
            }

            if (state._injected.length > 0) {
                Bus.$emit('injected', _.flattenDeep(state._injected))
                state._injected = []
            }
        },
        async REFACTOR_SIBLINGS({state, dispatch}, resource: Resource) {
            if (resource._index !== undefined) {
                const path = _.toPath(resource._path)
                path.pop()
                let target = resource._method === 'plugin' ? state : state.static
                for (const p of path) {
                    // @ts-ignore
                    target = target[p]
                }

                // target is resources parent
                if (!_.isArray(target)) {
                    debugger
                    throw new Error('Removed resource has _index but parent is not an array')
                }

                let index = 0
                for (const sibling of target) {
                    if (sibling._uuid === resource._uuid) continue

                    const oldIndex = sibling._index
                    const oldPath = sibling._path

                    if (oldIndex !== index) {
                        sibling._index = index

                        const sib_path = _.toPath(sibling._path)
                        sib_path[sib_path.length - 1] = index.toString()
                        sibling._path = pathToString(sib_path)

                        state._index.static[sibling._uuid]._index = index
                        state._index.static[sibling._uuid]._path = sibling._path
                        console.log('%c REMOVE - Refactor sibling\'s index and path ', Styles.LIGHTEN_RED, `(${oldIndex}) (${oldPath}) -> (${index}) (${sibling._path})`, sibling._data, sibling)
                    }

                    index++
                }
            }
        },
        async REMOVE_RESOURCE( { state, dispatch}, resource: Resource ) {
            if (resource === undefined) return

            const self = uuid()
            if (state._removing === false) state._removing = self

            function children(root: string): string[] {
                const _children = state._tree[root]

                if (_children === undefined) {
                    return []
                }

                const _grandchildren = _children.map(children).reduce((arr, cur) => [...arr, ...cur], [])

                return [..._children, ..._grandchildren]
            }

            const _children = children(resource._uuid)
            const stack = [resource._uuid, ..._children.filter((r) => ['subscriptions', 'plugin'].includes(state._index.static[r]._method))]
            const paths = stack.map((r, i) => _.toPath(i === 0 ? resource._path : state._index.static[r]._path))

            for (let y = paths.length - 1; y > 0; y--) {
                const target_resource = state._index.static[stack[y]]

                // @ts-ignore
                await dispatch(`SET_${target_resource._source.toUpperCase()}`, { res: target_resource, value: undefined })
                // target -> SET_MISC
                // index -> SET_EQUIPMENT
            }

            if (resource._method !== 'plugin') {
                let ref: any = state.async
                const final_path = paths[0].pop()
                for (const path of paths[0]) {
                    ref = ref[path]
                }

                if (_.isArray(ref)) {
                    ref.splice(parseInt(final_path as string, 10), 1)
                } else {
                    // @ts-ignore
                    ref[final_path] = undefined
                }
            }

            dispatch('UNINDEX_RESOURCE', resource)
            delete state._index.commands[resource._id]

            const stack_defrag = resource._stack_defrag
            const fetch_defrag = resource._fetch_defrag
            state._index.defrag.pre_stack[stack_defrag] = state._index.defrag.pre_stack[stack_defrag].filter((u) => u !== resource._uuid)
            if (fetch_defrag === undefined) throw new Error('UNDEFINED POS-FETCH DEFRAG ID')
            state._index.defrag.pos_fetch[fetch_defrag] = state._index.defrag.pos_fetch[fetch_defrag].filter((u) => u !== resource._uuid)

            // @ts-ignore
            delete state.static._index.answers[resource._id]

            if (state._observer[resource._uuid]) { // is is observer
                for (const unwatch of state._observer[resource._uuid]) {
                    unwatch()
                }

                delete state._observer[resource._uuid]
            }

            // update siblings index
            await dispatch('REFACTOR_SIBLINGS', resource)

            if (resource.meta === 'command') {
                console.log('LIDAR COM A REMOCAO DE COMMANDS')
            }

            console.log('%c REMOVE ', Styles.RED, m(resource._uuid), resource._id, resource._path, '->', undefined, resource, self)

            await dispatch('NORMALIZE_RESOURCES', { self })
        },
        async RIPPLE_RESOURCE({ state, dispatch }, { resource, directive }) {
            console.log('RIPPLE', directive, resource._data, resource)

            if (!directive) {
                // call for children
                const children = state._tree[resource._uuid]
                if (children) {
                    for (const child of children) {
                        const child_path = state._index.static[child]._path
                        const [target, prop, mention] = Mention.resolve('@me/' + child_path, state, true)

                        let res
                        if (target._ !== undefined) {
                            res = target._[prop]
                        } else {
                            res = target[prop]
                        }

                        if (res._method === 'subscriptions') {
                            console.log('%c (Ripple) REMOVE ', Styles.RED, res._data, res)

                            dispatch(`SET_${res._source.toUpperCase()}`, { res, value: undefined })
                        }
                    }
                }
            } else {
                console.log('%c (Ripple) NEST ', Styles.GREEN, resource._data, resource)
                dispatch('NEST_RESOURCES', [resource])
            }
        },
        async SET_RESOURCES({ state, dispatch }, { meta, index, target, value, base= {}, quantity, res, injected }: { meta: string, [key: string]: any }) {
            if (meta === undefined) throw new Error('Unimplemented SET_RESOURCE without meta information')

            if (value === undefined) {
                let resource
                if (target === undefined && index === undefined) {
                    if (['equipment', 'proficiencies', 'features', 'spells'].includes(meta)) index = res._index
                    else if (['stats', 'misc'].includes(meta)) target = res._type

                    // double-check if resource is really the one to be removed
                    if (!Mention.check(state, meta, target, res)) return

                    resource = res
                } else {
                    // @ts-ignore
                    resource = state.static[meta][target]
                }

                const _data = resource._data

                if (quantity) {
                    const [static_target, static_prop, static_mention] = Mention.resolve('@me/' + resource._path, state, true, false)
                    if (!('mechanics' in static_target[static_prop])) static_target[static_prop].mechanics = {quantity: 1}
                    static_target[static_prop].mechanics.quantity += quantity

                    // atualizar qtd in async
                    const [async_target, async_prop, async_mention] = Mention.resolve('@me/' + resource._path, state, true, true)
                    if (!('mechanics' in async_target[async_prop])) async_target[async_prop].mechanics = {quantity: 1}
                    async_target[async_prop].mechanics.quantity = static_target[static_prop].mechanics.quantity

                    // make virtual reload
                    const virtual = state._index.virtual[resource._uuid]
                    const update_key = `__update__${uuid()}__`
                    Vue.set(state.virtual[meta][virtual._index], update_key, uuid())
                    Vue.delete(state.virtual[meta][virtual._index], update_key)

                    console.log(`%c ADD/SUBTRACT ${meta.toUpperCase()} `, Styles.BOLD, quantity, '->', async_target[async_prop].mechanics.quantity, resource._data, resource)
                    if (static_target[static_prop].mechanics.quantity > 0) return
                }

                console.log(`%c REMOVE ${meta.toUpperCase()} `, Styles.BOLD, target || index, _data, '->', undefined)

                // @ts-ignore
                const LEFTOVER = ResourceService.leftover(state.static[meta][target], state)

                if (state._index.async[LEFTOVER._uuid] !== undefined)
                    dispatch('REMOVE_RESOURCE', LEFTOVER)

                if (['equipment', 'proficiencies', 'features', 'spells'].includes(meta)) state.static[meta].splice(index, 1)
                else if (['misc'].includes(meta)) Vue.set(state.static[meta], target, undefined)
                else if (meta === 'stats') {
                    // @ts-ignore
                    Vue.set(state.static.stats._, target, undefined)
                    Vue.set(state.static.stats, target, undefined)
                }
            } else {
                // FIXME: adicionar handaxe, adiciona longsword, adiciona handaxe, adiciona longsword ACABA SOMANDO +1 NO HANDAXE -> (handaxe x3, longsword x1)
                if (index === undefined) index = state.static[meta].length

                // PREPARE OPTIONS
                const options = {
                    ...{
                        path: pathToString([meta, target || index]),
                        origin: 'input',
                        source: meta,
                        type: target,
                        parent: 'custom'
                    },
                    ...base
                }

                // MAKE RESOURCE
                const resource = await dispatch('CREATE_RESOURCE', { value: meta === 'stats' ? target : value, ...options })

                // SET STATIC
                if (['equipment', 'proficiencies', 'features', 'spells'].includes(meta)) state.static[meta].splice(index, 1, resource)
                else if (['misc', 'stats'].includes(meta)) Vue.set(state.static[meta], target, resource)
                else if (meta === 'stats') {
                    // @ts-ignore
                    Vue.set(state.static.stats._, target, resource)
                    Vue.set(state.static.stats, target, value)
                }

                if (injected) state._injected.push(injected)
                // PUSH TO ASYNC STACK
                dispatch('STACK_RESOURCE', {resource})

                console.log(`%c SET ${meta.toUpperCase()} `, Styles.BOLD, value, '->', target || index, resource)
            }
        },
        async SET_MISC({dispatch}, args) {
            await dispatch('SET_RESOURCES', { meta: 'misc', ...args })
        },
        async SET_STATS({dispatch}, args) {
            await dispatch('SET_RESOURCES', { meta: 'stats', ...args })
        },
        async SET_PROFICIENCIES({dispatch}, args) {
            await dispatch('SET_RESOURCES', { meta: 'proficiencies', ...args })
        },
        async SET_EQUIPMENT({dispatch}, args) {
            await dispatch('SET_RESOURCES', { meta: 'equipment', ...args })
        },
        async SET_FEATURES({dispatch}, args) {
            await dispatch('SET_RESOURCES', { meta: 'features', ...args })
        },
        async SET_SPELLS({dispatch}, args) {
            await dispatch('SET_RESOURCES', { meta: 'spells', ...args })
        },
        async SET_PLUGINS({ state, dispatch }, { index, value, base= {}, res, injected }) {
            if (value === undefined) {
                let resource
                if (index === undefined) {
                    index = res._index
                    resource = res
                } else {
                    // @ts-ignore
                    resource = state.plugins[index]
                }

                const _data = resource._data

                console.log('REMOVE PLUGIN', index, _data, '->', undefined)
                // @ts-ignore
                const LEFTOVER = ResourceService.leftover(state.plugins[index], state)

                if (state._index.async[LEFTOVER._uuid] !== undefined)
                    dispatch('REMOVE_RESOURCE', LEFTOVER)

                state.plugins.splice(index, 1)
            } else {
                if (index === undefined) index = state.plugins.length

                // PREPARE OPTIONS
                const options = {
                    ...{
                        path: pathToString(['plugins', index]),
                        origin: 'input',
                        source: 'plugins',
                        // type // IDEM
                        parent: 'custom',
                        index
                    },
                    ...base
                }

                // MAKE RESOURCE
                const resource = await dispatch('CREATE_RESOURCE', { value, ...options })

                // SET STATIC
                state.plugins.splice(index, 1, resource)

                if (injected) state._injected.push(injected)
                // PUSH TO ASYNC STACK
                dispatch('STACK_RESOURCE', {resource})

                console.log('%c SET PLUGIN ', Styles.BOLD, value, '->', index)
            }
        },
        async SET_ANSWERS({ dispatch, state }, { command, answer, base= {}, res }) {
            console.log('%c SET ANSWER ', Styles.BOLD, command.inject ? 'injecting' : 'replacing', answer, '->', command.inject ? command.inject : command._path, command)

            if (command.transform) {
                answer = eval(command.transform)(answer)
            }

            if (command.inject === undefined) { // if the answer substitutes the command
                Bus.$emit('before-injection', [command._uuid])

                // debugger
                // if (state.static._index.answers === undefined) state.static._index.answers = {}
                // if (!(command._id in state.static._index.answers)) state.static._index.answers[command._id] = []

                // let index = state.static._index.answers[command._id].length
                // for (const value of answer) {
                //     // PREPARE OPTIONS
                //     const options = {
                //         ...{
                //             path: `answers.${command._id}[${index}]`,
                //             origin: command._uuid,
                //             source: 'answers',
                //             type: command._id,
                //             method: 'command',
                //             parent: command._id,
                //             index
                //         },
                //         ...base
                //     }

                //     // MAKE RESOURCE
                //     const resource = await dispatch('CREATE_RESOURCE', { value, ...options })

                //     // PUSH TO ASYNC STACK
                //     dispatch('STACK_RESOURCE', {resource})

                //     index++
                // }

                /**
                 * get static path
                 * get async path
                 * replace in async path
                 * replace in static path
                 * run normalization process
                 */

                const _path = command._path
                const _uuid = command._uuid
                const _old_defrag = ResourceService.defrag(command, false)

                if (answer.length > 1) {
                    throw new Error('Unimplemented answer injection with more than one shit')
                }

                const value = answer[0]

                // slugification of path
                if (value.slug === undefined) {
                    const paths = value.path
                    paths.sort((a: string, b: string) => b.length - a.length)
                    value.slug = '@' + paths[0]
                }

                let _data = value._id || value.slug || value.name || value.value
                let from
                if (value._id !== undefined) from = '_id'
                else if (value.slug !== undefined) from = 'slug'
                else if (value.name !== undefined) from = 'name'
                else if (value.value !== undefined) from = 'value'

                if (from !== undefined) _data = `(${from}) ${_data} #`

                const METADATA = [
                    '_uuid',
                    '_path',
                    '_origin',
                    '_source',
                    '_type',
                    '_method',
                    '_parent',
                    '_active',
                    // '_data', // should actually remake data
                    '_index'
                ]

                // STATIC REPLACE
                const [target, prop, mention] = Mention.resolve('@me/' + _path, state, true, false)

                // mantain metadata, remove the rest
                for (const key of Object.keys(target[prop])) {
                    if (!METADATA.includes(key)) {
                        delete target[prop][key]
                    }
                }

                Vue.set(target[prop], '_data',  _data)
                Vue.set(target[prop], 'slug',  value.slug)
                Vue.set(target[prop], 'mechanics',  value.mechanics)

                // no need to async replace, this part will be changed to fetch/pool
                // // ASYNC REPLACE
                // const [async_target, async_prop, async_mention] = Mention.resolve('@me/' + _path, state, true, true)

                // for (const key of Object.keys(async_target[async_prop])) {
                //     if (!METADATA.includes(key)) {
                //         delete async_target[async_prop][key]
                //     }
                // }

                // Vue.set(async_target[async_prop], '_data',  _data)

                // for (const key of Object.keys(value)) {
                //     if (!METADATA.includes(key)) {
                //         Vue.set(async_target[async_prop], key, value[key])
                //     }
                // }

                // // REPLACE DEFRAG INDEXES
                // //  for commands the pre_stack and pos_fetch defrag id`s should be the same
                // delete state._index.defrag.pre_stack[_old_defrag]
                // delete state._index.defrag.pos_fetch[_old_defrag]

                // const _new_stack_defrag = ResourceService.defrag(target[prop])
                // const _new_fetch_defrag = ResourceService.defrag(async_target[async_prop])

                // if (!(_new_stack_defrag in state._index.defrag.pre_stack)) state._index.defrag.pre_stack[_new_stack_defrag] = []
                // if (!(_new_fetch_defrag in state._index.defrag.pos_fetch)) state._index.defrag.pos_fetch[_new_fetch_defrag] = []

                // state._index.defrag.pre_stack[_new_stack_defrag].push(_uuid)
                // state._index.defrag.pos_fetch[_new_fetch_defrag].push(_uuid)

                console.log('REPLACE COMMAND BY ANSWER', answer, '->', _uuid, '@', _path, command)

                state._index.virtual._update.push(_uuid)
                dispatch(`SET_${command._source.toUpperCase()}`, { index: target[prop]._index, value: target[prop], injected: [command] })
                // dispatch('NORMALIZE_RESOURCES', {injected: [command]})
            } else {
                const [target, prop, mention] = Mention.resolve(command.inject, state, true)

                try {
                    // setting value in reactive wat
                    Vue.set(target, prop, answer)
                } catch (err) {
                    console.log(err)
                    debugger
                    throw new Error('Command with inject in fields without value not implemented')
                }

                if (!command.persistent) {
                    throw new Error('Not persistent commands with inject not implemented')
                }
            }
        },
        async SET_COIN({ dispatch, state, commit }, {value, key}) {
            console.log('%c SET COIN ', Styles.BOLD, value, '->', key)

            const coin = state.static.equipment.filter((res) => res._type === 'treasure' && res._id === key)[0]

            if (coin === undefined) {
                if (value !== undefined && value !== 0) {
                    const resource = {
                        _id: key,
                        slug: '@coin/' + key,
                        mechanics: {
                            quantity: value
                        }
                    }

                    dispatch('SET_EQUIPMENT', {index: state.static.equipment.length, value: resource, base: {type: 'treasure'}})
                }
            } else {
                if (value === undefined) value = 0 // nao quero realmente excluir o treco

                if (value === undefined) {
                    dispatch('SET_EQUIPMENT', {index: coin._index, value})
                } else {
                    if (coin.mechanics) {
                        coin.mechanics.quantity = value
                    } else {
                        coin.mechanics = {}
                        coin.mechanics.quantity = value
                    }
                }
            }
        },
    }
}
