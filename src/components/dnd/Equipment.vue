<template>
    <div class="dnd-equipment" :class="{transparent: !!transparent && transparent != 'false', collapsed, collapsed_input}">
        <label>Equipment</label>
        <q-btn flat class="expand-coin" :class="{'full-width': collapsed}" :icon="collapsed ? 'attach_money' : 'money_off'" @click="collapsed = !collapsed"/>
        <div class="money">
            <ul>
                <x-input tag="li" v-for="(coin, key) of coins" :key="key" :label="key" :value="coin" @input="handleCoin(key, $event)" />
            </ul>
        </div>
        <!-- <textarea placeholder="Equipment list here"></textarea> -->
        <div class="items">            
            <x-input 
                v-if="collapsed_input"
                class="input"
                ref="input"
                placeholder="Input"
                type="mention"
                @input="input_value = $event"
                :source="remoteSearch"
                :mentionOptions="mentionOptions"
                @keypress.enter="handleEnter"/>

            <q-btn flat class="expand-input full-width" :icon="!collapsed_input ? 'add' : 'expand_less'" @click="collapsed_input = !collapsed_input; collapsed = true"/>
            <q-list>
                <div v-for="(item, index) of value" :key="index">

                    <q-separator />
                    
                    <q-expansion-item
                        clickable
                        class="tag-item"
                        :expand-icon-toggle="item._children.length > 0"
                        :class="{'dont-expand': item._children.length == 0}">
                        <template v-slot:header>

                            <q-item-section side>
                                <q-icon class="remove" name="remove" color="gray" clickable @click="removeItem(item._index, item._id, item._parent)"/>
                            </q-item-section>

                            <q-separator vertical inset />
                            
                            <q-item-section>
                                <q-item-label style="font-weight: 600">{{nameItem(item, false) || item.slug || item}} <span v-if="quantityItem(item) != undefined">{{quantityItem(item)}}</span> </q-item-label>
                                <q-item-label v-if="captionItem(item) !== undefined" caption lines="2">{{captionItem(item)}}</q-item-label>
                            </q-item-section>
                        </template>
                        <q-list dense>
                            <q-item clickable v-for="(subitem, subindex) of item._children" :key="subindex">
                                <q-item-section side>
                                    <q-icon class="remove" name="remove" color="gray" style="font-size: 1.1rem; width: 1.5rem;" 
                                        clickable 
                                        @click="removeItem(subitem._index, subitem._id, subitem._parent)"
                                        :disable="quantity(subitem) != undefined"/>
                                </q-item-section>

                                <q-separator vertical inset />

                                <q-item-section>
                                    <div>{{nameItem(subitem) || subitem.slug || subitem}} <span v-if="quantityItem(subitem) != undefined">{{quantityItem(subitem)}}</span></div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-expansion-item>

                </div>

                <q-separator />
            </q-list>
        </div>
    </div>
</template>

<script>
import { economy } from '@/assets/rules/dnd/5e'
import utils from '@/assets/utils/resources'

import XInput from '@/components/utils/XInput.vue'

import axios from 'axios'

import {
  Quasar,
  QList,
  QExpansionItem,
  QItem,
  QItemSection,
  QItemLabel,
  QSeparator
} from 'quasar'
import { debuglog } from 'util';

export default {
    name: 'dnd-equipment',
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        value: {
            type: Array,
            return: () => []
        },
        transparent: [String, Boolean],
        coins: {
            type: [Object],
            default: () => ({})
        }
    },
    data(){
        return {
            collapsed: true,
            collapsed_input: true,
            mentionOptions: {
                menuItemTemplate: function (item) {
                    return `<div>${utils.name(item.original)}</div><span>${item.original.path[0] || item.original.path || ''}</span>`
                }
            },
            input_value: ''
        }
    },
    components: {
        'x-input': XInput,
        QList,
        QItem,
        QItemSection,
        QExpansionItem,
        QItemLabel,
        QSeparator
    },
    methods: {
        handleCoin: function(_id, quantity){
            this.$emit('coin', quantity, _id)
        },
        captionItem: function(item){
            if(item.meta == 'command'){
                return `${item.from.map(i => utils.name(i)).join(', ')}`
            }else{
                if(item._children.length == 0){
                    return undefined
                }
                return item._children.map(r => {
                    let name = utils.name(r) || r.slug || r
                    let quantity = (r.mechanics || {quantity: 1}).quantity
                    if(quantity < 1) return ''

                    return `${name}${quantity != 1 && quantity != undefined ? ` (${quantity})` : ''}`
                }).join(', ')
            }
        },
        quantityItem: function(item){
            if(item.meta == 'command') return undefined
            return `x${this.quantity(item)}`
        },
        quantity: function(item){
            if(item.meta == 'command') return undefined
            let quantity = (item.mechanics || {quantity: 1}).quantity
            return quantity == undefined ? 1 : quantity
        },
        nameItem: function(item){
            if(item.meta == 'command'){
                return `Choose ${item.choose}`
            }else{
                return utils.name(item)
            }
        },
        removeItem: function(index, _id, _parent){
            this.$emit('remove', index, _id, _parent)
        },
        remoteSearch: function(text, callback){
            axios.get(`http://localhost:3000/equipment?q=${text}&max=10${this.$props.query ? '&query=' + this.$props.query : ''}`)
                .then(res => {
                    callback(res.data)
                })
                .catch(err => {
                    console.log('ERROR ON FETCH', err)
                })
        },
        handleEnter: function(event){
            event.preventDefault()

            this.$emit('input', this.input_value.trim())
            this.input_value = ''
            
            
            this.$refs.input.empty()
        }
    }
}
</script>


<style lang="sass" scoped>
$radius: 10px


div.dnd-equipment
    position: relative
    padding-right: 5px !important
    padding-left: 0 !important
    padding-top: 5px !important
    display: grid

    &:not(.collapsed)
        grid-template-columns: 29px 60px 1fr
        grid-template-rows: 1fr auto
        grid-template-areas: "expand coin items" "expand label label"

        .expand-coin
            font-size: 0.65em
            padding-left: 12px
            padding-right: 12px
        
    &.collapsed
        grid-template-columns: 29px 1px 1fr
        grid-template-rows: 1fr auto
        grid-template-areas: "expand coin items" "expand label label"

        > div.money
            width: 0

        .expand-coin
            color: #1fcc00
    
    &.collapsed_input
        grid-template-columns: 1px 1px 1fr
        grid-template-rows: 1fr auto
        grid-template-areas: "expand coin items" "expand label label"

        > div.money
            width: 0

        .expand-coin
            display: none

        .expand-input


    > div.money
        $labelwidth: 20px
        $labelpadding: 3px
        grid-area: coin
        overflow: hidden
        animation: myfirst 5s linear 2s infinite alternate

        ul
            display: flex
            flex-direction: column
            justify-content: space-between
            height: 100%
            
            > li
                display: flex
                align-items: center
                margin: 5px 0

                &:first-of-type
                    margin-top: 0

                &:last-of-type
                    margin-bottom: 0

                > /deep/ label
                    border: 1px solid black
                    border-radius: $radius 0 0 $radius
                    border-right: 0
                    width: $labelwidth
                    font-size: 8px
                    text-align: center
                    padding: $labelpadding 0
                > /deep/ input
                    border: 1px solid black
                    border-radius: $radius
                    width: 40px
                    padding: 10px 3px
                    font-size: 12px
                    text-align: center
    

    .expand-coin
        grid-area: expand
        height: calc(100% + 15px)
        margin-top: -5px
        border-radius: 10px 0 0 10px
        margin-right: 5px

        &:hover
            color: #1fcc00

    .expand-input
        grid-area: input
        padding-top: 4px
        padding-bottom: 4px
        font-size: 0.75em

        &:hover
            color: rgb(66, 133, 244)             

    > label
        order: 3
        text-align: center
        grid-area: label
        padding-top: 10px

    > div.items
        grid-area: items
        max-height: 250px
        overflow-y: auto
        padding-left: 7px
        padding-right: 3px

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

        span
            color: #919191
            font-size: 0.9em
            margin-left: 10px

        .remove
            cursor: pointer

            &:hover
                color: red

        .tag-item
            &.dont-expand
                & /deep/ .q-item__section
                    &:last-of-type
                        display: none

            & /deep/ .q-item__section
                &.q-item__section--main
                    padding-left: 7px !important


        .input /deep/ [contenteditable="true"]
            font-size: 0.9em
            border: 0
            background-color: #f7f7f7
            padding: 10px 20px
            width: 100%
            border-radius: 10px 0 0 0
            text-align: center
            -webkit-box-pack: center
            -ms-flex-pack: center
            justify-content: center

    &.collapsed_input
        > div.items
            padding-left: 3px

    &.transparent
        > div.money
            ul > li
                > /deep/ label, > /deep/ input
                    color: transparent !important
                    border-color: transparent !important
        
        > textarea, > textarea::placeholder
            color: transparent !important
            border-color: transparent !important
</style>

