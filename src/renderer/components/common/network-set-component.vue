<template>
  <div class="network-set-component">
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      :close-on-click-modal="false"
      width="350px"
      @close="onClose">
      <h3 slot="title" class="el-dialog__headertitle">网络设置</h3>
      <div class="el-dialog__content">
        <el-form ref="form" :model="formData" :rules="rules" label-width="60px">
          <el-form-item label="IP" prop="ip">
            <el-input size="small" v-model="formData.ip" placeholder="请输入目标IP地址!"></el-input>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input size="small" v-model="formData.port" placeholder="请输入目标端口!"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="el-dialog__footer">
        <el-button @click="onClose">取消</el-button>
        <el-button :loading="loading" @click="handleChangeNetworkAddress">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { destoryAxios } from '../../utils/request'
export default {
  data() {
    return {
      loading: false,
      dialogVisible: false,
      formData: {
        ip: '',
        port: 10023
      },
      rules: {
        ip: [
          { required: true, message: '请输入目标IP地址!', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入目标端口!', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.init()
    this.$nextTick(() => {
      this.$on('setNetwork', () => {
        this.dialogVisible = true
      })
    })
  },
  methods: {
    init() {
      let network = localStorage.getItem("network");
      if (network) {
        network = JSON.parse(network);
        this.formData = {
          ip: network.ip,
          port: network.port
        }
      }
    },
    onClose () {
      this.dialogVisible = false;
    },
    handleChangeNetworkAddress() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          localStorage.setItem("network", JSON.stringify(this.formData))
          destoryAxios()
          this.$message({
            type: "success",
            message: "网络配置已更新!"
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请完善必要信息!'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.network-set-component {
  .el-dialog {
    // border: 1px solid #A7A7A7;
    border-radius: 0;
    .el-dialog__header {
      display: flex;
      align-items: center;
      height: 30px;
      padding: 0;
      .el-dialog__headertitle {
        flex: 1;
        padding-left: 10px;
      }
      .el-dialog__headerbtn {
        position: static;
        .el-dialog__close {
          width: 30px;
          height: 30px;
          line-height: 30px;
        }
        .el-dialog__close:hover {
          color: #FFFFFF !important;
        }
      }
      .el-dialog__headerbtn:hover {
        background: #FF0000;
      }
    }
    .el-dialog__body {
      padding: 0;
      background: #F7F7F7;
      .el-dialog__content {
        padding: 20px 10px 0 10px;
        .el-input__inner {
          border-radius: 0;
        }
      }
      .el-dialog__footer {
        padding: 10px;
        text-align: right;
        background: #fff;
        button {
          width: 80px;
          height: 22px;
          padding: 0;
          font-size: 12px;
          color: #333;
          background: #F3F3F3;
          border: 1px solid #A7A7A7;
          outline: none;
          border-radius: 0;
          &:hover {
            // border: 1px solid #0A419B;
            color: #333;
            background: #fff;
          }
        }
      }
    }
  }
}
</style>
