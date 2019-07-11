export default {
    list: [
        {
            name: 'Strength',
            alias: 'STR'
        },
        {
            name: 'Dexterity',
            alias: 'DEX'
        },
        {
            name: 'Constitution',
            alias: 'CON'
        },
        {
            name: 'Intelligence',
            alias: 'INT'
        },
        {
            name: 'Wisdom',
            alias: 'WIS'
        },
        {
            name: 'Charisma',
            alias: 'CHA'
        }
    ],
    map: (list) => {
        let m = {}
        for(let attr of list){
            m[attr.alias.toLowerCase()] = attr
        }

        return m
    }
}