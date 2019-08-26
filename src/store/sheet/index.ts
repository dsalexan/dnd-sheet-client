// @ts-ignore
import uuid from 'uuid/v4'

import { RootState } from '../types'
import { SheetState, Sheet, Resource, AsyncResource } from './types'

import { Module } from 'vuex';

import {notify, watch, Bus} from '@/bus'
import { Mention as MentionService, Resource as ResourceService } from '@/services'
// @ts-ignore
import Resources from '@/utils/resources'

import _ from 'lodash';
// @ts-ignore
import pathToString from 'deepdash-es/pathToString'

import axios from 'axios'

import Observer from '@/services/observer';
import { throwError } from 'rxjs';

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
                current: 0,
                temporary: 0
            },
            exaustion: 0,
            death_saves: {
                successes: [],
                failures: []
            }
        },
        stats: [],
        proficiencies: [],
        equipment: [],
        features: [],
        spells: [],
        _index: {
            injections: {}
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
                current: 0,
                temporary: 0
            },
            exaustion: 0,
            death_saves: {
                successes: [],
                failures: []
            }
        },
        stats: [],
        proficiencies: [],
        equipment: [],
        features: [],
        spells: [],
        _index: {
            subscriptions: {}
        }
    },
    _stack: [],
    _target: null,
    _pooling: false,
    _fetching: [],
    _nest: {
        _stack: [],
        _nesting: false
    },
    _index: {
        static: {},
        async: {},
        commands: {},
        answers: {}
    },
    _tree: {},
    _ui: {
        fetch: {
            working: false
        }
    },
    _observer: []
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
        experience_points: (state) => {
            const xp = state.static.misc.experience_points
            return xp.reduce((sum, cur) => sum + cur.points, 0)
        }
    },
    mutations: {
        SET_CLASS_LEVEL: (state, value) => {
            value = value.trim()
            let level = value.match(/\d+/gi)[0]
            level = !level && level !== 0 ? undefined : parseInt(level, 10)

            const classe = value.replace(level, '').trim()

            state.static.misc.class = classe
            state.static.misc.level = level
        }
    },
    actions: {
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
                dispatch('SET_MISC', { target: 'background', value: data.misc.background }) // target.misc.background = data.misc.background
                target.misc.player = data.misc.player
                dispatch('SET_MISC', { target: 'race', value: data.misc.race }) // target.misc.race = data.misc.race
                target.misc.alignment = data.misc.alignment
                target.misc.experience_points = data.misc.experience_points
                target.misc.age = data.misc.age
                target.misc.height = data.misc.height
                target.misc.weight = data.misc.weight
                target.misc.eye_color = data.misc.eye_color
                target.misc.hair_color = data.misc.hair_color
                target.misc.skin_color = data.misc.skin_color
                target.misc.inspiration = data.misc.inspiration
                // // attributes
                // // ability scores
                // target.attributes.ability_scores = data.attributes.ability_scores
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
        INDEX_RESOURCE( {state, dispatch}, {resource, remove= false, only_tree= false}) {
            if (!remove) {
                // index static resource
                if (!only_tree)
                    state._index.static[resource._uuid] = resource

                // index parenting
                if (resource._origin) {
                    if (!(resource._origin in state._tree)) state._tree[resource._origin] = []
                    state._tree[resource._origin].push(resource._uuid)
                }
            } else {
                delete state._index.static[resource._uuid]

                // NAO REMOVER O INDICE DE ORIGEM, ISSO VAI SER USADO EM REMOVE RESOURCE
                // if (resource._parent) {
                //     state._parent.static[resource._parent].splice(resource._index, 1)
                // }
            }
        },
        async CREATE_RESOURCE( { dispatch, state }, { value, path, origin, source, type, method, parent, index, should_index = true }): Promise<Resource> {
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

            const res: Resource = {
                _active: true,
                _uuid: uuid(),
                _path: path,
                _origin: origin,
                _source: source,
                _type: type || 'default',
                _method: method || 'input',
                _parent: parent,
                _index: index,
                ...value
            }

            // TODO evaluate ACTIVE here and SUBSCRIBE to target
            const targets = ResourceService.active(res, state)
            // for (const arr of targets) {
            //     // [target, property, path]
            //     let [target, property, pathtarget] = arr

            //     if (!(pathtarget in state._observer)) {
            //         // @ts-ignore
            //         target = Observer.observe(target, pathtarget, property, () => {
            //             console.log('OBSERVING', pathtarget, property, value)
            //             ResourceService.active(res, state)
            //         })

            //         state._observer.push(pathtarget)
            //     } else {
            //         // @ts-ignore
            //         Observer.observe(target, pathtarget, property, (value) => {
            //             console.log('OBSERVING', pathtarget, property, value)
            //             ResourceService.active(res, state)
            //         })
            //     }
            // }
            for (const arr of targets) {
                // [target, property, path]
                const [target, property, pathtarget] = arr

                watch('static.' + pathtarget, (newValue, oldValue) => {
                    const oldActive = res._active
                    ResourceService.active(res, state)
                    console.log('WATCHED CHANGE', `static.${pathtarget} (${oldValue} -> ${newValue})`, res._id || res.slug || res.name || res.value || res, oldActive, '->', res._active)
                })
            }


            await dispatch('INDEX_RESOURCE', {resource: res, only_tree: !should_index})

            return res
        },
        STACK_RESOURCE({dispatch, state}, resource) {
            state._stack.push(resource)
            // if (state._target == null) dispatch('FETCH_RESOURCE')
            if (!state._pooling) dispatch('POOL_RESOURCES')
        },
        async FETCH_RESOURCE({ dispatch, state }) {
            if (state._stack.length === 0) {
                await delay(500)
            }

            if (state._stack.length === 0) {
                if (state._ui.fetch.working) {
                    if (state._ui.fetch.dismiss) state._ui.fetch.dismiss()
                    state._ui.fetch.dismiss = undefined
                    state._ui.fetch.working = false

                    console.log('STOP FETCHING', state._ui.fetch.working)
                }

                return
            }

            if (!state._ui.fetch.working) {
                state._ui.fetch.working = true
                notify({ message: 'Fetching content...', classes: 'text-italic text-center', icon: 'cloud_download', timeout: 0}).then((dismiss: Function) => {
                    state._ui.fetch.dismiss = dismiss
                })
                console.log('NOTIFIED', 'fetching ==', state._ui.fetch.working)
            }

            const resource = state._stack.splice(0, 1)[0]
            state._target = resource

            async function fetch(srcRes: Resource, search: boolean = false): Promise<AsyncResource> {
                // @ts-ignore
                let reqRes: AsyncResource = {}

                if (srcRes.meta === 'command') {
                    const from = srcRes.from instanceof Array ? srcRes.from : [srcRes.from]
                    const promises = from.map((r) => fetch(r, true))

                    reqRes.from = await Promise.all(promises)
                } else { // if is a regular resource
                    const slug = _.isString(srcRes) ? srcRes : srcRes.slug
                    if (slug) {
                        const result = await axios.get(`http://localhost:3000/${search ? '' : 'resources'}?q=${slug.substr(1)}`)
                        reqRes = result.data[0]
                    }
                }

                if (reqRes === undefined) {
                    return {
                        ...srcRes,
                        _synced_at: new Date(),
                        _static: true
                    }
                } else {
                    let _data = srcRes instanceof Object ? _.cloneDeep(srcRes) : {}
                    _data = Object.assign({}, _data, {_synced_at: new Date()}) // essa linha ta aqui mais pra tirar o warning do tslint

                    _.mergeWith(_data, reqRes, (objValue, srcValue, key) => {
                        // if (_.isArray(srcValue)) return srcValue.concat(objValue)
                        if (key === 'quantity') {
                            if (_.isNumber(objValue) && _.isNumber(srcValue)) {
                                return objValue + srcValue
                            }
                        } else if (key === 'equipment') {
                            if (_.isArray(objValue) && _.isArray(srcValue))
                                return srcValue.concat(objValue)
                        }
                    })

                    return _data as AsyncResource
                }
            }

            const request = await fetch(resource)

            if (request.meta === 'command') {
                // TODO Lidar com commands e answers
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

            // find equivalent path at async
            let target: any = state.async
            const paths = _.toPath(resource._path)
            const final_path = paths.pop()

            for (const path of paths) {
                const is_number = _.isNumber(path)

                if (target === undefined) {
                    // se for indefinido, partir do path para atribuir objeto/array

                    if (is_number) {
                        target = []
                    } else {
                        target = {}
                    }
                }

                if (_.isString(target)) {
                    throw new Error('Path leads to a primitive target')
                } else if (_.isArray(target)) {
                    if (!is_number) {
                        throw new Error('Non-numeric path on array target')
                    }

                    target = target[parseInt(path, 10)]
                } else {
                    // @ts-ignore
                    target = target[path]
                }
            }

            if (target === undefined) {
                // se for indefinido, partir do path para atribuir objeto/array

                if (_.isNumber(final_path)) {
                    target = []
                } else {
                    target = {}
                }
            }

            // @ts-ignore
            target[final_path] = request

            // index async resource
            state._index.async[request._uuid] = request

            // ORIGIN ja foi indexado na parte estatica

            // index command _id
            if (request.meta === 'command')
                state._index.commands[request._id] = request._uuid

            state._target = null

            console.log('FETCH RESOURCE', m(resource._uuid), request._id, '->', resource._path, resource, '->', request)

            dispatch('NEST_RESOURCES', request)
            dispatch('FETCH_RESOURCE')
        },
        async POOL_RESOURCES({ dispatch, state }) {
            if (state._stack.length === 0) return

            function extract(srcRes: Resource, search: boolean = false, as_object: boolean = true) {
                let obj: any[] = []

                if (srcRes.meta === 'command') {
                    const from = srcRes.from instanceof Array ? srcRes.from : [srcRes.from]
                    // @ts-ignore
                    obj = from.map((r) => extract(r, true, false)).reduce((arr, cur) => [...arr, ...cur], [])
                } else { // if is a regular resource
                    let slug = srcRes.slug || (srcRes.path || [])[0] || srcRes.path || srcRes
                    if (!slug) {
                        throw new Error('Empty slug cannot be fetched')
                    }

                    slug = slug[0] === '@' ? slug.substr(1) : slug
                    obj = [{
                        q: slug,
                        search
                    }]
                }

                if (as_object)
                    return {
                        [srcRes._uuid]: obj
                    }

                return obj
            }

            if (!state._ui.fetch.working) {
                state._ui.fetch.working = true
                notify({ message: 'Fetching content...', classes: 'text-italic text-center', icon: 'cloud_download', timeout: 0}).then((dismiss: Function) => {
                    state._ui.fetch.dismiss = dismiss
                })
                console.log('%c NOTIFICATION ', 'background: #ffbf00; color: black; font-weight: bold;', 'fetching...')
            }

            const POOL_SIZE = 20
            state._pooling = true

            if (state._stack.length <= POOL_SIZE) {
                await delay(250)
            }
            const pool = state._stack.splice(0, POOL_SIZE)

            const query = pool
                            .map((r) => extract(r))
                            .reduce((obj, cur) => ({...obj, ...cur}), {})

            dispatch('FETCH_RESOURCES', {query, pool})

            state._pooling = false
            dispatch('POOL_RESOURCES')
        },
        async FETCH_RESOURCES({state, dispatch}, {query, pool}) {
            const self = uuid()

            function merge(resource: Resource, result: {}) {
                const obj = {
                    ...resource,
                    _synced_at: new Date()
                }

                _.mergeWith(obj, result, (objValue, srcValue, key) => {
                    // if (_.isArray(srcValue)) return srcValue.concat(objValue)
                    if (key === 'quantity') {
                        if (_.isNumber(objValue) && _.isNumber(srcValue)) {
                            return objValue + srcValue
                        }
                    } else if (key === 'equipment') {
                        if (_.isArray(objValue) && _.isArray(srcValue))
                            return srcValue.concat(objValue)
                    }
                })

                return obj
            }

            state._fetching.push(self)

            const request = (await axios.post(`http://localhost:3000/pool`, {data: query})).data

            console.log('FETCH RESOURCES', request, self)

            const resources: AsyncResource[] = []
            for (const source of pool as Resource[]) {
                let result = request[source._uuid]

                if (source.meta === 'command') {
                    result = [{
                        from: result
                    }]
                    // TODO Lidar com commands e answers
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

                const resource: AsyncResource = merge(source, result[0])

                // find equivalent path at async
                let target: any = state.async
                const paths = _.toPath(resource._path)
                const final_path = paths.pop()

                for (const path of paths) {
                    const is_number = _.isNumber(path)

                    if (target === undefined) {
                        // se for indefinido, partir do path para atribuir objeto/array

                        if (is_number) {
                            target = []
                        } else {
                            target = {}
                        }
                    }

                    if (_.isString(target)) {
                        throw new Error('Path leads to a primitive target')
                    } else if (_.isArray(target)) {
                        if (!is_number) {
                            throw new Error('Non-numeric path on array target')
                        }

                        target = target[parseInt(path, 10)]
                    } else {
                        // @ts-ignore
                        target = target[path]
                    }
                }

                if (target === undefined) {
                    // se for indefinido, partir do path para atribuir objeto/array

                    if (_.isNumber(final_path)) {
                        target = []
                    } else {
                        target = {}
                    }
                }

                // @ts-ignore
                target[final_path] = resource

                // index async resource
                state._index.async[resource._uuid] = resource

                // ORIGIN ja foi indexado na parte estatica

                // index command _id
                if (resource.meta === 'command')
                    state._index.commands[resource._id] = resource._uuid

                console.log('    (Resource)', m(resource._uuid), resource._id, '->', resource._path, source, '->', resource)
                resources.push(resource)
            }

            state._fetching = state._fetching.filter((u) => u !== self)

            dispatch('NEST_RESOURCES', resources)
        },
        NEST_RESOURCES({state, dispatch}, resources: AsyncResource[]) {
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
                if (state._ui.fetch.working) {
                    if (state._stack.length === 0 && !state._pooling && state._fetching.length === 0 && state._nest._stack.length === 0) {
                        delay(750).then(() => {
                            if (state._ui.fetch.working) {
                                if (state._stack.length === 0 && !state._pooling && state._fetching.length === 0  && state._nest._stack.length === 0) {
                                    state._ui.fetch.working = false
                                    if (state._ui.fetch.dismiss) state._ui.fetch.dismiss()
                                    state._ui.fetch.dismiss = undefined

                                    console.log('%c NOTIFICATION (Close) ', 'background: #ffbf00; color: black; font-weight: bold;', 'fetching stopped.')
                                }
                            }
                        })
                    }
                }

                return
            }

            state._nest._nesting = true
            const resource: AsyncResource = state._nest._stack.splice(0, 1)[0]

            console.log('NESTING RESOURCE', resource, `(of ${state._nest._stack.length})`)
            // debugger
            const subscriptions = resource.subscriptions
            const injections = resource.injections
            const plugins = resource.plugins

            const table = ResourceService.table(resource) // a funcao da table é injetar um _active baseado em level automaticamente

            if (subscriptions !== undefined || injections !== undefined) {
                if (subscriptions) {
                    if (resource._uuid in (state.async._index.subscriptions || {})) {
                        console.log('TENTANDO SUBSCRIBE ALGO QUE JA FOI SUBSCRIBED', resource)
                        debugger
                    } else {
                        for (const sub of subscriptions) { // proficiencies
                            const meta = {...resource.mechanics[sub], ...(table[sub] || {})} // mechanics.proficiencies

                            let objeto: any
                            if (_.isArray(meta)) objeto = {default: meta}
                            else objeto = {...meta}

                            let index = 0
                            for (const key of Object.keys(objeto)) { // armor
                                for (const value of objeto[key]) { // @armor/light
                                    const options = {
                                        path: `${sub}[${index}]`,
                                        origin: resource._uuid,
                                        source: sub,
                                        type: key,
                                        method: 'subscription',
                                        parent: resource._id,
                                        index: ++index
                                    }

                                    // MAKE RESOURCE
                                    const nested_resource = await dispatch('CREATE_RESOURCE', {value, ...options, should_index: false})
                                    // this static resource should die here right?

                                    // PUSH TO ASYNC STACK
                                    dispatch('STACK_RESOURCE', nested_resource)
                                }
                            }
                        }

                        if (state.async._index.subscriptions === undefined) state.async._index.subscriptions = {}
                        state.async._index.subscriptions[resource._uuid] = new Date()
                    }
                }

                if (injections) {
                    if (resource._uuid in (state.static._index.injections || {})) {
                        console.log('Resource already injected', resource)
                        debugger
                    } else {
                        for (const sub of injections) { // equipment
                            const meta = {...resource.mechanics[sub], ...(table[sub] || {})} // mechanics.equipment

                            let objeto: any
                            if (_.isArray(meta)) objeto = {default: meta}
                            else objeto = {...meta}

                            let index = 0
                            for (const key of Object.keys(objeto)) { // items
                                for (const value of objeto[key]) { // @longsword
                                    const options = {
                                        path: `${sub}[${index}]`,
                                        origin: resource._uuid,
                                        source: sub,
                                        type: key,
                                        method: 'injection',
                                        parent: resource._id,
                                        index
                                    }

                                    // INJECT RESOURCE
                                    await dispatch(`SET_${sub.toUpperCase()}`, { index, value, base: options }) // automatically push to stack and index

                                    index++
                                }
                            }
                        }

                        if (state.static._index.injections === undefined) state.static._index.injections = {}
                        state.static._index.injections[resource._uuid] = new Date()
                    }
                }
            }

            state._nest._nesting = false
            dispatch('NEST_RESOURCE')
        },
        async REMOVE_RESOURCE( { state, dispatch}, resource: AsyncResource ) {
            if (resource === undefined) return

            function children(root: string): string[] {
                const _children = state._tree[root]

                if (_children === undefined) {
                    return []
                }

                const _grandchildren = _children.map(children).reduce((arr, cur) => [...arr, ...cur], [])

                return [..._children, ..._grandchildren]
            }

            const stack = [resource._uuid, ...children(resource._uuid).filter((r) => state._index.async[r]._method === 'subscription')]
            const paths = stack.map((r) => _.toPath(state._index.async[r]._path))

            for (let y = stack.length - 1; y > 0; y--) {
                let ref2 = state.async

                for (const path of paths[y]) {
                    // @ts-ignore
                    ref2 = ref2[path]
                }

                // @ts-ignore
                const target = pathToString(_.toPath(ref2._path).splice(1))

                const target_resource = state._index.async[stack[y]]
                // @ts-ignore
                await dispatch(`SET_${target_resource._source.toUpperCase()}`, { res: target_resource, value: undefined })
                // target -> SET_MISC
                // index -> SET_EQUIPMENT
            }

            let ref = state.async
            const final_path = paths[0].pop()
            for (const path of paths[0]) {
                // @ts-ignore
                ref = ref[path]
            }

            // @ts-ignore
            ref[final_path] = undefined

            delete state._index.static[resource._uuid]
            delete state._index.async[resource._uuid]

            if (resource.meta === 'command') {
                console.log('LIDAR COM A REMOCAO DE COMMANDS')
            }

            console.log('REMOVE RESOURCE', m(resource._uuid), resource._id, resource._path, '->', undefined, resource)
        },
        async SET_MISC({ state, dispatch }, { target, value, base= {}, res }) {
            if (value === undefined) {
                let resource
                if (target === undefined) {
                    target = res._type
                    resource = res
                } else {
                    // @ts-ignore
                    resource = state.static.misc[target]
                }


                // @ts-ignore
                state.static.misc[target] = undefined

                if (resource._uuid !== undefined)
                    // remove index
                    await dispatch('INDEX_RESOURCE', {resource, remove: true})

                dispatch('REMOVE_RESOURCE', resource)

                console.log('REMOVE MISC', target, resource._id || resource.name || resource.slug || resource.value, '->', undefined)
            } else {

                // PREPARE OPTIONS
                const options = {
                    ...{
                        path: `misc.${target}`,
                        origin: 'input',
                        source: 'misc',
                        type: target,
                        parent: 'misc'
                    },
                    ...base
                }

                // MAKE RESOURCE
                const resource = await dispatch('CREATE_RESOURCE', { value, ...options })

                // SET STATIC
                // @ts-ignore
                state.static.misc[target] = resource // eu deveria quardar aqui o _uuid e o resto de metadados do resource?

                // PUSH TO ASYNC STACK
                dispatch('STACK_RESOURCE', resource)

                console.log('SET MISC', value, '->', target)
            }
        },
        async SET_EQUIPMENT({ state, dispatch }, { index, value, base= {}, res }) {
            if (value === undefined) {
                let resource
                if (index === undefined) {
                    index = res._index
                    resource = res
                } else {
                    // @ts-ignore
                    resource = state.static.equipment[index]
                }

                state.static.equipment.splice(index, 1)

                if (resource._uuid !== undefined)
                    // remove index
                    await dispatch('INDEX_RESOURCE', {resource, remove: true})

                dispatch('REMOVE_RESOURCE', resource)

                console.log('REMOVE EQUIPMENT', index, resource._id || resource.name || resource.value, '->', undefined)
            } else {

                // PREPARE OPTIONS
                const options = {
                    ...{
                        path: pathToString(['equipment', index]),
                        origin: 'input',
                        source: 'equipment',
                        // type // IDEM
                        // parent // NAO TEM COMO EU SABER O _parent DAQUI
                        index
                    },
                    ...base
                }

                // MAKE RESOURCE
                const resource = await dispatch('CREATE_RESOURCE', { value, ...options })

                // SET STATIC
                state.static.equipment.splice(index, 1, resource)

                // PUSH TO ASYNC STACK
                dispatch('STACK_RESOURCE', resource)

                console.log('SET EQUIPMENT', value, '->', index)
            }
        },
        async SET_PROFICIENCIES({ state, dispatch }, { index, value, base= {}, res }) {
            if (value === undefined) {
                let resource
                if (index === undefined) {
                    index = res._index
                    resource = res
                } else {
                    // @ts-ignore
                    resource = state.static.proficiencies[index]
                }

                state.static.proficiencies.splice(index, 1)

                if (resource._uuid !== undefined)
                    // remove index
                    await dispatch('INDEX_RESOURCE', {resource, remove: true})

                dispatch('REMOVE_RESOURCE', resource)

                console.log('REMOVE PROFICIENCIES', index, resource._id || resource.name || resource.value, '->', undefined)
            } else {
                // PREPARE OPTIONS
                const options = {
                    ...{
                        path: pathToString(['proficiencies', index]),
                        origin: 'input',
                        source: 'proficiencies',
                        // type // IDEM
                        // parent // NAO TEM COMO EU SABER O _parent DAQUI
                        index
                    },
                    ...base
                }

                // MAKE RESOURCE
                const resource = await dispatch('CREATE_RESOURCE', { value, ...options })

                // SET STATIC
                state.static.proficiencies.splice(index, 1, resource)

                // PUSH TO ASYNC STACK
                dispatch('STACK_RESOURCE', resource)

                console.log('SET PROFICIENCIES', value, '->', index)
            }
        },
        async SET_FEATURES({ state, dispatch }, { index, value, base= {}, res }) {
            if (value === undefined) {
                let resource
                if (index === undefined) {
                    index = res._index
                    resource = res
                } else {
                    // @ts-ignore
                    resource = state.static.features[index]
                }

                state.static.features.splice(index, 1)

                if (resource._uuid !== undefined)
                    // remove index
                    await dispatch('INDEX_RESOURCE', {resource, remove: true})

                dispatch('REMOVE_RESOURCE', resource)

                console.log('REMOVE FEATURES', index, resource._id || resource.name || resource.value, '->', undefined)
            } else {
                // PREPARE OPTIONS
                const options = {
                    ...{
                        path: pathToString(['features', index]),
                        origin: 'input',
                        source: 'features',
                        // type // IDEM
                        // parent // NAO TEM COMO EU SABER O _parent DAQUI
                        index
                    },
                    ...base
                }

                // MAKE RESOURCE
                const resource = await dispatch('CREATE_RESOURCE', { value, ...options })

                // SET STATIC
                state.static.features.splice(index, 1, resource)

                // PUSH TO ASYNC STACK
                dispatch('STACK_RESOURCE', resource)

                console.log('SET FEATURES', value, '->', index)
            }
        }
    }
}
