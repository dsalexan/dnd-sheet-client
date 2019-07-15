<template>
    <div class="dnd-list" :class="`x${cols}-column`">
        <div class="column" v-for="c in cols" :key="c">
            <x-input 
                class="input"
                v-for="index of lines" :key="index"
                ></x-input>
        </div>
    </div>
</template>

<script>
import XInputVue from '../utils/XInput.vue';
export default {
    name: 'dnd-list',
    props: {
        value: {
            type: Array,
            default: []
        },
        lines: {
            type: Number,
            default: 32
        },
        cols: {
            type: Number,
            default: 1
        }
    },
    components: {
        'x-input': XInputVue
    }
}
</script>

<style lang="sass" scoped>

    $radius: 10px
    
    div.dnd-list
        border: 1px solid black
        width: calc(100% - 2*2*#{$radius})
        padding: $radius * 2
        border-radius: $radius

        display: grid
        grid-gap: $radius

        &.x1-column
            grid-template-columns: 1fr
        
        &.x2-column
            grid-template-columns: 1fr 1fr

        div.input
            padding-top: 5px

            &:first-of-type
                padding-top: 0
                
            & /deep/ input
                font-size: 0.9em
                border: 0
                border-bottom: 1px solid #ddd
                width: calc(100% - 20px)
                background-color: #f7f7f7
                padding: 5px 10px

                &:disabled
                    background-color: white
</style>
