export default class Die {
    quantity: number
    die: number

    constructor(template: string, options: {quantity?: number, die?: number} = {}) {
        const {quantity, die} = options

        const t = ('.' + template + '.').split('d').map((d) => d.replace('.', '') === '' ? undefined : parseInt(d.replace('.', ''), 10))

        this.quantity = (t[0] !== undefined ? t[0] : quantity) as number
        this.die = (t[1] !== undefined ? t[1] : die) as number
    }

    get template() {
        return `${this.quantity}d${this.die}`
    }
}