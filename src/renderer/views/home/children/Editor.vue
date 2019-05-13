<template>
  <div class="editor-content-main-component">
    <div class="button-group">
      <span class="btn-item cancel-btn" @click="cancelEditor">取消</span>
      <span class="btn-item sure-btn" @click="updateEvent">保存</span>
    </div>
    <quill-editor
      v-model="content"
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
        content: `<p>hello world</p>`,
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
        editEvent: state => state.home.editEvent
      })
    },
    mounted () {
      this.content = this.editEvent.eventData
    },
    methods: {
      ...mapMutations([
        'SET_EDIT_EVENT'
      ]),
      ...mapActions([
        'EditEvent'
      ]),
      // 更新事件
      updateEvent () {
        this.EditEvent({
          ...this.editEvent,
          eventData: this.content
        })
          .then(data => {
            this.$message({
              message: '保存成功!',
              type: 'success',
              duration: 700
            })
          })
          .catch(err => {
            if (err.errcode) {
              this.$message({
                message: err.message,
                type: 'error',
                duration: 700
              })
              return
            }
            this.$message({
              message: '网络错误!',
              type: 'error',
              duration: 700
            })
          })
      },
      // 取消编辑
      cancelEditor () {
        this.$confirm('确定取消编辑吗?', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.SET_EDIT_EVENT('')
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
    .button-group {
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      /*padding-top: 40px;*/
      text-align: right;
      .btn-item {
        cursor: pointer;
      }
      .sure-btn {
        margin-left: 10px;
        color: orange;
      }
      /*span:hover {*/
        /*color: orange;*/
      /*}*/
    }
    .ql-container {
      max-height: calc(100vh - 75px - 30px - 42px);
      border: none;
      overflow: auto;
    }
  }
</style>
