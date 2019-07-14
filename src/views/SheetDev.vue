<template>
    <div class="sheet-dev">
        {{ sheet }} - 
        <button @click="reset_sheet">Reset</button>
        <form class="charsheet">
            <dnd-header />
            <!-- <dnd-main />
            <dnd-header type="physical" /> -->
            <dnd-spellcasting type="spellcasting" />
        </form>
    </div>
</template>

<script>
import {mapState, mapMutations, mapGetters} from 'vuex'

import Header from '@/components/dnd/Header.vue'
import Main from '@/components/dnd/Main.vue'
import Spellcasting from '@/components/dnd/Spellcasting.vue'

export default {
  name: 'sheet',
  components: {
    'dnd-main': Main,
    'dnd-header': Header,
    'dnd-spellcasting': Spellcasting
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

    .dnd-header + div.dnd-spellcasting
      padding-top: $gutter * 2

  // input::placeholder, li, div, span, ul, p, label, input, section, th, textarea, textarea::placeholder
  //   color: transparent !important
  //   border-color: transparent !important

  // input, textarea
  //   opacity: 0 !important

  // div.attr-applications
  //   background: grey
</style>

