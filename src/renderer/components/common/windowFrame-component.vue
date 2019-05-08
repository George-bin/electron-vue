<template>
  <div class="global-drag-window">
    <div style="flex: 1; display: flex; align-items: center; height: 30px; padding-left: 5px; font-size: 12px;">
      <img src="../../assets/images/logo.png" width="16" height="16" alt="logo" />
      <span>小耿记事本</span>
    </div>
    <div class="global-top-btn set-top-btn setup-btn" v-if="isLogin" @click.stop="startOpenSetup">
      <img src="../../assets/images/top-setup.png" width="20" height="23" title="设置">
    </div>
    <div class="global-top-btn"  @click="windowMin">
      <img src="../../assets/images/top-min.png" title="最小化" width="25" height="23">
    </div>
    <div class="global-top-btn" v-if="isLogin" @click="windowMax">
      <img src="../../assets/images/top-max.png" title="最大化" width="20" height="21" />
    </div>
    <div class="global-top-btn-close" @click="windowClose" alt="关闭窗口" title="关闭窗口">&nbsp;</div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    name: 'window-frame-component',
    props: ['isLogin'],
    data () {
      return {}
    },
    methods: {
      windowMax () {
        ipcRenderer.send('topWinMax')
      },
      // 最小化
      windowMin () {
        ipcRenderer.send('topWinMin')
      },
      // 关闭
      windowClose () {
        ipcRenderer.send('topWinClose')
      },
      startOpenSetup () {
        this.$emit('openSetup')
      }
    }
  }
</script>

<style lang="scss">
  .global-drag-window {
    position:fixed;
    top: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 30px;
    z-index: 999;
    -webkit-app-region: drag;
    // opacity:0.5;
    .global-top-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width:35px;
      height:30px;
      background: #fff;
      -webkit-app-region: no-drag;
      &:hover {
        background: #DCDFE6;
        cursor: pointer;
      }
    }
    .set-top-btn {
      background:#00000000;
      &:hover {
        background: #DCDFE6;
        cursor: pointer;
      }
    }
    .global-top-btn-close {
      width:35px;
      height:30px;
      background: #FFFFFF url('../../assets/images/top-close-black.png') no-repeat 13px;
      -webkit-app-region: no-drag;
      &:hover {
        background: #FB1A2C  url('../../assets/images/top-close-white.png') no-repeat 13px;
        cursor: pointer;
      }
    }
  }
</style>
