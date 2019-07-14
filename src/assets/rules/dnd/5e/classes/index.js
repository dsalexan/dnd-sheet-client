import bard from './bard'


let classes = [
    bard
]

const slug = (() => {

    let m = {}
    for(let c of classes){
        m[c.slug] = c
    }

    return m
})()

const name = (() => {
    let m = {}

    for(let c of classes){
        m[c.name] = c
    }

    return m
})()

export default {
    bard,
    slug, name
}