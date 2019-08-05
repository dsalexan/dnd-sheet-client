<template>
    <div class="tweet">
        {{ texto }}
        <x-input placeholder="XInput" type="mention" @input="texto = $event" :value="texto" :source="remoteSearch" :mentionOptions="mentionOptions"></x-input>

        <q-dialog v-model="dialog.open" seamless>
          <q-card style="width: 200px">
            <q-linear-progress :value="1" color="green" />

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
import axios from 'axios'
import utils from '@/assets/utils/resources'
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
      },
      api: {
        loading: false,
        data: []
      },
      mentionOptions: {
          menuItemTemplate: function (item) {
              return `<div>${utils.name(item.original)}</div><span>${item.original.path[0] || item.original.path || ''}</span>`
          }
      }
    };
  },
  methods: {
    handleInput(event){
      // console.log('INPUT', event)
      this.texto = event
    },
    getDataFromApi(){
      this.api.loading = true
      axios.get(`http://my-json-server.typicode.com/dsalexan/dnd-sheet-client/slugs/`)
        .then(res => {
          console.log('FETCH', res)
          this.api.loading = false
          this.api.data = res.data
        })
        .catch(err => {
          this.api.loading = false
          console.log('ERROR', err)
        })
    },
      remoteSearch: function(text, callback){
        axios.get(`http://localhost:3000/?q=${text}&max=10`)
            .then(res => {
                callback(res.data)
            })
            .catch(err => {
                console.log('ERROR ON FETCH', err)
            })
      },
  },
  mounted(){
    bus.$on('mention-click', (event) => {
      this.dialog.open = true
      this.dialog.data = JSON.parse(event.replace(/\'/gmi, '"'))
    })
  },
  created(){
    // this.getDataFromApi()
  }
};
</script>

<style lang="sass" scoped>

</style>


