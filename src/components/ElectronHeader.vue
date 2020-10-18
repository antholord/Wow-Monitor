<template>
  <header>
    <div id="drag-region">
      <div id="window-title">
        <span>Wow Monitor</span>
      </div>
      <div id="window-controls">
        <div
          v-show="!isSettingsRoute"
          class="button"
          id="settings-button"
        >
          <v-icon
            small
            @click="openSettings"
          >
            settings
          </v-icon>
        </div>
        <div
          class="button"
          id="min-button"
          @click="getWindow().minimize()"
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
          title="Maximize"
          @click="getWindow().maximize()"
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
          title="Minimize"
          @click="getWindow().unmaximize()"
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
          @click="closeWindow"
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

let winRef = {} as BrowserWindow | null;

export default Vue.extend({
  data: function() {
    return {
      maximized: false
    };
  },
  mounted() {
    winRef = this.$electron.remote.getCurrentWindow() as BrowserWindow;
    console.log(winRef.title);
    const maximizeCallback = () => { this.maximized = true; console.log(this.maximized); };
    const minimizeCallback = () => { this.maximized = false; console.log(this.maximized); };
    window.onbeforeunload = () => {
      console.warn('window closing');
      if (!winRef) return;

      winRef.removeListener('maximize', maximizeCallback);
      winRef.removeListener('unmaximize', minimizeCallback);
      winRef = null;
    };

    winRef.on('maximize', maximizeCallback);
    winRef.on('unmaximize', minimizeCallback);
  },
  methods: {
    getWindow() {
      return winRef;
    },
    openSettings() {
      this.$electron.ipcRenderer.send('toggle-settings', true);
    },
    closeWindow() {
      if (!winRef) return;

      winRef.close();
    }
  },
  computed: {
    isSettingsRoute: function() {
      return this.$route.name === 'Settings';
    }
  },
  beforeDestroy() {
    winRef = null;
  }
});

</script>
<style>

#window-controls > .button > .v-icon {
  color:#EEEEEE !important;
  opacity:0.3 !important;
}

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
  grid-template-columns: repeat(4, 46px);
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
#settings-button {
  grid-column: 1;
}
#min-button {
  grid-column: 2;
}
#max-button, #restore-button {
  grid-column: 3;
}
#close-button {
  grid-column: 4;
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
  grid-template-columns: auto 184px;
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
