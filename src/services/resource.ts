import axios from 'axios'
import _ from 'lodash'

import { Resource as IResource, AsyncResource } from '@/store/sheet/types';
import { Mention } from '.';
import { Styles } from '@/console';

import LZUTF8 from 'lzutf8'

export default class Resource {
    public static string(item: IResource | string, from: boolean = true): string {
        if (typeof item === 'string') return item
        else if (typeof item === 'object') {
            if (item.meta === 'command') {
                if (item.text) return item.text

                if (item.choose !== undefined) {
                    return `Choose ${item.choose} from <${from ? (item.from.map ? item.from.map((i: any) => Resource.string(i)) : item.from) : '...'}>`
                } else {
                    return '<Unknown command>'
                }
            }

            return (item.name || {}).en || (item.name || {})['pt-BR'] || item.name || item.slug || undefined
        }
        return '<Unknown>'
    }

    public static minimal(value: IResource) {
        return {
            slug: '@' + (value.path[0] || value.path),
            _id: value._id
        }
    }

    public static leftover(resource: IResource, state: any) {
        const stack_defrag = Resource.defrag(resource, false)

        const _async = Mention.resolve('@me/' + resource._path, state, false, true)
        const fetch_defrag = !!_async && Resource.defrag(_async, false)

        return {
            ...resource,
            _stack_defrag: stack_defrag,
            _fetch_defrag: fetch_defrag
        }
    }

    public static table(resource: IResource) {
        const obj: {
            [key: string]: {
                [type: string]: any[]
            }
        } = {}

        if (!('table' in (resource.mechanics || {}))) return obj

        const _table = resource.mechanics.table

        for (const key of resource.subscriptions) { // para cada meta
            for (const lvl in _table) { // para cada level
                if (key in _table[lvl]) { // se houver esse sub para esse level
                    if (!(key in obj)) obj[key] = {default: []}

                    for (const res of _table[lvl][key]) {
                        if (_.isString(res)) {
                            obj[key].default.push({
                                slug: res,
                                mechanics: {
                                    active: [
                                        {
                                            '>=': ['@me/misc/level', parseInt(lvl, 10)]
                                        }
                                    ]
                                }
                            })
                        } else {
                            if (res.mechanics) {
                                if (res.mechanics.active) {
                                    if (!_.isArray(res.mechanics.active)) {
                                        res.mechanics.active = [res.mechanics.active]
                                    }
                                } else {
                                    res.mechanics.active = []
                                }
                            } else {
                                res.mechanics = {
                                    active: []
                                }
                            }

                            res.mechanics.active.push({
                                '>=': ['@me/misc/level', parseInt(lvl, 10)]
                            })

                            obj[key].default.push(res)
                        }
                    }
                }
            }
        }

        return obj
    }

    public static active(resource: IResource, {state, dispatch}: any, parent: boolean = true) {
        let _active = true
        const _targets: any = []
        const oldActive = resource._active

        // INSTEAD WHEN PARENT IS EVALUATED CALL FOR EVALUATION OF CHILDREN
        // // evaluate recursively for parent`s activeness
        // if (resource._origin !== 'input') {
        //     const parent_path = state._index.static[resource._origin]._path
        //     const parent = Mention.resolve('@me/' + parent_path, state)
        //     this.active(parent, state) // re calc parent
        //     if (parent._active === false) _active = false
        // }

        if (_active) {
            if (!resource.mechanics) {
                _active = true
            } else if (!resource.mechanics.active) {
                _active = true
            } else { // has active condition
                const conditions = resource.mechanics.active

                _active = conditions
                    .map((condition: {[method: string]: string[]}) => {
                        let sum = true
                        for (const method of Object.keys(condition)) { // equals, greater-then, lesser
                            const path = condition[method][0]
                            const value = condition[method][1]

                            let target = Mention.resolve(path, state, true)
                            _targets.push(target)

                            if (target === undefined) debugger
                            target = target[0][target[1]]

                            if (['equals', 'equal', 'eq', '=', '==', '==='].includes(method)) {
                                sum = sum && (target == value)
                            } else if (['greater-then-or-equal', 'greater-or-equal', 'greater-then-equal', 'greater-equal', 'ge', '>=', '>=='].includes(method)) {
                                sum = sum && (target >= value)
                            } else {
                                throw new Error(`Unimplemented conditional method: <${method}>`)
                            }
                        }
                        return sum
                    })
                    .reduce((sum: boolean, cur: boolean) => sum && cur, true)
            }
        }

        if (_active !== oldActive) {
            resource._active = _active
            if (dispatch) dispatch('RIPPLE_RESOURCE', {directive: _active, resource})
        }

        return _targets
    }

    public static merge(objValue: any, srcValue: any, key: any, object: any, source: any, stack: any) {
        const METADATA = [
            '_uuid',
            '_path',
            '_origin',
            '_source',
            '_type',
            '_method',
            '_parent',
            '_active',
            '_data',
            '_index'
        ]

        if (METADATA.includes(key)) {
            return objValue
        }

        // if (_.isArray(srcValue)) return srcValue.concat(objValue)
        if (key === 'quantity') {
            const defaults = (value: string) => _.isNaN(parseInt(value, 10)) ? 1 : parseInt(value, 10)

            return defaults(objValue) + defaults(srcValue)
        } else if (key === 'equipment') {
            if (_.isArray(objValue) && _.isArray(srcValue))
                return srcValue.concat(objValue)
        }
    }

    public static extend(resource: IResource, data: {}, state: any): AsyncResource {
        const METADATA = [
            '_path',
            '_origin',
            '_source',
            '_type',
            '_method',
            '_parent',
            '_active',
            '_data',
            '_index'
        ]

        const copy = {...resource}


        delete copy._uuid
        for (const meta of METADATA) {
            delete copy[meta]
        }

        const obj = {
            _uuid: resource._uuid,
            ...copy,
            _synced_at: new Date(),
            _async: true
        }

        for (const meta of METADATA) {
            Object.defineProperty(obj, meta, {
                enumerable: false,   // não enumerável
                configurable: false, // não configurável
                get: () => {
                    const _resource = state._index.static[resource._uuid]

                    if (_resource === undefined) debugger

                    // @ts-ignore
                    let target = _resource._method === 'plugin' ? state : state.static
                    for (const p of _.toPath(_resource._path)) {
                        target = target[p]
                        if (target === undefined) {
                            console.trace('%c ERROR ', Styles.RED, 'Path most likely incorrect', resource._uuid, _resource._path)
                            debugger
                            return undefined
                        }
                        if ('_' in target) target = target._
                    }

                    if (target === undefined) debugger
                    return target[meta]
                },
                set: (value: any) => {
                    const _resource = state._index.static[resource._uuid]

                    // @ts-ignore
                    const path = _.toPath(_resource._path)
                    const final = path.pop()

                    let target = _resource._method === 'plugin' ? state : state.static
                    for (const p of path) {
                        target = target[p]
                        if (target === undefined) {
                            console.trace('%c ERROR ', 'Path most likely incorrect', resource._uuid, _resource._path)
                            return undefined
                        }
                        if ('_' in target) target = target._
                    }

                    if (target === undefined || target[final as string] === undefined) debugger

                    if (_resource._source === 'stats' && !value) {
                        console.log('%c WARNING ', Styles.AMBAR, 'What effect should have setting a stat active to FALSE')
                    }

                    return target[final as string][meta] = value
                }
            })
        }

        _.mergeWith(obj, data, Resource.merge)

        return obj as AsyncResource
    }

    public static virtual(resources: AsyncResource[], state: any, flag: boolean = true): AsyncResource {
        const METADATA = [
            // '_path', // this metadata is SINGULAR
            '_origin',
            '_source',
            '_type',
            // '_method', // this metadata is SINGULAR
            '_parent',
            // '_active', // this is ALWAYS true
            // '_data', // this metadata is SINGULAR
            // '_index' // this metadata is SINGULAR
        ]
        const KEYS = Array.from(resources.map((r) => Object.keys(r)).reduce((set, arr) => {
            arr.forEach((cur) => {
                if (!['_uuid', '_async', '_modified_at', '_synced_at'].includes(cur))
                    set.add(cur)
            })
            return set
        }, new Set()))

        const PROPS: string[] = [...METADATA, ...KEYS] as string[]

        const target: any = {
            _uuid: `${flag ? 'VIRTUAL-' : ''}${resources[resources.length - 1]._uuid}`,
            _virtual: true,
            _resources: resources.map((r) => r._uuid)
        }

        Object.defineProperty(target, '__async__', {
            enumerable: false,
            configurable: false,
            get() {
                const oneOrMany = this._resources.map((_uuid: string) =>
                    state._index.async[_uuid]
                )

                if (oneOrMany.length === 1) return oneOrMany[0]
                return oneOrMany
            }
        })

        for (const prop of PROPS) {
            Object.defineProperty(target, prop, {
                enumerable: false,   // não enumerável
                configurable: false, // não configurável
                get() {
                    const existent = this._resources.map((_uuid: string) => ({
                        async: state._index.async[_uuid],
                        resource: _uuid
                    })).filter((res: any) => res.async !== undefined)

                    if (existent.length === 0) {
                        // resource probably doenst exist anymore
                        console.log('%c                               %c ATTENTION ', '', Styles.LIGHTEN_YELLOW, 'Original resources probably dont exist anymore', this._resources)
                        return undefined
                    }

                    let values = (existent.map((res: any) => ({
                        ...res,
                        type: _.isArray(res.async[prop]) ? 'array' : _.isObjectLike(res.async[prop]) ? 'object' : 'primitive',
                        value: _.isArray(res.async[prop]) ? [...res.async[prop]] : _.isObjectLike(res.async[prop]) ? {...res.async[prop]} : res.async[prop]
                    }))).filter((v: any) => v.value !== undefined)

                    // @ts-ignore
                    const _var_type = Array.from(new Set(values.map((v: any) => v.type)))
                    if (_var_type.length > 1) {
                        debugger
                        throw new Error('Unimplemented dealing with multiple variable types in virtualization')
                    }


                    if (prop === '_path' || prop === '_index') {
                        values = values.splice(-1)
                    }

                    let result: any = _var_type[0] === 'array' ? [] : {}
                    if (_var_type[0] === 'object') {

                        for (const value of values) {
                            if (prop === 'mechanics') {
                                result.quantity = result.quantity || 0
                                value.value.quantity = value.value.quantity === undefined ? 1 : value.value.quantity
                            }

                            result = _.mergeWith(result, value.value, Resource.merge)
                        }
                    } else if (_var_type[0] === 'array') {
                        for (const value of values) {
                            result = [...result, ...value.value]
                        }
                    } else {
                        result = values.splice(-1)[0].value
                    }

                    return result
                },
                set(value: any) {
                    console.log('%c ERROR ', Styles.RED, 'Should not set in VirtualResource', value, this)
                }
            })
        }

        target._path = resources[resources.length - 1]._path
        target._index = resources[resources.length - 1]._index

        // @ts-ignore
        return target
    }

    public static defrag(resource: IResource, virtual: boolean = false): string {
        const data = resource._id || resource.slug || (resource.path || [])[0] || resource.path || resource.name

        if (virtual) return `${resource._source}.${resource._origin}.${data}`

        const active = resource.mechanics && resource.mechanics.active && LZUTF8.compress(JSON.stringify(resource.mechanics.active), {
            outputEncoding: 'Base64'
        })

        return `${resource._source}.${resource._origin}.${data}${active === undefined ? '' : '.' + active}`
    }

    public static weapon(resource: IResource) {
        const obj = {...resource}
        const properties: any = {
            improvised: false, // default
            melee: true, // default
            reach: [5, 'ft'], // default
            bonus: 0, // default

            finesse: true,

            ranged: false, // special
            thrown: false, // special

            versatile: false, // special

            light: false,
            loading: false
        }

        for (const prop of (obj.mechanics.properties || [])) {
            if (prop in properties) properties[prop] = true
            else {
                if (prop.match(/versatile/gi)) properties.versatile = prop.match(/\d?d\d+/gi)[0]
                else if (prop.match(/thrown/gi)) properties.thrown = (/range (\d+\/\d+)/gi.exec(prop) as string[])[1].split('/').map((r) => [parseInt(r, 10), 'ft'])
                else if (prop.match(/ammunition/gi)) {
                    properties.ranged = (/range (\d+\/\d+)/gi.exec(prop) as string[])[1].split('/').map((r) => [parseInt(r, 10), 'ft'])
                    properties.melee = false
                } else throw new Error('Unimplemented weapon property ' + `<${prop}> for resource: ${resource._data}`)
            }
        }

        properties.ability = properties.ranged ? 'dex' : 'str'

        obj.utils = {
            type: properties.ranged ? 'ranged' : 'melee',
            ability: properties.ability,

            modifier(store: any) {
                const proficiency_modifier = store.getters['sheet/proficiency_modifier']

                const value = proficiency_modifier(properties.ability, false)
                return value
            }
        }

        return obj
    }
}
