<template>
  <div id="app" @click="handleCloseSet" ref="app">
    <router-view></router-view>

    <!--window-->
    <template v-if="!isMac">
      <window-frame @openSetup="onOpenSetup.call(this)"></window-frame>
      <main-set v-if="!isMac" ref="mainSet" @openSetItem="onOpenSetItem"></main-set>
    </template>
    <!-- network set -->
    <network-set-component ref="networkSet"></network-set-component>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { ipcRenderer } from 'electron';
export default {
  name: 'admin-tools',
  data() {
    return {
    }
  },
  components: {
    windowFrame: () => import('@/components/common/window-frame-component.vue'),
    mainSet: () => import('@/components/common/main-set-component.vue'),
    NetworkSetComponent: () => import('@/components/common/network-set-component')
  },
  computed: {
    ...mapState({
      isMac: state => state.home.isMac
    })
  },
  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      console.log('获取store');
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))));
    }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      console.log('缓存store');
      sessionStorage.setItem('store', JSON.stringify(this.$store.state));
    })
  },
  watch: {},
  mounted() {
    this.init();
    this.handleInitIpcMainEvent();
    // 监听拖入
    this.$refs.app.ondrop = e => {
      e.preventDefault();
    }
    this.$refs.app.ondragenter = e => {
      e.preventDefault(); // 阻止拖入时的浏览器默认行为
    }
    this.$refs.app.ondragover = e => {
      e.preventDefault(); // 阻止拖来拖去的浏览器默认行为
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
        this.handleLogon();
      });
      // 网络设置
      ipcRenderer.on('network-set', (event, arg) => {
        this.$refs.networkSet.$emit('setNetwork');
      });
    },
    onOpenSetItem(type) {
      switch(type) {
        case 'network':
          this.$refs.networkSet.$emit('setNetwork');
        default:
          return false;
      }
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
    // 监听 => 打开设置
    onOpenSetup() {
      this.$refs.mainSet.$emit('openSet')
    },
    // 关闭设置
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
