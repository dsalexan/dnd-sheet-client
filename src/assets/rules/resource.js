
const slug = list => {

    let m = {}
    for(let c of list){
        m[c.slug] = c
    }

    return m
}

const name = list => {
    let m = {}

    for(let c of list){
        m[c.name] = c
    }

    return m
}

const all = list => {
    return list
}

const res = list => {
    return {
        ...slug(list),
        name: name(list),
        all: all(list)
    }
}

export default {
    slug, name, all,

    res
}
