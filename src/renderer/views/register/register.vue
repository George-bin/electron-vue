<template>
  <div class="register-component">
    <div class="cancel-register">
      <span @click="cancelRegister">取消</span>
    </div>
    <!--输入框区域-->
    <div class="register-form-section">
      <div class="register-title">
        <h2>用户注册</h2>
      </div>
      <el-form
        ref="registerForm"
        :model="form"
        :rules="rules"
        class="register-form"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名!"
            v-model="form.username"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码!"
            v-model="form.password"
            type="password"
            @keyup.enter.native="register"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="submit-section">
        <el-button :loading="loading" @click.native="register">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { validatorSpace } from '@/utils/script/validatorData'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false,
      rules: {
        username: [{ required: true, validator: validatorSpace, trigger: 'blur' }],
        password: [{ required: true, validator: validatorSpace, trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions([
      'Register'
    ]),
    // 用户注册
    register() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.Register(this.form)
            .then(data => {
              this.loading = false
              this.$message({
                type: 'success',
                message: res.data.message
              })
            })
            .catch(err => {
              console.log(err)
              this.loading = false
              if (err.errcode) {
                this.$message({
                  type: 'warning',
                  message: err.message
                })
                return
              }
              this.$message({
                type: 'error',
                message: '网络错误!'
              })
            })
        }
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
      width: 300px;
      transform: translateX(-50%) translateY(-100%);
      h2 {
        font-size: 24px;
        text-align: center;
      }
      .register-form {
        margin-top: 40px;
      }
    }
    .submit-section {
      text-align: center;
      .el-button {
        width: 200px;
        height: 34px;
        padding: 0;
        border: 0;
        color: white;
        background: #3385ff;
        border-radius: 20px;
      }
    }
  }
</style>
