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
                    :expended="sheet.static.attributes.spell_slots[lvl] || 0"
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
                    :expended="sheet.static.attributes.spell_slots[lvl]"
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
                    :expended="sheet.static.attributes.spell_slots[lvl]"
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

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'

import _ from 'lodash'
import { Bus } from '@/bus'

import XInput from '@/components/utils/XInput.vue'
import SpellSlot from '@/components/dnd/sheet/SpellSlot.vue'
import { Resource } from '../../../services';
import { Styles } from '../../../console';

@Component({
    components: {
        'x-input': XInput,
        'dnd-spell-slot': SpellSlot,
    },
    computed: {
        ...mapState([
            'sheet'
        ]),
        ...mapGetters({
            level: 'sheet/level',
            spellcasting: 'sheet/spellcasting',
            proficiency_bonus: 'sheet/proficiency_modifier'
        }),
    },
    methods: {
        ...mapActions({
            set_spells: 'sheet/SET_SPELLS',
        })
    },
    model: {
        prop: 'value',
        event: 'input'
    }
})
export default class Spellcasting extends Vue {
    base_spell_level: number = 1
    choose_spell_level: boolean = false
    choose_spell_level_callback: any
    choosen_level: number | undefined

    sheet!: any
    spellcasting!: any
    proficiency_bonus!: any

    spell_slots(spell_level: number) {
        const spellcasting = this.spellcasting
        if (spellcasting === undefined) return 0

        const total = spellcasting.mechanics.spell_slots[spell_level] || 0
        return total
    }

    other_spell_slots(spell_level: number) {
        const spellcasting = this.spellcasting
        if (spellcasting === undefined) return 0

        const others = _.pickBy(spellcasting.mechanics.spell_slots, (value, key: number) => key !== spell_level)
        const total_others = _.reduce(others, (sum, val, key) => sum + val, 0)

        let expent_others = 0
        for (const i in [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            if (parseInt(i, 10) > spell_level)
                expent_others += (this.sheet.static.attributes.spell_slots[i] || 0)
        }

        return total_others - expent_others
    }

    get higher_levels() {
        const minimum = this.base_spell_level + 1

        const arr = []
        for (let level = minimum; level <= 9; level++) {
            const slots = this.spell_slots(level)
            if (slots > 0) {
                if (slots > (this.sheet.static.attributes.spell_slots[level] || 0)) {
                    arr.push(level)
                }
            } else {
                break
            }
        }

        return arr
    }

    higher_level_percentage() {
        const level = this.choosen_level
        if (level === undefined) return 0

        const minimum = this.base_spell_level - 1
        const maximum = this.higher_levels[this.higher_levels.length - 1]

        return (level * 1.0) / maximum - minimum
    }

    name(value: any) {
        return Resource.string(value)
    }

    get spellcasting_ability() {
        const spellcasting = this.spellcasting
        if (spellcasting === undefined) return undefined

        return spellcasting.mechanics.ability.replace('@', '').toUpperCase()
    }

    get spell_attack_bonus() {
        const spellcasting = this.spellcasting
        if (spellcasting === undefined) return undefined

        return this.proficiency_bonus(spellcasting.mechanics.ability.replace('@', ''), true)
    }

    get spell_save_dc() {
        const bonus = this.spell_attack_bonus
        if (bonus === undefined) return undefined

        return parseInt(bonus, 10) + 8
    }

    get character_class() {
        return this.sheet.virtual.misc.class
    }

    get spellcasting_class() {
        const classe = this.sheet.virtual.misc.class
        if (classe === undefined) return undefined

        return classe.mechanics.spellcasting ? Resource.string(classe) : undefined
    }

    get cantrips_known() {
        const spellcasting = this.spellcasting
        if (spellcasting === undefined) return 0

        return spellcasting.mechanics.cantrips_known || 0
    }

    get cantrips_left_to_know() {
        const total = this.cantrips_known
        if (total === 0) return 0

        return total - this.spells_by_level(0, true).length
    }

    get spells_left_to_know() {
        const spellcasting = this.spellcasting
        const spells = this.sheet.virtual.spells

        if (spellcasting === undefined || spells === undefined) return 0

        const total = spellcasting.mechanics.spells_known || 0
        if (total === 0) return 0

        const current = spells.filter((spell: any) => {
            const countable_spell = (spell.mechanics || {}).count_as_spell !== false
            const spell_level = (spell.mechanics || {}).level || 0

            return countable_spell
        }).length

        return total - current
    }

    spells_by_level(level: number | string, countable: boolean = false) {
        if (this.sheet.virtual.spells === undefined || this.sheet.virtual.spells.length === 0) return []

        const filtered = this.sheet.virtual.spells.filter((spell: any) => {
            const countable_spell = (spell.mechanics || {}).count_as_spell !== false
            const spell_level = (spell.mechanics || {}).level || 0

            if (spell_level === level) return countable ? countable_spell : true
            return false
        })

        return filtered
    }

    expendSlot(event: any, level: string | number, force_number: boolean = false) {
        if (force_number) {
            this.sheet.static.attributes.spell_slots[level] = parseInt(event || 0, 10)
            return
        }
        console.log('%c CAST SPELL ', Styles.GREEN, event)

        if (level > 0) this.sheet.static.attributes.spell_slots[level] = (this.sheet.static.attributes.spell_slots[level] || 0) + 1
    }

    handleChoiceSpell() {
        this.choose_spell_level = false
        if (this.choose_spell_level_callback)
            this.choose_spell_level_callback(this.choosen_level)

        this.choosen_level = undefined
        this.base_spell_level = 1
        this.choose_spell_level_callback = undefined
    }

    handleCloseChoiceSpell() {
        this.choose_spell_level = false
        this.choosen_level = undefined
        this.base_spell_level = 1

        if (this.choose_spell_level_callback)
            this.choose_spell_level_callback(this.choosen_level)
        this.choose_spell_level_callback = undefined
    }

    mounted() {
        Bus.$on('choose-spell-level', (base: any, callback: () => {}) => {
            this.base_spell_level = base
            this.choose_spell_level = true
            this.choose_spell_level_callback = callback
        })
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
                
                & /deep/ div
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
