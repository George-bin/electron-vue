<template>
  <div class="note-detail-component" @keyup.ctrl.83="handleUpdateNote">
    <header class="title-section">
      <input
        placeholder="文章标题"
        class="note-title-input"
        v-model="note.title"
        type="text"
        @keyup.enter="handleQuillFocus" />
      <select class="set-note-label" v-model="note.type">
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
import editorConfig from '../../../assets/js/editorConfig';
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
        type: 'draft', // 文章类型 draft：草稿 main：正文
        label: [], // 关联标签
        account: '', // 关联账户
        notebookId: '' // 笔记本id
      },
      oldNote: null,
      // 是否编辑编辑标题
      isEditNoteNameFlag: '',
      editorOption: editorConfig,
      serverUrl: '',
      network: {
        ip: '127.0.0.1',
        port: 10023
      },
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
    },
    // 'note.content': function(val, oldval) {
    //   if (!val || !oldval) return;
    //   if (val.substring(val.length - 11, val.length) === '<p><br></p>' && val.length < oldval.length) {
    //     let reg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    //     let str = oldval.substring(val.length - 11, oldval.length);
    //     let result = str.match(reg);
    //     if (result && result.length) {
    //       console.log(result[1]);
    //     }
    //   }
    // }
  },
  created() {},
  mounted() {
    let network = localStorage.getItem('network');
    if (network) {
      this.network = JSON.parse(network);
    }
    this.serverUrl = `http://${this.network.ip}:${this.network.port}` + '/api/blog/uploadfile';
    this.init();
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([
      'UpdateNote'
    ]),
    init() {
      this.note = JSON.parse(JSON.stringify(this.activeNote));
      $('.ql-container').css({
        height: this.isMac ? 'calc(100vh - 55px - 41px)' : 'calc(100vh - 75px - 42px)'
      });
    },

    // 主动获取焦点
    handleQuillFocus() {
      this.$refs.myQuillEditor.quill.focus();
    },

    // 更新笔记
    handleUpdateNote() {
      let note = JSON.parse(JSON.stringify(this.note));
      let quill = this.$refs.myQuillEditor.quill;
      let activeLocation = quill.getSelection().index;
      quill.setSelection(1);
      note.content = note.content.replace(
        /\<p\>\<br\>\<\/p\>\<pre/g,
        '\<pre'
      );
      note.content = note.content.replace(/src="http:\/\/39.105.55.137\/file\/uploads\/images\/blog/g, 'src="/file/uploads/images/blog');
      this.UpdateNote({
        ...note
      })
        .then(data => {
          if (data.errcode === 0) {
            this.$message({
              message: '更新了一个笔记!',
              type: 'success',
              duration: 1000
            });
          } else {
            this.$message({
              type: 'warning',
              message
            });
          }
        })
        .catch(err => {
          console.error('更新笔记失败:', err);
          this.$message({
            type: 'error',
            message: '更新笔记失败!'
          });
        })
        .finally(() => {
          quill.setSelection(activeLocation)
          this.uploadingImg = false;
        })
    },

    onUpdateSuccess() {},

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
    onEditorChange({html, editor, text}) {
      // console.log(html)
    },

    // 图片上传成功
    handleUploadImgSuccess(res) {
      this.uploadingImg = false;
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
          `http://${this.network.ip}${res.filePath}`
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
.note-detail-component {
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
      margin-left: 5px;
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
    h1, h2, h3, h4, h5, h6, h7 {
      font-weight: bold;
    }
    p {
      img {
        display: block;
        width: 400px;
        margin-top: 5px;
      }
    }
    .ql-editor ol {
      margin-left: 28px;
    }
    .ql-editor ul {
      margin-left: 14px;
    }
    .ql-editor ol, .ql-editor ul {
      margin-top: 10px;
      padding-left: 0;
    }
    .ql-editor ol li:not(.ql-direction-rtl),
    .ql-editor ul li:not(.ql-direction-rtl) {
      padding-left: 0;
    }
    .ql-editor ul > li::before {
      content: '';
      width: 8px;
      height: 8px;
      margin-left: 0;
      background: gray;
      border-radius: 50%;
    }
    .ql-editor ol > li + li,
    .ql-editor ul > li + li {
      margin-top: 6px;
    }
  }
}
</style>