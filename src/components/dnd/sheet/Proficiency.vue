<template>
    <component :is="tag" class="proficiency">
        <input type="checkbox" :checked="checked" @change="$emit('change', $event.target.checked)"/>
        <x-input class="clean" :label="label" :placeholder="placeholder" :value="modifier(attribute, checked)" disabled reactive="false"/>
    </component>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import {mapGetters} from 'vuex'

import XInput from '@/components/utils/XInput.vue'

@Component({
    components: {
        'x-input': XInput
    },
    computed: {
        ...mapGetters({
            modifier: 'sheet/proficiency_modifier'
        })
    },
    model: {
        prop: 'checked',
        event: 'change'
    },
})
export default class Proficiency extends Vue {
    @Prop({default: 'div'}) tag!: string
    @Prop() placeholder!: string
    @Prop() label!: string
    @Prop({default: false}) checked!: boolean
    @Prop() attribute!: string
    @Prop() type!: string

    content: any = undefined
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

