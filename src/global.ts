import Vue from 'vue';

declare global {
  interface Window {
      bus: Vue;
  }
}
