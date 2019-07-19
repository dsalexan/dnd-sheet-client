import resource from '@/assets/rules/resource'

let list = [
        {
            name: 'Strength',
            slug: 'str'
        },
        {
            name: 'Dexterity',
            slug: 'dex'
        },
        {
            name: 'Constitution',
            slug: 'con'
        },
        {
            name: 'Intelligence',
            slug: 'int'
        },
        {
            name: 'Wisdom',
            slug: 'wis'
        },
        {
            name: 'Charisma',
            slug: 'cha'
        }
    ]

export default {
    ...resource.res(list)
}