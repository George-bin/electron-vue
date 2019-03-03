<template>
  <div id="wrapper">
    <!-- 标题 -->
    <header>
      <h1>ADMIN-TOOLS</h1>
      <!-- 用户信息 -->
      <div class="username-box">
        <strong>{{username}}</strong><span @click="logon">注销</span>
      </div>
    </header>
    <!-- body -->
    <section class="add-event">
      <!-- 新增事件框 -->
      <div class="input-box">
        <input
          type="text"
          placeholder="请输入内容按回车键!"
          v-model="eventName"
          @keyup.enter="addEvent" />
      </div>
      <!-- 刷新按钮 -->
      <!-- <div class="refresh">
        <span @click="getEventList">刷新</span>
      </div> -->
      <!-- 事件区域 -->
      <div class="event-box" :style="{height: eventListHeight}">
        <!-- 左侧导航 -->
        <ul class="event-num">
          <li
            @click="getNowEndEventList"
            :style="{color: activeClass === 'now-end' ? 'orange' :'white'}">
            今日待完成：{{nowNoEndEventNum}}
          </li>
          <li
            @click="getEndEventList"
            :style="{color: activeClass === 'end' ? 'orange' :'white'}">
            已完成事项：{{endEventNum}}
          </li>
          <li
            @click="getNoEndEventList"
            :style="{color: activeClass === 'no-end' ? 'orange' :'white'}">
            未完成事项：{{noEndEventNum}}
          </li>
          <li
            @click="goRecycleBin"
            :style="{color: activeClass === 'recycle-bin' ? 'orange' :'white'}">
            回收站
          </li>
        </ul>
        <!-- 事件列表 -->
        <eventlist-template
          :eventList="this.eventList"
          @updateData="updateData">
        </eventlist-template>
      </div>
    </section>
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
        eventListHeight: 0, // 事件列表的高度
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
        let h = document.documentElement.clientHeight;
        this.eventListHeight = h - 240 + 'px';
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
    h1 {
      margin-top: 20px;
      text-align: center;
      font-size: 30px;
      font-weight: normal;
    }
    .username-box {
      position: fixed;
      top: 20px;
      right: 20px;
      strong {
        margin-right: 10px;
        color: orange;
      }
      span {
        cursor: pointer;
      }
    }
    .add-event {
      margin-top: 40px;
      .input-box {
        text-align: center;
        input {
          width: 400px;;
          height: 40px;
          padding: 0 20px;
          border: 1px solid #dddddd;
          border-radius: 10px;
          outline: none; // 去除输入框焦点高亮显示
        }
        input:focus {
          border: 1px solid #009fd0;
        }
      }
      .refresh {
        padding: 0 70px;
        margin-top: 50px;
        text-align: right;
        cursor: pointer;
      }
      .event-box {
        display: flex;
        padding: 0 70px;
        margin-top: 60px;
        .event-num {
          padding: 10px 20px;
          text-align: left;
          line-height: 30px;
          background: #383838;
          color: white;
          li {
            cursor: pointer;
          }
        }
        .event-list {
          flex: 1;
          height: 100%;
          margin-left: 20px;
          background: #f9f9f9;
          overflow: auto;
          span {
            float: right;
          }
          li {
            position: relative;
            display: flex;
            height: 40px;
            padding: 0 20px;
            line-height: 40px;
            color: #333333;
            .item-content {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;
            }
            .edit-button {
              margin-left: 10px;
              cursor: pointer;
            }
            .edit-input {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: #f7f7f7;
              input {
                width: calc(100% - 110px);
                height: 38px;
                padding: 0 20px;
                border: 1px solid #dddddd;
                border-radius: 10px;
                outline: none; // 去除输入框焦点高亮显示
              }
              input:focus {
                border: 1px solid #009fd0;
              }
              button {
                border: none;
                font-size: 14px;
                font-family: '微软雅黑';
                color: #333333;
                background: none;
                outline: none; // 去掉点击时样式
                cursor: pointer;
              }
            }
          }
          li:hover {
            color: white;
            background: #777777;
          }
        }
        // 隐藏滚动条
        .event-list::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
</style>
