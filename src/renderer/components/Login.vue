<template>
  <div class="login-components">
    <h1>ADMIN-LOGIN</h1>
    <div class="input-box">
      <p class="username">
        <label for="username">用户：</label>
        <input v-model="username" id="username" type="text" />
      </p>
      <p class="password">
        <label for="password">密码：</label>
        <input v-model="password" @keyup.enter="asyncLogin" id="password" type="password" />
      </p>
    </div>

    <!-- 数据请求客户提示 -->
    <tips-template :type="resState" :message="resMessage" :hidden="stateTemplateShow"></tips-template>
  </div>
</template>

<script>
import request from '@/utils/script/request.js';
import TipsTemplate from '@/comm/tips-template';
export default {
  data () {
    return {
      username: '', // 用户名
      password: '', // 密码
      resState: 'normal', // 操作状态：success error normal
      resMessage: '', // 操作状态服务器返回信息
      stateTemplateShow: false // 控制状态组件显示
    }
  },
  methods: {
    // 用户登录
    login () {
      let data = {
        username: this.username,
        password: this.password
      }
      this.$store.commit('showLoading');
      return new Promise((resolve, reject) => {
        request.login('/login', 'post', data, (res) => {
          this.$store.commit('hideLoading');
          localStorage.setItem('username', this.username);
          // 全局函数-showTips
          this.showTips(res);
          resolve(res);
        });
      })
    },
    async asyncLogin () {
      let res = await this.login();
      if (res.data.errcode === 0) {
        this.$router.push({path: '/eventlist', query: { username: this.username }});
        this.username = '';
        this.password = '';
      }
    }
  },
  computed: {
    filterSpace(type) {}
  },
  watch: {},
  components: {
    TipsTemplate
  }
}
</script>

<style>
.login-components h1 {
  margin-top: 100px;
  font-size: 30px;
  text-align: center;
}

.login-components .input-box {
  width: 300px;
  margin: 50px auto 0;
}

.login-components .input-box .username, .login-components .input-box .password {
  display: flex;
  line-height: 36px;
}

.login-components .input-box .password {
  margin-top: 20px;
}

.login-components .input-box label {
  text-align: right;
}

.login-components .input-box input {
  flex: 1;
  height: 34px;
  line-height: 34px;
  padding: 0 10px;
  border: 1px solid #d1d1d1;
  border-radius: 5px;
  outline: none;
}

.login-components .input-box input:focus {
  border: 1px solid #009fd0;
}
</style>
