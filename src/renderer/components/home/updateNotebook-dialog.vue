<template>
  <div class="update-notebook-main-component">
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      width="350px"
      @close="onClose"
    >
      <h3 slot="title" class="el-dialog__headertitle">笔记本重命名</h3>
      <div class="el-dialog__content">
        <p style="padding-top: 10px">笔记本名称:</p>
        <input class="el-dialog__contentInp" v-model="notebook.notebookName" type="text" placeholder="请输入笔记本名称!" />
      </div>
      <div class="el-dialog__btngtoup">
        <button @click="onClose">取消</button>
        <button :disabled="!notebook.notebookName" @click="updateNotebook">确定</button>
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
        notebook: {}
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$on('showDialog', (data) => {
          this.dialogVisible = true
          this.notebook = JSON.parse(JSON.stringify(data))
        })
      })
    },
    methods: {
      ...mapMutations([
        'SET_UPDATE_NOTEBOOK'
      ]),
      onClose () {
        this.dialogVisible = false
        this.notebookName = ''
        this.SET_UPDATE_NOTEBOOK(null)
      },
      // 更新笔记本
      updateNotebook () {
        this.UpdateNotebook({
          _id: this.notebook._id,
          notebookName: this.notebook.notebookName
        })
          .then(data => {})
          .catch(err => {
            console.log(err)
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
