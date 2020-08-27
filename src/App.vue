<template>
  <div id="app">
    <electron-header v-show="!hideFrame" />
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <!-- <router-view/> -->
    <div id="main">
      <div id="canvasParent">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GameCapture from '@/electron/browser-windows/game-capture';
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
    const resp = await GameCapture.start(document.getElementById('canvasParent') as HTMLDivElement);
    if (!resp) return;
    const canvas = resp.canvas;
    const windowId = resp.windowId;
    this.$electron.ipcRenderer.on('swap-game-window', () => {
      (document.getElementById('canvasParent') as HTMLDivElement).innerHTML = '';
      GameCapture.start(document.getElementById('canvasParent') as HTMLDivElement);
    });
    this.$electron.ipcRenderer.on('toggle-frame', () => {
      this.hideFrame = !this.hideFrame;
    });
    //
  },
  methods: {
  },
  beforeDestroy() {
    // this.$electron.ipcRenderer.removeAllListeners('swap-game-window');
  }
});
</script>

<style>

* {margin: 0; padding: 0; border: 0; vertical-align: baseline;}
html {box-sizing: border-box;}
*, *:before, *:after {box-sizing: inherit;}
html, body {height: 100%; margin: 0;}

body {
  font-family: "Segoe UI", sans-serif;
  background: #1A2933;
  color: #FFF;
  overflow-y: hidden;
}
#main {
  padding-top:32px;
  height: calc(100% - 32px);
  padding: 5px;
  overflow-y: auto;
}
h1 {margin: 0 0 10px 0; font-weight: 600; line-height: 1.2;}
p {margin-top: 10px; color: rgba(255,255,255,0.4);}

</style>
