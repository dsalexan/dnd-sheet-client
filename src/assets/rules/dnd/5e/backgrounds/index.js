import entertrainer from './entertrainer'


let backgrounds = [
    entertrainer
]

const slug = (() => {

    let m = {}
    for(let c of backgrounds){
        m[c.slug] = c
    }

    return m
})()

const name = (() => {
    let m = {}

    for(let c of backgrounds){
        m[c.name] = c
    }

    return m
})()

export default {
    entertrainer,
    slug, name
}