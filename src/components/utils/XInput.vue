<template>
    <component 
        :is="tag"
        class="x-input"
        :class="{active: isReactive ? !(value !== 0 && !value) : false, box: isBox, transparent: isTransparent}">

        <template v-if="label != null && label != undefined">
            <template v-if="isBox">
                <div class="label-container">
                    <label :for="name">{{label}}</label>
                </div>

            </template>
            <template v-else>
                <label :for="name">{{label}}</label>
            </template>
        </template>
        
        <template v-if="type == 'mention'">
            <tribute :options="tributeOptions" 
                    :class="{empty: isEmpty}">
                <div
                    v-once
                    ref="input" 
                    class="content-editable"
                    contenteditable="true"
                    :placeholder="placeholder"
                    :disabled="isDisabled"
                    :name="name"

                    v-html="valueModel"
                    @tribute-replaced="handleMention"

                    v-on="inputListeners"  />
            </tribute>
        </template>
        <template v-else>
            <component
                :is="type === 'textarea' ? type : 'input'"
                ref="input"
                class="input"
                :type="type"

                :value.prop="valueModel"
                :checked.prop="valueModel"

                :name="name" 
                :placeholder="placeholder" 
                :disabled="isDisabled"

                v-on="inputListeners"/>
        </template>
    </component>
</template>

<script>
import bus from '@/bus'
import mentions from '@/assets/utils/mentions.js'

import VueTribute from "vue-tribute"

export default {
    name: 'x-input',
    components: {
        'tribute': VueTribute
    },
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        name: String,
        label: String,
        placeholder: String,

        value: {
            type: [String, Number, Boolean, Date],
            default: undefined
        },
        checked: {
            default: undefined
        },

        type: {
            type: String,
            default: 'text'
        },

        box: {
            type: [Boolean, String],
            default: false
        },
        disabled: {
            type: [Boolean, String],
            default: false
        },
        reactive: {
            type: [String, Boolean],
            default: true
        },
        transparent: {
            type: [String, Boolean],
            default: false
        },
        mentionOptions: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            tributeOptions: Object.assign({}, {
                trigger: "@",
                positionMenu: true,
                values: function(text, callback){
                    callback(mentions.test)
                },
                selectTemplate: mentions.template,
                lookup: function(entry, value){
                    return entry.key + entry.value
                },
                menuItemTemplate: function (item) {
                    return item.original.key;
                },
            }, this.mentionOptions || {}),
            isEmpty: this.value !== 0 && !this.value
        }
    },
    computed: {
        isReactive() {
            if(typeof this.reactive == 'boolean') return this.reactive
            else if(typeof this.reactive == 'string') return !!eval(this.reactive)
        },
        isDisabled() {
            if(typeof this.disabled == 'boolean') return this.disabled
            else if(typeof this.disabled == 'string') return !!eval(this.disabled)
        },
        isBox() {
            if(typeof this.box == 'boolean') return this.box
            else if(typeof this.box == 'string') return !!eval(this.box)
        },
        isTransparent() {
            if(typeof this.transparent == 'boolean') return this.transparent
            else if(typeof this.transparent == 'string') return this.transparent.toLowerCase() != 'false'
        },
        valueModel: {
            get () { 
                return mentions.parse(this.value, mentions.test)
            },
            set (value) {
                if(this.$props.type == 'checkbox'){
                    this.$emit('change', value)
                }else if(this.$props.type == 'text' || this.$props.type == 'textarea' || this.$props.type == 'mention'){
                    let v = value == "" ? undefined : value
                    this.isEmpty = !v

                    this.$emit('input', v)
                }
            },
        },
        inputListeners: function () {
            var vm = this
            // `Object.assign` mescla objetos para formar um novo objeto
            return Object.assign({},
                // Nós adicionamos todas as escutas do pai
                this.$listeners,
                // Então podemos adicionar escutas personalizadas ou substituir
                // comportamento de algumas escutas.
                {
                    // Isso garante que o componente funcione com o v-model
                    input: function (event) {
                        if(vm.$props.type == 'mention'){
                            vm.handleContentInput(event)
                        }else if(vm.$props.type == 'text' || vm.$props.type == 'textarea'){
                            vm.handleInput(event)
                        }
                    },
                    change: function(event){
                        if(vm.$props.type == 'checkbox'){
                            vm.handleChange(event)
                        }
                    }
                }
            )
        }
    },
    methods: {
        focus(){
            this.$refs.input.focus()
        },
        handleInput(event){
            this.valueModel = event.target.value
        },
        handleContentInput(event){
            this.valueModel = event.target.innerText
        },
        handleChange(event){
            this.valueModel = event.target.checked
        },
        handleMention(event){
            this.valueModel = event.target.innerText
        },
        handleMentionClick(event){
            this.$emit('mention-click', event)
        }
    },
    watch: {
        value: function(val){
            this.isEmpty = this.value !== 0 && !this.value
        }
    }
}
</script>

<style lang="sass">
    body
        > .tribute-container
            // padding: 10px 5px

            > ul
                > li
                    padding: 7.5px 10px
                    cursor: pointer
                    background: rgba(lightgray, 0.25)

                    &.highlight
                        background: rgba(green, 0.2)
                        font-weight: bold

                        &:before
                            font-weight: bold
</style>


<style lang="sass" scoped>
    $box-width: 30px
    $radius: 10px

    .active
        label
            color: lightgray

    
    .box
        display: flex
        flex-direction: row-reverse
        justify-content: flex-end
        
        div.label-container
            position: relative
            width: 100%
            height: $box-width - $radius - 2px
            margin-top: $radius / 2 + 1px
            border: 1px solid black
            border-left: 0
            text-align: center

            > label
                position: absolute
                left: 0
                top: 1px
                transform: translate(0%, 50%)
                width: 100%
                font-size: 8px
                                       
        & > input
            &[type="checkbox"]
                appearance: none
                border: 1px solid black
                padding: $box-width / 2
                border-radius: $radius

                &:checked
                    background-color: black

            &[type="text"]
                width: $box-width
                height: $box-width - 2
                border: 1px solid black
                text-align: center
                border-radius: $radius

    
    .clean
        input:disabled
            background-color: white

    .transparent
        input::placeholder, input, label
            color: transparent !important

    .v-tribute
        &.empty .content-editable:not(:focus):before
            content: attr(placeholder)
            cursor: text
            color: darkgray

        .content-editable
            border: 1px lightgray solid

            & /deep/ .mention
                background: rgba(green, 0.1)
                font-weight: bold
                cursor: pointer
                padding: 0 3px

</style>

