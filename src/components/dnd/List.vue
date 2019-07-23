<template>
    <div class="dnd-list" :class="`x${cols}-column ${expansion ? 'expansion' : ''} ${focused ? 'focused' : ''}`">
        <div class="column">
            <!-- <x-input 
                class="input"
                v-for="index of Math.max(qtd_lines, value.length)" :key="index"
                :index="realIndex(index-1, c-1)"
                :ref="`input${realIndex(index-1, c-1)}`"
                :value="text_value(realIndex(index-1, c-1)) || ''"
                @input="$emit('input', $event, realIndex(index-1, c-1))"
                @focus="handleFocus"
                @keyup.enter="handleEnter($event, realIndex(index-1, c-1))"
                @keyup.delete="handleDelete($event, realIndex(index-1, c-1))"
                /> -->

            <template v-if="expansion">
                <q-list
                    v-for="key in Object.keys(autofill)" :key="key">
                    <q-expansion-item
                        v-for="(item, index) of display_autofill[key]" :key="index"
                        :label="name(item)"
                        :group="key"
                        popup
                        :class="{'header-only': item.text !== 0 && !item.text}">
                        <span v-if="item.text" v-html="item.text"></span>
                    </q-expansion-item>
                </q-list>

                <q-list v-if="value.length > 0">
                    <q-expansion-item
                        v-for="(item, index) of value" :key="index"
                        :label="name(item)"
                        :group="'created'"
                        popup
                        class="editable">

                        <x-input placeholder="Slug" v-model="value[index].slug"></x-input>

                        <x-input :value="value[index].text" @input="wtf($event, index)" :placeholder="`${label} Description`" type="textarea"></x-input>

                    </q-expansion-item>
                </q-list>

                <q-list>
                    <x-input 
                        class="input" 
                        :placeholder="label"
                        @keyup.enter="createItem($event.target.value)"/>
                </q-list>
            </template>
            <template v-else>
                <q-list-item
                    v-for="key in Object.keys(compiled)" :key="key"
                    :title="key"
                    :value="compiled[key]"
                    class="item"
                    @click="handleClick">
                </q-list-item>

            </template>
        </div>
    </div>
</template>

<script>
import XInputVue from '../utils/XInput.vue';
import QListItem from './QListItem.vue'

import {
  Quasar,
  QExpansionItem,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  Ripple,
  QPopupEdit
} from 'quasar'

export default {
    name: 'dnd-list',
    props: {
        value: {
            type: [Object, Array],
            default: () => []
        },
        cols: {
            type: Number,
            default: 1
        },
        label: {
            type: String,
            default: 'Item'
        },
        autofill: {
            type: Object,
            default: () => ({})
        },
        expansion: {
            type: Boolean,
            default: false
        }
    },
    components: {
        'x-input': XInputVue,
        'q-expansion-item': QExpansionItem,
        'q-list-item': QListItem
    },
    updated: function() {
        // console.log('UPDATED', this)
    },
    data(){
        return {
            qtd_lines: this.lines,
            focused: false
        }
    },
    computed: {
        text_value(){
            return function(index){
                let value = this.$props.value[index]

                if(value == undefined) return ''
                else if(typeof value == 'object') return value.name || value.text || '<Unknown Feature>'
                else if(typeof value == 'string') return value
                else throw Error('Unimplemented')
            }
        },
        display_autofill(){
            let obj = this.$props.autofill

            for(let key in obj){
                obj[key] = obj[key].filter(i => (i.mechanics || {}).display !== false )
            }

            return obj
        },
        compiled(){
            let _fn = editable => item => {
                if(typeof item == 'string'){
                    return{
                        slug: item,
                        name: `Unknown Name (${item})`,
                        text: `Unknown Description (${item})`,
                        editable
                    }
                }else if(typeof item == 'object'){
                    return item
                }
            }

            let autofill = this.display_autofill
            let value = this.$props.value

            let obj = {}
            for(let key in autofill){
                obj[key] = autofill[key].map(_fn(false))

                if(key in value){
                    obj[key] = obj[key].concat(value[key].map(_fn(true)))
                }
            }

            return obj
        }
    },
    watch: {
        lines: function(val){
            this.qtd_lines = val
        },
        value: function(val){
            if(val.length < this.$props.lines) this.qtd_lines = this.$props.lines
        }
    },
    methods: {
        realIndex: function(index, col){
            return col*this.$props.lines + index
        },
        handleFocus: function(event){
            // console.log('SHOULD?', event, event.target, event.target.value)
            if(event.target.value !== 0 && !event.target.value){
                // console.log('FOCUS', event)
                // console.log('NEW INDEX', this.$props.value.length)
                // console.log('TO', this.$refs[`input${this.$props.value.length}`][0])
                let target = (this.$refs[`input${this.$props.value.length}`] || {})[0]
                if(target == undefined) return this.grow()
                target.focus()
            }
        },
        handleEnter: function(event, index){
            // console.log('ENTER', event, index)
            if(event.target.value !== 0 && !event.target.value) return
            
            let new_line = index + 1
            let last_index = this.$props.value.length-1

            
            if(last_index > new_line){
                for(let i = last_index; i >= new_line; i--){
                    let next = i+1

                    let value = this.$props.value[i]

                    this.$emit('input', value, next)
                }

                this.$emit('input', '', new_line)
            }

            let target = (this.$refs[`input${new_line}`] || {})[0]
            if(target == undefined) return this.grow()
            target.focus()
        },
        handleDelete: function(event, index){
            // console.log('DELETE', event, index)
            if(this.$props.value[index] == '') this.$emit('input', undefined, index)
        },
        handleClick: function(event){
            this.focused = !this.focused
        },
        grow(){
            this.qtd_lines++
        },
        createItem(value){
            this.$emit('input', {
                name: value,    
                slug: undefined,
                text: undefined
            }, this.$props.value.length)
        },
        wtf(e, index){
            this.$props.value[index].text = e
        },
        name(item){
            if(typeof item == 'string') return item
            else if(typeof item == 'object') {
                if(item.meta == 'command'){
                    if(item.choose != undefined){
                        return `Choose ${item.choose} from <${item.from}>`
                    }else{
                        return '<Unknown command>'
                    }
                }

                return item.name || undefined
            }
        }
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

        &.expansion
            padding: $radius * 1.5 0

        &.x1-column
            > div.column
                grid-template-columns: 1fr
        
        &.x2-column
            > div.column
                grid-template-columns: 1fr 1fr

        &.focused
            padding: 0
            // padding-bottom: $radius * 1.5
            > div.column
                grid-template-columns: 1fr

                .item
                    display: none
                    
                    &.focused
                        display: block

        div.input
            padding: 0 15px

            &:first-of-type
                padding-top: 0
                
            & /deep/ input
                font-size: 0.9em
                border: 0
                background-color: #f7f7f7
                padding: 5px 20px
                width: 100%
                border-radius: $radius
                height: 42px

                &:disabled
                    background-color: white

        > div.column
            display: grid
            grid-gap: $radius

            .q-list
                border-radius: $radius

                & + .q-list
                    & .q-expansion-item, & .input
                        &:first-of-type
                            margin-top: $radius * 1.5

                & /deep/ .q-expansion-item                
                    // arredondar o primeir item
                    &:first-of-type 
                        .q-expansion-item__container
                            border-top-left-radius: $radius
                            border-top-right-radius: $radius
                            

                    // arredondar ultimo item
                    &:last-of-type .q-expansion-item__container
                        border-bottom-left-radius: $radius
                        border-bottom-right-radius: $radius

                    // remover padding quando expanded
                    &.q-expansion-item--expanded 
                        .q-item
                            background: rgba(lightgray, 0.4)

                        padding-top: 0
                        padding-bottom: 0
                        
                        // ajustar a subposicao da borda quando ta expanded
                        .q-expansion-item__container
                            border-radius: 0
                            width: calc(100% + 2px)
                            margin-left: -1px

                    // remover borda quando collapsed
                    &.q-expansion-item--collapsed
                        .q-expansion-item__container
                            border-top-width: 0
                            border-bottom-width: 0

                        &:first-of-type
                            .q-expansion-item__container
                                border-top-width: 1px

                        &:last-of-type
                            .q-expansion-item__container
                                border-bottom-width: 1px

                    // container do slot
                    .q-expansion-item__container
                        overflow: hidden

                        .q-expansion-item__content
                            padding: $radius $radius * 2

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
