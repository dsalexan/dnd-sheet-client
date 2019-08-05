<template>
    <div class="dnd-list" :class="`x${cols}-column ${expansion ? 'expansion' : ''} ${focused ? 'focused' : ''}`">
        <div class="column">
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
                        :class="{editable: !item._id, 'header-only': !!item._id && item.text !== 0 && !item.text}">

                        <template v-if="!item._id">
                            <x-input placeholder="Slug" v-model="value[index].slug"></x-input>

                            <x-input v-model="value[index].text" :placeholder="`${label} Description`" type="textarea"></x-input>
                        </template>
                        <template v-else>
                            <span v-if="item.text" v-html="item.text"></span>

                            <q-btn flat round color="secondary" icon="clear" @click="removeItem(index)"/>   
                        </template>

                    </q-expansion-item>
                </q-list>

                <q-list>
                    <x-input 
                        class="input" 
                        ref="item_creator"
                        type="mention"
                        :placeholder="label"
                        :mentionOptions="mentionOptions"
                        :source="remoteSearch"
                        @keypress.enter="createItem($event.target.innerText, $event)"/>
                </q-list>
            </template>
            <template v-else>
                <q-list-item
                    v-for="key in Object.keys(compiled)" :key="key"
                    :title="key"
                    :meta="meta"
                    :query="query"
                    :value="compiled[key]"
                    class="item"
                    @click="handleClick"
                    @append="createSubItem($event, key)"
                    @remove="removeSubItem($event, key)">
                </q-list-item>

            </template>
        </div> 
    </div>
</template>

<script>

import utils from '@/assets/utils/resources.js'

import XInputVue from '../utils/XInput.vue';
import QListItem from './QListItem.vue'
import axios from 'axios';

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
import { debuglog } from 'util';

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
        },
        meta: {
            type: String,
            default: ''
        },
        query: {
            type: String,
            default: undefined
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
            focused: false,
            compiled: {},
            mentionOptions: {
                menuItemTemplate: function (item) {
                    return `<div>${utils.name(item.original)}</div><span>${item.original.path[0] || item.original.path || ''}</span>`
                }
            },
        }
    },
    computed: {
        text_value(){
            return function(index){
                let value = this.$props.value[index]

                if(value == undefined) return ''
                else if(typeof value == 'object') return (value.name.en || value.name['pt-BR'] || value.name) || value.text || '<Unknown Feature>'
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
        }
    },
    watch: {
        value: {
            handler: function(val){
                this.compile(this.$props.autofill, val)
            },
            deep: true
        },
        autofill: {
            handler: function(val){
                this.compile(val, this.$props.value)
            },
            deep: true
        }
    },
    mounted(){
        this.compile(this.$props.autofill, this.$props.value)
    },
    methods: {
        remoteSearch: function(text, callback){
            axios.get(`http://localhost:3000/${this.$props.meta}?q=${text}&max=10${this.$props.query ? '&query=' + this.$props.query : ''}`)
                .then(res => {
                    callback(res.data)
                })
                .catch(err => {
                    console.log('ERROR ON FETCH', err)
                })
        },
        compile: async function(_autofill, _value){
            if(this.expansion) return undefined
            // value são os dados da lista
            // o que a gente tem que fazer aqui é passar esse dado para um data
            // e loopar pelos items e retornar os slugs
            // basicamente o compile
            
            let _fn = editable => {
                let _fetch = async (item) => {
                    let result

                    if(item[0] == `@`)
                        result = (await axios.get(`http://localhost:3000/?q=${item.substr(1)}`)).data
                    else
                        result = []

                    result = result.map(o => ({
                        ...o,
                        editable
                    }))

                    if(result.length > 0){
                        return result.length == 1 ? result[0] : result
                    }else{
                        if(item[0] == '@')
                            return {
                                slug: item,
                                name: `Unknown Name (${item})`,
                                text: `Unknown Description (${item})`,
                                editable
                            }
                        else
                            return {
                                name: item,
                                text: `Unknown Description (${item})`,
                                editable
                            }

                    }
                }
                
                return async item => {
                    if(typeof item == 'string'){
                        return _fetch(item)
                    }else if(typeof item == 'object'){
                        if(item.meta == 'command'){
                            let _from = await _fetch(item.from)
                            return Object.assign({}, item, {
                                from: _from
                            })
                        }
                        else{
                            return item
                        }
                    }
                }
            }

            
            let autofill = _autofill
            for(let key in autofill){
                autofill[key] = autofill[key].filter(i => (i.mechanics || {}).display !== false )
            }

            let value = _value

            let obj = {}
            for(let key in autofill){
                obj[key] = autofill[key].map(_fn(false))
                obj[key] = await Promise.all(obj[key])

                if(key in value){
                    obj[key] = obj[key].concat(value[key].map(_fn(true)))
                    obj[key] = await Promise.all(obj[key])
                }
            }

            // console.log('COMPILE', 'autofill', _autofill, 'value', _value)
            // console.log('COMPILED', obj)
            this.compiled = obj
        },
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
        handleClick: function(event){
            this.focused = !this.focused
        },
        createItem(value, event){
            event.preventDefault()

            if(value[0] == '@') {
                let slug = value.trim().replace(/[\n\r]+/gm, '')

                this.remoteSearch(slug.substr(1), data => {
                    if(data.length > 0)
                        this.$emit('input', data[0], this.$props.value.length)
                    else
                        this.$emit('input', {
                            name: value,    
                            slug: undefined,
                            text: undefined
                        }, this.$props.value.length)
                })
            }else {
                this.$emit('input', {
                    name: value,    
                    slug: undefined,
                    text: undefined
                }, this.$props.value.length)
            }

            this.$refs.item_creator.empty()
        },
        removeItem(index){
            this.$emit('input', undefined, index)
        },
        createSubItem(value, key){
            this.$emit('input', value, this.$props.value[key].length, key)
        },
        removeSubItem(index, key){
            this.$emit('input', undefined, index, key)
        },
        name: utils.name
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
