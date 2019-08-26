<template>
    <div class="sheet">
        <form class="charsheet">
            <button @click="reset">Reset</button>
            <button @click="load('5d5dda78b23baa7a60ae89aa')">Load</button>
            <button @click="state = !state">Show State</button>
            <button @click="logState(false)">Log State</button>
            <button @click="logState(true)">Log State (Pretty)</button>
            <div v-if="state" style="max-height: 600px; overflow-y: auto; background: #333; color: #ddd; padding: 10px 25px;">
                <pre>{{pretty_sheet}}</pre>
            </div>
            <dnd-header />
            <!-- <dnd-main />
            <dnd-header type="physical" />
            <dnd-spellcasting type="spellcasting" /> -->
        </form>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import axios from 'axios';
import _ from 'lodash'

import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import { Bus } from '@/bus'
import { NotifyLevel, NotifySettings } from '@/bus/types'

// import Sheet from "@/services/sheet";

import Header from '@/components/dnd/sheet/Header.vue'
// import Main from '@/components/dnd/Main.vue'
// import Spellcasting from '@/components/dnd/Spellcasting.vue'

@Component({
    components: {
        'dnd-header': Header
    },
    computed: {
        ...mapState(['sheet'])
    },
    methods: {
        ...mapActions({
            reset: 'sheet/RESET',
            load: 'sheet/LOAD'
        })
    },
})
export default class Sheet extends Vue {
    public sheet!: any
    public load!: (id: string) => {}

    public state: boolean = false

    get pretty_sheet() {
        return JSON.stringify(this.sheet, null, 2)
    }

    public mounted() {
        Bus.$on('notify', (settings: NotifySettings, resolve: (dismiss: Function) => void) => {
            const dismiss = this.$q.notify({
                message: settings.message,
                timeout: settings.timeout === undefined ? 2000 : settings.timeout,
                html: settings.html,
                classes: settings.classes,
                icon: settings.icon
            })

            resolve(() => {
                setTimeout(dismiss, 500)
            })
        })

        Bus.$on('watch', (pathname: string, callback: () => void) => {
            this.$store.watch(
                (state, getters) => {
                    let target = state.sheet
                    const path = _.toPath(pathname)
                    const final = path.pop()

                    for (const p of path) {
                        target = target[p]
                    }

                    // @ts-ignore
                    return target[final]

                    // state.sheet.static.misc.level
                },
                callback,
            )
        })

        this.load('5d64533836faaf2a6c6b8319')
    }

    logState(pretty: boolean = false) {
        console.log(this.sheet)
    }
};
</script>

<style lang="sass" scoped>
  @import '@/assets/sass/dnd5e-sheet.sass'

  form.charsheet
    min-width: $sheet-width
    width: 90%
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

