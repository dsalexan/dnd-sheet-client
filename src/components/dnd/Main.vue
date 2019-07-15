<template>
    <main class="dnd-main">
        <section>
            <!-- <section class="attributes">
                <div class="scores">
                    <dnd-scores></dnd-scores>
                </div>
                <div class="attr-applications">
                    <x-input transparent class="inspiration" name="inspiration" type="checkbox" label="Inspiration" v-model="sheet.stats.inspiration" box reactive="false"  />
                    <x-input transparent class="proficiencybonus clean" name="proficiencybonus" label="Proficiency Bonus" :value="sheetProficiencyBonus" placeholder="+2" box reactive="false" disabled  />

                    <div class="list-section box">
                        <ul>
                            <dnd-proficiency 
                                v-for="(attr, index) in attributes" :key="index"
                                tag="li" 
                                placeholder="+0" 
                                :label="attr.name" 
                                :attribute="attr.alias.toLowerCase()" 
                                v-model="sheet.stats.proficiencies.saves[attr.alias.toLowerCase()]"/>
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
                                v-model="sheet.stats.proficiencies.skills[skill.slug]"/>
                        </ul>
                        <div class="label">Skills</div>
                    </div>
                </div>
            </section> -->
            <x-input transparent class="passive-perception clean" name="passiveperception" label="Passive Perception (Wisdom)" placeholder="10" :value="sheetPassiveProficiency('perception')" box reactive="false" disabled/>

            <section class="otherprofs textblock">
                <label>Other Proficiencies and Languages</label>
                <dnd-list 
                    :lines="12" 
                    :value="sheet.stats.proficiencies.others"
                    @input="(value, index) => value == undefined ? sheet.stats.proficiencies.others.splice(index, 1) : sheet.stats.proficiencies.others.splice(index, 1, value)"/>
            </section>
        </section>
        <!-- <section>
            <section class="combat">
                <div class="armorclass">
                    <x-input transparent label="Armor Class" name="ac" placeholder="10" v-model="sheet.stats.combat.ac"/>
                </div>
                <div class="initiative">
                    <x-input transparent class="clean" label="Initiative" name="initiative" placeholder="+0" :value="sheetModifier('dex')" disabled/>
                </div>
                <div class="speed">
                    <x-input transparent label="Speed" name="speed" placeholder="30" v-model="sheet.stats.combat.speed"/>
                </div>
                <div class="hp">
                    <div class="regular">
                        <x-input transparent class="max" label="Hit Point Maximum" name="maxhp" placeholder="10" v-model="sheet.stats.combat.hp.maximum"/>
                        <x-input transparent class="current" label="Current Hit Points" name="currenthp" placeholder="10" v-model="sheet.stats.combat.hp.current" reactive="false"/>
                    </div>
                    <x-input transparent class="temporary" label="Temporary Hit Points" name="temphp" placeholder="10" v-model="sheet.stats.combat.hp.temporary" reactive="false"/>
                </div>
                <div class="hitdice">
                    <div>
                        <x-input transparent class="total" label="Total" name="totalhd" placeholder="1d10" v-model="sheet.stats.combat.hit_dice.total"/>
                        <x-input transparent class="remaining" label="Hit Dice" name="remaininghd" placeholder="1d10" v-model="sheet.stats.combat.hit_dice.current" reactive="false"/>
                    </div>
                </div>
                <dnd-death-saves v-model="sheet.stats.combat.death_saves" />
            </section>
            <section class="attacksandspellcasting">
                <div>
                    <label>Attacks & Spellcasting</label>
                    <div class="table">
                        <div class="row header">
                            <div>Name</div>
                            <div>Atk Bonus</div>
                            <div>Damage</div>
                        </div>
                        <div class="row" v-for="(item, index) of sheet.stats.combat.attacks_spellcasting" :key="index">
                            <x-input transparent v-model="sheet.stats.combat.attacks_spellcasting[index].name"></x-input>
                            <x-input transparent v-model="sheet.stats.combat.attacks_spellcasting[index].attack_bonus"></x-input>
                            <x-input transparent v-model="sheet.stats.combat.attacks_spellcasting[index].damage_type"></x-input>
                        </div>
                    </div>
                </div>
            </section>
            <section class="equipment">
                <dnd-equipment transparent v-model="sheet.equipment"></dnd-equipment>
            </section>
        </section> -->
        <section>
            <section class="features textblock">
                <label>Features & Traits</label>
                <dnd-list 
                    :lines="32"
                    :value="sheet.features"
                    @input="(value, index) => value == undefined ? sheet.features.splice(index, 1) : sheet.features.splice(index, 1, value)"/>
            </section>
        </section>
    </main>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { attributes, skills } from '@/assets/rules/dnd/5e'

import Scores from '@/components/dnd/Scores.vue'
import Proficiency from '@/components/dnd/Proficiency.vue'
import DeathSaves from '@/components/dnd/DeathSaves.vue'
import Equipment from '@/components/dnd/Equipment.vue'
import List from '@/components/dnd/List.vue'

import XInput from '@/components/utils/XInput.vue'

export default {
    name: 'dnd-main',
    components: {
        'dnd-scores': Scores,
        'dnd-proficiency': Proficiency,
        'dnd-death-saves': DeathSaves,
        'dnd-equipment': Equipment,
        'dnd-list': List,
        'x-input': XInput
    },
    data(){
        return {
            attributes: attributes.list,
            skills: skills.list
        }
    },
    computed: {
        ...mapState([
            'sheet'
        ]),
        ...mapGetters([
            'sheetModifier',
            'sheetProficiencyBonus',
            'sheetPassiveProficiency'
        ])
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
                                font-size: 8px
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

                    > div.table
                        width: 100%

                        div.row
                            display: grid
                            grid-template-columns: 2fr 1fr 1fr

                            &.header
                                font-size: 10px
                                color: $faded

                            > div
                                margin: 0 $gutter /2

                                &:first-of-type
                                    margin-left: 0

                                &:last-of-type
                                    margin-right: 0

                                input
                                    width: calc(100% - 4px)
                                    border: 0
                                    background-color: $faded-light
                                    font-size: 10px
                                    padding: 3px
            
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

