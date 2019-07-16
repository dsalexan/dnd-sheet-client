export default {
    meta: 'class',
    name: 'Bard',
    slug: 'bard',

    subscriptions: ['features', 'proficiencies', 'equipment'],

    hit_dice: '1d8',
    proficiencies: {
        meta: 'proficiencies',
        armor: ['light_armor'],
        weapons: ['simple', 'hand_crossbow', 'longsword', 'rapier', 'shortsword'],
        tools: [
            {
                choose: 'any 3'
            }
        ],
        saves: ['dex', 'cha'],
        skills: [
            {
                choose: 'any 3'
            }
        ]
    },
    equipment: [
        ['1x rapier', '1x longsword', 'any simple'],
        ['1x diplomat\'s pack', '1x entertainer\'s pack'],
        ['1x lute', 'any musical instrument'],
        [['1x lether armor', '1x dagger']]
    ],
    table: {
        1: {
            features: ['spellcasting', 'bardic_inspiration'],
            cantrips_known: 2,
            spells_known: 4,
            spell_slots: {
                1: 2
            }
        },
        2: {
            features: ['jack_of_all_trades', 'song_of_rest'],
            cantrips_known: 2,
            spells_known: 5,
            spell_slots: {
                1: 3
            }
        },
        3: {
            features: ['bard_college', 'expertise'],
            cantrips_known: 2,
            spells_known: 6,
            spell_slots: {
                1: 4,
                2: 2
            }
        },
        4: {
            features: ['ability_score_improvement'],
            cantrips_known: 3,
            spells_known: 7,
            spell_slots: {
                1: 4,
                2: 3
            }
        },
        5: {
            features: ['font_of_inspiration'],
            cantrips_known: 3,
            spells_known: 8,
            spell_slots: {
                1: 4,
                2: 3,
                3: 2
            }
        },
        6: {
            features: ['countercharm'],
            cantrips_known: 3,
            spells_known: 9,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3
            }
        },
        7: {
            features: [],
            cantrips_known: 3,
            spells_known: 10,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 1
            }
        },
        8: {
            features: ['ability_score_improvement'],
            cantrips_known: 3,
            spells_known: 11,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 2
            }
        },
        9: {
            features: [],
            cantrips_known: 3,
            spells_known: 12,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 1
            }
        },
        10: {
            features: ['expertise', 'magical_secrets'],
            cantrips_known: 4,
            spells_known: 14,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 2
            }
        },
        11: {
            features: [],
            cantrips_known: 4,
            spells_known: 15,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 2,
                6: 1
            }
        },
        12: {
            features: ['ability_score_improvement'],
            cantrips_known: 4,
            spells_known: 15,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 2,
                6: 1
            }
        },
        13: {
            features: [],
            cantrips_known: 4,
            spells_known: 16,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 2,
                6: 1,
                7: 1
            }
        },
        14: {
            features: ['magical_secrets'],
            cantrips_known: 4,
            spells_known: 18,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 2,
                6: 1,
                7: 1
            }
        },
        15: {
            features: [],
            cantrips_known: 4,
            spells_known: 19,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 2,
                6: 1,
                7: 1,
                8: 1
            }
        },
        16: {
            features: ['ability_score_improvement'],
            cantrips_known: 4,
            spells_known: 19,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 2,
                6: 1,
                7: 1,
                8: 1
            }
        },
        17: {
            features: [],
            cantrips_known: 4,
            spells_known: 20,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 2,
                6: 1,
                7: 1,
                8: 1,
                9: 1
            }
        },
        18: {
            features: ['magical_secrets'],
            cantrips_known: 4,
            spells_known: 22,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 3,
                6: 1,
                7: 1,
                8: 1,
                9: 1
            }
        },
        19: {
            features: ['ability_score_improvement'],
            cantrips_known: 4,
            spells_known: 22,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 3,
                6: 2,
                7: 1,
                8: 1,
                9: 1
            }
        },
        20: {
            features: ['superior_inspiration'],
            cantrips_known: 4,
            spells_known: 22,
            spell_slots: {
                1: 4,
                2: 3,
                3: 3,
                4: 3,
                5: 3,
                6: 2,
                7: 2,
                8: 1,
                9: 1
            }
        }
    },
    features: {
        spellcasting: {
            meta: 'feature',
            name: 'Spellcasting',
            slug: 'spellcasting',
            text: undefined,
            mechanics: {
                regain_slots: 'on long_rest',
                on_level_up: 'replace one spell known',
                ability: 'cha',
                ritual_casting: true,
                prepare_spells: false
            }
        },
        bardic_inspiration: {
            meta: 'feature',
            name: 'Bardic Inspiration',
            slug: 'bardic_inspiration',
            text: `<p>You can inspire others through stirring words or music. To do so, you use a Bonus Action on Your Turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6.</p>
            <p>Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, Attack roll, or saving throw it makes. The creature can wait until after it rolls The D20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.</p>
            <p>You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a Long Rest.</p>
            <p>Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level.</p>`
        },
        jack_of_all_trades: {
            meta: 'feature',
            name: 'Jack of All Trades',
            slug: 'jack_of_all_trades',
            text: `<p>Starting at 2nd level, you can add half your Proficiency Bonus, rounded down, to any ability check you make that doesn't already include your Proficiency Bonus.</p>`
        },
        song_of_rest: {
            meta: 'feature',
            name: 'Song of Rest',
            slug: 'song_of_rest',
            text: `<p>Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a Short Rest. If you or any friendly creatures who can hear your Performance regain Hit Points by spending Hit Dice at the end of the Short Rest, each of those creatures regains an extra 1d6 Hit Points.</p>
            <p>The extra Hit Points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level.</p>`
        },
        bard_college: {
            meta: 'feature',
            name: 'Bard College',
            slug: 'bard_college',
            text: `The way of a bard is gregarious. Bards seek each other out to sw ap so n g s and stories, boast of their accomplishments, and share their knowledge. Bards form loose associations, which they call colleges, to facilitate their gatherings and p reserve their traditions.`,
            mechanics: '$subclass:bard_college'
        },
        expertise: {
            meta: 'feature',
            name: 'Expertise',
            slug: 'expertise',
            text: `<p>At 3rd level, choose two of your skill proficiencies. Your Proficiency Bonus is doubled for any ability check you make that uses either of the chosen proficiencies.</p>
            <p>At 10th level, you can choose another two skill proficiencies to gain this benefit.</p>`
        },
        ability_score_improvement: {
            meta: 'feature',
            name: 'Ability Score Improvement',
            slug: 'ability_score_improvement',
            text: `<p>When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two Ability Scores of your choice by 1. As normal, you can’t increase an ability score above 20 using this feature.</p>`
        },
        font_of_inspiration: {
            meta: 'feature',
            name: 'Font of Inspiration',
            slug: 'font_of_inspiration',
            text: `<p>Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or Long Rest.</p>`
        },
        countercharm: {
            meta: 'feature',
            name: 'Countercharm',
            slug: 'countercharm',
            text: `<p>At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing Effects. As an action, you can start a Performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on Saving Throws against being Frightened or Charmed. A creature must be able to hear you to gain this benefit. The Performance ends early if you are Incapacitated or silenced or if you voluntarily end it (no action required).</p>`
        },
        magical_secrets: {
            meta: 'feature',
            name: 'Magical Secrets',
            slug: 'magical_secrets',
            text: `<p>By 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two Spells from any class, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.</p>
            <p>The chosen Spells count as Bard Spells for you and are included in the number in the Spells Known column of the Bard table.</p>
            <p>You learn two additional Spells from any class at 14th level and again at 18th level.</p>`
        },
        superior_inspiration: {
            meta: 'feature',
            name: 'Superior Inspiration',
            slug: 'superior_inspiration',
            text: `<p>At 20th level, when you roll Initiative and have no uses of Bardic Inspiration left, you regain one use.</p>`
        }
    },
    spellcasting: 'features.spellcasting.mechanics'
}