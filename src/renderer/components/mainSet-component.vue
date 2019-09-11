<template>
  <div class="main-set-main-component">
    <!--设置选项-->
    <ul v-if="showSetUpList" class="setup-list">
      <li class="setup-list-item" @click="logon">退出登录</li>
      <li class="setup-list-item">账户设置</li>
      <li class="setup-list-item" @click.stop="handleSetNetwork">网络设置</li>
    </ul>

    <!--网络设置-->
    <el-dialog
      :visible.sync="openNetworkSetDialog"
      width="300px"
      :close="handleCloseNetwork">
      <h2 slot="title">网络设置</h2>
      <el-input
        v-model="networkAddress"
        placeholder="请输入网络地址!"
        @keyup.enter.native="handleChangeNetworkAddress">
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
import { destoryAxios } from '../utils/request'
export default {
  data () {
    return {
      networkAddress: '',
      showSetUpList: false,
      openNetworkSetDialog: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('openNetwork', () => {
        this.showSetUpList = true
      })
    })
  },
  methods: {
    // 注销
    logon () {
      this.$confirm('确定退出登录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          let data = {
            // username: this.username
            username: localStorage.getItem('username')
          }
          this.Logon(data)
            .then(data => {
              if (data.errcode === 0) {
                this.$message({
                  type: 'success',
                  message: '注销成功!',
                  duration: 1500
                })
                this.$router.push('/login');
              }
            })
        })
        .catch(() => {
          this.$router.push('/login');
        })
    },
    // 网络设置
    handleSetNetwork () {
      console.log('打开网络设置!')
      this.showSetUpList = false
      this.openNetworkSetDialog = true
    },
    // 关闭网络设置
    handleCloseNetwork () {
      this.openNetworkSetDialog = false
    },
    // 改变网络地址
    handleChangeNetworkAddress () {
      console.log('改变网络地址!')
      localStorage.setItem('baseUrl', this.networkAddress)
      destoryAxios()
    }
  }
}
</script>

<style lang="scss">
  .main-set-main-component {
    .setup-list {
      position: fixed;
      right: 42px;
      top: 30px;
      border: 1px solid #7D7D7D;
      z-index: 9999;
      background: #ffffff;
      .setup-list-item {
        height: 24px;
        line-height: 24px;
        padding: 0 20px;
        cursor: pointer;
      }
      .setup-list-item:hover {
        background: #DFDFDF;
      }
      .setup-list-item + .setup-list-item {
        border-top: 1px solid #7D7D7D;
      }
    }
  }
</style>
