<template>
  <div class="register-component">
    <div class="cancel-register">
      <span @click="cancelRegister">取消</span>
    </div>
    <!--输入框区域-->
    <div class="register-form-section">
      <div class="register-title">
        <img src="../../../../static/img/logo.png" alt="logo" />
        <h2>用户注册</h2>
      </div>
      <el-form
        ref="registerForm"
        :model="formData"
        :rules="rules"
        :show-message="false"
        class="register-form"
        label-width="50px">
        <el-form-item prop="account" label="账户">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名!"
            v-model="formData.account">
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入密码!"
            v-model="formData.password"
            type="password">
          </el-input>
        </el-form-item>
        <el-form-item prop="username" label="昵称">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户昵称!"
            v-model="formData.username">
          </el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户邮箱!"
            v-model="formData.email">
          </el-input>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户电话!"
            v-model="formData.phone">
          </el-input>
        </el-form-item>
        <el-form-item prop="username" label="年龄">
          <el-input-number v-model="formData.age" :min="15" :max="99" label="请输入年龄!"></el-input-number>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="formData.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="avatar" label="头像">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入头像地址!"
            v-model="formData.avatar">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click.native="handleClickRegister" class="register-button">注册用户</el-button>
        </el-form-item>
      </el-form>
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
      formData: {
        account: '',
        password: '',
        username: '',
        email: '',
        phone: '',
        age: '',
        sex: '男',
        avatar: ''
      },
      loading: false,
      rules: {
        account: [{ required: true, validator: validatorSpace, trigger: 'blur' }],
        password: [{ required: true, validator: validatorSpace, trigger: 'blur' }],
        username: [{ required: true, validator: validatorSpace, trigger: 'blur' }],
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
    handleClickRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let data = JSON.parse(JSON.stringify(this.formData))
          data.password = this.$md5(data.password)
          this.Register(data)
            .then(data => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '注册成功!',
                duration: 1500
              })
              this.$router.push('/login')
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
        } else {
          this.$message({
            type: 'warning',
            message: '请完善必要数据!'
          })
        }
      })
    },
    // 取消注册
    cancelRegister() {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
  .register-component {
    height: 100%;
    .cancel-register {
      padding-right: 40px;
      padding-top: 20px;
      text-align: right;
      color: #0A419B;
      cursor: pointer;
    }
    .register-form-section {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 300px;
      transform: translateX(-50%) translateY(-50%);
      .register-title {
        text-align: center;
        img {
          width: 50px;
          height: 50px;
        }
        h2 {
          font-size: 16px;
          text-align: center;
          color: #333333;
          letter-spacing: 4px;
        }
      }
      .register-form {
        margin-top: 10px;
        .el-form-item {
          margin-bottom: 6px;
          .el-input__inner {
            border-radius: 0;
          }
          .register-button {
            border-radius: 0;
          }
        }
      }
    }
  }
</style>
