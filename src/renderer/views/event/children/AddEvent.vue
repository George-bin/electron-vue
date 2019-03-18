<template>
  <div class="add-event-component">
    <div class="title-section">
      <h2>ADMIN-ADDEVENT</h2>
    </div>
    <!-- 新增事件框 -->
    <div class="content-section">
      <el-form
        ref="form"
        :model="form"
      >
        <el-form-item>
          <el-input
            placeholder="请输入内容按回车键!"
            v-model="form.eventName"
            @keyup.enter.native="addEvent"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      // 新增事件名
      form: {
        eventName: '',
        eventData: ''
      }
    }
  },
  methods: {
    ...mapActions([]),
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
        this.$message({
          type: 'success',
          message: res.data.message
        })
      }.bind(this));
    },
  }
}
</script>

<style lang="scss">
.add-event-component {
  .title-section {
    margin-top: 100px;
    font-size: 30px;
    text-align: center;
  }
  .content-section {
    width: 500px;
    margin: 50px auto 0;
  }
}
</style>

