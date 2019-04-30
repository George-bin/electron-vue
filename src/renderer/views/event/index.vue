<template>
  <div id="wrapper">
    <el-container
      class="event-list-box">
      <!-- 左侧导航 -->
      <el-aside
        class="event-num"
        :style="{ 'width': isCollapse ? '64px' : '200px' }"
      >
        <el-menu
          :collapse="isCollapse"
          :router="true"
          background-color="#545454"
          text-color="white"
          active-text-color="orange"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">事项管理</span>
            </template>
            <el-menu-item
              index="/event/addEvent"
            >
              <i class="iconfont icon-xinzeng"></i>
              新增事项
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
          <!--<strong>{{username}}</strong><span @click="logon">注销</span>-->
          <strong>geng</strong><span @click="logon">注销</span>
        </el-header>
        <router-view></router-view>

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
  import request from '@/utils/request.js';
  import eventlistTemplate from '@/components/eventlist-template';
  import { mapActions } from 'vuex'
  export default {
    name: 'landing-page',
    data () {
      return {
        username: '', // 用户名
        eventData: '', // 添加事件名字
        eventList: [], // 当前显示事件列表
        allEventList: [], // 总的事件列表
        endEventNum: 0, // 完成事件的数量
        noEndEventNum: 0, // 未完成事件的数量
        nowNoEndEventNum: 0, // 今日待完成事项
        activeClass: 'no-end', // 当前选中分类
        isCollapse: false
      }
    },
    created () {
      this.initData();
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
        let data = {
          username: 'geng',
          password: '123456'
        }
        this.Logon(data)
          .then(data => {
            if (data.errcode === 0) {
              this.$message({
                type: 'success',
                message: '注销成功!'
              })
              this.$router.push('/login');
            }
          })
      },

      // 初始化页面信息
      initData () {
        this.username = localStorage.getItem('username');
        this.getEventList();
      },

      // 获取事项列表
      getEventList () {
        this.$store.commit('showLoading');
        request.geteventlist('/geteventlist', 'get', '', (res) => {
          this.$store.commit('hideLoading');
          if (res.data.errcode === 0) {
            this.activeClass = 'no-end';
            this.updateData(res.data.eventList, 'no-end');
            return;
          } else {
            // 全局函数-showTips
            this.showTips(res);
            this.$router.push('/login');
          }
        })
      },

      // 触发父组件数据更新
      updateData (allEventList, type) {
        this.allEventList = allEventList;
        this.eventList = this.filterEvent(type);
        this.calculationEndNum(allEventList)
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
    mounted () {},
    components: {
      eventlistTemplate
    },
  }
</script>

<style lang="scss">
  #wrapper {
    height: 100%;
    // h1 {
    //   height: 100px;
    //   line-height: 100px;
    //   text-align: center;
    //   font-size: 30px;
    //   font-weight: normal;
    // }
    .add-event-box {
      margin-top: 20px;
      .input-box {
        text-align: center;
        input {
          width: 400px;;
          height: 38px;
          padding: 0 20px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          outline: none; // 去除输入框焦点高亮显示
        }
        input:focus {
          border: 1px solid #009fd0;
        }
      }
    }
    .event-list-box {
      height: 100%;
      .event-num {
        /*width: auto !important;*/
        text-align: left;
        line-height: 30px;
        background: #383838;
        color: white;
        overflow: hidden;
        .el-menu {
          width: 100%;
          /*height: 100%;*/
        }
        /*.el-submenu .el-menu-item {*/
          /*min-width: 150px;*/
          /*padding: 0 !important;*/
          /*text-align: center;*/
        /*}*/
      }

      .el-main {
        padding: 0;
        .el-header {
          position: relative;
          height: 56px !important;
          line-height: 56px;
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
            position: absolute;
            left: 10px;
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
        }
      }
    }
  }
</style>
