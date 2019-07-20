<template>
    <div class="dnd-list" :class="`x${cols}-column`">
        <div class="column" v-for="c in cols" :key="c">
            <!-- <x-input 
                class="input"
                v-for="index of Math.max(qtd_lines, value.length)" :key="index"
                :index="realIndex(index-1, c-1)"
                :ref="`input${realIndex(index-1, c-1)}`"
                :value="text_value(realIndex(index-1, c-1)) || ''"
                @input="$emit('input', $event, realIndex(index-1, c-1))"
                @focus="handleFocus"
                @keyup.enter="handleEnter($event, realIndex(index-1, c-1))"
                @keyup.delete="handleDelete($event, realIndex(index-1, c-1))"
                /> -->
            <q-list>
                <q-expansion-item
                    v-for="item of teste" :key="item.slug || item"
                    :label="item.name || item"
                    :group="'teste'"
                    popup
                    :class="{'header-only': item.text !== 0 && !item.text}">
                    <span v-if="item.text" v-html="item.text"></span>
                </q-expansion-item>
            </q-list>
            <q-list >
                <q-expansion-item
                    v-for="item of created" :key="item.slug || item"
                    :label="item.name || item"
                    :group="'created'"
                    popup
                    class="editable">

                    <template v-if="item.slug">
                        <span v-html="item.slug"></span>
                    </template>
                    <template v-else>
                        <x-input placeholder="Slug"></x-input>
                    </template>

                    <template v-if="item.text">
                        <span v-html="item.text"></span>
                    </template>
                    <template v-else>
                        <x-input :placeholder="`${label} Description`" type="textarea"></x-input>
                    </template>

                </q-expansion-item>
            </q-list>
            <q-list>
                <x-input 
                    class="input" 
                    :placeholder="label"
                    @keyup.enter="createItem($event.target.value)"/>
            </q-list>
        </div>
    </div>
</template>

<script>
import XInputVue from '../utils/XInput.vue';

import {
  Quasar,
  QExpansionItem
} from 'quasar'

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
        },
        label: {
            type: String,
            default: 'Item'
        }
    },
    components: {
        'x-input': XInputVue,
        'q-expansion-item': QExpansionItem
    },
    updated: function() {
        // console.log('UPDATED', this)
    },
    data(){
        return {
            qtd_lines: this.lines,
            teste: [
                {
                    meta: 'feature',
                    name: 'Feature #1',
                    slug: 'feature_1',
                    text: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu scelerisque lorem. Vestibulum eleifend turpis at est ultricies viverra. Nulla vel magna viverra, luctus ante sed, porttitor elit. Maecenas lectus dui, vulputate eget purus sed, congue auctor ipsum. Sed consequat, massa vel fringilla maximus, libero massa condimentum sem, a fringilla urna ligula non nisi. Curabitur justo diam, viverra vel ligula non, semper luctus sapien. Cras luctus bibendum felis, ut cursus justo molestie quis. In ullamcorper lectus ante, vel mattis turpis molestie at. Mauris et erat auctor purus viverra maximus. Morbi ullamcorper felis non nunc malesuada, vulputate cursus lacus cursus. Nulla egestas at sem in condimentum.</p>
                    <p>Nam laoreet ultrices ex, sed elementum mi placerat eget. Mauris in diam a metus auctor ullamcorper. Integer ipsum ex, tincidunt in orci vitae, tincidunt vehicula libero. Maecenas accumsan nec enim non fringilla. Phasellus sodales libero at sem mattis, et faucibus nisi egestas. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac nisi a velit cursus accumsan ac quis leo. Aenean a ullamcorper nibh. Quisque vel tortor id mauris imperdiet congue vitae sed dolor. Fusce pellentesque feugiat mauris at viverra. Aliquam erat volutpat.</p>`
                },
                {
                    meta: 'feature',
                    name: 'Feature #2',
                    slug: 'feature_2',
                    text: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu scelerisque lorem. Vestibulum eleifend turpis at est ultricies viverra. Nulla vel magna viverra, luctus ante sed, porttitor elit. Maecenas lectus dui, vulputate eget purus sed, congue auctor ipsum. Sed consequat, massa vel fringilla maximus, libero massa condimentum sem, a fringilla urna ligula non nisi. Curabitur justo diam, viverra vel ligula non, semper luctus sapien.</p>`
                },
                'Feature #3',
                {
                    meta: 'feature',
                    name: 'Feature #4',
                    slug: 'feature_4',
                }
            ],
            created: []
        }
    },
    computed: {
        text_value(){
            return function(index){
                let value = this.$props.value[index]

                if(value == undefined) return ''
                else if(typeof value == 'object') return value.name || value.text || '<Unknown Feature>'
                else if(typeof value == 'string') return value
                else throw Error('Unimplemented')
            }
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
        },
        createItem(value){
            console.log('CREATE ITEM', value)
            this.created.push(value)
        }
    }
}
</script>

<style lang="sass" scoped>

    $radius: 10px
    
    div.dnd-list
        border: 1px solid black
        width: 100%
        padding: $radius * 1.5 0
        border-radius: $radius

        display: grid
        grid-gap: $radius

        &.x1-column
            grid-template-columns: 1fr
        
        &.x2-column
            grid-template-columns: 1fr 1fr

        div.input
            padding: 0 15px

            &:first-of-type
                padding-top: 0
                
            & /deep/ input
                font-size: 0.9em
                border: 0
                background-color: #f7f7f7
                padding: 5px 20px
                width: 100%
                border-radius: $radius
                height: 42px

                &:disabled
                    background-color: white

        div.column
            .q-list
                border-radius: $radius

                & + .q-list
                    & .q-expansion-item, & .input
                        &:first-of-type
                            margin-top: $radius * 1.5

                & /deep/ .q-expansion-item                
                    // arredondar o primeir item
                    &:first-of-type 
                        .q-expansion-item__container
                            border-top-left-radius: $radius
                            border-top-right-radius: $radius
                            

                    // arredondar ultimo item
                    &:last-of-type .q-expansion-item__container
                        border-bottom-left-radius: $radius
                        border-bottom-right-radius: $radius

                    // remover padding quando expanded
                    &.q-expansion-item--expanded 
                        .q-item
                            background: rgba(lightgray, 0.4)

                        padding-top: 0
                        padding-bottom: 0
                        
                        // ajustar a subposicao da borda quando ta expanded
                        .q-expansion-item__container
                            border-radius: 0
                            width: calc(100% + 2px)
                            margin-left: -1px

                    // remover borda quando collapsed
                    &.q-expansion-item--collapsed
                        .q-expansion-item__container
                            border-top-width: 0
                            border-bottom-width: 0

                        &:first-of-type
                            .q-expansion-item__container
                                border-top-width: 1px

                        &:last-of-type
                            .q-expansion-item__container
                                border-bottom-width: 1px

                    // container do slot
                    .q-expansion-item__container
                        overflow: hidden

                        .q-expansion-item__content
                            padding: $radius $radius * 2

                    &.header-only
                        .q-expansion-item__container
                            .q-item
                                cursor: initial !important

                                div.q-item__section:last-of-type
                                    cursor: initial !important
                                    opacity: 0

                            .q-expansion-item__content
                                padding: 0

                    &.input
                        .q-expansion-item__container
                            .q-item
                                padding: 0

                                div.input
                                    padding-top: 0
                                    width: 100%
                                    border-radius: $radius

                                    & /deep/ input
                                        border-radius: $radius
                                        height: 100%
                                        width: 100%
                                        border-bottom: 0

                                div.q-item__section:last-of-type
                                    display: none
                                        
                        &.q-expansion-item--expanded 
                            .q-expansion-item__container .q-item div.input
                                &, > input
                                    border-radius: 0
                    
                    &.editable
                        .q-expansion-item__container
                            .q-expansion-item__content
                                & /deep/ div.x-input
                                    input, textarea
                                        font-size: 0.9em
                                        border: 0
                                        background-color: #f7f7f7
                                        padding: 5px 20px
                                        width: 100%
                                        border-radius: $radius
                                        min-height: 42px

                                    input
                                        margin-bottom: 10px

                                    textarea
                                        padding: 15px 20px
                                        max-height: 15em
                                        overflow-y: scroll
                                        

                                        

</style>
