<template>
    <div class="deathsaves">
        <div :class="{transparent: isTransparent}">
            <div class="label">
                <label>Death Saves</label>
            </div>
            <div class="marks">
                <div class="deathsuccesses">
                    <label>Successes</label>
                    <div class="bubbles">
                        <input v-for="(success, index) of content.success" :key="index" type="checkbox" v-model="content.success[index]" @change="$emit('change', content)"/>
                    </div>
                </div>
                <div class="deathfails">
                    <label>Failures</label>
                    <div class="bubbles">
                        <input v-for="(failure, index) of content.failure" :key="index" type="checkbox" v-model="content.failure[index]" @change="$emit('change', content)"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'dnd-death-saves',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: Object,
            default: {
                success: [false, false, false],
                failure: [false, false, false]
            }
        },
        transparent: {
            type: [String, Boolean],
            default: false
        }
    },
    data() {
        return {
            content: this.value
        }
    },
    computed: {
        isTransparent() {
            if(typeof this.transparent == 'boolean') return this.transparent
            else if(typeof this.transparent == 'string') return this.transparent.toLowerCase() != 'false'
        }
    }
}
</script>

<style lang="sass" scoped>
$bubble-size: 5px
$radius: 10px

.deathsaves
    > div
        border: 1px solid black
        border-radius: $radius
        display: flex
        flex-direction: column-reverse
        
        > div.label
            text-align: center
            
            label
                font-size: 10px
            
        > div.marks
            display: flex
            flex: 1
            flex-direction: column
            justify-content: center
            
            div.deathsuccesses, div.deathfails
                display: flex
                align-items: center

                > *

                label
                    font-size: 8px
                    text-align: right
                    flex: 1 30%
        
        div.bubbles
            flex: 1 50%

            input[type="checkbox"]
                appearance: none
                width: $bubble-size
                height: $bubble-size
                border: 1px solid black
                border-radius: $bubble-size
                margin: 0 2.5px

                &:first-of-type
                    margin-left: 0
                    
                &:last-of-type
                    margin-right: 0

                &:checked
                    background-color: black

.transparent
    input::placeholder, input, label
        color: transparent !important
</style>

