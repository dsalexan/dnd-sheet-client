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
        
        <template v-if="type == 'textarea'">
            <textarea
                ref="input"
                :name="name" 
                :placeholder="placeholder" 
                :value="value"
                :disabled="isDisabled"

                v-on="inputListeners"/>
        </template>
        <template v-else-if="type == 'mention'">
            <tribute :options="tributeOptions">
                <div
                    class="content-editable"
                    contenteditable="true"
                    :placeholder="placeholder"
                    v-html="value"
                    :disabled="isDisabled"
                    :name="name"
                    ref="input" 
                    :class="{empty: isEmpty}"

                    v-on="inputListeners"  />
            </tribute>
        </template>
        <template v-else>
            <input
                ref="input"
                :name="name" 
                :placeholder="placeholder" 
                :value="value"
                :checked="value"
                :type="type == 'textarea' ? false : type"
                :disabled="isDisabled"

                v-on="inputListeners"/>
        </template>
    </component>
</template>

<script>
import VueTribute from "vue-tribute";

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
                positionMenu: false,
                values: function(text, callback){
                    callback([
                        { key: "Collin Henderson", value: "syropian" },
                        { key: "Sarah Drasner", value: "sarah_edo" },
                        { key: "Evan You", value: "youyuxi" },
                        { key: "Adam Wathan", value: "adamwathan" }
                    ])
                },
                selectTemplate: function(item) {
                    return `<span contenteditable="false" class="mention" onclick="alert('${item.original.key}');">@${item.original.value}</span>`;
                }
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
                    input: vm.handleInput,
                    change: vm.handleChange
                }
            )
        }
    },
    methods: {
        handleInput(e){
            if(this.$props.type != 'text' && this.$props.type != 'textarea') {
                if(this.$props.type != 'mention') return 
                else {
                    let v = e.target.innerText == "" ? undefined : e.target.innerText
                    this.isEmpty = !v

                    this.$emit('input', v)
                    return
                }
            }

            let v =  e.target.value == "" ? undefined : e.target.value
            this.isEmpty = !v

            this.$emit('input', v)
        },
        handleChange(e){
            if(this.$props.type != 'checkbox') return 

            this.$emit('input', e.target.checked)
        },
        focus(){
            this.$refs.input.focus()
        }
    },
    watch: {
        value: function(val){
            // console.log('VALUE', val)
        }
    }
}
</script>

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

    .content-editable
        border: 1px lightgray solid

        &.empty:not(:focus):before
            content: attr(placeholder)
            cursor: text
            color: darkgray

        & /deep/ .mention
            background-color: rgba(0, 0, 255, 0.1)
            font-weight: bold
            cursor: pointer
            padding: 0 3px

</style>

