<template>
    <div class="dnd-spellcasting">
        <header class="dnd-header">
            <section class="charname">
                <x-input class="clean" name="spellcasting_class" label="Spellcasting Class" placeholder="Unknown" :value="spellcasting_class" reactive="false" disabled></x-input>
            </section>
            <section class="misc">
                <x-input class="clean" label="Spellcasting Ability" placeholder="INT" :value="spellcasting.ability.toUpperCase()" reactive="false" disabled/>
                <x-input class="clean" label="Spell Attack Bonus" placeholder="+0" :value="spell_attack_bonus" reactive="false" disabled/>
                <x-input class="clean" label="Spell Save DC" placeholder="10" :value="spell_save_dc" reactive="false" disabled/>
            </section>
        </header>
        <main>
            <div>
                <dnd-spell-slot :level="0" :lines="10"></dnd-spell-slot>
                <dnd-spell-slot :level="1" :lines="13"></dnd-spell-slot>
                <dnd-spell-slot :level="2" :lines="13"></dnd-spell-slot>
            </div>
            <div>
                <dnd-spell-slot :level="3" :lines="13"></dnd-spell-slot>
                <dnd-spell-slot :level="4" :lines="13"></dnd-spell-slot>
                <dnd-spell-slot :level="5" :lines="10"></dnd-spell-slot>
            </div><div>
                <dnd-spell-slot :level="6" :lines="9"></dnd-spell-slot>
                <dnd-spell-slot :level="7" :lines="9"></dnd-spell-slot>
                <dnd-spell-slot :level="8" :lines="7"></dnd-spell-slot>
                <dnd-spell-slot :level="9" :lines="7"></dnd-spell-slot>
            </div>
        </main>
    </div>
</template>

<script>
import {mapState, mapMutations, mapGetters} from 'vuex'

import XInput from '@/components/utils/XInput.vue'
import SpellSlot from '@/components/dnd/SpellSlot.vue'

export default {
    name: 'dnd-spellcasting',
    components: {
        'x-input': XInput,
        'dnd-spell-slot': SpellSlot
    },
    computed: {
        ...mapState([
            'sheet'
        ]),
        ...mapGetters({
            character_class: 'sheetClass',
            spellcasting: 'sheetSpellcasting',
            proficiency_bonus: 'sheetProficiencyModifier'
        }),
        spell_attack_bonus(){
            return this.proficiency_bonus(this.spellcasting.ability, true)
        },
        spell_save_dc(){
            let bonus = this.spell_attack_bonus
            if(bonus == undefined) return undefined
            return parseInt(bonus) + 8
        },
        spellcasting_class(){
            let c = this.character_class
            return c.spellcasting ? c.name : undefined
        }
    }
}
</script>

<style lang="sass" scoped>
    @import '@/assets/sass/dnd5e-sheet.sass'

    div.dnd-spellcasting
        display: block

        header.dnd-header
            display: flex !important
            align-contents: stretch
            align-items: stretch
            margin-bottom: $gutter * 2
            
            section.charname
                border: 1px solid black
                border-right: 0
                border-radius: $radius 0 0 $radius
                padding: 5px 0
                background-color: $faded-light
                width: 30%
                bottom: 0
                top: 0
                display: flex
                margin: auto
                
                div
                    display: flex
                    flex-direction: column-reverse
                    margin: auto
                    width: 100%
                    margin: 0 $radius

                    input
                        padding: 0.5em
                        margin: 5px
                        border: 0
                    
                    label
                        padding-left: 1em
            
            section.misc
                width: 70%
                border: 1px solid black
                border-radius: $radius
                padding: 1em

                display: flex
                flex-wrap: wrap
                background-color: lightgray
                
                > div
                    flex-basis: 33.333%

                    display: flex
                    flex-direction: column-reverse
                    align-items: center

                    & /deep/ label
                        font-size: 8px
                        width: $wide-box-width - $radius*2
                        border: 1px solid black
                        border-top: 0
                        background-color: $bg
                        text-align: center
                        padding-top: 5px
                        padding-bottom: 5px
                        border-radius: 0 0 $radius $radius

                    & /deep/ input
                        height: $small-box-width + $radius
                        width: $wide-box-width
                        border-radius: $radius
                        border: 1px solid black
                        text-align: center
                        font-size: 20px
            
        main
            display: grid
            grid-template-columns: 1fr 1fr 1fr
            grid-column-gap: 20px

            div.dnd-spell-slot
                padding-top: $gutter*2

                &:first-of-type
                    padding-top: 0
</style>
