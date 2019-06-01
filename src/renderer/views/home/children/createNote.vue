<template>
  <div class="create-note-main-component" @keyup.ctrl.83="createNote">
    <el-header class="title-section">
      <input
        placeholder="标题"
        class="note-title-input"
        :style="{'border': isEditNoteNameFlag ? '1px solid #CCCCCC' : '1px solid #FFFFFF'}"
        v-model="note.noteName"
        type="text"
        @focus="onFocus"
        @blur="onBlur" />
    </el-header>
    <quill-editor
      v-model="note.noteContent"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)">
    </quill-editor>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  export default {
    data () {
      return {
        note: {
          noteName: '',
          noteContent: ''
        },
        // 是否编辑编辑标题
        isEditNoteNameFlag: '',
        editorOption: {
          modules:{
            toolbar:[
              // 字体样式
              ['bold', 'italic', 'underline', 'strike'],
              // 代码编写
              ['blockquote', 'code-block'],
              // 标题，键值对的形式；1、2表示字体大小
              // [{ 'header': 1 }, { 'header': 2 }],
              // 几级标题
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              // 字体颜色，字体背景颜色
              [{ 'color': [] }, { 'background': [] }],
              // 列表
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              // 上下标
              [{ 'script': 'sub'}, { 'script': 'super' }],
              // 缩进
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              // 字体
              // [{ 'font': ['Microsoft YaHei', 'Arial', '黑体', '宋体'] }],
              // 对齐方式
              [{ 'align': [] }],
            ]
          }
        }
      }
    },
    components: {},
    computed: {
      ...mapState({
        editEvent: state => state.home.editEvent,
        activeNotebook: state => state.home.activeNotebook
      })
    },
    watch: {
      editEvent: {
        handler: function(val, oldval) {
          this.content = val.eventData
        },
        deep: true
      }
    },
    created () {
      // debugger
      console.log(this.$route.params)
    },
    mounted () {
      this.content = this.editEvent.eventData
    },
    methods: {
      ...mapMutations([]),
      ...mapActions([
        'EditEvent',
        'CreateNote'
      ]),
      onFocus () {
        this.isEditNoteNameFlag = true
      },
      onBlur () {
        this.isEditNoteNameFlag = false
      },
      // 创建笔记
      createNote () {
        this.CreateNote({
          noteName: this.note.noteName,
          noteContent: this.note.noteContent,
          username: localStorage.getItem('username'),
          notebookCode: this.activeNotebook.notebookCode,
          status: 0,
          flag: 'note'
        })
          .then(data => {
            this.$message({
              message: '笔记创建成功!',
              type: 'success',
              duration: 1500
            })
          })
          .catch(err => {
            if (err.errcode) {
              this.$message({
                message: err.message,
                type: 'error',
                duration: 1500
              })
              return
            }
            this.$message({
              message: '网络错误!',
              type: 'error',
              duration: 1500
            })
          })
      },
      // 更新事件
      updateEvent () {
        this.EditEvent({
          ...this.editEvent,
          eventData: this.content,
          createTime: new Date(this.editEvent.createTime).getTime()
        })
          .then(data => {
            this.$message({
              message: '保存成功!',
              type: 'success',
              duration: 1500
            })
          })
          .catch(err => {
            if (err.errcode) {
              this.$message({
                message: err.message,
                type: 'error',
                duration: 1500
              })
              return
            }
            this.$message({
              message: '网络错误!',
              type: 'error',
              duration: 1500
            })
          })
      },
      // 取消编辑
      cancelEditor () {
        this.$confirm('确定取消编辑吗?', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.$router.back()
          })
          .catch(() => {})
      },
      // 失去焦点事件
      onEditorBlur (event) {
        console.log(this.content)
      },
      // 获得焦点事件
      onEditorFocus () {},
      // 内容改变事件
      onEditorChange () {}
    }
  }
</script>

<style lang="scss">
  .create-note-main-component {
    .title-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 45px !important;
      padding: 0 5px;
      border-bottom: 1px solid #CCCCCC;
      text-align: right;
      background: #FFFFFF !important;
      .note-title-input {
        flex: 1;
        height: 30px;
        line-height: 30px;
        padding: 0 5px;
        border: 1px solid #FFFFFF;
        outline: none;
      }
      .note-title-input:hover {
        border: 1px solid #CCCCCC !important;
      }
    }
    .ql-snow {
      border-left: none !important;
      border-right: none !important;
      border-top: none !important;
    }
    .ql-container {
      height: calc(100vh - 75px - 42px) !important;
      border: none !important;
      overflow: auto !important;
    }
  }
</style>
