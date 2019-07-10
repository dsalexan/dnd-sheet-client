<template>
    <component 
        :is="tag"
        :class="{active: value != undefined && value != null && value != ''}">
        <label v-if="label != null && label != undefined" :for="name">{{label}}</label>
        <input 
            :name="name" 
            :placeholder="placeholder" 
            @input="$emit('input', $event.target.value)" 
            :value="value" 
            :type="type"/>
    </component>
</template>

<script>
export default {
    name: 'x-input',
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        name: String,
        label: String,
        placeholder: String,
        value: {
            type: [String, Number, Boolean, Date],
            default: undefined
        },
        type: {
            type: String,
            default: 'text'
        }
    }
}
</script>

<style lang="sass" scoped>
    .active
        label
            color: lightgray
</style>

