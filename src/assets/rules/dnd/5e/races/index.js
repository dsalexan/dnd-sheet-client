import fairy from './fairy'


let races = [
    fairy
]

const slug = (() => {

    let m = {}
    for(let c of races){
        m[c.slug] = c
    }

    return m
})()

const name = (() => {
    let m = {}

    for(let c of races){
        m[c.name] = c
    }

    return m
})()

export default {
    fairy,
    slug, name
}