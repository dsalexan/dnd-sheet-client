<template>
    <div
        :class="{focused}"  >
        <q-item 
            clickable
            @click="handleClick">
            <template v-if="focused">
                <q-item-section avatar>
                    <q-icon name="keyboard_backspace" color="black" />
                </q-item-section>
            </template>

            <q-item-section>
                <q-item-label 
                    v-if="!!title" 
                    overline>
                    {{ title }}
                </q-item-label>
                <q-item-label>
                    <template v-if="!focused">
                        <template v-if="value.length > 0">
                            {{ value.map(i => name(i)).join(', ') }}
                        </template>
                        <template v-else>
                            <span class="empty">No proficiencies</span>
                        </template>
                    </template>
                </q-item-label>
            </q-item-section>

            <template v-if="focused">
                <q-item-section avatar style="opacity: 0">
                    <q-icon name="keyboard_backspace" color="black" />
                </q-item-section>
            </template>
        </q-item>
        <template v-if="focused">
            <div>
                <q-chip dense square clickable :removable="item.editable"
                    v-for="(item, index) of value" :key="index">{{ name(item) }}</q-chip>
            </div>

            <x-input 
                class="input" 
                placeholder="Input"/>
        </template>
    </div>
</template>


<script>
import XInputVue from '../utils/XInput.vue';

import {
  Quasar,
  QExpansionItem,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  Ripple,
  QPopupEdit,
  QIcon,
  QChip
} from 'quasar'

export default {
    props: {
        title: {
            type: String,
            default: undefined
        },
        value: {
            type: Array,
            default: () => ([])
        }
    },
    components: {
        'x-input': XInputVue,
        'q-chip': QChip
    },
    data() {
        return {
            focused: false
        }
    },
    methods: {
        handleClick: function(event){
            this.focused = !this.focused
            this.$emit('click', event)
        },
        editItem: function({reset}){
            console.log('EDIT', reset)
            reset()
        },
        removeItem: function({reset}){
            console.log('REMOVE', reset)
            reset()
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
    .text-overline                               
        text-transform: uppercase

    span.empty
        color: lightgray
        font-style: italic
        font-size: 0.9em

    .focused
        > .q-item
            background: rgba(lightgray, 0.4)
            margin-bottom: 20px

        .text-overline
            font-size: 1em

        .q-item__label
            margin-top: 0

        div.input
            margin-top: 20px
            // padding: 0 15px

            &:first-of-type
                padding-top: 0
                
            & /deep/ input
                font-size: 0.9em
                border: 0
                background-color: #f7f7f7
                padding: 20px 20px
                width: 100%
                border-radius: 0 0 10px 10px
                text-align: center

                &:disabled
                    background-color: white
</style>
