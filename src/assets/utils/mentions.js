function template(item){
    return `<span contenteditable="false" class="mention" onclick="eval('window.bus.$emit(\\'mention-click\\', \\'${JSON.stringify(item.original).replace(/\"/gmi, "\\\\\\'")}\\')')">@${item.original.path[0] || item.original.path}</span>`;
}

function parse(text, source=undefined){
    if(!text) return text

    let rest = String(text).split(/@\w+/gmi)
    let mentions = String(text).match(/@\w+/gmi) || []

    if(mentions.length == 0) return text

    let data = (i) => ({
        original: {
            key: i.substr(1),
            value: i.substr(1)
        }
    })
    if(source){
        data = (i) => {
            if(i.substr(1) == '') return ''
            return lookup(source, i.substr(1))
        }
    }

    mentions = mentions.map(i => template(data(i)))

    let list = rest.reduce(function(arr, v, i) {
        return arr.concat(v, mentions[i]); 
    }, []);
    return list.join('')
}

function lookup(source, value){
    for(let item of source){
        if(item.value == value){
            return {
                original: item
            }
        }
    }
}

let test = [
    { key: "Collin Henderson", value: "syropian" },
    { key: "Sarah Drasner", value: "sarah_edo" },
    { key: "Evan You", value: "youyuxi" },
    { key: "Adam Wathan", value: "adamwathan" },
    { key: "Krakoa Island", value: "krakoa" },
    { key: "Cuckoo Sisters", value: "cuckoo" },
    { key: "House X", value: "x" }
]

export default {
    parse, 
    template,
    lookup,
    test
}