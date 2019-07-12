<template>
    <header class="dnd-header">
        <section class="charname">
            <x-input name="charname" label="Name" placeholder="John Jones" v-model="sheet.name"></x-input>
        </section>
        <section class="misc">
            <ul v-if="type == 'system'">
                <x-input tag="li" label="Class & Level" placeholder="Unknown 1" v-model="sheet.misc.class_level"></x-input>

                <x-input tag="li" label="Background" placeholder="Acolyte" v-model="sheet.misc.background"></x-input>
                <x-input tag="li" label="Player Name" placeholder="John Doe" v-model="sheet.misc.player"></x-input>
                <x-input tag="li" label="Race" placeholder="Human" v-model="sheet.misc.race"></x-input>
                <x-input tag="li" label="Alignment" placeholder="True Neutral" v-model="sheet.misc.alignment"></x-input>
                <x-input tag="li" label="Experience Points" placeholder="0" v-model="sheet.misc.experience_points"></x-input>
            </ul>
            <ul v-else-if="type == 'physical'">
                <x-input tag="li" label="Age" v-model="sheet.misc.age"></x-input>
                <x-input tag="li" label="Height" v-model="sheet.misc.height"></x-input>
                <x-input tag="li" label="Weight" v-model="sheet.misc.weight"></x-input>

                <x-input tag="li" label="Eyes" v-model="sheet.misc.eye_color"></x-input>
                <x-input tag="li" label="Hair" v-model="sheet.misc.hair_color"></x-input>
                <x-input tag="li" label="Skin" v-model="sheet.misc.skin_color"></x-input>
            </ul>
            <ul v-else-if="type == 'spellcasting'">
                <x-input tag="li" label="Spellcasting Ability" placeholder="INT" v-model="sheet.misc.class_level"></x-input>
                <x-input tag="li" label="Attack Bonus" placeholder="+0" v-model="sheet.misc.background"></x-input>
                <x-input tag="li" label="Saving Throw" placeholder="9" v-model="sheet.misc.player"></x-input>
            </ul>
        </section>
    </header>
</template>

<script>
import {mapState} from 'vuex'

import XInput from '@/components/utils/XInput.vue'

export default {
    name: 'dnd-header',
    props: {
        type: {
            type: String,
            default: 'system'
        }
    },
    components: {
        'x-input': XInput
    },
    computed: mapState([
        'sheet'
    ])
}
</script>

<style lang="sass">
    @import '@/assets/sass/dnd5e-sheet.sass'

    header.dnd-header
        display: flex !important
        align-contents: stretch
        align-items: stretch
        
        section.charname
            border: 1px solid black
            border-right: 0
            border-radius: $radius 0 0 $radius
            padding: 5px 0
            background-color: $faded-light
            width: 30%
            bottom: 0
            top: 0
            display: flex
            margin: auto
            
            div
                display: flex
                flex-direction: column-reverse
                margin: auto
                width: 100%
                margin: 0 $radius

                input
                    padding: 0.5em
                    margin: 5px
                    border: 0
                
                label
                    padding-left: 1em
        
        section.misc
            width: 70%
            border: 1px solid black
            border-radius: $radius
            padding-left: 1em
            padding-right: 1em
            
            ul
                padding: 15px 0px 5px 0px
                display: flex
                flex-wrap: wrap
            
            li
                margin-right: 5px
                margin-left: 5px
                width: calc(33.33333% - 10px)
                display: flex
                flex-direction: column-reverse
                
                label
                    margin-bottom: 5px
                    margin-top: 5px

                input
                    border: 0
                    border-bottom: 1px solid $faded

                    &:focus
                        border-bottom: 1px solid $rich

                &.active
                    input
                        border-bottom: 1px solid $faded
        
    
</style>

