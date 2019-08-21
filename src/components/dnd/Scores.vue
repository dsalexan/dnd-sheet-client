<template>
    <ul class="dnd-scores">
        <li v-for="(attr, index) in attributes" :key="index">
            <x-input class="score half-clean" :label="attr.name" placeholder="+0" :value="modifier(attr.slug)" disabled reactive="false"></x-input>
            <div class="modifier" :class="{'adding': isAdding(attr.slug), 'default': !isAdding(attr.slug)}">
                <x-input 
                    class="main"
                    placeholder="10" 
                    :value="isAdding(attr.slug) ? sheet.stats.attributes[attr.slug].value : score(attr.slug)" 
                    @input="sheet.stats.attributes[attr.slug].value = $event"
                    @focus="adding = add(attr.slug) !== undefined ? attr.slug : false"
                    @blur="adding = false"></x-input>
                <x-input 
                    class="add"
                    placeholder="+0"
                    disabled
                    :value="add(attr.slug)"
                    ></x-input>
            </div>
        </li>
    </ul>
</template>

<script>
import { mapState, mapGetters } from 'vuex'


import { attributes } from '@/assets/rules/dnd/5e'

import XInput from '@/components/utils/XInput.vue'
import { debuglog } from 'util';

export default {
    name: 'dnd-scores',
    components: {
        'x-input': XInput
    },
    data() {
        return {
            attributes: attributes.all,
            adding: false
        }
    },
    computed: {
        ...mapState([
            'sheet'
        ]),
        ...mapGetters({
            score: 'sheet/attribute',
            modifier: 'sheet/modifier'
        }),
        isAdding: function(){
            return attr => {
                return this.adding == attr
            }
        },
        add: function(){
            return attr => {
                let attribute = ((this.sheet.async.stats || {}).attributes || {})[attr] || {}
                
                if(!attribute || attribute.add == undefined) return undefined

                return attribute.add >= 0 ? '+' + attribute.add : attribute.add
            } 
        }
    }
}
</script>

<style lang="sass" scoped>
    @import '@/assets/sass/dnd5e-sheet.sass'

    ul.dnd-scores
        display: flex
        align-items: center

        label
            font-size: 8px
            font-weight: bold

        li
            display: flex
            flex-direction: column

            & /deep/ div.score
                background-color: $bg
                border: 1px solid black
                text-align: center
                border-radius: $radius
                padding-bottom: $radius

                &.disable, &.disabled
                    background-color: rgba($bg, 0.8)

                > input
                    text-align: center
                    font-size: 40px
                    padding: 2px 0px 0px 0px
                    background: transparent
                    border: none
                    width: 100%
                    padding: 0
                    border: 0

            div.modifier
                margin-top: -$radius
                text-align: center
                display: flex
                flex-direction: row
                justify-content: center

                > div
                    &:first-of-type
                        margin-right: 2px
                    
                    &:last-of-type
                        margin-left: 2px

                & /deep/ .x-input
                    > input
                        background: $bg
                        width: $radius*3
                        height: $radius*2
                        border: 1px inset black
                        border-radius: $radius*2 0 0 $radius*2
                        margin: -1px
                        text-align: center

                    &.add
                        display: none

                        > input
                            border-radius: 0 $radius*2 $radius*2 0
                            opacity: 1 !important
                            cursor: default !important

                &.adding
                    & /deep/ .x-input
                        &.add
                            display: block

                &.default
                    & /deep/ .x-input
                        > input
                            border-radius: $radius*2


                        
                        
</style>

