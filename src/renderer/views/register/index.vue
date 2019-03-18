<template>
  <div class="register-component">
    <div class="cancel-register">
      <span @click="cancelRegister">取消</span>
    </div>
    <!--输入框区域-->
    <div class="register-form-section">
      <div class="register-title">
        <h2>ADMIN-REGISTER</h2>
      </div>
      <el-form
        :model="form"
        :rules="rules"
        label-width="60px"
        class="register-form"
      >
        <el-form-item label="用户" prop="username">
          <el-input
            v-model="form.username"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            @keyup.enter.native="register"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from '@/utils/script/request'
import { validatorSpace } from '@/utils/script/validatorData'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, validator: validatorSpace, trigger: 'blur' }],
        password: [{ required: true, validator: validatorSpace, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 注册
    register() {
      const data = { ...this.user }
      request.register('/register', 'post', data, (res) => {
        if (res.data.errcode === 0) {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          return
        }
        this.$message({
          type: 'error',
          message: res.data.message
        })
      })
    },
    // 取消注册
    cancelRegister() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss">
  .register-component {
    .cancel-register {
      padding-right: 40px;
      margin-top: 20px;
      text-align: right;
      span:hover {
        color: orange;
        cursor: pointer;
      }
    }
    .register-form-section {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 400px;
      transform: translateX(-50%) translateY(-100%);
      h2 {
        font-size: 30px;
        text-align: center;
      }
      .register-form {
        margin-top: 40px;
      }
    }
  }
</style>
