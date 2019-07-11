<template>
    <div class="list-section box">
        <ul>
            <dnd-proficiency 
                v-for="(item, index) in value" :key="index"
                tag="li" 
                :placeholder="placeholder" 
                :label="item.name" 
                :attribute="item.attribute" 
                :value="item.value"
                @change="handleChange"/>
        </ul>
        <div class="label">{{ label }}</div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { attributes } from '@/assets/rules/dnd/5e'

import Proficiency from '@/components/dnd/Proficiency.vue'

import XInput from '@/components/utils/XInput.vue'

export default {
    name: 'dnd-list-section',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        label: String,
        placeholder: String,
        value: Array,
        mode: String
    },
    components: {
        'x-input': XInput,
        'dnd-proficiency': Proficiency
    },
    computed: {
        ...mapState([
            'sheet'
        ]),
        ...mapGetters({
            modifier: 'sheetModifier'
        })
    },
    methods: {
        handleChange(e){
            console.log(e.target)
            this.value = e.target.value
            this.$emit('change', this.value)
        }
    }
}
</script>

<style lang="sass">
    @import '@/assets/sass/dnd5e-sheet.sass'
    
    div.list-section
        border: 1px solid black
        border-radius: $radius
        padding: $gutter 2.5%
        
        div.label
            margin-top: $gutter
            margin-bottom: $gutter / 4
            text-align: center
            text-transform: uppercase
            font-size: 10px
            font-weight: bold
        
        ul li
            margin-top: $gutter / 2

            &:first-of-type
                margin-top: 0

            > *
                margin-left: $gutter / 2

            label
                font-size: 10px
                
                span.skill
                    color: $faded-dark

            input
                &[type="text"]
                    font-size: 12px

                &[type="checkbox"]
                    width: $bubble-size
                    height: $bubble-size
                    border-radius: $bubble-size
</style>

