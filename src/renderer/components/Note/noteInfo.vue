<template>
  <div class="note-info-component" @keyup.ctrl.83="handleSaveNote">
    <header class="title-section">
      <input
        placeholder="文章标题"
        class="note-title-input"
        v-model="note.title"
        type="text"
        @keyup.enter="handleQuillFocus" />
      <select class="set-note-label" v-model="note.label">
        <option value="main" selected>正文</option>
        <option value="draft">草稿</option>
      </select>
    </header>
    <div>
      <!-- 图片上传组件 start -->
      <el-upload
        v-show="false"
        class="avatar-uploader"
        :action="serverUrl"
        name="img"
        :show-file-list="false"
        :on-success="handleUploadImgSuccess"
        :on-error="handleUploadImgError"
        :before-upload="handleBeforeUploadImg"
      ></el-upload>
      <!-- 图片上传组件 end -->
      <el-row v-loading="uploadingImg">
        <quill-editor
          v-model="note.content"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        ></quill-editor>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import editorConfig from '../../assets/js/editorConfig';
export default {
  components: {},
  data() {
    return {
      note: {
        title: '', // 笔记标题
        content: '', // 笔记内容
        status: 1, // 笔记状态 0：未完成 1：已完成 2：进入回收站
        createTime: null, // 创建时间
        updateTime: null, // 更新时间
        label: 'draft', // 关联标签 draft：草稿 main：正文
        account: '', // 关联账户
        notebookId: '' // 笔记本id
      },
      oldNote: null,
      // 是否编辑编辑标题
      isEditNoteNameFlag: '',
      editorOption: editorConfig,
      serverUrl: '',
      uploadingImg: '',
      // 当前光标位置
      activeLocation: 0,
      // 富文本对象
      quill: null,
      // 是否获得焦点
      quillFocusFlag: false
    }
  },
  computed: {
    ...mapState({
      isMac: state => state.home.isMac,
      activeNote: state => state.note.activeNote
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
  created() {
  },
  mounted() {
    this.serverUrl = localStorage.getItem('baseUrl') + '/api/blog/uploadfile';
    this.quill = this.$refs.myQuillEditor.quill;
    this.init();
    this.$nextTick(() => {
      this.$on('updateSuccess', () => {
        this.quill.setSelection(this.activeLocation)
        this.uploadingImg = false;
      })
      this.$on('updateFail', () => {
        this.quill.setSelection(this.activeLocation)
        this.uploadingImg = false;
      })
    })
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([]),
    init() {
      $('.ql-container').css({
        height: this.isMac ? 'calc(100vh - 55px - 41px)' : 'calc(100vh - 75px - 42px)'
      });
    },

    // 主动获取焦点
    handleQuillFocus() {
      this.$refs.myQuillEditor.quill.focus();
    },

    // 保存笔记
    handleSaveNote() {
      let { path } = this.$route;
      // 保存当前文档内容，避免操作失败
      this.oldNote = JSON.parse(JSON.stringify(this.note));
      if (this.quillFocusFlag) {
        this.activeLocation = this.quill.getSelection().index;
      }
      if (path === '/home/createNote') {
        this.$emit('createNote', this.note)
      } else {
        this.$emit('updateNote', this.note)
      }
    },

    onUpdateSuccess() {

    },

    // 失去焦点事件
    onEditorBlur(event) {
      this.quillFocusFlag = false;
      // console.log(this.content)
    },

    // 获得焦点事件
    onEditorFocus() {
      this.quillFocusFlag = true;
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
        // console.log('图片地址:', `${baseUrl}${res.filePath}`)
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
.note-info-component {
  .title-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 54px !important;
    padding: 0 5px;
    border-bottom: 1px solid #cccccc;
    text-align: right;
    background: #ffffff !important;
    .note-title-input {
      flex: 1;
      height: 36px;
      line-height: 36px;
      padding: 0 5px;
      border: none;
      border-bottom: 1px solid #f1f1f1;
      outline: none;
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
    // height: calc(100vh - 75px - 42px) !important;
    border: none !important;
    overflow: auto !important;
  }
}
</style>
