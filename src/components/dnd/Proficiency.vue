<template>
    <component :is="tag" class="proficiency">
        <input type="checkbox" :checked="checked" @change="$emit('change', $event.target.checked)"/>
        <x-input :label="label" :placeholder="placeholder" :value="modifier(attribute, checked)" disabled reactive="false"/>
    </component>
</template>

<script>
import {mapGetters} from 'vuex'

import XInput from '@/components/utils/XInput.vue'

export default {
    name: 'dnd-proficiency',
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        placeholder: String,
        label: String,
        checked: {
            type: Boolean,
            default: false
        },

        attribute: String
    },
    components: {
        'x-input': XInput
    },
    data(){
        return {
            content: undefined
        }
    },
    computed: {
        ...mapGetters({
            modifier: 'sheetProficiencyModifier'
        })
    },
    methods: {

    }
}
</script>

<style lang="sass" scoped>     
    $bubble-size: 10px
    
    .proficiency
        display: flex
        align-items: center
        flex-direction: row-reverse
        justify-content: flex-end

        & > *
            margin-left: 5px

        & > div
            display: flex
            align-items: center
            
            & /deep/ label
                text-transform: none
                text-align: left
                order: 3
                margin-left: 5px

            & /deep/ input[type="text"]
                    width: 30px
                    text-align: center
                    border: 0
                    border-bottom: 1px solid black
                    order: 2

                    &:disabled
                        background-color: initial

        input[type="checkbox"]
            appearance: none
            width: $bubble-size
            height: $bubble-size
            border: 1px solid black
            border-radius: $bubble-size
            order: 1

            &:checked
                background-color: black    
</style>

