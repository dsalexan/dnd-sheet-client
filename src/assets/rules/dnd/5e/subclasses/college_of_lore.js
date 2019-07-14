export default {
    name: 'College of Lore',
    slug: 'college_of_lore',
    class: 'bard',
    desc: `<p>Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales. Whether singing folk ballads in taverns or elaborate compositions in royal courts, these bards use their gifts to hold audiences spellbound. When the applause dies down, the audience members might find themselves questioning everything they held to be true, from their faith in the priesthood of the local Temple to their loyalty to the king.</p>
    <p>The loyalty of these bards lies in the pursuit of beauty and truth, not in fealty to a monarch or following the tenets of a deity. A noble who keeps such a bard as a herald or Advisor knows that the bard would rather be honest than politic.</p>
    <p>The college’s members gather in libraries and sometimes in actual colleges, complete with classrooms and dormitories, to share their lore with one another. They also meet at festivals or affairs of state, where they can expose corruption, unravel lies, and poke fun at self-important figures of authority.</p>`,
    table: {
        3: {
            features: ['bonus_proficiencies', 'cutting_words']
        },
        6: {
            features: ['additional_magical_secrets']
        },
        14: {
            features: ['peerless_skill']
        }
    },
    features: {
        bonus_proficiencies: {
            name: 'Bonus Proficiencies',
            slug: 'bonus_proficiencies',
            text: `When you join the College of Lore at 3rd level, you gain proficiency with three Skills of your choice.`
        },
        cutting_words: {
            name: 'Cutting Words',
            slug: 'cutting_words',
            text: `<p>Also at 3rd level, you learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of you makes an Attack roll, an ability check, or a damage roll, you can use your Reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature’s roll. You can choose to use this feature after the creature makes its roll, but before the GM determines whether the Attack roll or ability check succeeds or fails, or before the creature deals its damage. The creature is immune if it can’t hear you or if it’s immune to being Charmed.</p>`
        },
        additional_magical_secrets: {
            name: 'Additional Magical Secrets',
            slugs: 'additional_magical_secrets',
            text: `<p>At 6th level, you learn two Spells of your choice from any class. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.<br>
            The chosen Spells count as Bard Spells for you but don’t count against the number of Bard Spells you know.</p>`
        },
        peerless_skill: {
            name: 'Peerless Skill',
            slug: 'peerless_skill',
            text: `<p>Starting at 14th level, when you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the die for the ability check, but before the GM tells you whether you succeed or fail.</p>`
        }
    }
}