<template>
    <div class="dnd-equipment">
        <label>Equipment</label>
        <div class="money">
            <ul>
                <x-input tag="li" v-for="(coin, index) of coins" :key="index" :label="coin.slug" v-model="content.treasure.coins[coins[index].slug]" />
            </ul>
        </div>
        <textarea placeholder="Equipment list here"></textarea>
    </div>
</template>

<script>
import { economy } from '@/assets/rules/dnd/5e'

import XInput from '@/components/utils/XInput.vue'

export default {
    name: 'dnd-equipment',
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        value: {
            type: Object,
            default: () => ({
                treasure: {
                    coins: {}
                },
                items: []
            })
        }
    },
    components: {
        'x-input': XInput
    },
    data() {
        return {
            coins: economy.money.coins.list,
            content: this.value
        }
    }
}
</script>


<style lang="sass" scoped>
$radius: 10px

div.dnd-equipment
    display: flex
    flex-direction: row
    flex-wrap: wrap
    
    > div.money
        $labelwidth: 20px
        $labelpadding: 3px

        ul
            display: flex
            flex-direction: column
            justify-content: space-between
            height: 100%
            
            > li
                display: flex
                align-items: center

                > /deep/ label
                    border: 1px solid black
                    border-radius: $radius 0 0 $radius
                    border-right: 0
                    width: $labelwidth
                    font-size: 8px
                    text-align: center
                    padding: $labelpadding 0
                > /deep/ input
                    border: 1px solid black
                    border-radius: $radius
                    width: 40px
                    padding: 10px 3px
                    font-size: 12px
                    text-align: center
        
    > label
        order: 3
        text-align: center
        flex: 100%
    
    > textarea
        flex: 1
        border: 0
</style>

