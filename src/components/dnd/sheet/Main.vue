<template>
    <main class="dnd-main">
        <section>
            <section class="attributes">
                <div class="scores">
                    <dnd-scores></dnd-scores>
                </div>
                <div class="attr-applications">
                    <x-input transparent="false" class="inspiration" name="inspiration" type="checkbox" label="Inspiration" v-model="sheet.static.misc.inspiration" box reactive="false"  />
                    <x-input transparent="false" class="proficiencybonus clean" name="proficiencybonus" label="Proficiency Bonus" :value="proficiency_bonus" placeholder="+2" box reactive="false" disabled  />

                    <div class="list-section box">
                        <ul>
                            <dnd-proficiency 
                                v-for="(attr, index) in abilities" :key="index"
                                tag="li" 
                                placeholder="+0" 
                                :label="attr.name" 
                                :attribute="attr.slug" 
                                :checked="!!proficient_save(attr.slug)"
                                type="save"
                                @change="setProficiencySave(attr.slug, !$event)"/>
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
                                :attribute="skill.ability" 
                                :checked="!!proficient_skill(skill.slug)"
                                type="skill"
                                @change="setProficiencySkill(skill.slug, !$event)"/>
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
                    :value="sheet.virtual.proficiencies"
                    @input="(value, index, key) => setProficiencies({index, value, base: {type: key}})"/>
            </section>
            <br />
            <br />
            <br />
            <br />
            <br /><br />
            <br />
            <br /><br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            v
            <br />
            <br />
            <br />v<br /><br />
            <br />
            <br />
            v
            <br />
            <br /><br />
            <br />  
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
                            :value="focus_hp ? sheet.static.attributes.hp.current : (sheet.static.attributes.hp.current == undefined ? maximum_hp : sheet.static.attributes.hp.current)" 
                            @input="sheet.static.attributes.hp.current = $event" 
                            @focus="focus_hp=true"
                            @blur="focus_hp=false"
                            reactive="false"/>
                    </div>
                    <x-input transparent="false" class="temporary" label="Temporary Hit Points" name="temphp" placeholder="10" v-model="sheet.static.attributes.hp.temporary" reactive="false"/>
                </div>
                <div class="hitdice">
                    <div>
                        <x-input transparent="false" class="total clean" label="Total" name="totalhd" placeholder="1d10" :value="maximum_hit_dice" disabled/>
                        <x-input transparent="false" class="remaining" label="Hit Dice" name="remaininghd" placeholder="1d10" 
                        @input="sheet.static.attributes.hit_dice = $event" 
                        :value="focus_hit_dice ? sheet.static.attributes.hit_dice : (sheet.static.attributes.hit_dice == undefined ? maximum_hit_dice : hit_dice)" 
                        @focus="focus_hit_dice=true"
                        @blur="focus_hit_dice=false"
                        reactive="false"/>
                    </div>
                </div>
                <dnd-death-saves :value="sheet.static.attributes.death_saves" @change="(type, index, value) => sheet.static.attributes.death_saves[type][index] = value"/>
            </section>
            <section class="attacksandspellcasting">
                <div>
                    <label>Attacks & Spellcasting</label>
                    <div>
                        <q-list v-if="attacks_spellcasting.length > 0">
                            <q-item 
                                v-for="(item) of attacks_spellcasting" :key="item._uuid"
                                clickable>
                                <q-item-section>
                                    <q-item-label><b style="margin-right: 10px">{{ name(item) }}</b> {{ ((item.mechanics || {}).damage || []).map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(', ') }}</q-item-label>
                                    <q-item-label caption>{{ ((item.mechanics || {}).properties || []).map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(', ') }}</q-item-label>
                                </q-item-section>

                                <q-item-section side top>
                                    <div style="display: flex; flex-direction: column; justify-content: space-around; align-items: flex-end">
                                        <q-item-label caption style="font-size: 1.05em; color: rgba(0,0,0, 0.6); font-weight: bold;">{{ w(item).utils.modifier(store) }}</q-item-label>
                                        <q-item-label caption style="font-size: 0.85em; color: rgba(0,0,0, 0.4); text-transform: uppercase;">{{ w(item).utils.ability }}</q-item-label>
                                    </div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                        <span v-if="attacks_spellcasting.length == 0" style="display: inline-block; text-align: center; width: 100%; color: lightgray; font-style: italic; font-size: 0.9em;">No Attacks/Spellcasting</span>
                    </div>
                </div>
            </section>
            <section class="equipment">
                <dnd-equipment 
                    transparent="false"
                    :coins="coins"
                    :value="items"
                    @input="(value, parent) => setEquipment({value, index, base: {parent, type: 'items'}})"
                    @remove="(index, type) => setEquipment({index, value: undefined})"
                    @coin="(value, key) => setCoin({value, key})" />
                    <!-- @block="(_id, path, value) => blockEquipment({_id, path, value})" -->
            </section>
        </section>
        <section>
            <section 
                v-for="(item) in sheet.plugins" :key="item.name"
                class="plugin textblock">
                <label>{{ item.name }}</label>

                <div class="box">
                    <q-list>
                        <q-item 
                            v-for="(content, index) of item.content" :key="index"
                            clickable
                            @click="clickPluginContent(content, item)">
                            <q-item-section>
                                <!-- <q-item-label overline>OVERLINE</q-item-label> -->
                                <q-item-label style="font-weight: bold">{{ name(content) }}</q-item-label>
                                <q-item-label caption>Current: <span style="font-weight:bold">{{ resolve(content.inject) }}</span></q-item-label>
                            </q-item-section>

                            <q-item-section side top>
                                <q-item-label caption>{{ content.from.join(', ') }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
            </section>
            <section class="features textblock">
                <label>Features & Traits</label>
                <dnd-list 
                    :expansion="true"
                    label="Feature"
                    :value="features"
                    meta="feature"
                    @input="(value, index) => setFeatures({value, index, base: {type: 'custom'}})"/>
            </section>
        </section>

        
        <q-dialog class="command-dialog" v-model="command_dialog.open" position="bottom" @hide="handleHideDialog" full-width>
            <q-card style="min-width: 400px; width: auto !important;" v-if="command_dialog.open">
                <!-- <q-linear-progress :value="higher_level_percentage" color="amber" /> -->

                <q-card-section class="row items-center no-wrap" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
                    <div style="flex-grow: 1; display: flex; flex-direction: row; justify-content: center;">
                        <q-chip
                            style="border-radius: 16px;"
                            round
                            v-for="(item, index) of command_dialog.args.from" :key="index"
                            clickable
                            @click="handleClickDialog(index, item)">
                            <q-avatar :icon="command_dialog.args.icon || 'priority_high'" :color="command_dialog.values.includes(index) ? (command_dialog.args.color || 'green') : 'grey-5'" :text-color="command_dialog.values.includes(index) ? 'white' : 'grey-3'" />
                            <span :style="{fontWeight: command_dialog.values.includes(index) ? 500 : 400}"> {{ command_dialog.args.display(item) }} </span>
                        </q-chip>
                    </div>
                        <q-separator vertical />

                    <div  style="flex-shrink: 1; display: flex; flex-direction: row; margin-left: 16px">

                        <q-btn flat round color="black" icon="check" :disable="command_dialog.values.length == 0" @click="handleChoiceDialog" v-close-popup/>
                    </div>
                </q-card-section>
                
            </q-card>
        </q-dialog>
    </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import axios from 'axios'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
// @ts-ignore
import utils from '@/utils/resources'


import XInput from '@/components/utils/XInput.vue'

import { Bus, command } from '@/bus'

import { Resource, Plugin } from '@/store/sheet/types';
import { CommandSettings } from '../../../bus/types';
import { Mention, Resource as ResourceService } from '../../../services';
import { Styles } from '../../../console';
import Scores from './Scores.vue';
import Proficiency from './Proficiency.vue';
import Panel from './Panel.vue';
import DeathSaves from './DeathSaves.vue';
import Equipment from './Equipment.vue';
import List from './List.vue';


@Component({
    components: {
        'x-input': XInput,
        'dnd-scores': Scores,
        'dnd-proficiency': Proficiency,
        'dnd-panel': Panel,
        'dnd-death-saves': DeathSaves,
        'dnd-equipment': Equipment,
        'dnd-list': List
    },
    computed: {
        ...mapState({
            sheet: 'sheet',
        }),
        ...mapGetters({
            modifier: 'sheet/modifier',
            plugins: 'sheet/plugins',
            proficiency_bonus: 'sheet/proficiency_bonus',
            abilities: 'sheet/abilities',
            skills: 'sheet/skills',
            proficient_save: 'sheet/proficient_save',
            proficient_skill: 'sheet/proficient_skill',
            passive_proficiency: 'sheet/passive_proficiency',
            speed: 'sheet/speed',
            maximum_hp: 'sheet/maximum_hp',
            maximum_hit_dice: 'sheet/maximum_hit_dice',
            hit_dice: 'sheet/hit_dice',
            attacks_spellcasting: 'sheet/attacks_spellcasting',
            ac: 'sheet/ac',
            coins: 'sheet/coins',
            items: 'sheet/items_with_quantity',
            features: 'sheet/tree_features'
        })
    },
    methods: {
        ...mapActions({
            setCoin: 'sheet/SET_COIN',
            setAnswers: 'sheet/SET_ANSWERS',
            setFeatures: 'sheet/SET_FEATURES',
            setProficiencies: 'sheet/SET_PROFICIENCIES',
            setEquipment: 'sheet/SET_EQUIPMENT'
        })
    },
})
export default class Main extends Vue {

    speed_index: number = 0
    focus_hp: boolean = false
    focus_hit_dice: boolean = false

    command_dialog: any = {
        open: false,
        callback: undefined,
        values: [],
        args: undefined,
        display: (item: any) => item
    }

    // to use computed inside here
    sheet!: any
    speed!: any[]
    setAnswers!: any
    setProficiencies!: any
    proficient_save!: any
    proficient_skill!: any


    get store() {
        return this.$store
    }

    get labelSpeed() {
        if (this.speed.length > 1)
            return `${this.speed[this.speed_index] ? this.speed[this.speed_index].movement + ' ' : ''}Speed`

        return 'Speed'
    }

    name(res: Resource) {
        return utils.name(res)
    }

    resolve(mention: string) {
        return Mention.resolve(mention, this.sheet, false, false)
    }

    setProficiencySave(attr: string, remove: boolean) {
        if (!remove) {
            this.setProficiencies({ index: this.sheet.static.proficiencies.length, value: '@' + attr, base: {type: 'saves'} })
        } else {
            const res = this.proficient_save(attr)
            this.setProficiencies({ value: undefined, res })
        }
    }

    setProficiencySkill(attr: string, remove: boolean) {
        if (!remove) {
            this.setProficiencies({ index: this.sheet.static.proficiencies.length, value: '@' + attr, base: {type: 'skills'} })
        } else {
            const res = this.proficient_skill(attr)
            this.setProficiencies({ value: undefined, res })
        }
    }

    mounted() {
        Bus.$on('open-command-dialog', (args: CommandSettings, callback: () => {}) => {
            if (args.current) {
                this.command_dialog.values = args.from.map((v, i) => ({v, i})).filter((item) => item.v === args.current).map((item) => item.i)
            }

            this.command_dialog.open = true
            this.command_dialog.args = args
            this.command_dialog.callback = callback

            if (this.command_dialog.args.display === undefined) this.command_dialog.args.display = this.command_dialog.display
        })
    }

    handleHideDialog() {
        this.command_dialog.values = []

        this.handleChoiceDialog()
    }

    handleChoiceDialog() {
        this.command_dialog.open = false
        if (this.command_dialog.callback)
            this.command_dialog.callback(this.command_dialog.values.map((i: any) => this.command_dialog.args.from[i]))

        this.command_dialog.values = []
        this.command_dialog.callback = undefined
        this.command_dialog.args = undefined
    }

    handleClickDialog(index: number) {
        if (this.command_dialog.args.multiple) {
            if (this.command_dialog.values.includes(index)) {
                this.command_dialog.values = this.command_dialog.values.filter((i: number) => i !== index)
                return
            }

            this.command_dialog.values.push(index)
        } else {
            if (this.command_dialog.values.includes(index)) {
                this.command_dialog.values = []
                return
            }

            this.command_dialog.values = [index]
        }
    }

    clickPluginContent(item: Resource, plugin: Plugin) {
        console.log('CLICK PLUGIN CONTENT', item, plugin)

        if (item.meta === 'command') {
            command({
                from: item.from,
                display: utils.name,
                icon: plugin.icon || 'bubble_chart',
                color: plugin.color,
                current: this.resolve(item.inject)
            }).then((answer: any) => {
                if (answer.length > 0) {
                    console.log(`%c PLUGIN (${plugin.name}) `, Styles[plugin.color as string], answer, item)
                    this.setAnswers({answer, command: item})
                }
            })
        } else {
            throw new Error(`Meta <${item.meta}> not implemented as plugin content`)
        }
    }

    w(resource: Resource) {
        return ResourceService.weapon(resource)
    }
}
</script>

<style lang="sass" scoped>
    @import '@/assets/sass/variables.sass'

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
                width: 100%
                display: flex
                flex-direction: row
                justify-content: space-between
                
                div.scores
                    width: calc(90px + #{$gutter} * 2)
                    background-color: $faded-dark
                    border-radius: $radius
                    padding: $gutter/2 $gutter
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
                        padding: 0
                        margin: 0

                        /deep/ li
                            padding: $gutter 0

                            &::first-of-type
                                padding-top: 0

                            &::last-of-type
                                padding-bottom: 0
                            
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
                        
                        > /deep/ div.x-input
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
                        
                            > /deep/ div.x-input
                                &.max
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

                                &.current
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
                            
                        > /deep/ div.x-input
                            &.temporary
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

                        > /deep/ div.x-input
                            &.total
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
                                
                            &.remaining
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
                    
                    
                
                > /deep/ .deathsaves
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

            section.plugin
                padding: 0 $gutter
                display: flex
                flex-direction: column-reverse

                > label
                    text-align: center

                > .box    
                    border: 1px solid black
                    width: 100%
                    padding: 15px
                    border-radius: 10px
                    padding: 15px 0

                    & /deep/ .q-list
                        > .q-item
                            > .q-item__section
                                > .q-item__label
                                    text-align: left

                & + section
                    margin-top: 15px

            section.features     
                padding: 0 $gutter
                display: flex
                flex-direction: column-reverse


                > label
                    text-align: center
</style>