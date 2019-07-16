export default {
    name: 'Entertrainer',
    slug: 'entertrainer',

    subscriptions: ['features', 'proficiencies', 'equipment'],

    proficiencies: {
        skills: ['acrobatics', 'performance'],
        tools: ['disguise_kit', 'any musical instrument']
    },
    equipment: [
        'any musical instrument', '1x favor of an admirer', '1x costume', '1x belt pouch'
    ],
    features: {
        'by_popular_demand': {
            name: 'By Popular Demand',
            slug: 'by_popular_demand',
            text: `<p>You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble’s court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night. In addition, your performance makes you something of a local figure. When strangers recognize you in a town where you have performed, they typically take a liking to you.</p>`
        }
    },
    treasure: {
        coins: {
            gp: 15
        }
    }
}