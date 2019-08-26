import axios from 'axios'
import _ from 'lodash'

import { Resource as IResource } from '@/store/sheet/types';
import { Mention } from '.';

export default class Resource {
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

    public static active(resource: IResource, state: any) {
        let _active = true
        const _targets: any = []

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

        resource._active = _active

        return _targets
    }
}
