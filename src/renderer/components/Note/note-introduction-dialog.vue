<template>
  <div class="note-introduction-component">
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      :close-on-click-modal="false"
      width="500px"
      @close="onClose">
      <h3 slot="title" class="el-dialog__headertitle">笔记简介</h3>
      <div class="el-dialog__content">
        <el-form ref="form" :model="formData" :rules="rules" label-width="60px">
          <el-form-item label="封面:" prop="img">
            <el-upload
              :action="serverUrl"
              :show-file-list="false"
              :on-success="handleUploadImgSuccess"
              :on-error="handleUploadImgError"
              :on-exceed="handleUploadImgExceed"
              :file-list="fileList"
              :limit="1">
              <el-button size="mini" type="primary">{{formData.img ? '重新上传' : '点击上传'}}</el-button>
              <div slot="tip" class="el-upload__tip">
                <img class="cover-img" v-if="formData.img" :src="formData.img" alt="封面" />
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="内容:" prop="introduction">
            <el-input
              v-model="formData.introduction"
              type="textarea"
              rows="4">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="el-dialog__btngtoup">
        <el-button @click="onClose">取消</el-button>
        <el-button :loading="loading" @click="handleClickSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      dialogVisible: false,
      loading: false,
      serverUrl: '',
      network: {
        ip: '12.0.0.1',
        port: '10023'
      },
      fileList: [],
      // 简介信息
      formData: {
        _id: '',
        introduction: '',
        img: ''
      },
      rules: {
        introduction: [
          { required: true, message: '请输入简介内容!', trigger: 'blur' },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ],
        // img: [
        //   { required: true, message: '请上传封面图片!', trigger: 'blur' }
        // ],
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.init();
    this.$nextTick(() => {
      this.$on('showDialog', (data) => {
        this.dialogVisible = true;
        this.formData = {
          _id: data._id,
          introduction: data.introduction,
          img: data.img,
        }
      })
    })
  },
  methods: {
    ...mapActions([
      'UpdateNoteAttr'
    ]),
    init() {
      let network = localStorage.getItem('network');
      if (network) {
        this.network = JSON.parse(network);
      }
      this.serverUrl = `http://${this.network.ip}:${this.network.port}` + '/api/blog/uploadfile';
    },
    onClose() {
      this.dialogVisible = false;
    },
    // 上传成功
    handleUploadImgSuccess(res, file, fileList) {
      this.formData.img = `http://${this.network.ip}${res.filePath}`;
      this.fileList = [];
    },
    // 上传失败
    handleUploadImgError(err, file, fileList) {
      this.$message({
        type: 'error',
        message: '图片上传失败!'
      });
    },
    // 文件超出个数限制时的钩子
    handleUploadImgExceed(files, fileList) {
      this.$message({
        type: 'warning',
        message: '只能选择一张图片作为封面图片!'
      });
      return false;
    },
    // 提交表单
    handleClickSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.UpdateNoteAttr({
            ...this.formData
          })
            .then(data => {
              let { errcode, message } = data
              if (errcode === 0) {
                this.$message({
                  type: 'success',
                  message: '成功!',
                  duration: 1000
                })
                this.dialogVisible = false;
                return;
              }
              this.$message({
                type: 'warning',
                message
              })
            })
            .catch(err => {
              console.log('更新笔记简介失败!', err);
              this.$message({
                type: 'error',
                message: '更新笔记简介失败!'
              });
            })
        } else {
          console.log('error submit!');
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss">
.note-introduction-component {
  .el-dialog {
    border: 1px solid #A7A7A7;
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
      padding: 0 10px;
      background: #F7F7F7;
      .el-dialog__content {
        .cover-img {
          display: block;
          max-width: 160px;
        }
      }
      .el-dialog__btngtoup {
        padding: 10px 0;
        text-align: right;
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
