<template>
  <el-dialog
    :visible.sync="showDialog"
    width="300px">
    <h2 slot="title">网络设置</h2>
    <el-input
      v-model="networkAddress"
      placeholder="请输入网络地址!"
      @keyup.enter.native="handleChangeNetworkAddress"
    >
    </el-input>
  </el-dialog>
</template>

<script>
import { destoryAxios } from '../../utils/request'
export default {
  data() {
    return {
      showDialog: false,
      networkAddress: ''
    }
  },
  mounted() {
    this.init()
    this.$nextTick(() => {
      this.$on('setNetwork', () => {
        this.showDialog = true
      })
    })
  },
  methods: {
    init() {
      let baseUrl = localStorage.getItem("baseUrl")
      if (baseUrl) {
        this.networkAddress = baseUrl
      }
    },
    handleChangeNetworkAddress() {
      this.showDialog = false;
      localStorage.setItem("baseUrl", this.networkAddress)
      destoryAxios()
      this.$message({
        type: "success",
        message: "网络地址已变更!"
      })
    }
  }
}
</script>

<style lang="scss">
</style>
