<template>
    <div class="tweet">
        <x-input placeholder="XInput" type="mention" :value="texto" @input="handleInput"></x-input>

        <q-dialog v-model="dialog.open" seamless>
          <q-card style="width: 200px">
            <q-linear-progress :value="1" color="darkblue" />

            <q-card-section class="row items-center no-wrap">
              <div>
                <div class="text-weight-bold">{{dialog.data.key}}</div>
                <div class="text-grey">@{{dialog.data.value}}</div>
              </div>

              <q-space />

              <q-btn flat round icon="clear" @click="dialog.open = false"/>
            </q-card-section>
          </q-card>
        </q-dialog>
    </div>
</template>

<script>
import bus from '@/bus'
import XInputVue from './XInput.vue';

import {
  Quasar,
  QCard,
  QDialog,
  QCardSection,
  QLinearProgress,
  QSpace,
  ClosePopup
} from 'quasar'

export default {
  name: "tweet",
  components: {
    'x-input': XInputVue,
    QCard,
    QDialog,
    QLinearProgress,
    QCardSection,
    QSpace
  },
  directives: {
    ClosePopup
  },
  data() {
    return {
      texto: '',
      dialog: {
        open: false,
        data: {}
      }
    };
  },
  methods: {
    handleInput(event){
      // console.log('INPUT', event)
      this.texto = event
    }
  },
  mounted(){
    bus.$on('mention-click', (event) => {
      this.dialog.open = true
      this.dialog.data = JSON.parse(event.replace(/\'/gmi, '"'))
    })
  }
};
</script>

<style lang="sass" scoped>

</style>


