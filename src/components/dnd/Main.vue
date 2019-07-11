<template>
    <main class="dnd-main">
        <section>
            <section class="attributes">
                <div class="scores">
                    <dnd-scores></dnd-scores>
                </div>
                <div class="attr-applications">
                    <x-input class="inspiration" name="inspiration" type="checkbox" label="Inspiration" v-model="sheet.stats.inspiration" box />
                    <x-input class="proficiencybonus" name="proficiencybonus" label="Proficiency Bonus" placeholder="+2" box />
                    <dnd-list-section />
                </div>
            </section>
        </section>
    </main>
</template>

<script>
import {mapState} from 'vuex'

import Scores from '@/components/dnd/Scores.vue'
import ListSection from '@/components/dnd/ListSection.vue'


import XInput from '@/components/utils/XInput.vue'

export default {
    name: 'dnd-main',
    components: {
        'dnd-scores': Scores,
        'dnd-list-section': ListSection,
        'x-input': XInput
    },
    computed: mapState([
        'sheet'
    ])
}
</script>

<style lang="sass">
    @import '@/assets/sass/dnd5e-sheet.sass'

    main.dnd-main
        display: flex
        justify-content: space-between
        margin-top: $gutter*2
        
        div.label-container
            height: $small-box-width - $radius - 2px
            margin-top: $radius / 2 + 1px

        > section
            width: 32%
            display: flex
            flex-direction: column
            
            section.attributes
                $attr-width: 70px
                $attr-height: 80px
                $attr-gutter: 31px
                width: 100%
                display: flex
                flex-direction: row
                justify-content: space-between
                
                div.scores
                    width: $attr-width + $attr-gutter
                    background-color: $faded-dark
                    border-radius: $radius
                    padding-bottom: $gutter / 2
                    display: flex
                    flex-direction: column
                    justify-content: center

                    label
                        font-size: 8px
                        font-weight: bold

                    ul
                        display: flex
                        flex-direction: column
                        justify-content: space-around
                        align-items: center
                        height: 100%

                    li
                        height: $attr-height
                        width: $attr-width
                            
                div.attr-applications
                    flex-grow: 1
                    margin-left: 10px

                    // div.list-section
                    //     border: 1px solid black
                    //     border-radius: $radius
                    //     padding: $gutter $gutter/2
                        
                    //     div.label
                    //         margin-top: $gutter
                    //         margin-bottom: $gutter / 4
                    //         text-align: center
                    //         text-transform: uppercase
                    //         font-size: 10px
                    //         font-weight: bold
                        
                    //     ul li
                    //         display: flex
                    //         align-items: center

                    //         > *
                    //             margin-left: $gutter / 2

                    //         label
                    //             text-transform: none
                    //             font-size: 8px
                    //             text-align: left
                    //             order: 3
                                
                    //             span.skill
                    //                 color: $faded-dark

                    //         input
                    //             &[type="text"]
                    //                 width: 30px
                    //                 font-size: 12px
                    //                 text-align: center
                    //                 border: 0
                    //                 border-bottom: 1px solid black
                    //                 order: 2
                    //             &[type="checkbox"]
                    //                 appearance: none
                    //                 width: $bubble-size
                    //                 height: $bubble-size
                    //                 border: 1px solid black
                    //                 border-radius: $bubble-size
                    //                 order: 1
                    //                 &:checked
                    //                 background-color: black

</style>

