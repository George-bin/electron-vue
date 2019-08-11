<template>
  <div class="editor-content-main-component" @keyup.ctrl.83="updateNote">
    <el-header class="title-section">
      <input
        placeholder="标题"
        class="note-title-input"
        :disabled="activeModule === 'recycleBin'"
        :style="{'border': isEditNoteNameFlag ? '1px solid #CCCCCC' : '1px solid #FFFFFF'}"
        v-model="note.noteName"
        type="text"
        @focus="onFocus"
        @blur="onBlur" />
      <select class="set-note-label" v-model="note.noteLabel">
        <option value="note" selected>笔记</option>
        <option value="jottings">随笔</option>
      </select>
    </el-header>
    <quill-editor
      v-model="note.noteContent"
      ref="myQuillEditor"
      :options="editorOption"
      :disabled="activeModule === 'recycleBin'"
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
        note: {},
        isEditNoteNameFlag: false,
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
        activeNote: state => state.home.activeNote,
        activeModule: state => state.home.activeModule
      })
    },
    watch: {
      activeNote: {
        handler: function(val, oldval) {
          this.note = JSON.parse(JSON.stringify(val))
        },
        deep: true
      }
    },
    mounted () {
      this.note = JSON.parse(JSON.stringify(this.activeNote))
    },
    methods: {
      ...mapMutations([]),
      ...mapActions([
        'UpdateNote'
      ]),
      onFocus () {
        this.isEditNoteNameFlag = true
      },
      onBlur () {
        this.isEditNoteNameFlag = false
      },
      // 更新事件
      updateNote () {
        this.UpdateNote({
          ...this.activeNote,
          noteLabel: this.note.noteLabel,
          noteContent: this.note.noteContent,
          noteName: this.note.noteName
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
  .editor-content-main-component {
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
        background: none;
        outline: none;
      }
      .note-title-input:hover {
        border: 1px solid #CCCCCC !important;
      }
      .set-note-label {
        width: 60px;
        height: 32px;
        margin-left: 10px;
        outline: none;
      }
    }
    .ql-snow {
      border-left: none !important;
      border-right: none !important;
      border-top: none !important;
    }
    .ql-container {
      height: calc(100vh - 75px - 43px) !important;
      border: none !important;
      overflow: auto !important;
    }
  }
</style>
