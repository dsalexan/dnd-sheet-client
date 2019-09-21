import axios from 'axios'
import _ from 'lodash'
import Vue from 'vue'

// @ts-ignore
import utils from '@/utils/resources'
import { Resource } from '@/store/sheet/types';
import { Styles } from '@/console';


function delay(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export default class Mention {
    public static async search(text: string, meta: string = '', options: {max?: number, query?: string} = {}): Promise<object[]> {
        console.log('SEARCH', text, meta)
        const {max, query} = options
        const response = await axios.get(`http://localhost:3000/${meta}?q=${text}${max ? '&max=' + max : ''}${query ? '&query=' + query : ''}`)
        return response.data
    }

    public static async sheet(id: string) {
        if (id === undefined) {
            return undefined
        }

        try {
            return (await axios.get(`http://localhost:3000/sheets?q=${id}`)).data[0]
        } catch (err) {
            throw err
        }
    }

    public static options(type: string = 'default') {
        if (type === 'default') {
            return {
                menuItemTemplate(item: any) {
                    return `<div>${utils.name(item.original)}</div><span>${item.original.path[0] || item.original.path || ''}</span>`
                },
                selectTemplate(item: any) {
                    return `<span class="mention" data-value="${JSON.stringify(item.original).replace(/\"/gmi, '\'')}">${item.original.name.en || item.original.name['pt-BR'] || item.original.name}</span>`
                },
                requireLeadingSpace: false
            }
        }
    }

    public static resolve(mention: string, state: any, reference: boolean = false, async: boolean = false) {
        // if (mention === '@me/stats/form') debugger
        if (mention.substr(0, 4) === '@me/') {
            mention = mention.substr(4)
            mention = mention.replace(/\/+/, '.')

            const paths = _.toPath(mention)
            const final = paths.pop()

            let _static = state.static
            for (const p of paths) {
                _static = _static[p]
            }

            let _async
            if (async) {
                _async = state.async
                for (const p of paths) {
                    _async = _async[p]
                }
            }

            if (!reference) {
                if (_static === undefined && _async === undefined) return undefined
                // @ts-ignore
                return _async === undefined ? _static[final] : _async[final]
            } else {
                // @ts-ignore
                if (_static === undefined && _async === undefined) {
                    debugger
                    return undefined
                }
                // @ts-ignore
                return [_async === undefined ? _static : _async, final, mention]
            }
        } else if (mention[0] === '@') {
            return Mention.search(mention.substr(1), 'resource')
        } else {
            throw new Error(`Unimplemented resolve mention for <${mention}>`)
        }
    }

    public static check(state: any, meta: string, target: string, res: Resource, type: string = 'static') {
        let parent = state[type][meta][target]
        if (meta === 'stats')
            parent = state[type].stats._[target]

        const resource = parent[target]

        if (resource === undefined || resource._uuid !== res._uuid) {
            console.log('%c WARNING ', Styles.AMBAR, 'Resource indicated is not the one in position likely was already removed by other means > ', target, res._data, res, 'in loco', resource)
            return false
        }

        return true
    }

    public static set(resource: Resource, root: any) {
        let target: any = root
        const paths = _.toPath(resource._path)
        const final_path = paths.pop()

        // get/make target reference
        for (const path of paths) {
            const is_number = !_.isNaN(parseInt(path, 10))

            if (target[path] === undefined) {
                // se o proximo alvo for indefinido, definir e tornar reativo

                if (is_number) {
                    Vue.set(target, path, [])
                } else {
                    Vue.set(target, path, {})
                }
            }

            if (is_number) {
                target = target[parseInt(path, 10)]
            } else {
                target = target[path]
            }
        }

        // ser value on target (reactive way)
        const is_final_number = !_.isNaN(parseInt(final_path as string, 10))

        if (_.isString(target)) {
            throw new Error('Path leads to a primitive target')
        } else if (_.isArray(target)) {
            if (!is_final_number) {
                throw new Error('Non-numeric path on array target')
            }
        }

        if (is_final_number) {
            Vue.set(target, parseInt(final_path as string, 10), resource)
        } else {
            Vue.set(target, final_path as string, resource)
        }
    }
}
