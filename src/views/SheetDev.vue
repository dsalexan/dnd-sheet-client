<template>
    <div class="sheet-dev">
        {{ sheet.stats.proficiencies.skills.perception }} - 
        <button @click="reset_sheet">Reset</button>
        <form class="charsheet">
            <dnd-header />
            <dnd-main />
        </form>
    </div>
</template>

<script>
import {mapState, mapMutations, mapGetters} from 'vuex'

import Header from '@/components/dnd/Header.vue'
import Main from '@/components/dnd/Main.vue'

export default {
  name: 'sheet',
  components: {
    'dnd-main': Main,
    'dnd-header': Header
  },
  computed: {
    ...mapState([
      'sheet'
    ])
  },
  methods: {
    ...mapMutations([
      'RESET_SHEET'
    ]),
    reset_sheet: function(){
      this.RESET_SHEET()
    }
  }
}
</script>

<style lang="sass" scoped>
  @import '@/assets/sass/dnd5e-sheet.sass'

  form.charsheet
    min-width: $sheet-width
    width: 90vw
    right: 0
    left: 0
    margin-right: auto
    margin-left: auto
    margin-top: 10px

    main                
      section.combat
        background-color: $faded-light
        display: flex
        flex-wrap: wrap
        border-radius: $radius
        
        > div
          overflow: hidden
          
          &.armorclass, &.initiative, &.speed
            flex-basis: 33.333%
            
            > div
              display: flex
              flex-direction: column-reverse
              align-items: center
              margin-top: $gutter
              
              label
                font-size: 8px
                width: $large-box-width - $radius*2
                border: 1px solid black
                border-top: 0
                background-color: $bg
                text-align: center
                padding-top: 5px
                padding-bottom: 5px
                border-radius: 0 0 $radius $radius

              input
                height: $large-box-width
                width: $large-box-width
                border-radius: $radius
                border: 1px solid black
                text-align: center
                font-size: 30px
        
          &.hp
            flex-basis: 100%
            
            > div.regular
              background-color: $bg
              border: 1px solid black
              margin: $gutter
              margin-bottom: $gutter / 2
              border-radius: $radius $radius 0 0
              
              > div.max
                display: flex
                justify-content: space-around
                align-items: baseline
                
                label
                  font-size: 10px
                  text-transform: none
                  color: $faded-dark
                
                input
                  width: 40%
                  border: 0
                  border-bottom: 1px solid $faded
                  font-size: 12px
                  text-align: center

              > div.current
                display: flex
                flex-direction: column-reverse

                input
                  border: 0
                  width: 100%
                  padding: 1em 0
                  font-size: 20px
                  text-align: center

                label
                  font-size: 10px
                  padding-bottom: 5px
                  text-align: center
                  font-weight: bold
                  
            > div.temporary
              margin: $gutter
              margin-top: 0
              border: 1px solid black
              border-radius: 0 0 $radius $radius
              display: flex
              flex-direction: column-reverse
              background-color: $bg
              
              input
                padding: 1em 0
                font-size: 20px
                border: 0
                text-align: center

              label
                font-size: 10px
                padding-bottom: 5px
                text-align: center
                font-weight: bold
                
          &.hitdice, &.deathsaves
            $height: 100px
            flex: 1 50%
            height: $height
            
            > div
              height: $height - $gutter*2
            
          &.hitdice > div
            background-color: $bg
            margin: $gutter
            border: 1px solid black
            border-radius: $radius
            display: flex
            flex-direction: column

            > div.total
              display: flex
              align-items: baseline
              justify-content: space-around
              padding: $gutter/2 0
              
              label
                font-size: 10px
                color: $faded-dark
                margin: 0.25em
                text-transform: none
                
              input
                font-size: 12px
                flex-grow: 1
                border: 0
                border-bottom: 1px solid $faded
                width: 50%
                margin-right: 0.25em
                padding: 0 0.25em
                text-align: center
                
            > div.remaining
              flex: 1
              display: flex
              flex-direction: column-reverse

              label
                text-align: center
                padding: 2px
                font-size: 10px
                
              input
                text-align: center
                border: 0
                flex: 1

          &.deathsaves
            > div
              margin: $gutter
              background: $bg
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
                    flex: 1 50%
            
              div.bubbles
                flex: 1 40%
                margin-left: $gutter / 2

                input[type="checkbox"]
                  appearance: none
                  width: $bubble-size
                  height: $bubble-size
                  border: 1px solid black
                  border-radius: $bubble-size
                  &:checked
                    background-color: black
                  
      section.attacksandspellcasting
        border: 1px solid black
        border-radius: $radius
        margin-top: $gutter
        
        > div
          margin: $gutter
          display: flex
          flex-direction: column
        
          > label
            order: 3
            text-align: center

          > table
            width: 100%
            
            th
              font-size: 10px
              color: $faded
            
            input
              width: calc(100% - 4px)
              border: 0
              background-color: $faded-light
              font-size: 10px
              padding: 3px
              
          textarea
            border: 0
            width: calc(100% - (2 * #{$radius}))
            margin-bottom: $radius

      section.equipment
        border: 1px solid black
        border-radius: $radius
        margin-top: $gutter
        
        > div
          padding: $gutter
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
                label
                  border: 1px solid black
                  border-radius: $radius 0 0 $radius
                  border-right: 0
                  width: $labelwidth
                  font-size: 8px
                  text-align: center
                  padding: $labelpadding 0
                input
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

      section.flavor
        padding: $gutter
        background: $faded-dark
        border-radius: $radius
        
        div
          background: $bg
          display: flex
          flex-direction: column-reverse
          padding: 5px
          border: 1px solid black
          
          label
            text-align: center
            font-size: 10px
            margin-top: 3px
            
          textarea
            border: 0
            border-radius: 0
            height: 4em
            
          &:first-child
            border-radius: $radius $radius 0 0

          &:not(:first-child)
            margin-top: $gutter
          
          &:last-child
            border-radius: 0 0 $radius $radius

      section.features
        padding: $gutter
        
        div
          padding: $gutter
          border: 1px solid black
          border-radius: $radius
          display: flex
          flex-direction: column-reverse
          label
            text-align: center
          textarea
            border: 0
            padding: 5px
            height: 43em
            height: 75em

  // input::placeholder, li, div, span, ul, p, label, input, section, th, textarea, textarea::placeholder
  //   color: transparent !important
  //   border-color: transparent !important

  // input, textarea
  //   opacity: 0 !important

  // div.attr-applications
  //   background: grey
</style>

