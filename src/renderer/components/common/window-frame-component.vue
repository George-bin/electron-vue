<template>
  <div class="global-drag-window">
    <p class="app-name">Blog Manage</p>
    <div class="global-drag-window-box">
      <div class="global-top-btn global-top-btn-close" @click="windowClose" title="关闭">
        <i class="iconfont icon-htmal5icon21"></i>
      </div>
      <div class="global-top-btn" @click="windowMax" title="最大化">
        <i class="iconfont icon-zuidahua1"></i>
      </div>
      <div class="global-top-btn" @click="windowMin" title="最小化">
        <i class="iconfont icon-zuixiaohua"></i>
      </div>
      <div class="global-top-btn" @click.stop="handleClickOpenSetup" title="设置">
        <i class="iconfont icon-icon_set_up"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { ipcRenderer } from 'electron';
export default {
  name: 'window-frame-component',
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      isLogin: state => state.user.isLogin
    })
  },
  methods: {
    windowMax() {
      ipcRenderer.send('topWinMax');
    },
    // 最小化
    windowMin() {
      ipcRenderer.send('topWinMin');
    },
    // 关闭
    windowClose() {
      ipcRenderer.send('topWinClose');
    },
    handleClickOpenSetup() {
      this.$emit('openSetup');
    }
  }
};
</script>

<style lang="scss">
.global-drag-window {
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 26px;
  background: #fff;
  -webkit-app-region: drag;
  .app-name {
    padding-left: 10px;
    color: gray;
    // color: #333;
  }
  .global-drag-window-box {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    // opacity:0.5;
    /*-webkit-app-region: no-drag;*/
    .global-top-btn {
      width: 32px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      color: gray;
      background: #fff;
      -webkit-app-region: no-drag;
      i {
        font-size: 14px;
      }
      &:hover {
        background: #dcdfe6;
        cursor: pointer;
      }
    }
    .global-top-btn-close:hover {
      background: #fb1a2c;
    }
    .global-top-btn-close:hover i {
      color: #fff;
    }
  }
}
</style>
