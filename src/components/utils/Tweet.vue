<template>
    <div class="tweet">
        <x-input placeholder="XInput" type="mention" :value="texto"></x-input>
    </div>
</template>

<script>
import XInputVue from './XInput.vue';

export default {
  name: "tweet",
  components: {
    'x-input': XInputVue
  },
  data() {
    return {
      tributeOptions: {
        trigger: "@",
        positionMenu: false,
        values: [
          { key: "Collin Henderson", value: "syropian" },
          { key: "Sarah Drasner", value: "sarah_edo" },
          { key: "Evan You", value: "youyuxi" },
          { key: "Adam Wathan", value: "adamwathan" }
        ],
        selectTemplate: function(item) {
          return `<span contenteditable="false" style="background-color: rgba(0, 0, 255, 0.1); font-weight: bold; cursor: pointer;" onclick="alert('${
            item.original.key
          }');">@${item.original.value}</span>`;
        }
      },
      texto: '@syropian'
    };
  },
  methods: {
    search(text, callback) {
      [
        { key: "Collin Henderson", value: "syropian" },
        { key: "Sarah Drasner", value: "sarah_edo" },
        { key: "Evan You", value: "youyuxi" },
        { key: "Adam Wathan", value: "adamwathan" }
      ];
    }
  }
};
</script>

<style lang="sass" scoped>

</style>


