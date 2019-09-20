<template>
<q-slide-item @left="castSpellHigher" @right="removeSpell" :left-color="otherslots > 0 ? 'amber' : 'grey-5'" right-color="red">  
    <template v-slot:left v-if="!isCantrip">
        <q-icon :color="otherslots > 0 ? 'black' : 'white'" :name="otherslots > 0 ? 'flash_on' : 'flash_off'" />
        <span style="padding-left: 10px" :style="{color: otherslots > 0 ? 'black' : 'white'}">Cast at Higher Level</span>
    </template>
    <template v-slot:right v-if="value._origin === 'input'">
        <span style="padding-right: 10px">Remove</span>
        <q-icon name="clear" />
    </template>
    <q-item
        class="spell-slot-item"
        :class="{expanded}">
        <q-item-section>
            <!-- <q-item-label overline>OVERLINE</q-item-label> -->
            <q-item-label style="text-align: left" class="head">
                <div>
                    <q-btn flat round size="sm" :color="(cast || isCantrip) ? 'green' : 'grey-5'" :icon="(cast || isCantrip) ? 'flash_on' : 'flash_off'" @click="castSpell">
                        <q-tooltip>
                            {{ (cast || isCantrip) ? 'Cast spell' : 'All slots for this level were expent' }}
                        </q-tooltip>
                    </q-btn>


                    <span class="name">{{ name(value) }}</span>
                    <span class="school">({{ upper((value.mechanics || {}).school) }})</span>
                </div>
                
                <div>
                    <!-- <q-btn flat round size="sm" color="gray" icon="menu" @click="spellDescription">
                        <q-tooltip>
                            Spell Description
                        </q-tooltip>
                    </q-btn> -->
                    <q-btn flat round size="sm" color="green" :icon="expanded ? 'expand_less' : 'expand_more'"  @click="expanded = !expanded">
                        <q-tooltip>
                            {{ expanded ? 'Show Less' : 'Show More' }}
                        </q-tooltip>
                    </q-btn>
                </div>
            </q-item-label>
            
            <!-- <q-item-label style="text-align: left" caption><span v-html="value.text"></span></q-item-label> -->
            <q-item-label style="text-align: left" class="information" caption v-if="expanded">
                <div>Casting Time <span>{{ upper((value.mechanics || {}).casting_time.join(' ')) }}</span></div>
                <div class="right">Range <span>{{ upper((value.mechanics || {}).range.join(' ')) }}</span></div>
                <div>Components <span>{{ upper((value.mechanics || {}).components.join(' ')) }}</span></div>
                <div class="right">Duration <span>{{ upper((value.mechanics || {}).duration.join(' ')) }}</span></div>
            </q-item-label>

            
            <q-item-label v-if="expanded && value.text !== undefined" style="text-align: left" caption>
                <q-separator style="margin: 12px 0;"></q-separator>
                <span v-html="value.text"></span>
            </q-item-label>
        </q-item-section>
    </q-item>
</q-slide-item>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import { Bus, notify } from '@/bus'
import { Resource } from '../../../services';


@Component({})
export default class SpellSlotItem extends Vue {
    @Prop({default: -1}) value!: number
    @Prop({default: 10}) cast!: number
    @Prop({default: 0}) otherslots!: number

    expanded: boolean = false
    show_higher: boolean = true

    get isCantrip() {
        return this.$props.value.mechanics.level === 0
    }

    name(value: any) {
        return Resource.string(value)
    }

    upper(string = '') {
        if (string === '') return string
        return string[0].toUpperCase() + string.substr(1)
    }

    castSpell(event: any) {
        if (this.$props.cast || this.isCantrip) {
            const spell = this.$props.value

            notify({
                message: `<div style="width: 100%; text-align: center">Casting "<strong>${Resource.string(spell)}</strong>"</div>`,
                icon: 'flash_on',
                html: true
            })

            this.$emit('cast', this.$props.value)
        }
    }

    castSpellHigher({ reset }: any ) {
        if (this.$props.otherslots <= 0) return reset()

        const spell = this.$props.value

        Bus.$emit('choose-spell-level', spell.mechanics.level, (level: string | number) => {
            if (level !== undefined) {
                console.log('LEVEL CHOOSEN', level, spell)

                const sulfix: any = [
                    'st',
                    'nd',
                    'rd',
                    'th'
                ][level > 4 ? 4 : level as number]

                notify({
                    message: `<div style="width: 100%; text-align: center">Casting "<strong>${Resource.string(spell)}</strong>" at ${level}${sulfix} Level</div>`,
                    icon: 'flash_on',
                    html: true
                })

                this.$emit('cast', this.$props.value, level)
            }

            setTimeout(() => reset(), 400)
        })
    }

    removeSpell({ reset }: any){
        const spell = this.$props.value

        notify({
            message: `<div style="width: 100%; text-align: center">Removing ${this.isCantrip ? 'cantrip' : 'spell'} "<strong>${Resource.string(spell)}</strong>"</div>`,
            icon: 'clear',
            html: true
        })

        setTimeout(() => {
            reset()
            this.$emit('remove', spell)
        }, 800)
    }
}
</script>

<style lang="sass" scoped>
    .spell-slot-item
        padding: 12px 12px !important
        // padding-top: 12px !important
        flex-direction: column

        &:hover, &.expanded
            background-color: rgba(black, 0.05)

        .expand-button
            margin-top: 12px
            width: calc(100% + 44px)
            margin-left: -22px

        .head
            display: flex
            justify-content: space-between
            align-items: center

            div
                .name
                    font-weight: bold
                    margin: 0 7px

                .school
                    font-size: 0.8em
                    font-style: italic

                .higher
                    transform: rotate(90deg)
                    box-shadow: none

        .information
            display: grid
            grid-template-columns: 1fr 1fr
            grid-template-rows: 1fr 1fr

            div
                padding-top: 7px

                span
                    padding-left: 7px
                    display: block
                    color: black

                &.right
                    text-align: right

                    span
                        padding-left: 0
                        padding-right: 7px   
</style>