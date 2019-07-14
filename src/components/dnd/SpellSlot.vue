<template>
    <div class="dnd-spell-slot">
        <div class="header">
            <div class="level">{{ level == -1 ? '-' : level }}</div>
            <div class="title">
                <template v-if="level == 0">
                    <div class="label">Cantrips</div>
                </template>
                <template v-else>
                    <div class="inputs">
                        <x-input class="total clean" label="Slots Total" :value="total" disabled reactive="false"/>
                        <x-input class="expended" label="Slots Expended" :value="expended" @input="$emit('expended', $event)" reactive="false" :disabled="isDisabled"/>
                    </div>
                </template>
            </div>
        </div>
        <div class="body">
            <x-input 
                v-for="index in lines" :key="index" 
                class="input" 
                :disabled="isDisabled || (entries == -1 ? false : index > entries)"
                :value="spells[index-1]"
                @input="$emit('spell', index-1, $event)"></x-input>
        </div>
    </div>
</template>


<script>
import XInputVue from '../utils/XInput.vue';

export default {
    name: 'dnd-spell-slot',
    props: {
        level: {
            type: Number,
            default: -1
        },
        lines: {
            type: Number,
            default: 10
        },
        total: {
            type: Number,
            default: 0
        },
        expended: {
            type: Number,
            default: undefined
        },
        spells: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: [String, Boolean],
            default: false
        },
        entries: {
            type: Number,
            default: -1
        }
    },
    components: {
        'x-input': XInputVue
    },
    computed: {
        isDisabled() {
            if(typeof this.disabled == 'boolean') return this.disabled
        }
    },
    watch: {
        spells: function(val){
            // console.log('spells', val)
        }
    }
}
</script>


<style lang="sass" scoped>
    @import '@/assets/sass/dnd5e-sheet.sass'

    .dnd-spell-slot
        display: flex
        flex-direction: column
        justify-content: center
        // align-items: center

        .header
            $v-padding: 19px
            $h-padding: 25px

            display: flex
            flex-direction: row
            align-items: center
            font-size: 12px

            .level
                font-size: 30px
                font-weight: bold
                color: #444
                padding: 15px 10px
                border: 2px solid #555
                border-radius: $radius*1 $radius/2 $radius*1 0
                margin-right: -1px
                z-index: 1
                background-color: white

            .title
                height: 52px
                margin-top: -4px
                text-transform: uppercase
                border: 1px solid #555
                border-radius: 0 $radius*0.75 $radius*0.75 0
                border-left: 0
                flex-grow: 1

                .label
                    font-weight: bold
                    padding: $v-padding $h-padding

                .inputs
                    height: 100%
                    display: flex
                    flex-direction: row
                    border-radius: 0 $radius*0.75 $radius*0.75 0
                    padding: 0 $gutter

                    > div
                        height: 100%
                        display: flex
                        flex-direction: column

                        &:first-of-type
                            border-right: 1px solid #ccc
                            padding-right: $gutter

                        &:last-of-type
                            padding-left: $gutter

                        &.total
                            width: 80px

                        &.expended
                            // background: green
                            flex-grow: 1

                        > /deep/ input
                            border: 0
                            background: transparent
                            width: 100%
                            line-height: 1
                            flex-grow: 1
                            text-align: center
                            font-size: 2em
                            margin-bottom: 3px

                        > /deep/ label
                            font-size: 8px
                            margin-top: 6px
                            margin-bottom: 2px

        .body
            border: 1px solid #000
            border-top: 0
            border-radius:  0  0 $radius $radius
            width: calc(95% - #{$gutter} *4)
            margin-top: -10px
            padding: #{$gutter + 10px} $gutter*2
            margin-right: 2%
            margin-left: auto

            > div.input
                padding: 0 $gutter
                padding-top: $gutter/2

                &:first-of-type
                    padding-top: 0
                
                > /deep/ input
                    font-size: 0.9em
                    border: 0
                    border-bottom: 1px solid #ddd
                    width: calc(100% - 20px)
                    background-color: #f7f7f7
                    padding: 5px 10px

                    &:disabled
                        background-color: white

</style>

