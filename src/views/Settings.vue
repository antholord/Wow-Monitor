<template>
  <div id="settings-main">
    {{ settings }}
  </div>
</template>

<script lang="ts">
import { ISettings } from '@/settings';
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      settings: {} as ISettings
    };
  },
  created() {
    this.settings = this.$electron.ipcRenderer.sendSync('get_settings');
    console.log(this.settings);
  }
});
</script>

<style>
#settings-main {
  padding-top:50px;
}
</style>
