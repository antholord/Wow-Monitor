<template>
  <div id="app">
    <electron-header v-show="!hideFrame" />
    <div id="main">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ElectronHeader from '@/components/ElectronHeader.vue';

export default Vue.extend({
  data() {
    return {
      hideFrame: false
    };
  },
  components: {
    ElectronHeader
  },
  async mounted() {
    this.$electron.ipcRenderer.on('toggle-frame', (_, state: boolean) => {
      if (state) {
        this.hideFrame = state;
      } else {
        this.hideFrame = !this.hideFrame;
      }
    });
  },
  methods: {

  },
  beforeDestroy() {

  }
});
</script>

<style>

* {margin: 0; padding: 0; border: 0; vertical-align: baseline;}
html {box-sizing: border-box;}
*, *:before, *:after {box-sizing: inherit;}
html, body {height: 100%; margin: 0;}
html {
  overflow-y: hidden !important;
}

#main {
  /* padding-top:32px; */
  height: calc(100% - 32px);
  overflow-y: auto;
}

body {
  font-family: "Segoe UI", sans-serif;
  background: #1A2933;
  color: #FFF;
  overflow-y: hidden;
}
</style>
