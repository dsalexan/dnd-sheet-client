<template>
    <main class="dnd-main">
        <section>
            <section class="attributes">
                <div class="scores">
                    <dnd-scores></dnd-scores>
                </div>
                <div class="attr-applications">
                    <x-input class="inspiration" name="inspiration" type="checkbox" label="Inspiration" v-model="sheet.stats.inspiration" box reactive="false" />
                    <x-input class="proficiencybonus clean" name="proficiencybonus" label="Proficiency Bonus" :value="sheetProficiencyBonus" placeholder="+2" box reactive="false" disabled />
                    <!-- <dnd-list-section label="Saving Throw" placeholder="+0" v-model="sheet.stats.proficiencies.saves" :map="mapSaves"/> -->

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
            </section>
            <x-input class="passive-perception clean" name="passiveperception" label="Passive Perception (Wisdom)" placeholder="10" :value="sheetPassiveProficiency('perception')" box reactive="false" disabled />   

            <div class="otherprofs box textblock">
                <label for="otherprofs">Other Proficiencies and Languages</label>
                <textarea name="otherprofs"></textarea>
            </div>
        </section>
        <section>
          <section class="combat">
                <div class="armorclass">
                    <div>
                        <label for="ac">Armor Class</label><input name="ac" placeholder="10" type="text" />
                    </div>
                </div>
                <div class="initiative">
                    <div>
                        <label for="initiative">Initiative</label><input name="initiative" placeholder="+0" type="text" />
                    </div>
                </div>
                <div class="speed">
                    <div>
                        <label for="speed">Speed</label><input name="speed" placeholder="30" type="text" />
                    </div>
                </div>
                <div class="hp">
                    <div class="regular">
                        <div class="max">
                        <label for="maxhp">Hit Point Maximum</label><input name="maxhp" placeholder="10" type="text" />
                        </div>
                        <div class="current">
                        <label for="currenthp">Current Hit Points</label><input name="currenthp" type="text" />
                        </div>
                    </div>
                    <div class="temporary">
                        <label for="temphp">Temporary Hit Points</label><input name="temphp" type="text" />
                    </div>
                </div>
                <div class="hitdice">
                    <div>
                        <div class="total">
                        <label onclick="totalhd_clicked()" for="totalhd">Total</label><input name="totalhd" placeholder="2d10"
                            type="text" />
                        </div>
                        <div class="remaining">
                        <label for="remaininghd">Hit Dice</label><input name="remaininghd" type="text" />
                        </div>
                    </div>
                </div>
                <div class="deathsaves">
                    <div>
                        <div class="label">
                        <label>Death Saves</label>
                        </div>
                        <div class="marks">
                        <div class="deathsuccesses">
                            <label>Successes</label>
                            <div class="bubbles">
                            <input name="deathsuccess1" type="checkbox" />
                            <input name="deathsuccess2" type="checkbox" />
                            <input name="deathsuccess3" type="checkbox" />
                            </div>
                        </div>
                        <div class="deathfails">
                            <label>Failures</label>
                            <div class="bubbles">
                            <input name="deathfail1" type="checkbox" />
                            <input name="deathfail2" type="checkbox" />
                            <input name="deathfail3" type="checkbox" />
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    </main>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { attributes, skills } from '@/assets/rules/dnd/5e'

import Scores from '@/components/dnd/Scores.vue'
import Proficiency from '@/components/dnd/Proficiency.vue'

import XInput from '@/components/utils/XInput.vue'

export default {
    name: 'dnd-main',
    components: {
        'dnd-scores': Scores,
        'dnd-proficiency': Proficiency,
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

            
            div.otherprofs textarea
                height: 26em
                width: 100%

                         
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
                                    padding: 1em 0
                                    font-size: 20px
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
                                padding: 1em 0
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
                            padding: $gutter/2 0
                            
                            label
                                font-size: 10px
                                color: $faded-dark
                                margin: 0.25em
                                text-transform: none
                                
                            input
                                font-size: 12px
                                flex-grow: 1
                                border: 0
                                border-bottom: 1px solid $faded
                                width: 50%
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
                            border: 1px solid black
                            border-radius: $radius
                            display: flex
                            flex-direction: column-reverse
                            
                            > div.label
                                text-align: center
                                
                                label
                                    font-size: 10px
                                
                            > div.marks
                                display: flex
                                flex: 1
                                flex-direction: column
                                justify-content: center
                                
                                div.deathsuccesses, div.deathfails
                                    display: flex
                                    align-items: center

                                    > *

                                    label
                                        font-size: 8px
                                        text-align: right
                                        flex: 1 50%
                            
                            div.bubbles
                                flex: 1 40%
                                margin-left: $gutter / 2

                                input[type="checkbox"]
                                    appearance: none
                                    width: $bubble-size
                                    height: $bubble-size
                                    border: 1px solid black
                                    border-radius: $bubble-size
                                    &:checked
                                        background-color: black
                    
</style>

