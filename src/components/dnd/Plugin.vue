<template>
    <div class="dnd-plugin">
        PLUGIN
    </div>
</template>

<script>
import utils from '@/assets/utils/resources.js'

import XInputVue from '../utils/XInput.vue';
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
            type: [Object],
            default: () => ({})
        },
        label: {
            type: String,
            default: 'Item'
        },
        autofill: {
            type: Object,
            default: () => ({})
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
        'q-expansion-item': QExpansionItem
    },
    updated: function() {
        // console.log('UPDATED', this)
    },
    data(){
        return {
            mentionOptions: {
                menuItemTemplate: function (item) {
                    return `<div>${utils.name(item.original)}</div><span>${item.original.path[0] || item.original.path || ''}</span>`
                }
            },
            expanded: false
        }
    },
    computed: {
        value_with_length(){
            let value = this.$props.value

            let data = {}

            for(let key in value){
                if(value[key] && value[key].length > 0){
                    data[key] = value[key]
                }
            }

            return data
        }
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
        createItem(value, key, event){
            (event || {}).preventDefault()

            this.$emit('input', value.trim(), (this.$props.value[key] || []).length, key)

            this.$refs.item_creator.empty()
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
