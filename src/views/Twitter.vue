<template>
  <div class="twitter">
    <tweet/>
  </div>
</template>

<style>
</style>

<script>
import TweetVue from "../components/utils/Tweet.vue";

export default {
  name: "Twitter",
  components: {
    tweet: TweetVue
  }
};
</script>
