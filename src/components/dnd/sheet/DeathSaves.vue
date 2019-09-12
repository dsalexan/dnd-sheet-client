<template>
    <div class="deathsaves">
        <div>
            <div class="label">
                <label>Death Saves</label>
            </div>
            <div class="marks">
                <div class="deathsuccesses">
                    <label>Successes</label>
                    <div class="bubbles">
                        <input v-for="(val, index) of 3" :key="index" type="checkbox" :value="value['successes'][index]" @change="(value) => handleChange(value, index, 'successes')"/>
                    </div>
                </div>
                <div class="deathfails">
                    <label>Failures</label>
                    <div class="bubbles">
                        <input v-for="(val, index) of 3" :key="index" type="checkbox" :value="value['failures'][index]" @change="(value) => handleChange(value, index, 'failures')"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

@Component({})
export default class DeathSaves extends Vue {
    @Prop() value!: string

    handleChange(value: boolean, index: number, type: string) {
        this.$emit('change', type, index, value)
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

