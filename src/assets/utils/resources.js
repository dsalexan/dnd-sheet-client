function name(item){
    if(typeof item == 'string') return item
    else if(typeof item == 'object') {
        if(item.meta == 'command'){
            if(item.choose != undefined){
                return `Choose ${item.choose} from <${item.from.map(i => name(i))}>`
            }else{
                return '<Unknown command>'
            }
        }

        return (item.name || {}).en || (item.name || {})['pt-BR'] || item.name || undefined
    }
}


export default {
    name
}