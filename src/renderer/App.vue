<template>
  <div id="app" @click="handleCloseSet" ref="app">
    <window-frame
      v-if="!isMac"
      :isLogin="showSetupBtnFlag"
      @openSetup="openSetup.call(this)"
    ></window-frame>
    <router-view></router-view>

    <!-- 数据请求客户提示 -->
    <!--<tips-template :type="resState" :message="resMessage" :hidden="stateTemplateShow"></tips-template>-->

    <!-- Loading组件 -->
    <!--<loading-template :loadingShow="loadingShow"></loading-template>-->

    <!--设置选项-->
    <main-set ref="mainSet"></main-set>
  </div>
</template>

<script>
import TipsTemplate from '@/components/tips-template'
import LoadingTemplate from '@/components/loading-template'
import windowFrame from '@/components/common/windowFrame-component.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'admin-tools',
  data() {
    return {
      showSetupBtnFlag: false
    }
  },
  components: {
    TipsTemplate,
    LoadingTemplate,
    windowFrame,
    mainSet: () => import('@/components/mainSet-component.vue')
  },
  computed: {
    ...mapState({
      isMac: state => state.home.isMac,
      resState: state => state.tipsStore.resState, // 操作状态：success error normal
      resMessage: state => state.tipsStore.resMessage, // 操作状态服务器返回信息
      stateTemplateShow: state => state.tipsStore.stateTemplateShow, // 控制状态组件显示
      loadingShow: state => state.loadingStore.loadingShow // 加载动画显示/隐藏
    })
  },
  created() {},
  watch: {},
  mounted() {
    this.init()
    this.$refs.app.ondrop = e => {
      e.preventDefault()
    }
    this.$refs.app.ondragenter = e => {
      e.preventDefault() // 阻止拖入时的浏览器默认行为
    }
    this.$refs.app.ondragover = e => {
      e.preventDefault() // 阻止拖来拖去的浏览器默认行为
    }
  },
  methods: {
    ...mapMutations([
      'SET_ISMAC'
    ]),
    ...mapActions(['Logon']),
    init() {
      let UA = navigator.userAgent
      if (UA.indexOf('Mac OS') > -1) {
        this.SET_ISMAC(true)
      } else {
        this.SET_ISMAC(false)
      }
    },
    openSetup() {
      this.$refs.mainSet.$emit('openNetwork')
    },
    handleCloseSet() {
      this.$refs.mainSet.$emit('closeSet')
    }
  }
}
</script>

<style lang="scss">
/* CSS */
* {
  font-family: "Microsoft YaHei", "Arial", "黑体", "宋体", sans-serif;
}
body,
html {
  height: 100%;
}
body::-webkit-scrollbar {
  display: none;
}
#app {
  height: 100%;
}
</style>
