<template>
  <div class="login-components">
    <div class="input-box">
      <div class="title">
        <h1>ADMIN-LOGIN</h1>
      </div>
      <div class="content">
        <p class="username">
          <label for="username">用户：</label>
          <input v-model="username" id="username" type="text" />
        </p>
        <p class="password">
          <label for="password">密码：</label>
          <input v-model="password" @keyup.enter="asyncLogin" id="password" type="password" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/script/request.js';
export default {
  data () {
    return {
      username: '', // 用户名
      password: '', // 密码
      resState: 'normal', // 操作状态：success error normal
      resMessage: '', // 操作状态服务器返回信息
      stateTemplateShow: false, // 控制状态组件显示
      radios: ''
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
  components: {}
}
</script>

<style>
.login-components {
  height: 100%;
}

.login-components h1 {
  font-size: 30px;
  text-align: center;
}

.login-components .input-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  width: 300px;
}

.login-components .input-box .content {
  margin-top: 70px;
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
