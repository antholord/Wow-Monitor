<template>
  <header>
    <div id="drag-region">
      <div id="window-title">
        <span>Wow Monitor</span>
      </div>
      <div id="window-controls">
        <div
          class="button"
          id="min-button"
          @click="win.minimize()"
        >
          <img
            class="icon"
            :srcset="require('@/assets/icons/min-w-10.png') + ' 1x, ' + require('@/assets/icons/min-w-12.png') + ' 1.25x, ' + require('@/assets/icons/min-w-15.png') + ' 1.5x, ' + require('@/assets/icons/min-w-15.png') + ' 1.75x, ' + require('@/assets/icons/min-w-20.png') + ' 2x, ' + require('@/assets/icons/min-w-20.png') + ' 2.25x, ' + require('@/assets/icons/min-w-24.png') + ' 2.5x, ' + require('@/assets/icons/min-w-30.png') + ' 3x, ' + require('@/assets/icons/min-w-30.png') + ' 3.5x'"
            draggable="false"
          >
        </div>

        <div
          class="button"
          id="max-button"
          v-show="!maximized"
          @click="win.maximize()"
        >
          <img
            class="icon"
            :srcset="require('@/assets/icons/max-w-10.png') + ' 1x, ' + require('@/assets/icons/max-w-12.png') + ' 1.25x, ' + require('@/assets/icons/max-w-15.png') + ' 1.5x, ' + require('@/assets/icons/max-w-15.png') + ' 1.75x, ' + require('@/assets/icons/max-w-20.png') + ' 2x, ' + require('@/assets/icons/max-w-20.png') + ' 2.25x, ' + require('@/assets/icons/max-w-24.png') + ' 2.5x, ' + require('@/assets/icons/max-w-30.png') + ' 3x, ' + require('@/assets/icons/max-w-30.png') + ' 3.5x'"
            draggable="false"
          >
        </div>

        <div
          class="button"
          id="restore-button"
          v-show="maximized"
          @click="win.unmaximize()"
        >
          <img
            class="icon"
            :srcset="require('@/assets/icons/restore-w-10.png') + ' 1x, ' + require('@/assets/icons/restore-w-12.png') + ' 1.25x, ' + require('@/assets/icons/restore-w-15.png') + ' 1.5x, ' + require('@/assets/icons/restore-w-15.png') + ' 1.75x, ' + require('@/assets/icons/restore-w-20.png') + ' 2x, ' + require('@/assets/icons/restore-w-20.png') + ' 2.25x, ' + require('@/assets/icons/restore-w-24.png') + ' 2.5x, ' + require('@/assets/icons/restore-w-30.png') + ' 3x, ' + require('@/assets/icons/restore-w-30.png') + ' 3.5x'"
            draggable="false"
          >
        </div>

        <div
          class="button"
          id="close-button"
          @click="win.close()"
        >
          <img
            class="icon"
            :srcset="require('@/assets/icons/close-w-10.png') + ' 1x, ' + require('@/assets/icons/close-w-12.png') + ' 1.25x, ' + require('@/assets/icons/close-w-15.png') + ' 1.5x, ' + require('@/assets/icons/close-w-15.png') + ' 1.75x, ' + require('@/assets/icons/close-w-20.png') + ' 2x, ' + require('@/assets/icons/close-w-20.png') + ' 2.25x, ' + require('@/assets/icons/close-w-24.png') + ' 2.5x, ' + require('@/assets/icons/close-w-30.png') + ' 3x, ' + require('@/assets/icons/close-w-30.png') + ' 3.5x'"
            draggable="false"
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import { BrowserWindow } from 'electron';

export default Vue.extend({
  data: function() {
    return {
      maximized: false,
      win: {} as BrowserWindow
    };
  },
  mounted() {
    this.win = this.$electron.remote.getCurrentWindow();

    const maximizeCallback = () => { this.maximized = true; };
    const minimizeCallback = () => { this.maximized = false; };
    window.onbeforeunload = () => {
      this.win.removeListener('maximize', maximizeCallback);
      this.win.removeListener('unmaximize', minimizeCallback);
    };

    this.win.on('maximize', maximizeCallback);
    this.win.on('unmaximize', minimizeCallback);
  }
});

</script>
<style>

header {
  display: block;
  padding: 4px;
  position: fixed;
  height: 32px;
  width: 100%;
  z-index:1000;
  background: #254053;
}

#drag-region {
  width: 100%;
  height: 100%;
  -webkit-app-region: drag;
}

header {
  color: #FFF;
}

#window-controls {
  display: grid;
  grid-template-columns: repeat(3, 46px);
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 1000;
}

#window-controls .button {
  grid-row: 1 / span 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
#min-button {
  grid-column: 1;
}
#max-button, #restore-button {
  grid-column: 2;
}
#close-button {
  grid-column: 3;
}

@media (-webkit-device-pixel-ratio: 1.5), (device-pixel-ratio: 1.5),
(-webkit-device-pixel-ratio: 2), (device-pixel-ratio: 2),
(-webkit-device-pixel-ratio: 3), (device-pixel-ratio: 3) {
  #window-controls .icon {
    width: 10px;
    height: 10px;
  }
}

#window-controls {
  -webkit-app-region: no-drag;
}

#window-controls .button {
  user-select: none;
}
#window-controls .button:hover {
  background: rgba(255,255,255,0.1);
}
#window-controls .button:active {
  background: rgba(255,255,255,0.2);
}

#close-button:hover {
  background: #E81123 !important;
}
#close-button:active {
  background: #F1707A !important;
}
#close-button:active .icon {
  filter: invert(1);
}

.maximized header {
  width: 100%;
  padding: 0;
}

.maximized #window-title {
  margin-left: 12px;
}

.maximized #restore-button {
  display: flex !important;
}

.maximized #max-button {
  display: none;
}

header #drag-region {
  display: grid;
  grid-template-columns: auto 138px;
}

#window-title {
  grid-column: 1;
  display: flex;
  align-items: center;
  margin-left: 8px;
  overflow: hidden;
  font-family: "Segoe UI", sans-serif;
  font-size: 12px;
}

#window-title span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.5;
}
</style>
