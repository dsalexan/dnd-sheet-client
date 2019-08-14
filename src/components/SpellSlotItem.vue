<template>
    <q-item
        class="spell-slot-item"
        :class="{expanded}">
        <q-item-section>
            <!-- <q-item-label overline>OVERLINE</q-item-label> -->
            <q-item-label style="text-align: left" class="head">
                <div>
                    <q-btn flat round size="sm" :color="cast ? 'green' : 'grey-5'" :icon="cast ? 'flash_on' : 'flash_off'" @click="castSpell">
                        <q-tooltip>
                            {{ cast ? 'Cast spell' : 'All slots for this level were expent' }}
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
</template>

<script>
import utils from '@/assets/utils/resources'

import bus from '@/bus.js'

import {
  Quasar,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QTooltip,
  QSeparator
} from 'quasar'

export default {
    name: 'dnd-spell-slot-item',
    props: [
        'value', 'cast'
    ], components: {
        QList,
        QItem,
        QItemSection,
        QItemLabel,
        QIcon,
        QTooltip,
        QSeparator
    },
    data(){
        return {
            expanded: false
        }
    },
    methods: {
        name: utils.name,
        upper(string=''){
            if(string == '') return string
            return string[0].toUpperCase() + string.substr(1)
        },
        castSpell(event){
            if(this.$props.cast)
                this.$emit('cast', this.$props.value)
        },
        spellDescription(event){
            bus.$emit('spell-description', this.$props.value)
        }
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