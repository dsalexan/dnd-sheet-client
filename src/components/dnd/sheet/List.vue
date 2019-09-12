<template>
    <div class="dnd-list">
        <q-list
            v-for="key in Object.keys(value_with_length)" :key="key">
            <q-expansion-item
                v-for="(item, index) of value[key]" :key="index"
                :group="key"
                popup
                expand-icon-toggle
                :class="{editable: !item._id, 'header-only': !!item._id && item.text !== 0 && !item.text}"
                @input="expanded = $event && index">
                <template v-slot:header>          
                    <q-item-section avatar>
                        <q-btn v-if="item._origin === 'input'" flat round color="red" icon="clear" @click="removeItem(item.__async__._index)"/>   
                    </q-item-section>

                    <q-item-section>
                        {{ name(item) }}
                    </q-item-section>      

                </template>

                <template v-if="!item._id">
                    <x-input placeholder="Slug" v-model="value[key][index].slug"></x-input>

                    <x-input v-model="value[key][index].text" :placeholder="`${label} Description`" type="textarea"></x-input>
                </template>
                <template v-else>
                    <span v-if="item.text" v-html="item.text"></span>
                </template>

                
                <q-expansion-item
                    :header-inset-level="1"
                    class="inner-item"
                    v-for="(subitem, index) of (item._children || [])" :key="`s${index}`"
                    @input="expanded = $event && index">

                    <template v-slot:header>

                        <q-item-section>
                            {{ name(subitem) }}
                        </q-item-section>      

                    </template>

                    <span v-if="subitem.text" v-html="subitem.text"></span>
                    <p v-if="subitem.text == undefined" style="color: lightgray; font-style: italic; font-size: 0.9em;">No Description</p>
                </q-expansion-item>


            </q-expansion-item>
        </q-list>

        <q-list>
            <x-input 
                :style="`display: ${mention ? 'none' : ''}`"

                class="input"
                :placeholder="label"
                type="text"
                @input="handleInput"
                
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
                :option-label="opt => opt === null ? '(Unknown Resource)' : name(opt)"
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
        </q-list>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import axios from 'axios'
import { Mention, Resource } from '../../../services';
import XInputVue from '../../utils/XInput.vue';

@Component({
    components: {
        'x-input': XInputVue
    }
})
export default class List extends Vue {
    @Prop({default: () => ({})}) value!: {}
    @Prop({default: 'Item'}) label!: string
    @Prop({default: () => ({})}) autofill!: {}
    @Prop({default: ''}) meta!: string
    @Prop({}) query!: string | undefined

    expanded: boolean = false
    mention: boolean = false
    source: any[] = []
    input_value: string = ''
    select_value: string = ''

    get value_with_length() {
        const value = this.$props.value

        const data: any = {}
        for (const key in value) {
            if (value[key] && value[key].length > 0) {
                data[key] = value[key]
            }
        }

        return data
    }

    remoteSearch(val: string, update: () => {}, abort: () => void) {
        if (!this.mention) abort()

        Mention.search(val.substr(1), 'feature', {query: this.$props.query}).then((data) => {
            this.source = data
            update()
        })
    }

    get select_value_c() {
        return '@' + this.select_value
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

    handleSelect(value: any) {
        this.$emit('input', Resource.minimal(value))
        this.input_value = ''
        this.select_value = ''

        this.mention = false
    }

    handleEnter(event: any) {
        event.preventDefault()

        this.$emit('input', this.input_value.trim())
        this.input_value = ''

        // this.$refs.input.empty()
    }

    removeItem(index: number) {
        this.$emit('input', undefined, index)
    }

    name(value: any) {
        return Resource.string(value)
    }
}
</script>

<style lang="sass" scoped>

    $radius: 10px
    
    div.dnd-list
        border: 1px solid black
        width: 100%
        padding: $radius * 1.5
        border-radius: $radius
        padding: $radius * 1.5 0

        div.input
            padding: 0 15px

            &:first-of-type
                padding-top: 0
                
            & /deep/ [contenteditable="true"], & /deep/ input
                font-size: 0.9em
                border: 0
                background-color: #f7f7f7
                padding: 5px 20px
                width: 100%
                border-radius: $radius
                height: 42px
                text-align: start

                &:disabled
                    background-color: white
            
        & /deep/ div.q-field.q-select
            @import '@/assets/sass/q-select.sass'

            width: calc(100% - 30px)
            font-size: 0.9em
            border: 0
            background-color: #f7f7f7
            padding: 10px 0px
            padding-right: 10px
            margin: 0px 15px
            border-radius: 10px
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

        >.q-list
            border-radius: $radius

            & + .q-list
                & .q-expansion-item, & .input
                    &:first-of-type
                        margin-top: $radius * 1.5

            & /deep/ .q-expansion-item                
                // arredondar o primeir item
                &:first-of-type 
                    > .q-expansion-item__container
                        border-top-left-radius: $radius
                        border-top-right-radius: $radius
                        

                // arredondar ultimo item
                &:last-of-type > .q-expansion-item__container
                    border-bottom-left-radius: $radius
                    border-bottom-right-radius: $radius

                // remover padding quando expanded
                &.q-expansion-item--expanded 
                    > .q-expansion-item__container
                        > .q-item
                            background: rgba(lightgray, 0.4)

                    padding-top: 0
                    padding-bottom: 0
                    
                    // ajustar a subposicao da borda quando ta expanded
                    > .q-expansion-item__container
                        border-radius: 0
                        width: calc(100% + 2px)
                        margin-left: -1px

                // remover borda quando collapsed
                &.q-expansion-item--collapsed
                    > .q-expansion-item__container
                        border-top-width: 0
                        border-bottom-width: 0

                    &:first-of-type
                        > .q-expansion-item__container
                            border-top-width: 1px

                    &:last-of-type
                        > .q-expansion-item__container
                            border-bottom-width: 1px

                // container do slot
                > .q-expansion-item__container
                    overflow: hidden

                    > .q-expansion-item__content
                        padding: $radius $radius * 3
                        text-align: justify
                        text-justify: inter-word

                        > .q-expansion-item.inner-item 
                            > .q-expansion-item__container
                                border-radius: 0 !important

                                > .q-item
                                    padding-left: 16px !important
                                    border-radius: 0 !important

                                    > .q-focus-helper
                                        border-radius: 0 !important
                

                &.header-only
                    .q-expansion-item__container
                        .q-item
                            cursor: initial !important

                            div.q-item__section:last-of-type
                                cursor: initial !important
                                opacity: 0

                        .q-expansion-item__content
                            padding: 0

                &.input
                    .q-expansion-item__container
                        .q-item
                            padding: 0

                            div.input
                                padding-top: 0
                                width: 100%
                                border-radius: $radius

                                & /deep/ input
                                    border-radius: $radius
                                    height: 100%
                                    width: 100%
                                    border-bottom: 0


                            div.q-item__section:last-of-type
                                display: none
                                    
                    &.q-expansion-item--expanded 
                        .q-expansion-item__container .q-item div.input
                            &, > input
                                border-radius: 0
                
                &.editable
                    .q-expansion-item__container
                        .q-expansion-item__content
                            & /deep/ div.x-input
                                input, textarea
                                    font-size: 0.9em
                                    border: 0
                                    background-color: #f7f7f7
                                    padding: 5px 20px
                                    width: 100%
                                    border-radius: $radius
                                    min-height: 42px

                                input
                                    margin-bottom: 10px

                                textarea
                                    padding: 15px 20px
                                    max-height: 15em
                                    overflow-y: scroll


                                        

</style>
