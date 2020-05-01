<template>
  <div id="app" @click="handleCloseSet" ref="app">
    <router-view></router-view>

    <!-- 数据请求客户提示 -->
    <!--<tips-template :type="resState" :message="resMessage" :hidden="stateTemplateShow"></tips-template>-->

    <!-- Loading组件 -->
    <!--<loading-template :loadingShow="loadingShow"></loading-template>-->

    <!-- mac -->
    <template v-if="isMac">
      <network-set-component ref="networkSet"></network-set-component>
    </template>
    <!--window-->
    <template v-else>
      <window-frame :isLogin="showSetupBtnFlag" @openSetup="openSetup.call(this)"></window-frame>
      <main-set v-if="!isMac" ref="mainSet"></main-set>
    </template>
  </div>
</template>

<script>
import TipsTemplate from '@/components/tips-template'
import LoadingTemplate from '@/components/loading-template'
import windowFrame from '@/components/common/windowFrame-component.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import { ipcRenderer } from 'electron'
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
    mainSet: () => import('@/components/mainSet-component.vue'),
    NetworkSetComponent: () => import('@/components/common/NetworkSetComponent')
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
  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      console.log('获取store')
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      console.log('缓存store')
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  watch: {},
  mounted() {
    this.init()
    this.handleInitIpcMainEvent()
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
    // 初始化主进程事件(mac)
    handleInitIpcMainEvent() {
      // 退出登陆
      ipcRenderer.on('logout', (event, arg) => {
        this.handleLogon()
      })
      // 网络设置
      ipcRenderer.on('network-set', (event, arg) => {
        this.$refs.networkSet.$emit('setNetwork')
      })
    },
    // 注销(mac)
    handleLogon() {
      this.$confirm("确定退出登录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.Logon()
            .then(data => {
              if (data.errcode === 0) {
                this.$message({
                  type: "success",
                  message: "注销成功!",
                  duration: 1500
                });
                if (this.isMac) {
                  ipcRenderer.send('logout')
                }
                this.$router.push("/login");
              }
            })
            .catch(err => {
              this.$router.push("/login");
            });
        })
        .catch(() => {});
    },
    openSetup() {
      this.$refs.mainSet.$emit('openNetwork')
    },
    handleCloseSet() {
      if (this.isMac) return
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
