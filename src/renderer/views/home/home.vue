<template>
  <div id="wrapper" @click="normalSetup">
    <el-container
      class="event-list-box">
      <window-frame :isLogin="true" @openSetup="openSetup"></window-frame>
      <!-- 左侧导航 -->
      <el-aside
        class="aside-menu-section"
        :style="{ 'width': isCollapse ? '45px' : '170px' }"
      >
        <el-menu
          :collapse="isCollapse"
          :router="true"
          :collapse-transition="false"
          background-color="#545454"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="normalActiveMenu"
        >
          <el-submenu index="eventManage">
            <template slot="title">
              <i class="el-icon-menu" :style="{ 'padding-left': isCollapse ? '10px' : '20px' }"></i>
              <span slot="title">事项管理</span>
            </template>
            <el-menu-item index="/home/addEvent">
              <i class="iconfont icon-xinzeng"></i>
              新增事项
            </el-menu-item>
            <el-menu-item index="/home/eventList">
              <i class="iconfont icon-liebiao"></i>
              事项列表
            </el-menu-item>
            <el-menu-item index="/home/recycleBin">
              <i class="iconfont icon-huishouzhan"></i>
              回收站
            </el-menu-item>
            <!--<el-menu-item-->
              <!--index="1-1"-->
              <!--route="/now"-->
            <!--&gt;-->
              <!--今日待完成：{{nowNoEndEventNum}}-->
            <!--</el-menu-item>-->
            <!--<el-menu-item-->
              <!--index="1-2"-->
              <!--route="/end"-->
            <!--&gt;-->
              <!--已完成事项：{{endEventNum}}-->
            <!--</el-menu-item>-->
            <!--<el-menu-item-->
              <!--index="1-3"-->
              <!--route="/no"-->
            <!--&gt;-->
              <!--未完成事项：{{noEndEventNum}}-->
            <!--</el-menu-item>-->
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧显示 -->
      <el-main>
        <el-header class="title-box">
          <!--转换-->
          <i
            :class="['iconfont', 'icon-caidan', isCollapse ? 'shrink-menu' : 'an-menu']"
            @click="startRotate"
          >
          </i>
          <div class="search-section" v-if="isShowSearch">
            <i class="el-icon-search"></i>
            <input v-model="searchContent" type="text" />
            <i v-show="searchContent" class="el-icon-error" @click="clearSearchContent" style="width: 14px;"></i>
          </div>
        </el-header>
        <router-view></router-view>

        <!--设置选项-->
        <ul v-if="showSetupListFlag" class="setup-list">
          <li class="setup-list-item" @click="logon">退出登录</li>
        </ul>

        <!-- 事项列表 -->
        <!--<eventlist-template-->
          <!--:eventList="this.eventList"-->
          <!--@updateData="updateData">-->
        <!--</eventlist-template>-->
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import request from '@/utils/request.js'
  import eventlistTemplate from '@/components/eventlist-template'
  import windowFrame from '@/components/common/windowFrame-component.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'landing-page',
    data () {
      return {
        eventData: '', // 添加事件名字
        eventList: [], // 当前显示事件列表
        allEventList: [], // 总的事件列表
        endEventNum: 0, // 完成事件的数量
        noEndEventNum: 0, // 未完成事件的数量
        nowNoEndEventNum: 0, // 今日待完成事项
        activeClass: 'no-end', // 当前选中分类
        isCollapse: false,
        normalActiveMenu: '/home/addEvent',
        showSetupListFlag: false,
        searchContent: ''
      }
    },
    components: {
      windowFrame,
      eventlistTemplate
    },
    computed: {
      ...mapState({
        username: state => state.user.username
      }),
      isShowSearch () {
        return this.$route.path !== '/home/addEvent'
      }
    },
    watch: {},
    created () {
      this.initData();
      console.log(this.$route)
    },
    methods: {
      ...mapActions([
        'Logon'
      ]),
      // 展示/收缩菜单
      startRotate() {
        this.isCollapse = !this.isCollapse
      },
      // 注销
      logon () {
        // this.$router.push('/login');
        this.$confirm('确定退出登录吗?', '提示', {
          type: 'warning'
        })
          .then(() => {
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
      },

      // 初始化页面信息
      initData () {
        // this.getEventList();
      },

      // 过滤代办事项
      filterEvent (type) {
        switch (type) {
          case 'now-end':
            return this.allEventList.filter(item => {
              return item.state === 3
            });
            break;
          case 'no-end':
            return this.allEventList.filter(item => {
              return item.state === 0 || item.state === 3;
            });
            break;
          case 'end':
            return this.allEventList.filter(item => {
              return item.state === 1;
            });
            break;
          default:
            return this.allEventList.filter(item => {
              return item.state === 2;
            });
        }
      },

      // 打开设置选项
      openSetup () {
        this.showSetupListFlag = true
      },

      // 恢复默认设置
      normalSetup () {
        this.showSetupListFlag = false
      },

      // 清空搜索内容
      clearSearchContent () {
        this.searchContent = ''
      },

      // 计算事件完成情况
      calculationEndNum (events) {
        let endEventsList = events.filter(item => {
          return item.state === 1;
        });
        let recycleBinEventList = events.filter(item => {
          return item.state === 2;
        });
        let nowEndEventList = events.filter(item => {
          return item.state === 3;
        });
        this.endEventNum = endEventsList.length;
        this.noEndEventNum = events.length - endEventsList.length - recycleBinEventList.length;
        this.nowNoEndEventNum = nowEndEventList.length;
      },

      // 获取已完成事项的数据
      getEndEventList () {
        this.activeClass = 'end';
        this.eventList = this.filterEvent('end');
      },

      // 获取未完成事项的数据
      getNoEndEventList () {
        this.activeClass = 'no-end';
        this.eventList = this.filterEvent('no-end');
      },

      // 获取今日需完成的事项数据
      getNowEndEventList () {
        this.activeClass = 'now-end';
        this.eventList = this.filterEvent('now-end');
      },

      // 前往回收站
      goRecycleBin () {
        this.activeClass = 'recycle-bin';
        this.eventList = this.filterEvent('recycle-bin');
      }
    },

    activated () {
      this.initData();
    },
    mounted () {}
  }
</script>

<style lang="scss">
  #wrapper {
    height: 100%;
    .event-list-box {
      height: 100%;
      padding-top: 24px;
      .aside-menu-section {
        text-align: left;
        line-height: 30px;
        background: #383838;
        color: white;
        overflow: hidden;
        .el-menu {
          width: 100%;
          .el-submenu__title {
            display: flex;
            align-items: center;
            height: 45px;
            /*line-height: 45px;*/
            padding: 0 !important;
          }
          .el-menu-item {
            height: 45px;
            line-height: 45px;
          }
        }
      }

      .el-main {
        padding: 0;
        .el-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 45px !important;
          border-bottom: 1px solid #f3f3f3;
          text-align: right;
          .shrink-menu {
            transform: rotate(90deg);
            transition: transform 0.5s;
          }
          .an-menu {
            transform: rotate(0deg);
            transition: transform 0.5s;
          }
          .icon-caidan {
            font-size: 20px;
            cursor: pointer;
          }
          strong {
            margin-right: 10px;
            color: orange;
          }
          span {
            cursor: pointer;
          }
          .search-section {
            display: flex;
            align-items: center;
            width: 180px;
            padding: 4px 5px;
            border-radius: 5px;
            background: #f3f3f3;
            input {
              width: 140px;
              padding: 0 5px;
              border: none;
              outline: none;
              background: none;
            }
          }
        }
        .setup-list {
          position: fixed;
          right: 42px;
          top: 24px;
          border: 1px solid #dfdfdf;
          z-index: 9999;
          background: #ffffff;
          .setup-list-item {
            height: 24px;
            line-height: 24px;
            padding: 0 20px;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
