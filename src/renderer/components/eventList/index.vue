<template>
  <div id="wrapper">
    <el-container
      class="event-list-box">
      <!-- 左侧导航 -->
      <el-aside
        class="event-num">
        <el-menu
          background-color="#545454"
          text-color="white"
          style="width: 100%">
          <el-submenu index="1">
            <template>
              <span slot="title">事项管理</span>
            </template>
            <el-menu-item
              index="001"
              route="/eventlist"
            >
              新增事项
            </el-menu-item>
            <!-- <el-menu-item
              index="1-1"
              route="/now"
            >
              今日待完成：{{nowNoEndEventNum}}
            </el-menu-item>
            <el-menu-item
              index="1-2"
              route="/end"
            >
              已完成事项：{{endEventNum}}
            </el-menu-item>
            <el-menu-item
              index="1-3"
              route="/no"
            >
              未完成事项：{{noEndEventNum}}
            </el-menu-item> -->
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧显示 -->
      <el-main>
        <el-header
          class="title-box"
        >
          <strong>{{username}}</strong><span @click="logon">注销</span>
          <!-- <h1>ADMIN-TOOLS</h1> -->
          <!-- <div class="username-box"> -->
          <!-- <div class="username-box">
            <strong>{{username}}</strong><span @click="logon">注销</span>
          </div> -->
        </el-header>

        <!-- 新增事件框 -->
        <div class="add-event-box">
          <div class="input-box">
            <input
              type="text"
              placeholder="请输入内容按回车键!"
              v-model="eventName"
              @keyup.enter="addEvent" />
          </div>
        </div>

        <!-- 事项列表 -->
        <eventlist-template
          :eventList="this.eventList"
          @updateData="updateData">
        </eventlist-template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import request from '@/utils/script/request.js';
  import eventlistTemplate from '@/comm/eventlist-template';
  export default {
    name: 'landing-page',
    data () {
      return {
        username: '', // 用户名
        eventName: '', // 添加事件名字
        eventData: '', // 添加事件名字
        eventList: [], // 当前显示事件列表
        allEventList: [], // 总的事件列表
        endEventNum: 0, // 完成事件的数量
        noEndEventNum: 0, // 未完成事件的数量
        nowNoEndEventNum: 0, // 今日待完成事项
        activeClass: 'no-end' // 当前选中分类
      }
    },
    created () {
      this.initData();
    },
    methods: {
      // 注销
      logon () {
        let data = {
          username: this.username
        }
        this.$store.commit('showLoading');
        request.logon('/logon', 'post', data, (res) => {
          this.$store.commit('hideLoading');
          if (res.data.errcode === 0) {
            // 全局函数-showTips
            this.showTips(res);
            this.$router.push('/login');
          }
        })
      },

      // 初始化页面信息
      initData () {
        this.username = localStorage.getItem('username');
        this.getEventList();
      },

      // 添加待办事项
      addEvent () {
        let data = {
          state: 0, // 事件状态 0：未完成 1：已完成 2：进入回收站 3：需要今日完成
          eventName: this.eventName, // 事件名称
          eventData: this.eventData, // 事件名称
          username: this.username, // 用户
          date: Date.now() // 事件创建时间
        }
        this.$store.commit('showLoading');
        request.addevent('/addevent', 'post', data, function cb(res) {
          this.$store.commit('hideLoading');
          this.eventName = '';
          // 全局函数-showTips
          this.showTips(res);
          if (res.data.errcode === 0) {
            this.activeClass = 'no-end';
            this.allEventList = res.data.eventList;
            this.eventList = this.filterEvent('no-end');
            this.calculationEndNum(res.data.eventList);
            return;
          }
        }.bind(this));
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
      // height: calc(100% - 260px);
      // margin-top: 60px;
      .event-num {
        width: 150px !important;
        text-align: left;
        line-height: 30px;
        background: #383838;
        color: white;
        overflow: hidden;
        li {
          cursor: pointer;
          text-align: left;
        }
        .el-submenu .el-menu-item {
          min-width: 150px;
          padding: 0 !important;
          text-align: center;
        }
      }

      .el-main {
        padding: 0;
        .el-header {
          height: 56px !important;
          line-height: 56px;
          border-bottom: 1px solid #f3f3f3;
          text-align: right;
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
