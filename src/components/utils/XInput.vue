<template>
    <component 
        :is="tag"
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
        
        <component :is="type == 'textarea' ? 'textarea' : 'input'"
            :name="name" 
            :placeholder="placeholder" 
            @input="handleInput"
            @change="handleChange"
            :value="value"
            :checked="value"
            :type="type == 'textarea' ? false : type"
            :disabled="isDisabled"/>
    </component>
</template>

<script>
export default {
    name: 'x-input',
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
        }
    },
    methods: {
        handleInput(e){
            if(this.$props.type == 'text') this.$emit('input', e.target.value)
        },
        handleChange(e){
            if(this.$props.type == 'checkbox') this.$emit('input', e.target.checked)
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
</style>

