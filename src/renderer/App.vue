<template>
  <div id="app" @click="normalSetup">
    <window-frame :isLogin="showSetupBtnFlag" @openSetup="openSetup"></window-frame>
    <router-view></router-view>

    <!-- 数据请求客户提示 -->
    <!--<tips-template :type="resState" :message="resMessage" :hidden="stateTemplateShow"></tips-template>-->

    <!-- Loading组件 -->
    <!--<loading-template :loadingShow="loadingShow"></loading-template>-->

    <!--设置选项-->
    <ul v-if="showSetupListFlag" class="setup-list">
      <li class="setup-list-item" @click="logon">退出登录</li>
      <li class="setup-list-item">账户设置</li>
    </ul>
  </div>
</template>

<script>
  import TipsTemplate from '@/components/tips-template'
  import LoadingTemplate from '@/components/loading-template'
  import windowFrame from '@/components/common/windowFrame-component.vue'
  import { mapState, mapMutations, mapActions } from 'vuex';
  export default {
    name: 'admin-tools',
    data () {
      return {
        showSetupListFlag: false,
        showSetupBtnFlag: false
      }
    },
    created () {},
    watch: {
      $route(to,from){
        console.log(to.path);
        if (to.path !== '/login') {
          this.showSetupBtnFlag = true
        } else {
          this.showSetupBtnFlag = false
        }
        // 是否显示编辑标题
        if (to.path !== '/home/editorevent' && to.path !== '/home/eventDetail') this.SET_EDIT_EVENT('')
      }
    },
    methods: {
      ...mapMutations([
        'SET_EDIT_EVENT',
        'SET_SHOW_LEFT_MENU_FLAG'
      ]),
      ...mapActions([
        'Logon'
      ]),
      openSetup () {
        this.showSetupListFlag = true
      },
      // 恢复默认设置
      normalSetup () {
        this.showSetupListFlag = false
      },
      // 注销
      logon () {
        this.$confirm('确定退出登录吗?', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.SET_SHOW_LEFT_MENU_FLAG(true)
            let data = {
              // username: this.username
              username: localStorage.getItem('username')
            }
            this.Logon(data)
              .then(data => {
                if (data.errcode === 0) {
                  this.$message({
                    type: 'success',
                    message: '注销成功!',
                    duration: 700
                  })
                  this.$router.push('/login');
                }
              })
          })
          .catch(() => {})
      }
    },
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
      LoadingTemplate,
      windowFrame
    }
  }
</script>

<style lang="scss">
  /* CSS */
  * {
    font-family: "Microsoft YaHei","Arial","黑体","宋体",sans-serif;
  }
  body, html {
    height: 100%;
  }
  body::-webkit-scrollbar {
    display: none;
  }
  #app {
    height: 100%
  }
  .setup-list {
    position: fixed;
    right: 42px;
    top: 30px;
    border: 1px solid #7D7D7D;
    z-index: 9999;
    background: #ffffff;
    .setup-list-item {
      height: 24px;
      line-height: 24px;
      padding: 0 20px;
      cursor: pointer;
    }
    .setup-list-item:hover {
      background: #DFDFDF;
    }
    .setup-list-item + .setup-list-item {
      border-top: 1px solid #7D7D7D;
    }
  }
</style>
