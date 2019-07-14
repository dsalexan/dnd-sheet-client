<template>
    <div class="dnd-spellcasting">
        <header class="dnd-header">
            <section class="charname">
                <x-input class="clean" name="spellcasting_class" label="Spellcasting Class" placeholder="Unknown" :value="spellcasting_class" reactive="false" disabled></x-input>
            </section>
            <section class="misc">
                <x-input class="clean" label="Spellcasting Ability" placeholder="INT" :value="spellcasting_ability" reactive="false" disabled/>
                <x-input class="clean" label="Spell Attack Bonus" placeholder="+0" :value="spell_attack_bonus" reactive="false" disabled/>
                <x-input class="clean" label="Spell Save DC" placeholder="10" :value="spell_save_dc" reactive="false" disabled/>
            </section>
        </header>
        <main>
            <div>
                <dnd-spell-slot 
                    :level="0" 
                    :lines="10" 
                    :entries="cantrips_known" 
                    :disabled="cantrips_known <= 0" 
                    :spells="sheet.spells.by_level[0]"
                    @spell="(index, value) => value ? sheet.spells.by_level[0].splice(index, 1, value) : sheet.spells.by_level[0].splice(index, 1) "></dnd-spell-slot>
                <dnd-spell-slot 
                    v-for="(lvl, index) in [1,2]" :key="lvl"
                    :level="lvl" 
                    :lines="[13,13][index]" 
                    :total="spell_slots(lvl)" 
                    :entries="spells_left_to_know" :disabled="spell_slots(lvl) <= 0"
                    :expended="sheet.spells.slots[lvl]"
                    @expended="sheet.spells.slots[lvl] = parseInt($event)"
                    :spells="sheet.spells.by_level[lvl]"
                    @spell="(index, value) => value ? sheet.spells.by_level[lvl].splice(index, 1, value) : sheet.spells.by_level[lvl].splice(index, 1) "></dnd-spell-slot>
            </div>
            <div> 
                <dnd-spell-slot 
                    v-for="(lvl, index) in [3,4,5]" :key="lvl"
                    :level="lvl" 
                    :lines="[13,13,10][index]" 
                    :total="spell_slots(lvl)" 
                    :entries="spells_left_to_know" :disabled="spell_slots(lvl) <= 0"
                    :expended="sheet.spells.slots[lvl]"
                    @expended="sheet.spells.slots[lvl] = parseInt($event)"
                    :spells="sheet.spells.by_level[lvl]"
                    @spell="(index, value) => value ? sheet.spells.by_level[lvl].splice(index, 1, value) : sheet.spells.by_level[lvl].splice(index, 1) "></dnd-spell-slot>
            </div><div>
                <dnd-spell-slot 
                    v-for="(lvl, index) in [6,7,8,9]" :key="lvl"
                    :level="lvl" 
                    :lines="[9,9,7,7][index]" 
                    :total="spell_slots(lvl)" 
                    :entries="spells_left_to_know" :disabled="spell_slots(lvl) <= 0"
                    :expended="sheet.spells.slots[lvl]"
                    @expended="sheet.spells.slots[lvl] = parseInt($event)"
                    :spells="sheet.spells.by_level[lvl]"
                    @spell="(index, value) => value ? sheet.spells.by_level[lvl].splice(index, 1, value) : sheet.spells.by_level[lvl].splice(index, 1) "></dnd-spell-slot>
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
            level: 'sheetlevel',
            character_class: 'sheetClass',
            spellcasting: 'sheetSpellcasting',
            proficiency_bonus: 'sheetProficiencyModifier',
            spells_known: 'sheetSpellsKnown'
        }),
        spellcasting_ability(){
            let spellcasting = this.spellcasting
            if(spellcasting == undefined) return undefined

            return spellcasting.ability.toUpperCase()
        },
        spell_attack_bonus(){
            let spellcasting = this.spellcasting
            if(spellcasting == undefined) return undefined

            return this.proficiency_bonus(spellcasting.ability, true)
        },
        spell_save_dc(){
            let bonus = this.spell_attack_bonus
            if(bonus == undefined) return undefined
            return parseInt(bonus) + 8
        },
        spellcasting_class(){
            let classe = this.character_class
            if(classe == undefined) return undefined

            return classe.spellcasting ? classe.name : undefined
        },
        cantrips_known(){
            let classe = this.character_class
            if(classe == undefined) return 0

            let level = this.level
            if(level == undefined) return 0

            return classe.spellcasting ? (classe.table[level].cantrips_known || 0) : 0
        },
        spell_slots(){
            return function(spell_level){
                let classe = this.character_class
                if(classe == undefined) return 0

                let level = this.level
                if(level == undefined) return 0

                return classe.spellcasting ? (classe.table[level].spell_slots[spell_level] || 0) : 0
            }
        },
        spells_left_to_know(){
            let classe = this.character_class
            if(classe == undefined) return undefined

            let level = this.level
            if(level == undefined) return undefined

            return classe.spellcasting ? (classe.table[level].spells_known || 0) : 0
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
