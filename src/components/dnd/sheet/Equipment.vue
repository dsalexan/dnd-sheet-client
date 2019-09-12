<template>
    <div class="dnd-equipment" :class="{collapsed, collapsed_input}">
        <!-- <label>Equipment</label> -->
        <q-btn flat class="expand-coin" :class="{'full-width': collapsed}" :icon="collapsed ? 'attach_money' : 'money_off'" @click="collapsed = !collapsed"/>
        <div class="money">
            <ul>
                <x-input tag="li" v-for="(coin, key) of coins" :key="key" :label="key" :value="coin" @input="handleCoin(key, $event)" />
            </ul>
        </div>
        <!-- <textarea placeholder="Equipment list here"></textarea> -->
        <div class="items">
            <template v-if="collapsed_input">
                <x-input 
                    :style="`display: ${mention ? 'none' : ''}`"

                    class="input"
                    placeholder="Input"
                    type="text"
                    @input="handleInput"
                    
                    @keypress.enter="handleEnter"/>
                
                <q-select
                    :style="`display: ${mention ? '' : 'none'}`"

                    :value="select_value_c"
                    @input="handleSelect"

                    class="input"
                    ref="select"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    placeholder="Input"
                    :options="source"
                    @filter="remoteSearch"
                    :option-value="opt => opt === null ? null : name(opt)"
                    :option-label="opt => opt === null ? '(Unknown Resource)' : name(opt)"
                >
                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">
                            No results
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-slot:append>
                        <q-icon
                            class="cursor-pointer"
                            name="clear"
                            @click.stop="handleInput(null)"
                        />
                    </template>
                </q-select>
            </template>

            <q-btn flat class="expand-input full-width" :icon="!collapsed_input ? 'add' : 'expand_less'" @click="collapsed_input = !collapsed_input; collapsed = true"/>
            <q-list>
                <div v-for="(item, index) of value" :key="index">

                    <q-separator />
                    
                    <!-- @left="({reset}) => blockItem({reset}, item, !item.mechanics.blocked)" -->
                    <q-slide-item 
                        :ref="`q-slide-item_${item._uuid}`"
                        @left="({reset}) => answerCommand({reset}, item)"
                        @right="({reset}) => removeItem({reset}, item)" :left-color="'green'" :right-color="quantity(item) > 1 ? 'deep-orange' : 'red'">
                        <template v-slot:left v-if="item.meta == 'command'">
                            <q-icon color="white" :name="'add'" />
                            <span style="padding-left: 10px; color: white;"> Choose </span>
                        </template>
                        <template v-slot:right>
                            <span style="padding-right: 10px; color: white;">{{ quantity(item) > 1 ? 'Remove' : 'Discard' }}</span>
                            <q-icon :name="quantity(item) > 1 ? 'remove' : 'clear'" />
                        </template>
                        <q-expansion-item
                            clickable
                            class="tag-item"
                            :expand-icon-toggle="item._children.length > 0"
                            :class="{'dont-expand': item._children.length == 0}">
                            <template v-slot:header>

                                <!-- <q-item-section side>
                                    <q-icon class="remove" name="remove" color="gray" clickable @click="removeItem(item._index, item._id, item._parent)"/>
                                </q-item-section>

                                <q-separator vertical inset /> -->
                                
                                <q-item-section>
                                    <q-item-label style="font-weight: 600">{{nameItem(item, false) || item.slug || item}} <span v-if="quantityItem(item) != undefined">{{quantityItem(item)}}</span> </q-item-label>
                                    <q-item-label v-if="captionItem(item) !== undefined" caption lines="2">{{captionItem(item)}}</q-item-label>
                                </q-item-section>
                            </template>
                            <q-list dense>
                                <q-slide-item  
                                    clickable v-for="(subitem, subindex) of item._children" :key="subindex"
                                    :ref="`q-slide-item_${subitem._uuid}`"
                                    @left="({reset}) => answerCommand({reset}, subitem)"
                                    @right="({reset}) => removeItem({reset}, subitem)" :left-color="'green'" :right-color="quantity(item) > 1 ? 'deep-orange' : 'red'">
                                    <template v-slot:left v-if="subitem.meta == 'command'">
                                        <q-icon color="white" :name="'add'" />
                                        <span style="padding-left: 10px; color: white;"> Choose </span>
                                    </template>
                                    <template v-slot:right>
                                        <span style="padding-right: 10px; color: white;">{{ quantity(subitem) > 1 ? 'Remove' : 'Discard' }}</span>
                                        <q-icon :name="quantity(subitem) > 1 ? 'remove' : 'clear'" />
                                    </template>
                                    <q-item>
                                        <!-- <q-item-section side>
                                            <q-icon class="remove" name="remove" color="gray" style="font-size: 1.1rem; width: 1.5rem;" 
                                                clickable 
                                                @click="removeItem(subitem._index, subitem._id, subitem._parent)"
                                                :disable="quantity(subitem) != undefined"/>
                                        </q-item-section>

                                        <q-separator vertical inset /> -->

                                        <q-item-section>
                                            <div>{{nameItem(subitem) || subitem.slug || subitem}} <span v-if="quantityItem(subitem) != undefined">{{quantityItem(subitem)}}</span></div>
                                        </q-item-section>
                                    </q-item>
                                </q-slide-item>
                            </q-list>
                        </q-expansion-item>

                    </q-slide-item>
                </div>

                <q-separator />
            </q-list>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

import XInput from '@/components/utils/XInput.vue'

import axios from 'axios'
import { Mention, Resource } from '../../../services';
import { notify, command, injected, before_injection } from '../../../bus';
import { Styles } from '../../../console';

@Component({
    components: {
        'x-input': XInput
    },
    computed: {
        ...mapState([
            'sheet'
        ]),
        ...mapGetters({
            modifier: 'sheet/modifier',
            abilities: 'sheet/abilities',
            ability_scores: 'sheet/ability_scores'
        }),
    },
    methods: {
        ...mapMutations({
            setAbilityScore: 'sheet/SET_ABILITY_SCORE'
        }),
        ...mapActions({
            setAnswers: 'sheet/SET_ANSWERS'
        })
    },
    model: {
        prop: 'value',
        event: 'input'
    }
})
export default class Equipment extends Vue {
    @Prop({default: []}) value!: any[]
    @Prop({default: {}}) coins!: any

    sheet!: any
    setAnswers!: any

    collapsed: boolean = true
    collapsed_input: boolean = true
    input_value: string = ''
    select_value: string = ''
    bugfix_slide: any = false
    bugfix_slide_before: any = false
    mention: boolean = false
    source: any[] = []

    handleCoin(slug: string, quantity: number){
        this.$emit('coin', quantity, slug)
    }

    get select_value_c() {
        return '@' + this.select_value
    }

    handleInput(value: string) {
        this.mention = (value || '')[0] === '@'

        if (this.mention) {
            // @ts-ignore
            this.$refs.select.$el.style.display = ''
            // @ts-ignore
            this.$refs.select.$el.querySelector('input').focus()
        }

        this.input_value = value
    }

    handleSelect(value: any) {
        this.$emit('input', Resource.minimal(value))
        this.input_value = ''
        this.select_value = ''

        this.mention = false
    }

    captionItem(item: any) {
        if (item.meta === 'command') {
            return `${item.from.map((i: any) => Resource.string(i)).join(', ')}`
        } else {
            if (item._children.length === 0) return undefined

            return item._children.map((r: any) => {
                const name = Resource.string(r) || r.slug || r
                const quantity = (r.mechanics || {quantity: 1}).quantity
                if (quantity < 1) return ''

                return `${name}${quantity !== 1 && quantity !== undefined ? ` (${quantity})` : ''}`
            }).join(', ')
        }
    }

    quantityItem(item: any){
        return item.meta === 'command' ? undefined : `x${this.quantity(item)}`
    }

    quantity(item: any) {
        if (item.meta === 'command') return undefined
        const quantity = (item.mechanics || {quantity: 1}).quantity
        return quantity === undefined ? 1 : quantity
    }

    nameItem(item: any) {
        const nome = item.meta === 'command' ? `Choose ${item.choose}` : Resource.string(item)
        return nome
    }

    removeItem({reset}: any, item: any) {
        this.$q.notify({
            message: `<div style="width: 100%; text-align: center">Removing item "<strong>${Resource.string(item)}</strong>"</div>`,
            icon: 'clear',
            html: true
        })
        setTimeout(() => {
            reset()

            this.$emit('remove', item.__async__._index, item.__async__._type, -1)
        }, 800)
    }

    blockItem({reset}: any, item: any, value: any) {
        notify({
            message: `<div style="width: 100%; text-align: center">${value ? 'Unlocking' : 'Locking'} item "<strong>${Resource.string(item)}</strong>"</div>`,
            icon: 'block',
            html: true
        })

        setTimeout(() => {
            reset()

            this.$emit('block', item.__async__._index, item.__async__._type)
        }, 800)
    }

    answerCommand({reset}: any, item: any) {
        if (item.meta === 'command') {
            return setTimeout(() => {
                reset()

                command({
                    from: item.from,
                    display: Resource.string,
                    icon: 'toys'
                }).then((answer: any) => {
                    if (answer.length > 0) {
                        console.log(`%c COMMAND (${item._id}) `, Styles.GREEN, answer, item)
                        this.setAnswers({answer, command: item})
                    }
                })
            }, 600)
        }
        reset()
    }

    handleEnter(event: any) {
        event.preventDefault()

        this.$emit('input', this.input_value.trim())
        this.input_value = ''

        // this.$refs.input.empty()
    }


    remoteSearch(val: string, update: () => {}, abort: () => void) {
        if (!this.mention) abort()

        Mention.search(val.substr(1), 'equipment', {query: this.$props.query}).then((data) => {
            this.source = data
            update()
        })
    }

    name(value: any) {
        return Resource.string(value)
    }

    mounted() {
        before_injection().then((references) => {
            console.log('%c BEFORE INJECTION ', Styles.GRAY, 'Preparing for command injection, forcing layout update on equipment component', references)
            this.bugfix_slide_before = references
        })

        injected().then((references) => {
            console.log('%c INJECTION ', Styles.GRAY, 'Command injection happenned, forcing layout update on equipment component', references)
            this.bugfix_slide = references
        })
    }

    updated() {
        this.$nextTick(function() {
            // Código que irá rodar apenas após toda
            // a árvore do componente ter sido re-renderizada
            if (this.bugfix_slide) {

                for (const answer of this.bugfix_slide) {
                    const _uuid = `q-slide-item_${answer._uuid}`

                    // @ts-ignore
                    const target = this.$refs[_uuid][0].$el

                    const right = target.querySelector('.q-slide-item__right')
                    const right_div = target.querySelector('.q-slide-item__right > div')
                    const content = target.querySelector('.q-slide-item__content')

                    right.style.visibility = ''
                    right_div.style.transform = 'scale3d(0, 0, 1)'
                    content.style.visibility = 'visible'
                    target.style.display = ''
                }

                this.bugfix_slide = false
            }

            if (this.bugfix_slide_before) {

                for (const answer of this.bugfix_slide_before) {
                    const _uuid = `q-slide-item_${(answer._uuid || answer)}`

                    // @ts-ignore
                    const target = this.$refs[_uuid][0].$el

                    target.style.display = 'none'
                }

                this.bugfix_slide_before = false
            }
        })
    }
}
</script>


<style lang="sass" scoped>
$radius: 10px

div.dnd-equipment
    position: relative
    padding-right: 5px !important
    padding-left: 0 !important
    padding-top: 5px !important
    display: grid

    border: 1px solid black
    width: 100%
    padding: 15px
    border-radius: 10px
    flex-grow: 1

    &:not(.collapsed)
        grid-template-columns: 29px 60px 1fr
        grid-template-rows: 1fr auto
        grid-template-areas: "expand coin items" "expand label label"

        .expand-coin
            font-size: 0.65em
            padding-left: 12px
            padding-right: 12px
        
    &.collapsed
        grid-template-columns: 29px 1px 1fr
        grid-template-rows: 1fr auto
        grid-template-areas: "expand coin items" "expand label label"

        > div.money
            width: 0

        .expand-coin
            color: #1fcc00
    
    &.collapsed_input
        grid-template-columns: 1px 1px 1fr
        grid-template-rows: 1fr auto
        grid-template-areas: "expand coin items" "expand label label"

        > div.money
            width: 0

        .expand-coin
            display: none

        .expand-input


    > div.money
        $labelwidth: 20px
        $labelpadding: 3px
        grid-area: coin
        overflow: hidden
        animation: myfirst 5s linear 2s infinite alternate

        ul
            display: flex
            flex-direction: column
            justify-content: space-between
            height: 100%
            padding-inline-start: 0
            
            > li
                display: flex
                align-items: center
                margin: 5px 0

                &:first-of-type
                    margin-top: 0

                &:last-of-type
                    margin-bottom: 0

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
    

    .expand-coin
        grid-area: expand
        height: calc(100% + 15px)
        margin-top: -5px
        border-radius: 10px 0 0 10px
        margin-right: 5px

        &:hover
            color: #1fcc00

    .expand-input
        grid-area: input
        padding-top: 4px
        padding-bottom: 4px
        font-size: 0.75em

        &:hover
            color: rgb(66, 133, 244)             

    > label
        order: 3
        text-align: center
        grid-area: label
        padding-top: 10px

    > div.items
        grid-area: items
        max-height: 388px
        overflow-y: auto
        padding-left: 7px
        padding-right: 3px

        &::-webkit-scrollbar-track
            background-color: rgb(235, 235, 235)

        &::-webkit-scrollbar
            width: 6px
            background-color: #F5F5F5
            opacity: 0.75

        &::-webkit-scrollbar-thumb
            background-color: #1fcc00
            background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent)
            opacity: 0.75

        span
            color: #919191
            font-size: 0.9em
            margin-left: 10px

        .remove
            cursor: pointer

            &:hover
                color: red

        .tag-item
            &.dont-expand
                & /deep/ .q-item__section
                    &:last-of-type
                        display: none

            & /deep/ .q-item__section
                &.q-item__section--main
                    padding-left: 7px !important


        > /deep/ .x-input
            input
                font-size: 0.9em
                border: 0
                background-color: #f7f7f7
                padding: 10px 20px
                width: 100%
                border-radius: 10px 10px 0 0
                text-align: left
                -webkit-box-pack: center
                -ms-flex-pack: center
                justify-content: center

        > /deep/ div.q-field.q-select
            @import '@/assets/sass/q-select.sass'

            width: 100%
            font-size: 0.9em
            border: 0
            background-color: #f7f7f7
            padding: 10px 20px
            padding-right: 10px
            border-radius: 10px 10px 0 0
            text-align: center
            justify-content: center
                
            .q-field__inner
                .q-field__control
                    min-height: auto
                    height: 18.9px

                    .q-field__control-container
                        min-height: 18.9px
                        height: 18.9px

                        .q-field__native
                            padding-top: 0
                            min-height: auto

                            input
                                line-height: 18.9px
                                height: 18.9px
                                min-height: 18.9px
                                
                                &::placeholder
                                    color: #333

            &:not(.mention)
                .q-field__inner
                    .q-field__control
                        .q-field__append
                            // display: none

    &.collapsed_input
        > div.items
            padding-left: 3px

    &.transparent
        > div.money
            ul > li
                > /deep/ label, > /deep/ input
                    color: transparent !important
                    border-color: transparent !important
        
        > textarea, > textarea::placeholder
            color: transparent !important
            border-color: transparent !important
</style>

