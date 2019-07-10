<template>
    <div class="scores">
        <ul>
            <li v-for="(attr, index) in attributes" :key="index">
                <x-input class="score" :label="attr.name" placeholder="10"></x-input>
                <x-input class="modifier" placeholder="+0"></x-input>
            </li>
        </ul>
    </div>
</template>

<script>
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
    }
}
</script>

<style lang="sass">

</style>

