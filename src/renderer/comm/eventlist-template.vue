<template>
  <div class="event-list">
    <ul v-if="eventList.length">
      <li
        v-for="item in eventList"
        :key="item._id">
        <strong
          @click="editEvent(item)"
          class="item-content">{{item.eventName}}
        </strong>
        <template v-if="item.state === 0 || item.state === 3">
          <span
            class="edit-button"
            v-if="item.state === 0"
            @click="addNowEndEventList(item)">今日完成</span>
          <span
            class="edit-button"
            v-else-if="item.state === 3"
            @click="outInRecycleBin(item)">暂缓完成</span>
          <span class="edit-button" @click="endEvent(item)">完成</span>
          <span class="edit-button" @click="addRecycleBin(item)">回收</span>
        </template>
        <template v-else-if="item.state === 1">
          <span class="edit-button" @click="addToNoEndEvent(item)">尚未完成</span>
        </template>
        <template v-else>
          <span class="edit-button" @click="clearEvent(item)">销毁</span>
          <span class="edit-button" @click="outInRecycleBin(item)">恢复</span>
        </template>
      </li>
    </ul>
    <div v-else class="sweet-tip">
      <p>待办事项为空!</p>
    </div>
  </div>
</template>

<script>
import request from '@/utils/script/request.js';
export default {
  props: {
    eventList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {}
  },
  methods: {
    // 编辑事件
    editEvent (data) {
      this.$router.push({ path: '/editorevent', query: {event: data} });
    },

    // 添加至今日需完成列表
    addNowEndEventList (event) {
      let data = {
        _id: event._id
      }
      this.$store.commit('showLoading');
      request.addnowendeventlist(`/addNowEndEventList/${event._id}`, 'put', data, (res) => {
        this.$store.commit('hideLoading');
        // 全局函数-showTips
        this.showTips(res)
        if (res.data.errcode === 0) {
          this.$emit('updateData', res.data.eventList, 'no-end');
          return;
        }
      });
    },

    // 暂缓完成/移出回收站
    outInRecycleBin (event) {
      let data = {
        _id: event._id
      }
      this.$store.commit('showLoading');
      request.outinrecyclebin(`/outInRecycleBin/${event._id}`, 'put', data, function cb(res) {
        this.$store.commit('hideLoading');
        // 全局函数-showTips
        this.showTips(res)
        if (res.data.errcode === 0) {
          this.$emit('updateData', res.data.eventList, 'no-end')
          return;
        }
      }.bind(this));
    },

    // 添加到完成事件
    endEvent (item) {
      let data = {
        _id: item._id
      };
      this.$store.commit('showLoading');
      request.endevent(`/endevent/${data._id}`, 'put', data, (res) => {
        this.$store.commit('hideLoading');
        // 全局函数-showTips
        this.showTips(res)
        if (res.data.errcode === 0) {
          this.$emit('updateData', res.data.eventList, 'no-end');
          return;
        }
      });
    },

    // 将事项添加至回收站
    addRecycleBin (event) {
      let data = {
        _id: event._id
      }
      this.$store.commit('showLoading');
      request.addrecyclebin(`/addRecycleBin/${event._id}`, 'put', data, (res) => {
        this.$store.commit('hideLoading');
        // 全局函数-showTips
        this.showTips(res)
        if (res.data.errcode === 0) {
          this.$emit('updateData', res.data.eventList, 'no-end');
          return;
        }
      });
    },

    // 将完成事件移至未完成事件
    addToNoEndEvent (event) {
      let data = {
        _id: event._id
      }
      this.$store.commit('showLoading');
      request.tonoendevent(`/toNoEndEvent/${event._id}`, 'put', data, (res) => {
        this.$store.commit('hideLoading');
        // 全局函数-showTips
        this.showTips(res)
        if (res.data.errcode === 0) {
          this.$emit('updateData', res.data.eventList, 'end');
          return;
        }
      });
    },

    // 销毁事件
    clearEvent (event) {
      let data = {
        _id: event._id
      }
      this.$store.commit('showLoading');
      request.clearevent('/clearEvent', 'post', data, (res) => {
        this.$store.commit('hideLoading');
        // 全局函数-showTips
        this.showTips(res)
        if (res.data.errcode === 0) {
          this.$emit('updateData', res.data.eventList, 'recycle-bin');
          return;
        }
      });
    }
  }
}
</script>

<style lang="scss">
.event-list-box {
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
    .sweet-tip {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }
  // 隐藏滚动条
  .event-list::-webkit-scrollbar {
    display: none;
  }
}
</style>


