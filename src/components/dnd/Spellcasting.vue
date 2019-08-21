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
                    :spells="spells_by_level(0)"
                    :input="cantrips_left_to_know"
                    @expended="(event) => expendSlot(event, 0)"
                    @input="(index, value) => set_spells({index, value, level: 0}) "></dnd-spell-slot>

                <dnd-spell-slot 
                    v-for="(lvl, index) in [1,2]" :key="lvl"
                    :level="lvl" 
                    :lines="[13,13][index]" 
                    :total="spell_slots(lvl)"
                    :otherslots="other_spell_slots(lvl)"
                    :spells="spells_by_level(lvl)" 
                    :entries="spells_left_to_know" 
                    :disabled="spell_slots(lvl) <= 0"
                    :input="spells_left_to_know"
                    :expended="sheet.spells.slots[lvl]"
                    @expended="(event, level, force) => expendSlot(event, level || lvl, force)"
                    @input="(index, value) => set_spells({index, value, level: lvl}) "></dnd-spell-slot>
            </div>
            <div> 
                <dnd-spell-slot 
                    v-for="(lvl, index) in [3,4,5]" :key="lvl"
                    :level="lvl" 
                    :lines="[13,13,10][index]" 
                    :total="spell_slots(lvl)" 
                    :otherslots="other_spell_slots(lvl)"
                    :disabled="spell_slots(lvl) <= 0"
                    :input="spells_left_to_know"
                    :expended="sheet.spells.slots[lvl]"
                    @expended="(event, level, force) => expendSlot(event, level || lvl, force)"
                    :spells="spells_by_level(lvl)"
                    @input="(index, value) => set_spells({index, value, level: lvl})"></dnd-spell-slot>
            </div><div>
                <dnd-spell-slot 
                    v-for="(lvl, index) in [6,7,8,9]" :key="lvl"
                    :level="lvl" 
                    :lines="[9,9,7,7][index]" 
                    :total="spell_slots(lvl)" 
                    :otherslots="other_spell_slots(lvl)"
                    :disabled="spell_slots(lvl) <= 0"
                    :input="spells_left_to_know"
                    :expended="sheet.spells.slots[lvl]"
                    @expended="(event, level, force) => expendSlot(event, level || lvl, force)"
                    :spells="spells_by_level(lvl)"
                    @input="(index, value) => set_spells({index, value, level: lvl})"></dnd-spell-slot>
            </div>
        </main>

        <q-dialog v-model="choose_spell_level" position="bottom" @hide="handleCloseChoiceSpell">
            <q-card style="max-width: auto; min-width: 400px;" v-if="choose_spell_level">
                <q-linear-progress :value="higher_level_percentage" color="amber" />

                <q-card-section class="row items-center no-wrap" style="">
                    <div>
                        <q-chip
                            style="border-radius: 16px;"
                            round
                            v-for="level of higher_levels" :key="level"
                            clickable
                            @click="choosen_level = choosen_level == level ? undefined : level">
                            <q-avatar icon="flash_on" :color="choosen_level == level ? 'amber' : 'grey-5'" :text-color="choosen_level == level ? 'black' : 'white'" />
                            <span :style="{fontWeight: choosen_level == level ? 500 : 400}">Level</span> <span style="padding-left: 5px; opacity: 0.5">#</span><span :style="{fontWeight: choosen_level == level ? 500 : 400}">{{ level }}</span>
                        </q-chip>
                    </div>

                    <q-space />

                    <q-btn flat round color="black" icon="check" :disable="choosen_level == undefined" @click="handleChoiceSpell" v-close-popup/>
                </q-card-section>
                
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'

import _ from 'lodash'
import bus from '@/bus'
import utils from '@/assets/utils/resources'

import XInput from '@/components/utils/XInput.vue'
import SpellSlot from '@/components/dnd/SpellSlot.vue'

import {
  Quasar,
  QDialog,
  ClosePopup,
  QCard,
  QCardSection,
  QRating,
  QSeparator,
  QIcon,
  QCardActions,
  QTooltip
} from 'quasar'

export default {
    name: 'dnd-spellcasting',
    components: {
        'x-input': XInput,
        'dnd-spell-slot': SpellSlot,
        QDialog,
        QCard,
        QCardSection,
        QRating,
        QSeparator,
        QIcon,
        QCardActions,
        QTooltip
    },
    directives: {
        ClosePopup
    },
    data(){
        return {
            base_spell_level: 1,
            choose_spell_level: false,
            choose_spell_level_callback: undefined,
            choosen_level: undefined
        }
    },
    computed: {
        higher_levels(){
            let minimum = this.base_spell_level+1
            
            let arr = []
            for(let level = minimum; level <= 9; level++){
                let slots = this.spell_slots(level)
                if(slots > 0){
                    if(slots > this.sheet.spells.slots[level]){
                        arr.push(level)
                    }
                }else{
                    break
                }
            }

            return arr
        },
        higher_level_percentage(){
            let level = this.choosen_level
            if(level == undefined) return 0
            
            let minimum = this.base_spell_level-1
            let maximum = this.higher_levels[this.higher_levels.length-1]

            let m = maximum - minimum
            return (level * 1.0) / parseFloat(m)
        },
        name: utils.name,
        ...mapState([
            'sheet'
        ]),
        ...mapGetters({
            level: 'sheet/level',
            spellcasting: 'sheet/spellcasting',
            proficiency_bonus: 'sheet/proficiency_modifier'
        }),
        spellcasting_ability(){
            let spellcasting = this.spellcasting
            if(spellcasting == undefined) return undefined

            return spellcasting.mechanics.ability.replace('@', '').toUpperCase()
        },
        spell_attack_bonus(){
            let spellcasting = this.spellcasting
            if(spellcasting == undefined) return undefined

            return this.proficiency_bonus(spellcasting.mechanics.ability.replace('@', ''), true)
        },
        spell_save_dc(){
            let bonus = this.spell_attack_bonus
            if(bonus == undefined) return undefined
            return parseInt(bonus) + 8
        },
        character_class(){
            let classe = this.sheet.async.class
            return classe
        },
        spellcasting_class(){
            let classe = this.sheet.async.class
            if(classe == undefined) return undefined

            return classe.mechanics.spellcasting ? utils.name(classe) : undefined
        },
        cantrips_known(){
            let spellcasting = this.spellcasting
            if(spellcasting == undefined) return 0

            return spellcasting.mechanics.cantrips_known || 0
        },
        spell_slots(){
            return function(spell_level){
                let spellcasting = this.spellcasting
                if(spellcasting == undefined) return 0

                let total = spellcasting.mechanics.spell_slots[spell_level] || 0
                return total
            }
        },
        other_spell_slots(){
            return function(spell_level){
                let spellcasting = this.spellcasting
                if(spellcasting == undefined) return 0

                let others = _.pickBy(spellcasting.mechanics.spell_slots, (value, key) => key != spell_level)
                let total_others = _.reduce(others, (sum, val, key) => sum + val, 0)

                let expent_others = 0
                for(let i in [1, 2, 3, 4, 5, 6, 7, 8, 9]){
                    if(i > spell_level)
                        expent_others += (this.sheet.spells.slots[i] || 0)
                }

                return total_others - expent_others
            }
        },
        cantrips_left_to_know(){
            let total = this.cantrips_known
            if(total == 0) return 0

            return total - this.spells_by_level(0, true).length
        },
        spells_left_to_know(){
            let spellcasting = this.spellcasting
            if(spellcasting == undefined) return 0

            let total = spellcasting.mechanics.spells_known || 0
            if(total == 0) return 0

            let current = 0
            for(let level in this.sheet.async.spells){
                if(level > 0)
                    current += this.spells_by_level(level, true).length
            }

            return total - current
        }
    },
    methods: {
        ...mapActions({
            set_spells: 'sheet/SET_SPELLS',
        }),
        spells_by_level(level, countable=false){
            if(this.sheet.async.spells == undefined) return []
            
            if(countable)
                return this.sheet.async.spells[level].filter(s => (s.mechanics || {}).count_as_spell !== false)            
            else 
                return this.sheet.async.spells[level]
        },
        expendSlot(event, level, force_number=false){
            if(force_number){
                this.sheet.spells.slots[level] = parseInt(event || 0)
                return 
            }
            console.log('CAST SPELL', event)

            if(level > 0)
                this.sheet.spells.slots[level]++
        },
        handleChoiceSpell(){
            this.choose_spell_level = false
            if(this.choose_spell_level_callback)
                this.choose_spell_level_callback(this.choosen_level)
            
            this.choosen_level = undefined
            this.base_spell_level = 1
            this.choose_spell_level_callback = undefined
        },
        handleCloseChoiceSpell(){
            this.choose_spell_level = false
            this.choosen_level = undefined
            this.base_spell_level = 1
            
            if(this.choose_spell_level_callback)
                this.choose_spell_level_callback(this.choosen_level)
            this.choose_spell_level_callback = undefined
        }
    },
    mounted(){
        bus.$on('choose-spell-level', function(base, callback){
            this.base_spell_level = base
            this.choose_spell_level = true
            this.choose_spell_level_callback = callback
        }.bind(this))
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
