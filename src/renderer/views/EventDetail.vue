<template>
  <div class="event-editor-box">
    <header>
      <div class="back" @click="backEventList">
        <span>返回</span>
      </div>
      <h2>{{title}}</h2>
    </header>
    <div class="editor-button">
      <span @click="showEditor" :style="{color: isShowEditor ? 'orange': '#333333'}">编辑</span> |
      <span @click="cancelEditor">取消</span>
    </div>
    <!-- 事件编辑区域 -->
    <div v-if="isShowEditor" class="editor-event">
      <div class="event-info-item input">
        <label for="eventName">事项：</label>
        <input id="eventName" type="text" v-model="eventName" />
      </div>
      <div class="event-info-item textarea">
        <label for="eventData">方案：</label>
        <textarea name="" id="eventData" v-model="eventData"></textarea>
      </div>
      <div class="submit-button">
        <button @click="updateEvent">更新</button>
      </div>
    </div>
    <!-- 事件详情 -->
    <div v-else class="event-detail">
      <div class="event-detail-item event-name">
        <span>事项名称：</span>
        <p>{{eventName}}</p>
      </div>
      <div class="event-detail-item event-data">
        <span>解决方案：</span>
        <ul>
          <li v-for="item in eventData.split('\n')">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request.js';
export default {
  data () {
    return {
      title: 'ADMIN-EVENT-DETAIl', // 标题
      isShowEditor: false, // 是否编辑
      event: {}, // 事件对象
      eventId: '', // 事件id
      eventName: '', // 事项名称
      eventData: '' // 事项内容
    }
  },
  created () {
    this.event = this.$route.query.event;
    this.initData(this.event);
  },
  methods: {
    // 初始化数据
    initData (event) {
      this.eventId = event._id;
      this.eventName = event.eventName;
      this.eventData = event.eventData;
      this.title = 'ADMIN-EVENT-DETAIL';
    },

    // 返回事件列表
    backEventList () {
      if (this.isShowEditor) this.isShowEditor = false;
      this.title = 'ADMIN-EVENT-DETAIL';
      this.$router.back();
    },

    // 更新事项
    updateEvent () {
      let data = {
        _id: this.eventId,
        eventName: this.eventName,
        eventData: this.eventData
      }
      this.$store.commit('showLoading');
      request.editevent(`/editevent/${this.eventId}`, 'put', data, function cb(res) {
        this.$store.commit('hideLoading');
        // 全局函数-showTips
        this.showTips(res);
        if (res.data.errcode === 0) {
          this.event = res.data.eventData;
          this.initData(res.data.eventData);
          this.isShowEditor = false;
          return;
        }
      }.bind(this));
    },

    // 显示编辑
    showEditor () {
      this.title = 'ADMIN-EVENT-EDITOR';
      this.isShowEditor = true;
    },

    // 取消编辑
    cancelEditor () {
      this.isShowEditor = false;
      this.initData(this.event);
    }
  },
  activated () {
    this.event = this.$route.query.event;
    this.initData(this.event);
  },
  mounted () {}
}
</script>

<style lang="scss">
.event-editor-box {
  color: #333333;
  header {
    .back {
      position: fixed;
      top: 20px;
      left: 20px;
      span {
        cursor: pointer;
      }
    }
    h2 {
      margin-top: 30px;
      font-size: 30px;
      text-align: center;
    }
  }
  .editor-button {
    margin: 50px 100px 0 100px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f4f4f4;
    text-align: right;
    span {
      cursor: pointer;
    }
  }
  .editor-event {
    padding: 0 100px;
    margin-top: 10px;
    .event-info-item {
      display: flex;
      input, textarea {
        flex: 1;
        outline: none;
        border: 1px solid #d1d1d1;
      }
      input {
        height: 34px;
        padding: 0 10px;
        border: 1px solid #d1d1d1;
        border-radius: 6px;
      }
      textarea {
        height: 300px;
        padding: 10px;
        border-radius: 6px;
        resize: none;
      }
      input:focus, textarea:focus {
        border: 1px solid #009fd0;
      }
    }
    .input {
      line-height: 36px;
    }
    .textarea {
      margin-top: 20px;
    }
    .submit-button {
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: center;
      button {
        width: 120px;
        height: 40px;
        border: 1px solid #d1d1d1;
        background: none;
        border-radius: 10px;
        outline: none;
      }
      button:hover {
        border: 1px solid #009fd0;
        cursor: pointer;
      }
    }
  }
  .event-detail {
    padding: 0 100px;
    margin-top: 10px;
    .event-detail-item {
      display: flex;
      font-size: 16px;
      span {
        font-weight: bold;
      }
      p, ul {
        flex: 1;
      }
      li + li {
        margin-top: 5px;
      }
    }
    .event-data {
      margin-top: 10px;
    }
  }
}
</style>
