<template>
  <div id="wrapper">
    <el-container
      class="event-list-box">
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
          default-active="/home/addEvent"
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
          <!--当前编辑事件的名称-->
          <h3 v-if="editEvent && !isEditEventNameFlag" class="edit-event-name ellipsis" title="点击编辑" @click="startEditEventName">{{ editEvent.eventName }}</h3>
          <!--编辑事件名称-->
          <input v-show="editEvent && isEditEventNameFlag" ref="eventNameInput" class="edit-event-name-input" v-model="newEventName" type="text" @blur="editEventName" />
          <i class="iconfont icon-bofang play-music-btn" :class="{ 'play-music-btn-remote': isPlayingFlag }" @click="playMusic" title="静心聆听"></i>
          <audio src="../../../../static/music/花粥-纸短情长.mp3" loop ref="audioElement"></audio>
        </el-header>
        <!--子路由-->
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import Aplayer from 'vue-aplayer'
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
        activeClass: 'no-end', // 当前选中分类
        isCollapse: false,
        isPlayingFlag: false,
        // 开始编辑事件名称
        isEditEventNameFlag: false,
        // 新的事件名称
        newEventName: ''
      }
    },
    components: {
      windowFrame,
      eventlistTemplate,
      Aplayer
    },
    computed: {
      ...mapState({
        username: state => state.user.username,
        editEvent: state => state.home.editEvent
      })
    },
    watch: {},
    created () {
      this.initData();
      console.log(this.$route)
    },
    // activated () {
    //   this.initData();
    // },
    mounted () {},
    methods: {
      ...mapActions([
        'EditEvent'
      ]),
      // 开始编辑事件名称
      startEditEventName () {
        this.isEditEventNameFlag = true
        this.newEventName = this.editEvent.eventName
        this.$nextTick(() => {
          this.$refs.eventNameInput.focus()
        })
      },
      // 编辑事件名称
      editEventName () {
        if (!this.newEventName.replace(/\s/g, '')) {
          this.$message({
            message: '请输入有效的事件名称!',
            type: 'warning'
          })
          this.$nextTick(() => {
            this.$refs.eventNameInput.focus()
          })
          return
        }
        this.EditEvent({
          ...this.editEvent,
          eventName: this.newEventName
        })
          .then(data => {
            this.isEditEventNameFlag = false
          })
          .catch(err => {
            if (err.errcode) {
              this.$message({
                message: err.message,
                type: 'error',
                duration: 700
              })
              return
            }
            this.$message({
              message: '网络错误!',
              type: 'error',
              duration: 700
            })
          })
      },
      // 播放音乐
      playMusic () {
        if (this.isPlayingFlag) {
          this.$refs.audioElement.pause()
          this.isPlayingFlag = false
          return
        }
        this.isPlayingFlag = true
        this.$refs.audioElement.play()
      },
      // 展示/收缩菜单
      startRotate() {
        this.isCollapse = !this.isCollapse
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
    }
  }
</script>

<style lang="scss">
  #wrapper {
    height: 100%;
    .event-list-box {
      height: 100%;
      padding-top: 30px;
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
          border-bottom: 1px solid #e6e6e6;
          text-align: right;
          background: #F7F7F7;
          .edit-event-name {
            width: 320px;
            text-align: center;
            cursor: pointer;
          }
          .edit-event-name-input {
            width: 320px;
            border: none;
            outline: none;
            background: none;
          }
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
          .play-music-btn {
            font-size: 24px;
            cursor: pointer;
          }
          .play-music-btn-remote {
            animation: rotate 3s linear infinite;
          }
          @keyframes remote
          {
            from{-webkit-transform: rotate(0deg)}
            to{-webkit-transform: rotate(360deg)}
          }
        }
      }
    }
  }
</style>
