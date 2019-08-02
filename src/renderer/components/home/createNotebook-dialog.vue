<template>
  <div class="create-notebook-main-section">
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      width="350px"
      @close="onClose"
    >
      <h3 slot="title" class="el-dialog__headertitle">新建笔记本</h3>
      <div class="el-dialog__content">
        <p style="padding-top: 10px">笔记本名称:</p>
        <input
          class="el-dialog__contentInp"
          id="noteBookNameInput"
          v-model="notebookName"
          ref="notebookNameInput"
          type="text"
          @keyup.enter="createNotebook"
          placeholder="请输入笔记本名称!" />
      </div>
      <div class="el-dialog__btngtoup">
        <button @click="onClose">取消</button>
        <button :disabled="!notebookName" @click="createNotebook">确定</button>
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
        parentNode: state => state.home.parentNode
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
      ...mapMutations([
        'SET_PARENT_NODE'
      ]),
      ...mapActions([
        'CreateNotebook'
      ]),
      onClose () {
        this.dialogVisible = false
        this.notebookName = ''
        this.SET_PARENT_NODE(null)
      },
      // 创建笔记本
      createNotebook () {
        this.CreateNotebook({
          notebookCode: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
          notebookName: this.notebookName,
          PARENT_CODE: this.parentNode.notebookCode,
          noteNum: 0,
          // createTime: Date.now(),
          username: localStorage.getItem('username'),
          flag: 'notebook',
          nodeClass: this.parentNode.nodeClass + 1
        })
          .then(data => {
            this.dialogVisible = false
          })
          .catch(err => {
            this.dialogVisible = false
            if (err.errcode) {
              this.$message({
                message: err.message,
                type: 'error',
                duration: 1500
              })
              return
            }
            this.$message({
              message: '网络错误',
              type: 'error',
              duration: 1500
            })
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
