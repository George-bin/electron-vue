<template>
  <div class="register-component">
    <div class="cancel-register">
      <span @click="cancelRegister">取消</span>
    </div>
    <!--输入框区域-->
    <div class="register-form-section">
      <div class="register-title">
        <h2>注册</h2>
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
import windowFrame from '@/components/common/windowFrame-component.vue'
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
  components: {
    windowFrame
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
                message: '注册成功!',
                duration: 1500
              })
              this.form.username = ''
              this.form.password = ''
              this.$router.back()
            })
            .catch(err => {
              console.log(err)
              this.loading = false
              if (err.errcode) {
                this.$message({
                  type: 'warning',
                  message: err.message,
                  duration: 1500
                })
                return
              }
              this.$message({
                type: 'error',
                message: '网络错误!',
                duration: 1500
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
    height: 100%;
    .cancel-register {
      padding-right: 40px;
      padding-top: 44px;
      text-align: right;
      color: #000000;
      span:hover {
        cursor: pointer;
        color: orange;
      }
    }
    .register-form-section {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 300px;
      transform: translateX(-50%) translateY(-70%);
      h2 {
        font-size: 24px;
        text-align: center;
        color: #333333;
        letter-spacing: 4px;
      }
      .register-form {
        margin-top: 40px;
        input {
          border-radius: 20px;
        }
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
