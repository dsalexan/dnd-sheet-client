<template>
<div :class="{focused}">
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
            <q-chip dense square clickable 
                v-for="(item, index) of non_editables" :key="`ne${index}`" @click="handleClickChip(item)">
                <q-avatar v-if="item.meta == 'command'" icon="priority_high" color="green" text-color="white" />
                {{ name(item) }}
            </q-chip>
                
            <q-chip dense square clickable :removable="true" @remove="handleRemove(index)"
                v-for="(item, index) of editables" :key="`e${index}`">{{ name(item[0] || item) }}</q-chip>
        </div>

        <x-input 
            class="input"
            ref="input"
            placeholder="Input"
            type="mention"
            @input="input_value = $event"
            @mention="handleMention"
            :source="remoteSearch"
            :mentionOptions="mentionOptions"
            @keypress.enter="handleEnter"/>
    </template>
</div>
</template>


<script>
import utils from '@/assets/utils/resources.js'
import axios from 'axios'

import bus from '@/bus'

import XInputVue from '../utils/XInput.vue';


export default {
    props: {
        title: {
            type: String,
            default: undefined
        },
        value: {
            type: Array,
            default: () => ([])
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
        'x-input': XInputVue
    },
    data() {
        return {
            focused: false,
            mentionOptions: {
                menuItemTemplate: function (item) {
                    return `<div>${utils.name(item.original)}</div><span>${item.original.path[0] || item.original.path || ''}</span>`
                }
            },
            input_value: ''
        }
    },
    computed: {
        editables(){
            return this.$props.value.filter(i => i._source == 'custom')
        },
        non_editables(){
            return this.$props.value.filter(i => i._source !== 'custom')
        }
    },
    methods: {
        handleClick: function(event){
            this.focused = !this.focused
            this.$emit('click', event)
        },
        handleInput: function(event){
        },
        remoteSearch: function(text, callback){
            axios.get(`http://localhost:3000/${this.$props.meta}?q=${text}&max=10${this.$props.query ? '&query=' + this.$props.query : ''}`)
                .then(res => {
                    callback(res.data)
                })
                .catch(err => {
                    console.log('ERROR ON FETCH', err)
                })
        },
        handleMention: function(event){
        },
        handleEnter: function(event){
            event.preventDefault()

            this.$emit('append', this.input_value.trim())
            this.input_value = ''
            
            
            this.$refs.input.empty()
        },
        handleRemove: function(index){
            this.$emit('remove', index)
        },
        handleClickChip: function(item){
            if(item.meta == 'command'){
                bus.$emit('open-command-dialog', { from: item.from, display: utils.name, icon: 'build' }, (values) => {
                    let answer = values.map(i => ({
                        slug: '@' + i.path[0]
                    }))
                    bus.$emit('choose', { command: item, answer })
                })
            }
        },
        name: utils.name 
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
                
            & /deep/ div[contenteditable="true"]
                &.content-editable
                    font-size: 0.9em
                    border: 0
                    background-color: #f7f7f7
                    padding: 10px 20px
                    width: 100%
                    border-radius: 0 0 10px 10px
                    text-align: center
                    justify-content: center

                &:disabled
                    background-color: white
</style>
