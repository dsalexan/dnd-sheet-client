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
                    :input="cantrips_left_to_know > 0"
                    @input="(index, value) => set_spells({index, value, level: 0}) "></dnd-spell-slot>

                <dnd-spell-slot 
                    v-for="(lvl, index) in [1,2]" :key="lvl"
                    :level="lvl" 
                    :lines="[13,13][index]" 
                    :total="spell_slots(lvl)" 
                    :spells="spells_by_level(lvl)" 
                    :entries="spells_left_to_know" 
                    :disabled="spell_slots(lvl) <= 0"
                    :input="spells_left_to_know > 0"
                    :expended="sheet.spells.slots[lvl]"
                    @expended="(event, force) => expendSlot(event, lvl, force)"
                    @input="(index, value) => set_spells({index, value, level: lvl}) "></dnd-spell-slot>
            </div>
            <div> 
                <dnd-spell-slot 
                    v-for="(lvl, index) in [3,4,5]" :key="lvl"
                    :level="lvl" 
                    :lines="[13,13,10][index]" 
                    :total="spell_slots(lvl)" 
                    :disabled="spell_slots(lvl) <= 0"
                    :input="spells_left_to_know > 0"
                    :expended="sheet.spells.slots[lvl]"
                    @expended="(event, force) => expendSlot(event, lvl, force)"
                    :spells="spells_by_level(lvl)"
                    @input="(index, value) => set_spells({index, value, level: lvl})"></dnd-spell-slot>
            </div><div>
                <dnd-spell-slot 
                    v-for="(lvl, index) in [6,7,8,9]" :key="lvl"
                    :level="lvl" 
                    :lines="[9,9,7,7][index]" 
                    :total="spell_slots(lvl)" 
                    :disabled="spell_slots(lvl) <= 0"
                    :input="spells_left_to_know > 0"
                    :expended="sheet.spells.slots[lvl]"
                    @expended="(event, force) => expendSlot(event, lvl, force)"
                    :spells="spells_by_level(lvl)"
                    @input="(index, value) => set_spells({index, value, level: lvl})"></dnd-spell-slot>
            </div>
        </main>
        
        <q-dialog v-model="spell_dialog">
            <q-card>
                <q-card-section>

                    <div class="row no-wrap items-center">
                        <div class="col text-h6 ellipsis">{{ spell_dialog_data.name.en || spell_dialog_data.name }}</div>
                        <div class="col-auto text-grey q-pt-md">
                        <q-icon name="place" /> 250 ft
                        </div>
                    </div>
                </q-card-section>

                <q-card-section>
                    <div class="text-subtitle1">$・Italian, Cafe</div>
                    <div class="text-subtitle2 text-grey">Small plates, salads & sandwiches in an intimate setting.</div>
                </q-card-section>

                <q-separator />

                <q-card-actions style="justify-content: center">
                    <q-btn flat round icon="flash_on" color="green" v-close-popup>
                        <q-tooltip>Cast Spell</q-tooltip>
                    </q-btn>
                    <!-- <q-btn flat v-close-popup>5:30PM</q-btn>
                    <q-btn flat v-close-popup>7:30PM</q-btn>
                    <q-btn flat v-close-popup>9:00PM</q-btn>
                    <q-btn flat color="primary" v-close-popup>Reserve</q-btn> -->
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'

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
            spell_dialog: false,
            spell_dialog_data: {"slug":"@cantrip/mage_hand","_uuid":"cdf8ecb0-79b8-45cb-bfed-957f50ff9652","_path":"state.spells.by_level[0][0]","_origin":"input","_parent":0,"_source":"custom","_type":"default","_id":"cantrip_mage_hand","meta":"spell","parent":"cantrip","name":{"en":"Mage Hand","pt-BR":"Mão Mágica"},"text":"<p>A spectral, floating hand appears at a point you choose within range. The hand lasts for the Duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.</p><p>You can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. You can move the hand up to 30 feet each time you use it.</p><p>The hand can't Attack, activate magical items, or carry more than 10 pounds.</p>","mechanics":{"school":"conjuration","casting_time":["1","action"],"range":["30","ft"],"components":["V","S"],"duration":["1","minute"],"classes":["@bard","@sorcerer","@warlock","@wizard"],"active":true},"_modified_at":"2019-08-14T00:44:28.194Z","path":"cantrip/mage_hand","_index":0}
        }
    },
    computed: {
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

                let total = spellcasting.mechanics.spell_slots[spell_level-1] || 0
                return total
            }
        },
        cantrips_left_to_know(){
            let total = this.cantrips_known
            if(total == 0) return 0

            return total - this.spells_by_level(0).length
        },
        spells_left_to_know(){
            let spellcasting = this.spellcasting
            if(spellcasting == undefined) return 0

            let total = spellcasting.mechanics.spells_known || 0
            if(total == 0) return 0

            let current = 0
            for(let level in this.sheet.async.spells){
                current += this.spells_by_level(level).filter(s => (s.mechanics || {}).count_as_spell !== false).length
            }

            return total - current
        }
    },
    methods: {
        ...mapActions({
            set_spells: 'sheet/SET_SPELLS',
        }),
        spells_by_level(level){
            if(this.sheet.async.spells == undefined) return []
            
            return this.sheet.async.spells[level]            
        },
        expendSlot(event, level, force_number=false){
            if(force_number){
                this.sheet.spells.slots[level] = parseInt(event || 0)
                return 
            }
            console.log('CAST SPELL', event)
            this.sheet.spells.slots[level]++
        }
    },
    mounted(){
        bus.$on('spell-description', function(spell){
            console.log('OPENDIALOG', spell)

            this.spell_dialog = true
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
