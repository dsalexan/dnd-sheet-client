<template>
    <main class="dnd-main">
        <section>
            <section class="attributes">
                <div class="scores">
                    <dnd-scores></dnd-scores>
                </div>
                <div class="attr-applications">
                    <x-input transparent="false" class="inspiration" name="inspiration" type="checkbox" label="Inspiration" v-model="sheet.stats.inspiration" box reactive="false"  />
                    <x-input transparent="false" class="proficiencybonus clean" name="proficiencybonus" label="Proficiency Bonus" :value="proficiency_bonus" placeholder="+2" box reactive="false" disabled  />

                    <div class="list-section box">
                        <ul>
                            <dnd-proficiency 
                                v-for="(attr, index) in attributes" :key="index"
                                tag="li" 
                                placeholder="+0" 
                                :label="attr.name" 
                                :attribute="attr.slug" 
                                v-model="sheet.proficiencies.saves[attr.slug]"/>
                        </ul>
                        <div class="label">Saving Throws</div>
                    </div>
                    <div class="list-section box">
                        <ul>
                            <dnd-proficiency 
                                v-for="(skill, index) in skills" :key="index"
                                tag="li" 
                                placeholder="+0" 
                                :label="skill.name" 
                                :attribute="skill.attribute" 
                                v-model="sheet.proficiencies.skills[skill.slug]"/>
                        </ul>
                        <div class="label">Skills</div>
                    </div>
                </div>
            </section>
            <x-input transparent="false" class="passive-perception clean" name="passiveperception" label="Passive Perception (Wisdom)" placeholder="10" :value="passive_proficiency('perception')" box reactive="false" disabled/>

            <section class="otherprofs textblock">
                <label>Other Proficiencies and Languages</label>
                <dnd-panel 
                    label="Proficiency"
                    :cols="2"
                    query="{ 'meta': {'$not': { '$eq': 'feature' }} }"
                    :base="['armor', 'weapons', 'tools', 'languages']"
                    :value="sheet.async.proficiencies"
                    @input="(value, index, key) => set_proficiencies({value, index, key})"/>
            </section>
        </section>
        <section>
            <section class="combat">
                <div class="armorclass">
                    <x-input transparent="false" class="clean" label="Armor Class" name="ac" placeholder="10" :value="ac" disabled/>
                </div>
                <div class="initiative">
                    <x-input transparent="false" class="clean" label="Initiative" name="initiative" placeholder="+0" :value="modifier('dex')" disabled/>
                </div>
                <div class="speed" :class="{'has-prev': speed_index > 0, 'has-next': speed_index < speed.length - 1}">
                    <div class="prev">
                        <div class="icon" @click="speed_index -= speed_index > 0 ? 1 : 0">
                            <q-icon name="chevron_left"/>
                        </div>
                    </div>
                    <x-input transparent="false" class="clean" :label="labelSpeed" name="speed" placeholder="30" :value="(speed[speed_index] || {}).speed" disabled/>
                    <div class="next">
                        <div class="icon" @click="speed_index += speed_index < speed.length - 1 ? 1 : 0">
                            <q-icon name="chevron_right"/>
                        </div>
                    </div>
                </div>
                <div class="hp">
                    <div class="regular">
                        <x-input transparent="false" class="max clean" label="Hit Point Maximum" name="maxhp" placeholder="10" :value="maximum_hp" disabled/>
                        <x-input transparent="false" class="current" label="Current Hit Points" name="currenthp" placeholder="10" 
                            :value="focus_hp ? sheet.stats.hp.current : (sheet.stats.hp.current == undefined ? maximum_hp : sheet.stats.hp.current)" 
                            @input="sheet.stats.hp.current = $event" 
                            @focus="focus_hp=true"
                            @blur="focus_hp=false"
                            reactive="false"/>
                    </div>
                    <x-input transparent="false" class="temporary" label="Temporary Hit Points" name="temphp" placeholder="10" v-model="sheet.stats.hp.temporary" reactive="false"/>
                </div>
                <div class="hitdice">
                    <div>
                        <x-input transparent="false" class="total clean" label="Total" name="totalhd" placeholder="1d10" :value="maximum_hit_dice" disabled/>
                        <x-input transparent="false" class="remaining" label="Hit Dice" name="remaininghd" placeholder="1d10" 
                        @input="sheet.stats.hit_dice = $event" 
                        :value="focus_hit_dice ? sheet.stats.hit_dice : (sheet.stats.hit_dice == undefined ? maximum_hit_dice : sheet.stats.hit_dice)" 
                        @focus="focus_hit_dice=true"
                        @blur="focus_hit_dice=false"
                        reactive="false"/>
                    </div>
                </div>
                <dnd-death-saves v-model="sheet.stats.death_saves" />
            </section>
            <section class="attacksandspellcasting">
                <div>
                    <label>Attacks & Spellcasting</label>
                    <div>
                        <q-list v-if="attacks_spellcasting.length > 0">
                            <q-item 
                                v-for="(item) of attacks_spellcasting" :key="item._id"
                                clickable>
                                <q-item-section>
                                    <!-- <q-item-label overline>OVERLINE</q-item-label> string.charAt(0).toUpperCase() + string.slice(1)-->
                                    <q-item-label><b style="margin-right: 10px">{{ name(item) }}</b> {{ ((item.mechanics || {}).damage || []).map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(', ') }}</q-item-label>
                                    <q-item-label caption>{{ ((item.mechanics || {}).properties || []).map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(', ') }}</q-item-label>
                                </q-item-section>

                                <q-item-section side top>
                                    <q-item-label caption style="font-size: 1.05em; color: rgba(0,0,0, 0.6)">+4</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                        <span v-if="attacks_spellcasting.length == 0" style="color: lightgray; font-style: italic; font-size: 0.9em;">No Attacks/Spellcasting</span>
                    </div>
                </div>
            </section>
            <section class="equipment">
                <dnd-equipment 
                    transparent="false"
                    :coins="coins"
                    :value="items"
                    @input="(value, _id, _parent) => set_equipment({value, _id, _parent})"
                    @remove="(index, _id, _parent) => remove_equipment({index, _id, _parent})"
                    @coin="(value, key) => set_coin({value, key})" />
            </section>
        </section>
        <section>
            <section class="features textblock">
                <label>Features & Traits</label>
                <dnd-list 
                    :expansion="true"
                    label="Feature"
                    :value="sheet.async.features"
                    meta="feature"
                    @input="(value, index) => set_features({value, index})"/>
            </section>
        </section>
    </main>
</template>

<script>
import axios from 'axios'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

import { attributes, skills } from '@/assets/rules/dnd/5e'

import utils from '@/assets/utils/resources'

import Scores from '@/components/dnd/Scores.vue'
import Proficiency from '@/components/dnd/Proficiency.vue'
import DeathSaves from '@/components/dnd/DeathSaves.vue'
import Equipment from '@/components/dnd/Equipment.vue'
import List from '@/components/dnd/List.vue'
import Panel from '@/components/dnd/Panel.vue'

import XInput from '@/components/utils/XInput.vue'


import {
  Quasar,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel
} from 'quasar'

export default {
    name: 'dnd-main',
    components: {
        'dnd-scores': Scores,
        'dnd-proficiency': Proficiency,
        'dnd-death-saves': DeathSaves,
        'dnd-equipment': Equipment,
        'dnd-list': List,
        'dnd-panel': Panel,
        'x-input': XInput,
        QIcon,
        QList,
        QItem,
        QItemSection,
        QItemLabel
    },
    data(){
        return {
            attributes: attributes.all,
            skills: skills.all,

            speed_index: 0,
            focus_hp: false,
            focus_hit_dice: false
        }
    },
    computed: {
        ...mapState([
            'sheet'
        ]),
        ...mapGetters({
            modifier: 'sheet/modifier',
            proficiency_bonus: 'sheet/proficiency_bonus',
            passive_proficiency: 'sheet/passive_proficiency',
            proficiencies: 'sheet/proficiencies',
            coins: 'sheet/coins',
            items: 'sheet/items_with_quantity',
            speed: 'sheet/speed',
            maximum_hp: 'sheet/maximum_hp',
            maximum_hit_dice: 'sheet/maximum_hit_dice',
            attacks_spellcasting: 'sheet/attacks_spellcasting',
            ac: 'sheet/ac'
        }),
        labelSpeed: function(){
            if(this.speed.length > 1)
                return `${this.speed[this.speed_index] ? this.speed[this.speed_index].movement + ' ': ''}Speed`
            
            return 'Speed'
        }
    },
    methods: {
        name: utils.name, 
        ...mapActions({
            set_equipment: 'sheet/SET_EQUIPMENT',
            set_features: 'sheet/SET_FEATURES',
            set_proficiencies: 'sheet/SET_PROFICIENCIES',
            set_coin: 'sheet/SET_COIN',
            remove_equipment: 'sheet/REMOVE_EQUIPMENT'
        })
    }
}
</script>

<style lang="sass">
    @import '@/assets/sass/dnd5e-sheet.sass'

    main.dnd-main
        display: flex
        justify-content: space-between
        margin-top: $gutter*2
        margin-bottom: $gutter*2
        
        div.label-container
            height: $small-box-width - $radius - 2px
            margin-top: $radius / 2 + 1px

        > section
            width: 32%
            display: flex
            flex-direction: column
            
            section.attributes
                $attr-width: 70px
                $attr-height: 80px
                $attr-gutter: 31px
                width: 100%
                display: flex
                flex-direction: row
                justify-content: space-between
                
                div.scores
                    width: $attr-width + $attr-gutter
                    background-color: $faded-dark
                    border-radius: $radius
                    padding-bottom: $gutter / 2
                    display: flex
                    flex-direction: column
                    justify-content: center

                    label
                        font-size: 8px
                        font-weight: bold

                    ul
                        display: flex
                        flex-direction: column
                        justify-content: space-around
                        align-items: center
                        height: 100%

                    li
                        height: $attr-height
                        width: $attr-width
                            
                div.attr-applications
                    flex-grow: 1
                    margin-left: 10px

                    div.list-section
                        border: 1px solid black
                        border-radius: $radius
                        padding: $gutter $gutter/2
                        
                        div.label
                            margin-top: $gutter
                            margin-bottom: $gutter / 4
                            text-align: center
                            text-transform: uppercase
                            font-size: 10px
                            font-weight: bold
                        
                        ul li
                            display: flex
                            align-items: center

                            > *
                                margin-left: $gutter / 2

                            label
                                text-transform: none
                                font-size: 10px
                                text-align: left
                                order: 3
                                
                                span.skill
                                    color: $faded-dark

                            input
                                &[type="text"]
                                    width: 30px
                                    font-size: 12px
                                    text-align: center
                                    border: 0
                                    border-bottom: 1px solid black
                                    order: 2
                                &[type="checkbox"]
                                    appearance: none
                                    width: $bubble-size
                                    height: $bubble-size
                                    border: 1px solid black
                                    border-radius: $bubble-size
                                    order: 1
                                    &:checked
                                        background-color: black

            & /deep/ .x-input
                &.passive-perception, &.proficiencybonus
                    input
                        opacity: 1 !important
                        font-weight: bold

                        &::placeholder
                            font-weight: 400

            section.otherprofs 
                padding-top: $gutter

                         
            section.combat
                background-color: $faded-light
                display: flex
                flex-wrap: wrap
                border-radius: $radius
                
                > div
                    overflow: hidden
                
                    &.armorclass, &.initiative, &.speed
                        flex-basis: 33.333%
                        display: flex
                        flex-direction: row
                        justify-content: center
                        align-items: start
                        
                        > div
                            display: flex
                            flex-direction: column-reverse
                            align-items: center
                            margin-top: $gutter
                        
                            label
                                font-size: 8px
                                width: $large-box-width - $radius*2
                                border: 1px solid black
                                border-top: 0
                                background-color: $bg
                                text-align: center
                                padding-top: 5px
                                padding-bottom: 5px
                                border-radius: 0 0 $radius $radius

                            input
                                height: $large-box-width
                                width: $large-box-width
                                border-radius: $radius
                                border: 1px solid black
                                text-align: center
                                font-size: 30px

                    &.speed
                        .next, .prev
                            height: $large-box-width
                            border-radius: $radius

                            display: flex
                            flex-direction: row
                            align-items: center

                            opacity: 0
                            cursor: auto

                            .icon
                                height: 65%

                                display: flex
                                flex-direction: row
                                align-items: center                    

                                font-size: 16px                            
                                border: 1px solid black
                                background-color: $bg
                                text-align: center
                                // padding-left: 3px
                                // padding-right: 3px

                            &.next
                                .icon
                                    border-left: 0
                                    border-radius: 0 $radius $radius 0
                                    
                            &.prev
                                .icon
                                    border-right: 0
                                    border-radius: $radius 0 0 $radius

                            &:hover
                                .icon
                                    background-color: #dbf8d8
                                    color: #1fcc00

                        &.has-prev .prev, &.has-next .next
                            opacity: 1
                            cursor: pointer


                    &.hp
                        flex-basis: 100%
                        
                        > div.regular
                            background-color: $bg
                            border: 1px solid black
                            margin: $gutter
                            margin-bottom: $gutter / 2
                            border-radius: $radius $radius 0 0
                        
                            > div.max
                                display: flex
                                justify-content: space-around
                                align-items: baseline
                                padding-top: $radius * 0.75
                                
                                label
                                    font-size: 10px
                                    text-transform: none
                                    color: $faded-dark
                                
                                input
                                    width: 40%
                                    border: 0
                                    border-bottom: 1px solid $faded
                                    font-size: 12px
                                    text-align: center

                            > div.current
                                display: flex
                                flex-direction: column-reverse

                                input
                                    border: 0
                                    width: 100%
                                    padding: 0.75em 0
                                    font-size: 30px
                                    text-align: center

                                label
                                    font-size: 10px
                                    padding-bottom: 5px
                                    text-align: center
                                    font-weight: bold
                            
                        > div.temporary
                            margin: $gutter
                            margin-top: 0
                            border: 1px solid black
                            border-radius: 0 0 $radius $radius
                            display: flex
                            flex-direction: column-reverse
                            background-color: $bg
                            
                            input
                                padding: 0.75em 0
                                font-size: 20px
                                border: 0
                                text-align: center

                            label
                                font-size: 10px
                                padding-bottom: 5px
                                text-align: center
                                font-weight: bold
                            
                    &.hitdice, &.deathsaves
                        $height: 100px
                        flex: 1 50%
                        height: $height
                        
                        > div
                            height: $height - $gutter*2
                        
                    &.hitdice > div
                        background-color: $bg
                        margin: $gutter
                        border: 1px solid black
                        border-radius: $radius
                        display: flex
                        flex-direction: column

                        > div.total
                            display: flex
                            align-items: baseline
                            justify-content: space-around
                            margin: $gutter
                            
                            label
                                font-size: 10px
                                color: $faded-dark
                                margin: 0.25em
                                text-transform: none
                                
                            input
                                font-size: 12px
                                border: 0
                                border-bottom: 1px solid $faded
                                width: 40%
                                margin-right: 0.25em
                                padding: 0 0.25em
                                text-align: center
                            
                        > div.remaining
                            flex: 1
                            display: flex
                            flex-direction: column-reverse

                            label
                                text-align: center
                                padding: 2px
                                font-size: 10px
                                
                            input
                                text-align: center
                                border: 0
                                flex: 1
                    
                    
                    &.deathsaves
                        > div
                            margin: $gutter
                            background: $bg
                            border-radius: $radius
                        
                        div.bubbles
                            margin-left: $gutter / 2

                            input[type="checkbox"]
                                width: $bubble-size
                                height: $bubble-size
                                border-radius: $bubble-size

            section.attacksandspellcasting
                border: 1px solid black
                border-radius: $radius
                margin-top: $gutter
                
                > div
                    margin: $gutter
                    display: flex
                    flex-direction: column
                    
                    > label
                        order: 3
                        text-align: center
                        padding-top: $gutter

                .q-item__label
                    text-align: left

            
            section.equipment
                border: 1px solid black
                border-radius: $radius
                margin-top: $gutter
                
                > div
                    padding: $gutter

            section.features     
                padding: 0 $gutter
                display: flex
                flex-direction: column-reverse


                > label
                    text-align: center


</style>

