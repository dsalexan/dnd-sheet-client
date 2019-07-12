<template>
    <div class="dnd-spellcasting">
        <header class="dnd-header">
            <section class="charname">
                <x-input name="spellcasting_class" label="Spellcasting Class" placeholder="Unknown" v-model="sheet.name"></x-input>
            </section>
            <section class="misc">
                <x-input label="Ability" placeholder="INT" v-model="sheet.misc.class_level"></x-input>
                <x-input label="Attack Bonus" placeholder="+0" v-model="sheet.misc.background"></x-input>
                <x-input label="Saving Throw" placeholder="9" v-model="sheet.misc.player"></x-input>
            </section>
        </header>
    </div>
</template>

<script>
import {mapState, mapMutations, mapGetters} from 'vuex'

import XInput from '@/components/utils/XInput.vue'

export default {
    name: 'dnd-spellcasting',
    components: {
        'x-input': XInput
    },
    computed: mapState([
        'sheet'
    ])
}
</script>

<style lang="sass" scoped>
    @import '@/assets/sass/dnd5e-sheet.sass'

    div.dnd-spellcasting
        display: block

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
                padding: 1em

                display: flex
                flex-wrap: wrap
                
                > div
                    flex-basis: 33.333%

                    display: flex
                    flex-direction: column-reverse
                    align-items: center

                    & /deep/ label
                        font-size: 8px
                        width: $wide-box-width - $radius*2
                        border: 1px solid black
                        border-top: 0
                        background-color: $bg
                        text-align: center
                        padding-top: 5px
                        padding-bottom: 5px
                        border-radius: 0 0 $radius $radius

                    & /deep/ input
                        height: $small-box-width + $radius
                        width: $wide-box-width
                        border-radius: $radius
                        border: 1px solid black
                        text-align: center
                        font-size: 20px
            

</style>
