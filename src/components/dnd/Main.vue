<template>
    <main class="main">
        <section>
            <section class="attributes">
                <dnd-scores></dnd-scores>
            </section>
        </section>
    </main>
</template>

<script>
import {mapState} from 'vuex'

import Scores from '@/components/dnd/Scores.vue'

import XInput from '@/components/utils/XInput.vue'

export default {
    name: 'dnd-main',
    components: {
        'dnd-scores': Scores,
        'x-input': XInput
    },
    computed: mapState([
        'sheet'
    ])
}
</script>

<style lang="sass">
    @import '@/assets/sass/dnd5e-sheet.sass'

    main
        display: flex
        justify-content: space-between
        margin-top: $gutter*2
        
        div.label-container
            position: relative
            width: 100%
            height: $small-box-width - $radius - 2px
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
                            
                div.attr-applications
                    flex-grow: 1
                    margin-left: 10px
                    
                    div.inspiration
                        display: flex
                        flex-direction: row-reverse
                        justify-content: flex-end
                    
                        input
                            appearance: none
                            border: 1px solid black
                            padding: $small-box-width / 2
                            border-radius: $radius

                            &[type="checkbox"]
                                &:checked
                                    background-color: black

                    div.proficiencybonus
                        display: flex
                        flex-direction: row-reverse
                        justify-content: flex-end

                        input
                            width: $small-box-width
                            height: $small-box-width - 2
                            border: 1px solid black
                            text-align: center
                            border-radius: $radius

                    div.list-section
                        border: 1px solid black
                        border-radius: $radius
                        padding: $gutter $gutter/2
                        
                        div.label
                            margin-top: $gutter
                            margin-bottom: $gutter / 4
                            text-align: center
                            text-transform: uppercase
                            font-size: 10px
                            font-weight: bold
                        
                        ul li
                            display: flex
                            align-items: center

                            > *
                                margin-left: $gutter / 2

                            label
                                text-transform: none
                                font-size: 8px
                                text-align: left
                                order: 3
                                
                                span.skill
                                    color: $faded-dark

                            input
                                &[type="text"]
                                    width: 30px
                                    font-size: 12px
                                    text-align: center
                                    border: 0
                                    border-bottom: 1px solid black
                                    order: 2
                                &[type="checkbox"]
                                    appearance: none
                                    width: $bubble-size
                                    height: $bubble-size
                                    border: 1px solid black
                                    border-radius: $bubble-size
                                    order: 1
                                    &:checked
                                    background-color: black

</style>

