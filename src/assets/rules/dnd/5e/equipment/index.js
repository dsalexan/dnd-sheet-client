import resource from '@/assets/rules/resource'

import musical_instrument from './musical_instrument'

let list = [
    musical_instrument,
    {
        meta: 'equipment',
        name: 'Belt Pouch',
        slug: 'belt_pouch'
    }
]

export default {
    ...resource.res(list)
}