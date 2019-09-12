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
                
            <q-chip dense square clickable :removable="true" @remove="handleRemove(item.__async__._index)"
                v-for="(item, index) of editables" :key="`e${index}`">{{ name(item[0] || item) }}</q-chip>
        </div>

        <q-select
            :style="`display: ${mention ? '' : 'none'}`"

            :value="select_value_c"
            @input="handleSelect"

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
                    @click.stop="handleInput(null, 'selected')"
                />
            </template>
        </q-select>

        <x-input
            :style="`display: ${mention ? 'none' : ''}`"

            class="input"
            placeholder="Input"
            type="text"

            @input="handleInput"
            @keypress.enter="handleEnter"/>
    </template>
</div>
</template>


<script>
import { Resource } from '../../../services';
import axios from 'axios'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

import { command } from '@/bus'

import XInput from '@/components/utils/XInput.vue'
import Mention from '@/services/mention'
import { Styles } from '../../../console';


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
        'x-input': XInput
    },
    data() {
        return {
            focused: false,
            mentionOptions: {
                menuItemTemplate: function (item) {
                    return `<div>${Resource.string(item.original)}</div><span>${item.original.path[0] || item.original.path || ''}</span>`
                }
            },
            input_value: '',
            select_value: '',
            source: [],
            mention: false
        }
    },
    computed: {
        editables(){
            return this.$props.value.filter(i => i._origin === 'input')
        },
        non_editables(){
            return this.$props.value.filter(i => i._origin !== 'input')
        },
        select_value_c(){
            return '@' + this.select_value
        }
    },
    methods: {
        ...mapActions({
            setAnswers: 'sheet/SET_ANSWERS'
        }),

        handleClick: function(event){
            this.focused = !this.focused
            this.$emit('click', event)
        },
        handleInput: function(value){
            this.mention = value && value[0] == '@'

            if(this.mention){
                this.$refs.select.$el.style.display = ''
                this.$refs.select.$el.querySelector('input').focus()
            }

            this.input_value = value
        },
        handleSelect: function(value) {
            this.$emit('append', Resource.minimal(value))
            this.input_value = ''
            this.select_value = ''

            this.mention = false
        },
        remoteSearch(val, update, abort) {
            if(!this.mention) abort()

            Mention.search(val.substr(1), this.$props.meta, {query: this.$props.query}).then((data) => {
                this.source = data
                update()
            })
        },
        handleMention: function(event){
        },
        handleEnter: function(event){
            event.preventDefault()

            this.$emit('append', this.input_value.trim())
            this.input_value = ''
            this.select_value = ''
        },
        handleRemove: function(index){
            this.$emit('remove', index)
        },
        handleClickChip: function(item){
            if(item.meta == 'command'){
                command({
                    from: item.from,
                    display: Resource.string,
                    icon: 'build'
                }).then((answer) => {
                    if(answer.length > 0) {
                        console.log(`%c COMMAND (${item._id}) `, Styles.GREEN, answer, item)
                        this.setAnswers({answer, command: item})
                    }
                })
            }
        },
        name: Resource.string 
    }
}
</script>


<style lang="sass" scoped>
    @import '@/assets/sass/variables.sass'

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
                padding: 10px 20px
                width: 100%
                border-radius: 0 0 10px 10px
                justify-content: center

                &:disabled
                    background-color: white

    > /deep/ div.q-field.q-select
        @import '@/assets/sass/q-select.sass'

        margin-top: 20px
        width: 100%
        font-size: 0.9em
        border: 0
        background-color: #f7f7f7
        padding: 10px 20px
        padding-right: 10px
        border-radius: 0 0 10px 10px
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
</style>
