<template>
  <div class="login-components">
    <div class="register-btn">
      <span @click="goRegister">注册</span>
    </div>
    <div class="content-section">
      <div class="title">
        <h2>用户登录</h2>
      </div>
      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名!"
            v-model="form.username"
            :disabled="loading"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码!"
            v-model="form.password"
            @keyup.enter.native="login"
            :disabled="loading"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="submit-section">
        <el-button :loading="loading" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { validatorSpace } from '@/utils/script/validatorData'

export default {
  data () {
    return {
      form: {
        username: 'geng', // 用户名
        password: '123', // 密码
      },
      loading: false, // 登录中
      rules: {
        username: [{ required: true, validator: validatorSpace, trigger: 'blur' }],
        password: [{ required: true, validator: validatorSpace, trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions(['Login']),
    // 用户登录
    login () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.Login(this.form)
            .then(data => {
              this.loading = false
              if (data.errcode === 0) {
                // TODO:缓存当前用户
                localStorage.setItem('account', JSON.stringify(this.form))
                localStorage.setItem('username', this.form.username)
                this.$message({
                  type: 'success',
                  message: data.message
                })
                this.$router.push('/home')
              } else {
                this.$message({
                  type: 'warning',
                  message: '用户名或密码错误!'
                })
              }
            })
            .catch(err => {
              this.loading = false
              console.log(err)
              this.$message({
                type: 'error',
                message: '网路错误!'
              })
            })
        }
      })
    },

    // 前往注册
    goRegister() {
      this.$router.push({ path: '/register' })
    }
  },
  computed: {},
  watch: {},
  components: {}
}
</script>

<style lang="scss">
.login-components {
  height: 100%;
  .register-btn {
    padding-right: 40px;
    padding-top: 20px;
    text-align: right;
    span {
      cursor: pointer;
    }
    span:hover {
      color: orange;
    }
  }
  .content-section {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
    width: 300px;
    h2 {
      font-size: 20px;
      text-align: center;
    }
    .login-form {
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
