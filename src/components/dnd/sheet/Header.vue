<template>
    <header class="dnd-header">
        <section class="charname">
            <x-input transparent="false" name="charname" label="Name" placeholder="John Jones" v-model="sheet.name"></x-input>
        </section>
        <section class="misc">
            <ul v-if="type == 'system'">
                <!-- <x-input type="mention" :source="remoteSearch('class')" :mentionOptions="mentionOptions" tag="li" label="Class" placeholder="Unknown 1" v-model="sheet.misc.class"></x-input> -->
                <q-select
                    :value="async.misc.class"
                    @input="setClass"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    label="Class"
                    placeholder="Unknown"
                    :options="source"
                    @filter="(val, update) => remoteSearch('class')(val, update)"
                    :option-value="opt => opt === null ? null : name(opt)"
                    :option-label="opt => opt === null ? '(Unknown Class)' : name(opt)"
                >
                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">
                            No results
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-slot:append>
                        <q-icon
                            v-if="!!async.misc.class"
                            class="cursor-pointer"
                            name="clear"
                            @click.stop="setClass(null)"
                        />
                    </template>
                </q-select>

                <!-- <x-input type="mention" :source="remoteSearch('background')" :mentionOptions="mentionOptions" tag="li" label="Background" placeholder="Acolyte" v-model="sheet.misc.background"></x-input> -->
                <q-select
                    :value="async.misc.background"
                    @input="setBackground"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    label="Background"
                    placeholder="Acolyte"
                    :options="source"
                    @filter="(val, update) => remoteSearch('background')(val, update)"
                    :option-value="opt => opt === null ? null : name(opt)"
                    :option-label="opt => opt === null ? '(Unknown Background)' : name(opt)"
                >
                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">
                            No results
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-slot:append>
                        <q-icon
                            v-if="!!async.misc.background"
                            class="cursor-pointer"
                            name="clear"
                            @click.stop="setBackground(null)"
                        />
                    </template>
                </q-select>


                <x-input  tag="li" label="Player Name" placeholder="John Doe" v-model="sheet.misc.player"></x-input>
                <!-- <x-input type="mention" :source="remoteSearch('race')" :mentionOptions="mentionOptions" tag="li" label="Race" placeholder="Human" v-model="sheet.misc.race"></x-input> -->
                <q-select
                    :value="async.misc.race"
                    @input="setRace"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    label="Race"
                    placeholder="Human"
                    :options="source"
                    @filter="(val, update) => remoteSearch('race')(val, update)"
                    :option-value="opt => opt === null ? null : name(opt)"
                    :option-label="opt => opt === null ? '(Unknown Race)' : name(opt)"
                >
                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">
                            No results
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-slot:append>
                        <q-icon
                            v-if="!!async.misc.race"
                            class="cursor-pointer"
                            name="clear"
                            @click.stop="setRace(null)"
                        />
                    </template>
                </q-select>


                <x-input transparent="false" tag="li" label="Alignment" placeholder="True Neutral" v-model="sheet.misc.alignment"></x-input>
                <!-- <x-input class="clean" transparent="false" tag="li" label="Experience Points" placeholder="0" :value="experience_points" disabled></x-input> -->
                <x-input transparent="false" tag="li" label="Level" placeholder="0" v-model="sheet.misc.level"></x-input>
            </ul>
            <ul v-else-if="type == 'physical'">
                <x-input transparent="false" tag="li" label="Age" v-model="sheet.misc.age"></x-input>
                <x-input transparent="false" tag="li" label="Height" v-model="sheet.misc.height"></x-input>
                <x-input transparent="false" tag="li" label="Weight" v-model="sheet.misc.weight"></x-input>

                <x-input transparent="false" tag="li" label="Eyes" v-model="sheet.misc.eye_color"></x-input>
                <x-input transparent="false" tag="li" label="Hair" v-model="sheet.misc.hair_color"></x-input>
                <x-input transparent="false" tag="li" label="Skin" v-model="sheet.misc.skin_color"></x-input>
            </ul>
            <ul v-else-if="type == 'spellcasting'">
                <x-input transparent="false" tag="li" label="Spellcasting Ability" placeholder="INT" v-model="sheet.misc.class_level"></x-input>
                <x-input transparent="false" tag="li" label="Attack Bonus" placeholder="+0" v-model="sheet.misc.background"></x-input>
                <x-input transparent="false" tag="li" label="Saving Throw" placeholder="9" v-model="sheet.misc.player"></x-input>
            </ul>
        </section>
    </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import axios from 'axios'
// @ts-ignore
import utils from '@/utils/resources'

import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'

import Mention from '@/services/mention'

import XInput from '@/components/utils/XInput.vue'
import { Resource } from '../../../store/sheet/types'

@Component({
    components: {
        'x-input': XInput
    },
    computed: {
        ...mapState({
            _sheet: 'sheet'
        }),
        ...mapGetters({
            class_level: 'sheet/class_level',
            experience_points: 'sheet/experience_points'
        })
    },
    methods: {
        ...mapMutations({
            setClassLevel: 'sheet/SET_CLASS_LEVEL'
        }),
        ...mapActions({
            setMisc: 'sheet/SET_MISC'
        }),
    },
})
export default class Header extends Vue {
    @Prop({default: 'system'}) type!: string

    source: object[] = []

    _sheet!: any
    setMisc!: (args: any) => {}

    get sheet() {
        return this._sheet.static
    }

    get async() {
        return this._sheet.async
    }

    name(res: Resource) {
        return utils.name(res)
    }

    remoteSearch(meta: string = '') {
        return (val: string, update: () => {}) => {
            Mention.search(val, meta).then((data) => {
                this.source = data
                update()
            })
        }
    }

    setClass(value: any) {
        this.setMisc({target: 'class', value: value === null ? undefined : `@${value.path[0]}`})
    }

    setBackground(value: any) {
        this.setMisc({target: 'background', value: value === null ? undefined : `@${value.path[0]}`})
    }

    setRace(value: any) {
        this.setMisc({target: 'race', value: value === null ? undefined : `@${value.path[0]}`})
    }
}
</script>

<style lang="sass" scoped>
    @import '@/assets/sass/variables.sass'

    header.dnd-header
        display: flex !important
        align-contents: stretch
        align-items: stretch
        
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
            padding-left: 1em
            padding-right: 1em
            
            ul
                padding: 15px 0px 5px 0px
                display: flex
                flex-wrap: wrap
            
                > /deep/ li
                    margin-right: 5px
                    margin-left: 5px
                    width: calc(33.33333% - 10px)
                    display: flex
                    flex-direction: column-reverse
                    
                    label
                        margin-bottom: 5px
                        margin-top: 5px

                    & > input
                        border: 0
                        border-bottom: 1px solid $faded

                        &:focus
                            border-bottom: 1px solid $rich

                    & > div > div[contenteditable="true"]
                        border: black
                        position: relative
                        padding-bottom: 1px
                        
                        &:after
                            content: ''
                            width: 100%
                            background: $faded
                            height: 1px
                            position: absolute
                            bottom: 0

                        &:focus:after
                            background: $rich
                            

                    &.active
                        & > input
                            border-bottom: 1px solid $faded

                        & > div > div[contenteditable="true"]                        
                            &:after
                                background: $faded

                > /deep/ div.q-field.q-select
                    width: calc(33.33333% - 10px)
                    display: flex
                    margin-right: 5px
                    margin-left: 5px
                    
                    .q-field__inner
                        .q-field__control
                            &::before
                                content: none

                            &::after
                                content: none

                            .q-field__control-container
                                display: -webkit-box
                                display: -ms-flexbox
                                display: flex
                                flex-direction: column
                                padding-top: 0

                                .q-field__native
                                    padding-bottom: 0
                                    line-height: auto

                                    input
                                        border-bottom: 1px solid #ddd

                                        &::placeholder
                                            color: darkgray

                                .q-field__label.absolute
                                    position: relative
                                    transform: none !important
                                    left: 0
                                    right: 0
                                    top: 0
                                    color: black
                                    line-height: 1.5
                                    font-size: 14px
                                    margin-bottom: 5px
                                    margin-top: 5px

                            .q-field__append 
                                height: auto
                
                    &.q-field--float
                        .q-field__inner
                            .q-field__control
                                .q-field__control-container
                                    .q-field__label.absolute
                                        color: lightgray


        
    
</style>

