<template>
  <div class="add-event-component">
    <div class="title-section">
      <h3>新增待办事项</h3>
    </div>
    <!-- 新增事件框 -->
    <div class="content-section">
      <el-form
        ref="createEventForm"
        :model="form"
        :rules="rules"
        @submit.native.prevent=""
      >
        <el-form-item prop="eventName" class="submit-box">
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
import { mapState, mapActions } from 'vuex'
import { validatorSpace } from '@/utils/script/validatorData'

export default {
  data() {
    return {
      // 新增事件名
      form: {
        eventName: '',
        eventData: ''
      },
      rules: {
        eventName: [{ required: true, validator: validatorSpace, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      username: state => state.user.username
    })
  },
  methods: {
    ...mapActions(['AddEvent']),
    // 添加待办事项
    addEvent () {
      let data = {
        status: 0, // 事件状态 0：未完成 1：已完成 2：进入回收站 3：需要今日完成
        eventName: this.form.eventName, // 事件名称
        eventData: this.form.eventData, // 解决方案
        // username: this.username, // 所属用户
        username: localStorage.getItem('username'),
        date: Date.now() // 事件创建时间
      }
      this.$refs.createEventForm.validate((valid) => {
        if (valid) {
          this.AddEvent(data)
            .then(data => {
              console.log(data)
              this.form.eventName = ''
              this.$message({
                type: 'success',
                message: '新增事项成功!',
                duration: 700
              })
            })
            .catch(err => {
              this.form.eventName = ''
              console.log(errs)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.add-event-component {
  .title-section {
    margin-top: 30px;
    font-size: 30px;
    text-align: center;
    h3 {
      font-size: 20px;
    }
  }
  .content-section {
    width: 400px;
    margin: 40px auto 0;
    .submit-box {
      .el-form-item__content {
        display: flex;
        .el-input {
          flex: 1;
        }
        .el-button {
          margin-left: 10px;
          border: 0;
          color: white;
          background: #3385ff;
        }
      }
    }
  }
}
</style>

