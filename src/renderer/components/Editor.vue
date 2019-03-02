<template>
  <div>
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)">
    </quill-editor>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: null,
      editorOption: {
        modules:{
          toolbar:[
            ['bold', 'italic', 'underline', 'strike'], // 字体样式
            ['blockquote', 'code-block'] // 代码编写
          ]
        }
      }
    }
  },
  methods: {
    // 失去焦点事件
    onEditorBlur () {},
    // 获得焦点事件
    onEditorFocus () {},
    // 内容改变事件
    onEditorChange () {}
  }
}
</script>

<style>

</style>
