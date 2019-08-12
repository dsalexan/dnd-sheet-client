class Die{
    constructor(template, quantity, die){
        let t = ('.' + template + '.').split('d').map(d => d.replace('.', '') == '' ? undefined : parseInt(d.replace('.', '')))

        this.quantity = t[0] != undefined ? t[0] : quantity
        this.die = t[1] != undefined ? t[1] : die
    }

    get template(){
        return `${this.quantity}d${this.die}`
    }
}

export default Die