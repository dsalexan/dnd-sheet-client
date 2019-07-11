<template>
    <ul class="dnd-scores">
        <li v-for="(attr, index) in attributes" :key="index">
            <x-input class="score" :label="attr.name" placeholder="+0" :value="modifier(attr.alias.toLowerCase())" disabled reactive="false"></x-input>
            <x-input class="modifier" placeholder="10" v-model="sheet.stats.attributes[attr.alias.toLowerCase()]"></x-input>
        </li>
    </ul>
</template>

<script>
import { mapState, mapGetters } from 'vuex'


import { attributes } from '@/assets/rules/dnd/5e'

import XInput from '@/components/utils/XInput.vue'

export default {
    name: 'dnd-scores',
    components: {
        'x-input': XInput
    },
    data() {
        return {
            attributes: attributes.list
        }
    },
    computed: {
        ...mapState([
            'sheet'
        ]),
        ...mapGetters({
            modifier: 'sheetModifier'
        })
    }
}
</script>

<style lang="sass">
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

            input
                width: 100%
                padding: 0
                border: 0

            div.score
                background-color: $bg
                border: 1px solid black
                text-align: center
                border-radius: $radius
                padding-bottom: $radius

                input
                    text-align: center
                    font-size: 40px
                    padding: 2px 0px 0px 0px
                    background: transparent
                    border: none

            div.modifier
                margin-top: -$radius
                text-align: center

                input
                    background: $bg
                    width: $radius*3
                    height: $radius*2
                    border: 1px inset black
                    border-radius: $radius*2
                    margin: -1px
                    text-align: center
                        
</style>

