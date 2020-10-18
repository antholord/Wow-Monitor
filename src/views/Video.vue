<template>
  <div id="canvasParent">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GameCapture from '@/electron/browser-windows/game-capture';

export default Vue.extend({
  data() {
    return {
      windowId: '',
      windowWidth: 0,
      windowHeight: 0
    };
  },
  async mounted() {
    this.$electron.ipcRenderer.on('swap-game-window', async() => {
      (document.getElementById('canvasParent') as HTMLDivElement).innerHTML = '';
      const resp = await GameCapture.startVideo(document.getElementById('canvasParent') as HTMLDivElement, this.windowId);
      if (resp) {
        this.windowId = resp.windowId;
        this.getWindowSize();
      }
    });

    const resp = await GameCapture.startVideo(document.getElementById('canvasParent') as HTMLDivElement);
    if (!resp) return;
    this.windowId = resp.windowId;

    this.$nextTick(function() {
      window.addEventListener('resize', this.getWindowSize);
      // Init
      this.getWindowSize();
    });
  },
  methods: {
    getWindowSize() {
      this.windowHeight = document.documentElement.clientHeight;
      this.windowWidth = document.documentElement.clientWidth;

      const video = document.getElementById('video') as HTMLVideoElement | null;
      if (video) {
        video.width = this.windowWidth;
        video.height = this.windowHeight;
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowSize);
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
  /* padding-top:32px; */
  height: calc(100% - 32px);
  overflow-y: auto;
}
h1 {margin: 0 0 10px 0; font-weight: 600; line-height: 1.2;}
p {margin-top: 10px; color: rgba(255,255,255,0.4);}

video {
  z-index:1;
}
</style>
