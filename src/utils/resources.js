import _ from 'lodash'

var schema = {
    default: 'overwrite',
    // _id: 'overwrite',
    // meta: 'overwrite',
    name: 'merge_bigger',
    parent: String,
    slug: String,
    path: [String, Object],

    subscriptions: Array,
    injections: Array,
    mechanics: {
        default: []
    }
}

function isSingle(a){
    return !_.isArray(a) && !_.isObject(a)
}

var key = (() => {
    function compare(a, b, only_types=false){ // 1 = gt, 0 = eq, -1 = lt
        if(isSingle(a)){ // single
            if(isSingle(b)){ // single
                if(only_types) return 0

                if(a > b) return 1
                else if(a < b) return -1
                else return 0
            }else{ // not single
                return -1
            }
        }else if(_.isArray(a)){ // array
            if(isSingle(b)){ // single
                return 1
            }else if(_.isArray(b)){ // array
                if(only_types) return 0

                if(a.length > b.length) return 1
                else if(a.length < b.length) return -1
                else {
                    if(a > b) return 1
                    else if(a < b) return -1
                    else return 0
                }
            }else{ // object
                return -1
            }
        }else{ // object
            if(isSingle(b)){ // single
                return 1
            }else if(_.isArray(b)){ // array
                return 1
            }else{ // object
                if(only_types) return 0

                let k_a = Object.keys(a)
                let k_b = Object.keys(b)

                let v_a = Object.values(a)
                let v_b = Object.values(b)

                if(k_a.length > k_b.length) return 1
                else if(k_a.length < k_b.length) return -1
                else {
                    if(v_a.length > v_b.length) return 1
                    else if(v_a.length < v_b.length) return -1
                    else {
                        if(_.isEqual(a, b)) return 0
                        else return 1
                    }
                }
            }
        }
    }

    function type(a){
        if(isSingle(a)){
            return 'single'
        }else if(_.isArray(a)){
            return 'array'
        }else{
            return 'object'
        }
    }

    function order(a, b, directive="first"){
        let _directive = directive
        // DIRECTIVES
        //  first
        //  last
        //  bigger
        //  smaller

        if(isSingle(_directive)) _directive = [_directive, 'first']

        var helper
        helper = function(a, b, directive){
            if(directive == 'first'){
                return [a, b]
            }else if(directive == 'last'){
                return [b, a]
            }else {
                let comparasion = compare(a, b)

                if(directive == 'bigger'){
                    if(comparasion >= 0) return [a, b]
                    else return [b, a]
                }else if(directive == 'smaller'){
                    if(comparasion <= 0) return [a, b]
                    else return [b, a]
                }else{
                    throw new Error(`Inexistent directive <${directive}>`)
                }
            }
        }

        let v1 = _.cloneDeep(a)
        let v2 = _.cloneDeep(b)

        for(let d of _directive){
            [v1, v2] = helper(v1, v2, d)
        }

        return [v1, v2]
    }

    function merge(that, other, compare=false, order=''){
        // order
        //  bigger
        //  smaller
        //  first
        //  last

        if(type(that) == 'single' && type(other) == 'single') return [that]
        else {
            if(type(a) == 'single'){
                if(type(b) == 'array') return [a].concat(b)
            }
        }
    }

    return  {
        compare, type, merge
    }
})()

function name(item, from=true){
    if(typeof item == 'string') return item
    else if(typeof item == 'object') {
        if(item.meta == 'command'){
            if(item.text) return item.text
            
            if(item.choose != undefined){
                return `Choose ${item.choose} from <${from ? (item.from.map ? item.from.map(i => name(i)) : item.from) : '...'}>`
            }else{
                return '<Unknown command>'
            }
        }

        return (item.name || {}).en || (item.name || {})['pt-BR'] || item.name || item.slug || undefined
    }
}

function table(resource){
    let subs = resource.subscriptions

    let obj = {}

    if(!('table' in (resource.mechanics || {}))) return obj

    let _table = resource.mechanics.table
    
    for(let key of subs){ // para cada meta
        for(let lvl in _table){ // para cada level
            if(key in _table[lvl]){ // se houver esse sub para esse level
                if(!(key in obj)) obj[key] = {default: []}

                for(let res of _table[lvl][key]){
                    if(_.isString(res)){
                        obj[key].default.push({
                            slug: res,
                            mechanics: {
                                active: [
                                    {
                                        equals: ['@me/misc/level', parseInt(lvl)]
                                    }
                                ]
                            }
                        })
                    }else{
                        if(res.mechanics){
                            if(res.mechanics.active){
                                if(!_.isArray(res.mechanics.active)){
                                    res.mechanics.active = [res.mechanics.active]
                                }
                            }else{
                                res.mechanics.active = []
                            }
                        }else{
                            res.mechanics = {
                                active: []
                            }
                        }

                        res.mechanics.active.push({
                            equals: ['@me/misc/level', parseInt(lvl)]
                        })
                        
                        obj[key].default.push(res)
                    }
                }
            }
        }
    }

    return obj
}

function resolve(mention, state){    
    if(mention.substr(0, 4) == '@me/'){
        mention = mention.substr(4)
        mention = mention.replace(/\/+/, '.')
        
        let variable = _.get(state, mention)

        return variable
    }
}

function get(source, path){
    let _path = path
    if(typeof path == 'string'){
        _path = _.toPath(path)
    }

    let ref = undefined
    for(let p of _path){
        ref = (ref || source)[p]
    }

    return ref
}

export default {
    schema, name, table, resolve, key, get
}