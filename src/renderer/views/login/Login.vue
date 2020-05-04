<template>
  <div class="login-main-component">
    <div class="login-section">
      <div class="login-box">
        <header>
          <div class="logo">
            <img src="../../../../static/img/logo.png" alt="logo" />
          </div>
          <h1>博客管理端</h1>
        </header>
        <div class="login-form">
          <div
            class="login-form-item input__inner"
            style="margin-bottom: 10px">
            <!-- 选择账户 -->
            <el-popover
              placement="bottom"
              width="200"
              trigger="click"
              v-model="accountListVisible"
              :disabled="!accountList.length">
              <input
                v-model="formData.account"
                placeholder="Username"
                type="text"
                slot="reference" />
              <ul v-if="accountList && accountList.length" class="account-list">
                <li
                  v-for="item in accountList"
                  :key="item.account"
                  class="account-list-item"
                  @click="useAccount(item)">
                  <span>{{item.account}}</span>
                  <i
                    class="el-icon-circle-close"
                    @click.stop="deleteLocalAccount(item)"
                  ></i>
                </li>
              </ul>
            </el-popover>
          </div>
          <!-- 密码框 -->
          <div class="login-form-item input__inner">
            <input v-model="formData.password" placeholder="Password" type="password" autocomplete="off" />
          </div>
          <div class="login-form-item remember-checkbox">
            <div class="left">
              <input v-model="rememberMe" id="rememberMe" type="checkbox" />
              <label for="rememberMe">Remember me</label>
            </div>
            <span class="register" @click="handleClickGoRegister">注册</span>
          </div>
          <div class="login-form-item">
            <el-button type="primary" :loading="loading" class="login-btn" @click.native="handleClickLogin">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { aesEncrypt, aesDecrypt } from '../../utils/crypto'
import { validatorSpace } from '@/utils/script/validatorData'
import { ipcRenderer } from 'electron'

export default {
  data() {
    return {
      rememberMe: false,
      formData: {
        account: '', // 用户名
        password: '' // 密码
      },
      loading: false, // 登录中
      rules: {
        account: [
          { required: true, validator: validatorSpace, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatorSpace, trigger: 'blur' }
        ]
      },
      accountListVisible: false,
      accountList: []
    }
  },
  computed: {
    ...mapState({
      isMac: state => state.home.isMac
    })
  },
  watch: {
    rememberMe: function(val, oldval) {
      localStorage.setItem('rememberMe', val)
    }
  },
  components: {},
  created() {
    this.init()
  },
  methods: {
    ...mapActions(['Login']),
    init() {
      let list = JSON.parse(localStorage.getItem('accountList'))
      let rememberMe = localStorage.getItem('rememberMe')
      if (list && list.length > 0) {
        this.formData = {
          account: list[0].account,
          password: aesDecrypt({ encrypted: list[0].password })
        }
        this.accountList = JSON.parse(JSON.stringify(list))
      }
      if (rememberMe && rememberMe === 'true') {
        this.rememberMe = true
      } else {
        this.rememberMe = false
      }
    },
    // 用户登录
    handleClickLogin() {
      this.loading = true
      let data = JSON.parse(JSON.stringify(this.formData))
      data.password = this.$md5(data.password)
      this.Login(data)
        .then(res => {
          let { errcode, message } = res;
          if (errcode === 0) {
            if (this.rememberMe) this.cacheAccount();
            localStorage.setItem('account', this.formData.account);
            this.$message({
              type: 'success',
              message: '登录成功!'
            });
            if (this.isMac) {
              ipcRenderer.send('loginSuccess');
            }
            this.$router.push('/home');
          } else {
            this.$message({
              type: 'warning',
              message
            })
          }
        })
        .catch(err => {
          console.error('登录失败!', err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 缓存账户，方便下次登录
    cacheAccount() {
      let list = JSON.parse(localStorage.getItem('accountList'))
      if (list && list.length > 0) {
        if (
          list.some(item => {
            return item.account === this.formData.account
          })
        ) {
          let index = list.findIndex(item => {
            return item.account === this.formData.account
          })
          list.splice(index, 1)
          list.unshift({
            account: this.formData.account,
            password: aesEncrypt({ data: this.formData.password })
          })
        } else {
          list.unshift({
            account: this.formData.account,
            password: aesEncrypt({ data: this.formData.password })
          })
        }
      } else {
        list = []
        list.push({
          account: this.formData.account,
          password: aesEncrypt({ data: this.formData.password })
        })
      }
      localStorage.setItem('accountList', JSON.stringify(list))
    },

    // 使用该账户
    useAccount(event) {
      this.accountListVisible = false
      this.formData.account = event.account
      this.formData.password = aesDecrypt({ encrypted: event.password })
    },

    // 删除本地缓存中的账户
    deleteLocalAccount(account) {
      let list = JSON.parse(localStorage.getItem('accountList'))
      let index = list.findIndex(item => {
        return item.account === account.account
      })
      list.splice(index, 1)
      localStorage.setItem('accountList', JSON.stringify(list))
      this.accountList = JSON.parse(JSON.stringify(list))
      if (this.formData.account === account.account) {
        if (list && list.length > 1) {
          this.formData.account = list[0].account
          this.formData.password = aesDecrypt({ encrypted: list[0].password })
        } else {
          this.formData.account = ''
          this.formData.password = ''
        }
      }
    },

    // 前往注册
    handleClickGoRegister() {
      console.log(123)
      this.$router.push({ path: '/register' })
    }
  }
}
</script>

<style lang="scss">
.login-main-component {
  height: 100vh;
  background: url('../../../../static/img/login-bg.jpg') no-repeat;
  background-size: 100% 100%;
  .login-section {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-70%);
    .login-box {
      margin-top: 15px;
      padding: 10px 20px 20px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      header {
        text-align: center;
        .logo {
          display: inline-block;
          padding: 5px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          img {
            width: 50px;
            height: 50px;
            vertical-align: middle;
          }
        }
        h1 {
          margin-top: 5px;
          font-size: 18px;
          font-weight: normal;
          // letter-spacing: 4px;
          color: white;
        }
      }
      .login-form {
        margin-top: 20px;
        .login-form-item {
          .login-btn {
            width: 100%;
            height: 38px;
            padding: 0;
            // border-radius: 20px;
          }
        }
        .login-form-item + .login-form-item {
          margin-top: 10px;
        }
        .input__inner {
          // border: 1px solid #a7a7a7;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
          input {
            width: 220px;
            height: 38px;
            padding: 0 10px;
            border: none;
            color: #fff;
            background: none;
            outline: none;
            &::placeholder {
              font-size: 14px;
              color: #dfdfdf;
            }
          }
          input:-webkit-autofill{
            -webkit-box-shadow: 0 0 0 1000px rgb(255,255,255) inset;
            -webkit-text-fill-color: #333333;//设置字体颜色
          }
        }
        .remember-checkbox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #f7f7f7;
          .left-box {
            label {
              cursor: pointer;
              margin-left: 5px;
            }
            input {
              margin-top: -3px;
            }
          }
          .register {
            color: #0A419B;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.el-popover[x-placement^=bottom] {
  background: rgba(255, 255, 255, 0.8);
  .popper__arrow::after {
    border-bottom-color: rgba(235, 238, 245, 0.8) !important;
  }
}
// 选择账户
.account-list {
  max-height: 100px;
  overflow: auto;
  .account-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    cursor: pointer;
    &:hover {
      background: #f7f7f7;
    }
  }
}
</style>
