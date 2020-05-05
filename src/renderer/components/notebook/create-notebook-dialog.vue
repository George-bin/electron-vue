<template>
  <div class="create-notebook-main-section">
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      width="350px"
      @close="onClose"
    >
      <h3 slot="title" class="el-dialog__headertitle">新建文件夹</h3>
      <div class="el-dialog__content">
        <p style="padding-top: 10px">文件夹名称:</p>
        <input
          class="el-dialog__contentInp"
          id="noteBookNameInput"
          v-model="notebookName"
          ref="notebookNameInput"
          type="text"
          @keyup.enter="handleClickCreateNotebook"
          placeholder="请输入文件夹名称!" />
      </div>
      <div class="el-dialog__btngtoup">
        <button @click="onClose">取消</button>
        <button :disabled="!notebookName" @click="handleClickCreateNotebook">确定</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  export default {
    data () {
      return {
        dialogVisible: false,
        notebookName: ''
      }
    },
    computed: {
      ...mapState({
        activeNotebook: state => state.notebook.activeNotebook
      })
    },
    mounted() {
      this.$nextTick(() => {
        this.$on('showDialog', () => {
          this.dialogVisible = true
          this.$nextTick(() => {
            this.$refs['notebookNameInput'].focus()
          })
        })
      })
    },
    methods: {
      ...mapMutations([]),
      ...mapActions([
        'CreateNotebook'
      ]),
      onClose () {
        this.dialogVisible = false
        this.notebookName = ''
      },
      // 创建笔记本
      handleClickCreateNotebook () {
        let account = localStorage.getItem('account')
        this.CreateNotebook({
          name: this.notebookName, // 笔记本名称
          account: account, // 所属用户
          total: 0, // 笔记的数量
          createTime: null, // 创建时间
          updateTime: null, // 更新时间
          PARENT_CODE: this.activeNotebook._id, // 父级节点的code
          grade: this.activeNotebook.grade + 1 // 节点等级
        })
          .then(data => {
            this.dialogVisible = false;
            let { errcode, message } = data;
            if (errcode === 0) {
              this.$message({
                type: 'success',
                message: '新建了一个笔记本!'
              });
            } else {
              this.$message({
                type: 'warning',
                message
              });
            }
          })
          .catch(err => {
            console.error('新建笔记本失败:', err);
            this.dialogVisible = false;
            this.$message({
              message: '创建笔记本失败!',
              type: 'error'
            });
          })
      },
    }
  }
</script>

<style lang="scss">
  .create-notebook-main-section {
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
          border: 1px solid #3388FF;
        }
        .el-dialog__btngtoup {
          padding: 10px 0;
          text-align: right;
          button {
            width: 80px;
            height: 22px;
            padding: 0;
            font-size: 12px;
            background: #F3F3F3;
            border: 1px solid #A7A7A7;
            outline: none;
          }
          /*button:hover {*/
          /*border: 1px solid #3388ff;*/
          /*}*/
        }
      }
    }
  }
</style>
