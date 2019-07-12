<template>
    <div class="sheet-dev">
        {{ sheet.equipment }} - 
        <button @click="reset_sheet">Reset</button>
        <form class="charsheet">
            <!-- <dnd-header /> -->
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

  // input::placeholder, li, div, span, ul, p, label, input, section, th, textarea, textarea::placeholder
  //   color: transparent !important
  //   border-color: transparent !important

  // input, textarea
  //   opacity: 0 !important

  // div.attr-applications
  //   background: grey
</style>

