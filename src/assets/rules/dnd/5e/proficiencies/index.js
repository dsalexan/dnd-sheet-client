import skills from './skills'
import saves from './saves'

export default {
    types: [
        {
            name: 'Armor',
            slug: 'armor'
        },
        {
            name: 'Skills',
            slug: 'skills',
            display: false
        },
        {
            name: 'Saves',
            slug: 'saves',
            display: false
        },
        {
            name: 'Weapons',
            slug: 'weapons'
        },
        {
            name: 'Tools',
            slug: 'tools'
        },
        {
            name: 'Languages',
            slug: 'languages'
        }
    ],
    skills,
    saves
}