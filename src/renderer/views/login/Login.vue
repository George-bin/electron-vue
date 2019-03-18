<template>
  <div class="login-components">
    <div class="register-btn">
      <span @click="goRegister">注册</span>
    </div>
    <div class="content-section">
      <div class="title">
        <h1>ADMIN-LOGIN</h1>
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        class="form-box"
        label-width="60px"
      >
        <el-form-item label="用户" prop="username">
          <el-input
            placeholder="请输入用户名!"
            v-model="form.username"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            placeholder="请输入密码!"
            v-model="form.password"
            @keyup.enter.native="login"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from '@/utils/script/request'
import { mapActions } from 'vuex'
import { validatorSpace } from '@/utils/script/validatorData'

export default {
  data () {
    return {
      form: {
        username: '', // 用户名
        password: '', // 密码
      },
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
      const form = this.form
      // this.$store.commit('showLoading')
      this.Login(form)
        .then(data => {
          if (data.errcode === 0) {
            this.$message({
              type: 'success',
              message: data.message
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      // return new Promise((resolve, reject) => {
      //   request.login('/login', 'post', data, (res) => {
      //     this.$store.commit('hideLoading');
      //     localStorage.setItem('username', this.form.username);
      //     this.$message({
      //       type: 'success',
      //       message: res.data.message
      //     })
      //     resolve(res);
      //   });
      // })
    },
    async asyncLogin () {
      let res = await this.login();
      if (res.data.errcode === 0) {
        this.$router.push({path: '/event', query: { username: this.form.username }})
      }
    },

    // 前往注册
    goRegister() {
      this.$router.push({ path: '/register' })
    }
  },
  computed: {
    filterSpace(type) {}
  },
  watch: {},
  components: {}
}
</script>

<style lang="scss">
.login-components {
  height: 100%;
  .register-btn {
    padding-right: 40px;
    margin-top: 20px;
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
    width: 400px;
    h1 {
      font-size: 30px;
      text-align: center;
    }
    .form-box {
      margin-top: 40px;
    }
  }
}
</style>
