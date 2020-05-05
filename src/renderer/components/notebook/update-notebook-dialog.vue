<template>
  <div class="update-notebook-main-component">
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      :close-on-click-modal="false"
      width="350px"
      @close="onClose">
      <h3 slot="title" class="el-dialog__headertitle">文件夹重命名</h3>
      <div class="el-dialog__content">
        <p style="padding-top: 10px">文件夹名称:</p>
        <input
          v-model="notebook.name"
          ref="nameInp"
          class="el-dialog__contentInp"
          type="text"
          @keyup.enter="handleClickUpdateNotebook"
          placeholder="请输入文件夹名称!" />
      </div>
      <div class="el-dialog__btngtoup">
        <el-button @click="onClose">取消</el-button>
        <el-button :loading="loading" :disabled="!notebook.name" @click="handleClickUpdateNotebook">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  export default {
    data () {
      return {
        loading: false,
        dialogVisible: false,
        notebook: {}
      }
    },
    computed: {
      ...mapState({
        activeNotebook: state => state.notebook.activeNotebook
      })
    },
    mounted() {
      this.$nextTick(() => {
        this.$on('showDialog', (data) => {
          this.dialogVisible = true;
          this.notebook = JSON.parse(JSON.stringify(this.activeNotebook));
          this.$nextTick(() => {
            this.$refs['nameInp'].focus();
          });
        })
      })
    },
    methods: {
      ...mapMutations([]),
      ...mapActions([
        'UpdateNotebook'
      ]),
      onClose () {
        this.dialogVisible = false;
        this.notebookName = '';
      },
      // 更新笔记本
      handleClickUpdateNotebook () {
        this.loading = true;
        this.UpdateNotebook({
          _id: this.notebook._id,
          name: this.notebook.name
        })
          .then(data => {
            let { errcode, message } = data;
            this.loading = false;
            this.dialogVisible = false;
            if (errcode === 0) {
              this.$message({
                type: 'success',
                message: '更新了一个文件夹名称!'
              });
            } else {
              this.$message({
                type: 'warning',
                message
              });
            }
          })
          .catch(err => {
            console.error('更新文件夹名称失败:', err);
            this.dialogVisible = false;
            this.$message({
              type: 'error',
              message: '更新文件夹名称失败!'
            });
          })
      }
    }
  }
</script>

<style lang="scss">
  .update-notebook-main-component {
    .el-dialog {
      margin-top: 30vh !important;
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
        .el-dialog__contentInp {
          width: 306px;
          height: 22px;
          margin-top: 10px;
          padding: 0 10px;
          border: 1px solid #A7A7A7;
          outline: none;
        }
        .el-dialog__contentInp:focus {
          height: 22px;
          // border: 1px solid #3388FF;
          border: 1px solid #0A419B;
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
