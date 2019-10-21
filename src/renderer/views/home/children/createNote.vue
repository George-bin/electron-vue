<template>
  <div class="create-note-main-component" @keyup.ctrl.83="handleCreateNote">
    <el-header class="title-section">
      <input
        placeholder="标题"
        class="note-title-input"
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
    <div class>
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
      <el-row v-loading="uploadingImg">
        <quill-editor
          v-model="note.noteContent"
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
import { mapState, mapMutations, mapActions } from "vuex";
import editorConfig from "../../../assets/js/editorConfig";
export default {
  data() {
    return {
      note: {
        noteName: "",
        noteContent: "",
        noteLabel: "draft"
      },
      // 是否编辑编辑标题
      isEditNoteNameFlag: "",
      editorOption: editorConfig,
      serverUrl: "",
      uploadingImg: ""
    };
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
        this.content = val.eventData;
      },
      deep: true
    }
  },
  created() {
    // debugger
    console.log(this.$route.params);
  },
  mounted() {
    this.serverUrl = localStorage.getItem("baseUrl") + "/api/blog/uploadfile";
    this.content = this.editEvent.eventData;
  },
  methods: {
    ...mapMutations(["SET_ACTIVE_NOTE"]),

    ...mapActions(["CreateNote"]),

    onFocus() {
      this.isEditNoteNameFlag = true;
    },

    onBlur() {
      this.isEditNoteNameFlag = false;
    },

    // 创建笔记
    handleCreateNote() {
      this.CreateNote({
        noteName: this.note.noteName,
        noteContent: this.note.noteContent,
        noteLabel: this.note.noteLabel,
        notebookName: this.activeNotebook.notebookName,
        username: localStorage.getItem("username"),
        notebookCode: this.activeNotebook.notebookCode,
        status: 0,
        flag: "note",
        noteNum: this.activeNotebook.noteNum
      })
        .then(data => {
          this.$message({
            message: "笔记创建成功!",
            type: "success",
            duration: 1500
          });
          this.$router.push("/home/noteDetail");
        })
        .catch(err => {
          if (err.errcode) {
            this.$message({
              message: err.message,
              type: "error",
              duration: 1500
            });
            return;
          }
          this.$message({
            message: "网络错误!",
            type: "error",
            duration: 1500
          });
        });
    },

    // 取消编辑
    cancelEditor() {
      this.$confirm("确定取消编辑吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.$router.back();
        })
        .catch(() => {});
    },

    // 失去焦点事件
    onEditorBlur(event) {
      console.log(this.content);
    },

    // 获得焦点事件
    onEditorFocus() {},

    // 内容改变事件
    onEditorChange() {},

    // 图片上传成功
    handleUploadImgSuccess(res) {
      this.uploadingImg = false;
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.errcode === 0 && res.filePath) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        // console.log("图片地址:", `${baseUrl}${res.filePath}`);
        quill.insertEmbed(
          length,
          "image",
          `http://${
            process.env.NODE_ENV === "production"
              ? "39.105.55.137"
              : location.hostname
          }${res.filePath}`
        );
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
    },

    // 图片上传失败
    handleUploadImgError() {
      this.uploadingImg = false;
      this.$message({
        type: "error",
        message: "图片上传失败!"
      });
    },

    // 上传图片之前
    handleBeforeUploadImg() {
      this.uploadingImg = true;
    }
  }
};
</script>

<style lang="scss">
.create-note-main-component {
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
    height: calc(100vh - 75px - 42px) !important;
    border: none !important;
    overflow: auto !important;
  }
}
</style>
