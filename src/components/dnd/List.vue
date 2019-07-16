<template>
    <div class="dnd-list" :class="`x${cols}-column`">
        <div class="column" v-for="c in cols" :key="c">
            <x-input 
                class="input"
                v-for="index of Math.max(qtd_lines, value.length)" :key="index"
                :index="realIndex(index-1, c-1)"
                :ref="`input${realIndex(index-1, c-1)}`"
                :value="value[realIndex(index-1, c-1)] || ''"
                @input="$emit('input', $event, realIndex(index-1, c-1))"
                @focus="handleFocus"
                @keyup.enter="handleEnter($event, realIndex(index-1, c-1))"
                @keyup.delete="handleDelete($event, realIndex(index-1, c-1))"
                />
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
            default: 10
        },
        cols: {
            type: Number,
            default: 1
        }
    },
    components: {
        'x-input': XInputVue
    },
    updated: function() {
        // console.log('UPDATED', this)
    },
    data(){
        return {
            qtd_lines: this.lines
        }
    },
    watch: {
        lines: function(val){
            this.qtd_lines = val
        },
        value: function(val){
            if(val.length < this.$props.lines) this.qtd_lines = this.$props.lines
        }
    },
    methods: {
        realIndex: function(index, col){
            return col*this.$props.lines + index
        },
        handleFocus: function(event){
            // console.log('SHOULD?', event, event.target, event.target.value)
            if(event.target.value !== 0 && !event.target.value){
                // console.log('FOCUS', event)
                // console.log('NEW INDEX', this.$props.value.length)
                // console.log('TO', this.$refs[`input${this.$props.value.length}`][0])
                let target = (this.$refs[`input${this.$props.value.length}`] || {})[0]
                if(target == undefined) return this.grow()
                target.focus()
            }
        },
        handleEnter: function(event, index){
            // console.log('ENTER', event, index)
            if(event.target.value !== 0 && !event.target.value) return
            
            let new_line = index + 1
            let last_index = this.$props.value.length-1

            
            if(last_index > new_line){
                for(let i = last_index; i >= new_line; i--){
                    let next = i+1

                    let value = this.$props.value[i]

                    this.$emit('input', value, next)
                }

                this.$emit('input', '', new_line)
            }

            let target = (this.$refs[`input${new_line}`] || {})[0]
            if(target == undefined) return this.grow()
            target.focus()
        },
        handleDelete: function(event, index){
            // console.log('DELETE', event, index)
            if(this.$props.value[index] == '') this.$emit('input', undefined, index)
        },
        grow(){
            this.qtd_lines++
        }
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
