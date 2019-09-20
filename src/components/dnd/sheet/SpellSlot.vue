<template>
    <div class="dnd-spell-slot" :class="{disabled}">
        <div class="header">
            <div class="level">{{ level == -1 ? '-' : level }}</div>
            <div class="title">
                <template v-if="level == 0">
                    <div class="label">Cantrips</div>
                </template>
                <template v-else>
                    <div class="inputs">
                        <x-input class="total clean" label="Slots Total" :value="total" disabled reactive="false"/>
                        <x-input class="expended clean" label="Slots Expended" :value="expended" @input="handleCast($event, undefined, true)" reactive="false"/>
                    </div>
                </template>
            </div>
        </div>
        <q-list 
            class="body" :style="`height: ${30 * lines + 20 + 20 - 35}px;`"
            bordered >
            
            <div
                v-for="(spell, index) in spells" :key="index">
                <q-separator v-if="index == 0"></q-separator>

                <dnd-spell-slot-item
                    :value="spell"
                    @cast="handleCast"
                    :cast="expended < total"
                    :otherslots="otherslots"
                    @remove="handleRemove">
                </dnd-spell-slot-item>

                <q-separator></q-separator>
            </div>
            <div
                v-for="index in empties" :key="`mk${index}`">
                <q-separator v-if="index == (spells.length == 0 ? 1 : 0)"></q-separator>

                <q-item
                    class="mockup"
                    clickable>
                    <q-item-section>
                        <q-item-label style="text-align: left; padding-left: 30px; font-style: italic; opacity: 0.6;">
                            Unknown {{ level == 0 ? 'Cantrip' : 'Spell' }}
                        </q-item-label>
                    </q-item-section>
                </q-item>

                <q-separator></q-separator>
            </div>
        </q-list>

        <x-input 
            :style="`display: ${mention ? 'none' : ''}`"

            ref="input"
            class="input"
            placeholder="Input"
            type="text"
            @input="handleInput"
            :disabled="disabled"
            
            @keypress.enter="handleEnter"/>

        <q-select
            :style="`display: ${mention ? '' : 'none'}`"

            :value="select_value_c"
            @input="handleSelect"

            class="input"
            ref="select"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            placeholder="Input"
            :options="source"
            @filter="remoteSearch"
            :option-value="opt => opt === null ? null : name(opt)"
            :option-label="opt => opt === null ? '(Unknown Spell)' : name(opt)"
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
                    class="cursor-pointer"
                    name="clear"
                    @click.stop="handleInput(null)"
                />
            </template>
        </q-select>
    </div>
</template>


<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import axios from 'axios'

import XInputVue from '../../utils/XInput.vue';
import SpellSlotItemVue from './SpellSlotItem.vue';
import { Resource, Mention } from '../../../services';

@Component({
    components: {
        'x-input': XInputVue,
        'dnd-spell-slot-item': SpellSlotItemVue,
    }
})
export default class SpellSlot extends Vue {
    @Prop({default: -1}) level!: number
    @Prop({default: 10}) lines!: number
    @Prop({default: 0}) total!: number
    @Prop({default: undefined}) expended!: number
    @Prop({default: () => []}) spells!: any[]
    @Prop({default: false}) disabled!: string | boolean
    @Prop({default: 0}) input!: number
    @Prop({default: -1}) entries!: number
    @Prop({default: 0}) otherslots!: number

    input_value: string = ''
    select_value: string = ''
    mention: boolean = false
    source: any[] = []

    get select_value_c() {
        return '@' + this.select_value
    }

    name(value: any) {
        return Resource.string(value)
    }

    handleInput(value: string) {
        this.mention = (value || '')[0] === '@'

        if (this.mention) {
            // @ts-ignore
            this.$refs.select.$el.style.display = ''
            // @ts-ignore
            this.$refs.select.$el.querySelector('input').focus()
        }

        this.input_value = value
    }

    remoteSearch(val: string, update: () => {}, abort: () => void) {
        if (!this.mention) abort()

        Mention.search(val.substr(1), 'spell', {query: this.$props.query}).then((data) => {
            this.source = data
            update()
        })
    }

    handleSelect(value: any) {
        this.$emit('input', undefined, Resource.minimal(value))
        this.input_value = ''
        this.select_value = ''

        this.mention = false
    }

    get empties() {
        return (this.$props.level === 0 || this.$props.total > 0) ? this.$props.input : 0
    }

    handleEnter(event: any) {
        event.preventDefault()

        this.$emit('input', this.$props.spells.length, this.input_value.trim())
        this.input_value = ''
    }

    handleCast(event: any, level?: number, force: boolean = false) {
        this.$emit('expended', event, level, force)
    }

    handleRemove(event: any) {
        this.$emit('input', event._index, undefined)
    }
}
</script>


<style lang="sass" scoped>
    @import '@/assets/sass/dnd5e-sheet.sass'

    .dnd-spell-slot
        display: flex
        flex-direction: column
        justify-content: center
        // align-items: center

        .header
            $v-padding: 18px
            $h-padding: 25px

            display: flex
            flex-direction: row
            align-items: center
            font-size: 12px

            .level
                font-size: 30px
                font-weight: bold
                color: #444
                padding: 15px 10px
                border: 1.5px solid #555
                border-radius: $radius*1 $radius/2 $radius*1 0
                margin-right: -1px
                z-index: 1
                background-color: white

            .title
                height: 52px
                margin-top: -4px
                text-transform: uppercase
                border: 1px solid #555
                border-radius: 0 $radius*0.75 $radius*0.75 0
                border-left: 0
                flex-grow: 1

                .label
                    font-weight: bold
                    padding: 16.5px 25px

                .inputs
                    height: 100%
                    display: flex
                    flex-direction: row
                    border-radius: 0 $radius*0.75 $radius*0.75 0
                    padding: 0 $gutter

                    > /deep/ div.x-input
                        height: 100%
                        display: flex
                        flex-direction: column
                        justify-content: space-around

                        &:first-of-type
                            border-right: 1px solid #ccc
                            padding-right: $gutter

                        &:last-of-type
                            padding-left: $gutter

                        &.total
                            width: 80px

                        &.expended
                            // background: green
                            flex-grow: 1

                        > input
                            border: 0
                            background: transparent
                            width: 100%
                            line-height: 1
                            flex-grow: 1
                            text-align: center
                            font-size: 2em
                            // margin-bottom: 3px

                        > label
                            font-size: 8px
                            margin-top: 5px
                            // margin-bottom: 2px

        .body
            position: relative
            border: 1px solid #000
            border-top: 0
            border-bottom: 0
            width: calc(95% - #{$gutter} *4)
            margin-top: -15px
            padding: #{$gutter} 0
            margin-right: 2%
            margin-left: auto

            overflow-y: auto

            &::-webkit-scrollbar-track
                background-color: rgb(235, 235, 235)

            &::-webkit-scrollbar
                width: 6px
                background-color: #F5F5F5
                opacity: 0.75

            &::-webkit-scrollbar-thumb
                background-color: #1fcc00
                background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent)
                opacity: 0.75

            div
                div.mockup
                    cursor: auto !important


        > /deep/ div.input
            width: 100%
            border: 1px solid #000
            border-top: 0
            border-radius:  0  0 $radius $radius
            width: calc(95% - #{$gutter} *4)
            margin-right: 2%
            margin-left: auto
            // padding: 0 $gutter
            // padding-top: $gutter/2
            
            > input
                font-size: 0.9em
                border: 0
                width: 100%
                background-color: #f7f7f7
                border-bottom: 1px solid #ddd
                padding: 10px 20px
                border-radius: 0 0 $gutter $gutter

                &:disabled, &.disabled
                    background-color: white
                    color: transparent
                    cursor: default !important

                    &::placeholder
                        color: transparent
        
        > /deep/ div.q-field.q-select
            @import '@/assets/sass/q-select.sass'

            calc(95% - 10px *4)
            margin-right: 2%
            margin-left: auto

            font-size: 0.9em
            border: 0
            background-color: #f7f7f7
            padding: 10px 20px
            padding-right: 10px
            border: 1px solid #000
            border-top: 0
            border-radius:  0  0 $radius $radius
            text-align: center
            justify-content: center
                
            .q-field__inner
                .q-field__control
                    min-height: auto
                    height: 18.9px

                    .q-field__control-container
                        min-height: 18.9px
                        height: 18.9px

                        .q-field__native
                            padding-top: 0
                            min-height: auto

                            input
                                line-height: 18.9px
                                height: 18.9px
                                min-height: 18.9px
                                
                                &::placeholder
                                    color: #333

            &:not(.mention)
                .q-field__inner
                    .q-field__control
                        .q-field__append
                            // display: none

        &.disabled            
            .header
                .level
                    font-weight: 300
                    border: 1.5px solid #555
</style>


