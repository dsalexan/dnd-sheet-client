<template>
    <div class="dnd-panel" :class="`x${cols}-column ${focused ? 'focused' : ''}`">
        <div class="column">
            <q-list-item
                v-for="key in base" :key="key"
                :title="key"
                :meta="meta"
                :query="query"
                :value="value[key]"
                class="item"
                @click="handleClick"
                @append="createItem($event, key)"
                @remove="removeItem($event, key)">
            </q-list-item>
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
    name: 'dnd-panel',
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
        meta: {
            type: String,
            default: ''
        },
        query: {
            type: String,
            default: undefined
        },
        base: {
            type: Array,
            default: () => []
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
            mentionOptions: {
                menuItemTemplate: function (item) {
                    return `<div>${utils.name(item.original)}</div><span>${item.original.path[0] || item.original.path || ''}</span>`
                }
            },
        }
    },
    computed: {
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
        remote_slug_search: function(editable){
            let _fetch = async (item, search=false) => {
                let result

                if(item[0] == `@` || 'slug' in item){
                    let _slug = item instanceof Object ? item.slug : item.substr(1)
                    result = (await axios.get(`http://localhost:3000/${search ? '' : 'resources'}?q=${_slug}`)).data
                }else
                    result = []

                result = result.map(o => ({
                    ...o,
                    editable
                }))

                if(result.length > 0){
                    result.map(o => ({
                        ...o,
                        editable
                    }))
                    
                    return result.length == 1 ? result[0] : result
                }else{
                    debugger
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
                        let _from = await _fetch(item.from, true)
                        return Object.assign({}, item, {
                            from: _from
                        })
                    }
                    else{
                        return item
                    }
                }
            }
        },
        handleClick: function(event){
            this.focused = !this.focused
        },
        createItem(value, key){
            (event || {}).preventDefault()

            this.$emit('input', value, (this.$props.value[key] || {length:0}).length, key)
        },
        removeItem(index, key){
            this.$emit('input', undefined, index, key)
        },
        name: utils.name
    }
}
</script>

<style lang="sass" scoped>

    $radius: 10px
    
    div.dnd-panel
        border: 1px solid black
        width: 100%
        padding: $radius * 1.5
        border-radius: $radius

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
