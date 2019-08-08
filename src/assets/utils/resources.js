function name(item, from=true){
    if(typeof item == 'string') return item
    else if(typeof item == 'object') {
        if(item.meta == 'command'){
            if(item.choose != undefined){
                return `Choose ${item.choose} from <${from ? (item.from.map ? item.from.map(i => name(i)) : item.from) : '...'}>`
            }else{
                return '<Unknown command>'
            }
        }

        return (item.name || {}).en || (item.name || {})['pt-BR'] || item.name || undefined
    }
}

function table(resource, level=1){
    let subs = resource.subscriptions

    let obj = {}

    if(!('table' in resource.mechanics)) return obj

    let table = resource.mechanics.table.splice(0, level)

    console.log('TABLE AS ALLOWED', table)

    for(let key of subs){
        for(let lvl = 0; lvl < level; lvl++){
            if(key in table[lvl]){
                if(!(key in obj)) obj[key] = {}
                
                for(let res of table[lvl][key]){
                    let slug = res.slug || res
                    obj[key][slug] = res
                }
            }
        }
    }
    
    for(let key of subs){
        if(key in obj)
            obj[key] = Object.values(obj[key])
    }

    return obj
}

function compile(objs){
    let obj = {}

    return obj
}

export default {
    name, table, compile
}