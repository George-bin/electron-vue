<template>
  <div class="login-main-components">
    <!--<div class="register-btn">-->
    <!--<span @click="goRegister">注册</span>-->
    <!--</div>-->
    <div class="content-section">
      <div class="title">
        <h2>Login</h2>
      </div>
      <el-form ref="loginForm" :model="form" :rules="rules" class="login-form">
        <el-form-item prop="username" @click.native="showAccountList">
          <el-popover
            placement="bottom"
            width="200"
            v-model="accountListVisible"
          >
            <el-input
              :disabled="loading"
              placeholder="请输入用户名!"
              v-model="form.username"
              slot="reference"
            >
            </el-input>
            <ul v-if="accountList && accountList.length" class="account-list">
              <li
                v-for="item in accountList"
                :key="item.username"
                class="account-list-item"
                @click="useAccount(item)"
              >
                <span>{{ item.username }}</span>
                <i
                  class="el-icon-circle-close"
                  @click.stop="deleteLocalAccount(item)"
                ></i>
              </li>
            </ul>
          </el-popover>
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
        <el-form-item style="text-align: center">
          <el-button :loading="loading" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { aesEncrypt, aesDecrypt } from "../../utils/crypto";
import { validatorSpace } from "@/utils/script/validatorData";

export default {
  data() {
    return {
      form: {
        username: "", // 用户名
        password: "" // 密码
      },
      loading: false, // 登录中
      rules: {
        username: [
          { required: true, validator: validatorSpace, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatorSpace, trigger: "blur" }
        ]
      },
      accountListVisible: false,
      accountList: []
    };
  },
  computed: {},
  watch: {},
  components: {},
  created() {
    this.initData();
  },
  methods: {
    ...mapActions(["Login"]),
    initData() {
      let list = JSON.parse(localStorage.getItem("accountList"));
      if (list && list.length > 0) {
        this.form = {
          username: list[0].username,
          password: aesDecrypt({ encrypted: list[0].password })
        };
        this.accountList = JSON.parse(JSON.stringify(list));
      }
    },
    // 用户登录
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.Login(this.form)
            .then(data => {
              if (data.errcode === 0) {
                setTimeout(() => {
                  this.loading = false;
                  this.cacheAccount();
                  localStorage.setItem("username", this.form.username);
                  this.$message({
                    type: "success",
                    message: data.message,
                    duration: 1500
                  });
                  this.$router.push("/home");
                }, 3000);
              } else {
                this.loading = false;
                this.$message({
                  type: "warning",
                  message: "用户名或密码错误!",
                  duration: 1500
                });
              }
            })
            .catch(err => {
              this.loading = false;
              console.log(err);
              this.$message({
                type: "error",
                message: "网络错误!",
                duration: 1500
              });
            });
        }
      });
    },

    // 缓存账户，方便下次登录
    cacheAccount() {
      let list = JSON.parse(localStorage.getItem("accountList"));
      if (list && list.length > 0) {
        if (
          list.some(item => {
            return item.username === this.form.username;
          })
        ) {
          let index = list.findIndex(item => {
            return item.username === this.form.username;
          });
          list.splice(index, 1);
          list.unshift({
            username: this.form.username,
            password: aesEncrypt({ data: this.form.password })
          });
        } else {
          list.unshift({
            username: this.form.username,
            password: aesEncrypt({ data: this.form.password })
          });
        }
      } else {
        list = [];
        list.push({
          username: this.form.username,
          password: aesEncrypt({ data: this.form.password })
        });
      }
      localStorage.setItem("accountList", JSON.stringify(list));
    },

    // 使用该账户
    useAccount(event) {
      this.accountListVisible = false;
      this.form.username = event.username;
      this.form.password = aesDecrypt({ encrypted: event.password });
    },

    // 删除本地缓存中的账户
    deleteLocalAccount(account) {
      let list = JSON.parse(localStorage.getItem("accountList"));
      let index = list.findIndex(item => {
        return item.username === account.username;
      });
      list.splice(index, 1);
      localStorage.setItem("accountList", JSON.stringify(list));
      this.accountList = JSON.parse(JSON.stringify(list));
      if (this.form.username === account.username) {
        if (list && list.length > 1) {
          this.form.username = list[0].username;
          this.form.password = aesDecrypt({ encrypted: list[0].password });
        } else {
          this.form.username = "";
          this.form.password = "";
        }
      }
    },

    showAccountList() {
      this.accountList = JSON.parse(localStorage.getItem("accountList"));
      this.accountListVisible = false;
      if (this.accountList && this.accountList.length)
        this.accountListVisible = true;
    },

    // 前往注册
    goRegister() {
      console.log(123);
      this.$router.push({ path: "/register" });
    }
  }
};
</script>

<style lang="scss">
.login-main-components {
  height: 100%;
  /*background: linear-gradient(red, blue); !* 标准的语法 *!*/
  .register-btn {
    padding-right: 40px;
    padding-top: 44px;
    text-align: right;
    color: #000000;
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
    transform: translateX(-50%) translateY(-70%);
    width: 300px;
    /*display: flex;*/
    align-items: center;
    .title {
      text-align: center;
      .logo {
        width: 60px;
        height: 70px;
      }
      h2 {
        font-size: 24px;
        text-align: center;
        color: #333333;
        letter-spacing: 4px;
      }
    }
    .login-form {
      margin-top: 30px;
      input {
        border-radius: 20px;
      }
    }
  }
  .el-form {
    .el-form-item {
      .el-button {
        width: 200px;
        height: 34px;
        padding: 0;
        border: 0;
        color: white;
        background: #30b0e4;
        border-radius: 20px;
      }
    }
  }
}
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
