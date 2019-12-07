<template>
  <div class="editor-content-main-component" @keyup.ctrl.83="handleUpdateNote">
    <el-header class="title-section">
      <input
        placeholder="标题"
        class="note-title-input"
        :disabled="activeModule === 'recycleBin'"
        :style="{
          border: isEditNoteNameFlag ? '1px solid #CCCCCC' : '1px solid #FFFFFF'
        }"
        v-model="note.noteName"
        type="text"
        @focus="onFocus"
        @blur="onBlur"
      />
      <select class="set-note-label" v-model="note.noteLabel">
        <option value="main-body" selected>正文</option>
        <option value="draft">草稿</option>
      </select>
    </el-header>
    <div class="content-section">
      <el-upload
        v-show="false"
        class="avatar-uploader"
        :action="serverUrl"
        name="img"
        :show-file-list="false"
        :on-success="handleUploadImgSuccess"
        :on-error="handleUploadImgError"
        :before-upload="handleBeforeUploadImg"
      >
      </el-upload>
      <el-row v-loading="uploadingImg || !activeNote._id">
        <quill-editor
          v-model="note.noteContent"
          ref="myQuillEditor"
          :options="editorOption"
          :disabled="activeModule === 'recycleBin'"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        >
        </quill-editor>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import editorConfig from '../../../assets/js/editorConfig'
export default {
  data() {
    return {
      note: {},
      isEditNoteNameFlag: false,
      editorOption: editorConfig,
      // 服务器地址
      serverUrl: '',
      // 图片上传中
      uploadingImg: false,
      isDisabled: false
    }
  },
  components: {},
  computed: {
    ...mapState({
      isMac: state => state.home.isMac,
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
  mounted() {
    this.serverUrl = localStorage.getItem('baseUrl') + '/api/blog/uploadfile'
    this.note = JSON.parse(JSON.stringify(this.activeNote))
    this.init()
  },
  methods: {
    ...mapMutations([]),
    ...mapActions(['UpdateNote']),
    init() {
      $('.ql-container').css({
        height: this.isMac ? 'calc(100vh - 75px - 12px)' : 'calc(100vh - 75px - 42px)'
      })
    },
    onFocus() {
      this.isEditNoteNameFlag = true
    },
    onBlur() {
      this.isEditNoteNameFlag = false
    },
    // 更新笔记
    handleUpdateNote() {
      let oldNote = JSON.parse(JSON.stringify(this.note))
      let quill = this.$refs.myQuillEditor.quill
      let length = quill.getSelection().index
      this.uploadingImg = true
      let content = this.note.noteContent.replace(
        /\<p\>\<br\>\<\/p\>\<pre/g,
        '\<pre'
      )
      content = content.replace(/src="http:\/\/39.105.55.137\/file\/uploads\/images\/blog/g, 'src="/file/uploads/images/blog')
      this.UpdateNote({
        ...this.activeNote,
        noteLabel: this.note.noteLabel,
        noteContent: content,
        noteName: this.note.noteName
      })
        .then(data => {
          this.uploadingImg = false
          // 将光标插入到原来位置
          quill.setSelection(length)
          if (data.errcode === 0) {
            this.$message({
              message: '保存成功!',
              type: 'success',
              duration: 1500
            })
          }
        })
        .catch(err => {
          this.note = oldNote
          this.uploadingImg = false
          // 将光标插入到原来位置
          quill.setSelection(length)
          this.$message({
            message: '网络错误!',
            type: 'error',
            duration: 1500
          })
          // console.log('更新笔记失败!', err)
        })
      this.note = {}
    },
    // 失去焦点事件
    onEditorBlur(event) {
      console.log('失去焦点!')
    },
    // 获得焦点事件
    onEditorFocus() {
      console.log('获得焦点!')
    },
    // 内容改变事件
    onEditorChange() {},
    // 图片上传成功
    handleUploadImgSuccess(res) {
      this.uploadingImg = false
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.errcode === 0 && res.filePath) {
        // 获取光标所在位置
        let length = quill.getSelection().index

        // 插入图片  res.info为服务器返回的图片地址
        // console.log('图片地址:', `http://${baseUrl}${res.filePath}`)
        quill.insertEmbed(
          length,
          'image',
          `http://${
            process.env.NODE_ENV === 'production'
              ? '39.105.55.137'
              : location.hostname
          }${res.filePath}`
        )
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
    },
    // 图片上传失败
    handleUploadImgError() {
      this.uploadingImg = false
      this.$message({
        type: 'error',
        message: '图片上传失败!'
      })
    },
    // 上传图片之前
    handleBeforeUploadImg() {
      this.uploadingImg = true
    }
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
    border-bottom: 1px solid #cccccc;
    text-align: right;
    background: #ffffff !important;
    .note-title-input {
      flex: 1;
      height: 30px;
      line-height: 30px;
      padding: 0 5px;
      border: 1px solid #ffffff;
      background: none;
      outline: none;
    }
    .note-title-input:hover {
      border: 1px solid #cccccc !important;
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
  .ql-formats {
    margin-right: 0px !important;
  }
  .ql-container {
    // height: calc(100vh - 75px - 43px) !important;
    border: none !important;
    overflow: auto !important;
  }
}
</style>
