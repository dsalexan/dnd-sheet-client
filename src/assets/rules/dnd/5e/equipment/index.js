import resource from '@/assets/rules/resource'

import musical_instruments from './musical_instruments'

let list = [
    musical_instruments,
    {
        meta: 'equipment',
        name: 'Belt Pouch',
        slug: 'belt_pouch'
    }
]

export default {
    ...resource.res(list)
}