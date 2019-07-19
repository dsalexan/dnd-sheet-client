export default {
    meta: 'race',
    name: 'Fairy',
    slug: 'fairy',

    subscriptions: ['features', 'proficiencies'],

    traits: {
        ability_score_increase: {
            cha: 2,
            dex: 1,
            str: -1
        },
        size: {
            humanoid_form: 'medium',
            tiny_form: 'tiny'
        },
        speed: {
            humanoid_form: ['walk 25ft', 'flight 30ft special'],
            tiny_form: ['walk 10ft', 'flight 50ft no-armor ']
        }
    },
    proficiencies: {
        meta: 'proficiencies',
        languages: {
            common: ['speak', 'read', 'write'],
            sylvan: ['speak', 'read', 'write']
        }
    },
    features: [
        {
            meta: 'feature',
            name: 'Humanoid Fey',
            slug: 'humanoid_fey',
            text: `<p>You are considered to be both Humanoid and Fey.</p>`
        },
        {
            meta: 'feature',
            name: 'Faeform',
            slug: 'faeform',
            text: `<p>Fae (or fairies) are able to adjust their size in accordance with mood, whim, or environment – a choice between their tiny form or humanoid form. In the tiny form it’s facial traits become much more symmetrical and sharp, butterfly wings burst from the back and the skin color shifts to a aberrant tone (often to a excessively pale white or a dark as night onyx). In the humanoid form a fairy could almostlyr be mistaken for a high elf - if not for their irregular eyes (often entirely black, or with unnaturally large irises in an iridescent rainbow of varying colors) and the wings (not as big proportionally when compared to it’s tiny form) that unfold from their shoulder blades. Fairies can change between Fae form and Humanoid form for a maximum of once between short or long rests. For a extra change before a rest, you gain one point of exhaustion.</p>`
        },
        {
            meta: 'feature',
            name: 'Fey Ancestry',
            slug: 'fey_ancestry',
            text: `<p>You have advantage on saving throws against being charmed, and magic can’t put you to sleep.</p>`
        },
        {
            meta: 'feature',
            name: 'Gift of the Tricky',
            slug: 'gift_of_the_tricky',
            text: '<p>You have proficiency with deception, perception and arcana checks.</p>'
        },
        {
            meta: 'feature',
            name: 'True Name',
            slug: 'true_name',
            text: '<p>A fae have advantage in all charisma checks against a creature whose name were freely (not under effect of spells such suggestion) given to the fairy. If a fairy give it’s true name freely to a creature, such creature will have advantage in all charisma checks against the fairy.</p>'
        },
        {
            meta: 'feature',
            name: 'Feeble',
            slug: 'feeble',
            text: '<p>Your small body makes you unfit for feats of strength. You make Strength rolls at disadvantage and can’t wield weapons without the Undersized property while in tiny form.</p> '
        }
    ]
}