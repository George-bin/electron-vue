<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <!-- 数据请求客户提示 -->
    <tips-template :type="resState" :message="resMessage" :hidden="stateTemplateShow"></tips-template>

    <!-- Loading组件 -->
    <loading-template :loadingShow="loadingShow"></loading-template>
  </div>
</template>

<script>
  import TipsTemplate from '@/comm/tips-template';
  import LoadingTemplate from '@/comm/loading-template';
  import {mapState} from 'vuex';
  export default {
    name: 'admin-tools',
    data () {
      return {}
    },
    created () {},
    methods: {},
    computed: {
      ...mapState({
        resState: state => state.tipsStore.resState,  // 操作状态：success error normal
        resMessage: state => state.tipsStore.resMessage, // 操作状态服务器返回信息
        stateTemplateShow: state => state.tipsStore.stateTemplateShow, // 控制状态组件显示
        loadingShow: state => state.loadingStore.loadingShow // 加载动画显示/隐藏
      })
    },
    components: {
      TipsTemplate,
      LoadingTemplate
    }
  }
</script>

<style>
  @import './utils/css/init.css';
  /* CSS */
  * {
    font-family: '微软雅黑';
  }
  body, html {
    height: 100%;
  }
  #app {
    height: 100%
  }
</style>
