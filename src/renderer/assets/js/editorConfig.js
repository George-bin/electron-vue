import hljs from "highlight.js";

export default {
  // placeholder: "",
  theme: "snow", // or 'bubble'
  modules: {
    toolbar: {
      // 工具栏
      container: [
        // 字体样式
        ["bold", "italic", "underline", "strike"],
        // 代码编写
        ["blockquote", "code-block"],
        // 标题，键值对的形式；1、2表示字体大小
        // [{ header: 1 }, { header: 2 }, { header: 4 }],
        // 几级标题
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        // 字体颜色，字体背景颜色
        [{ color: [] }, { background: [] }],
        // [{ size: ["small", false, "large", "huge"] }], // 字体大小
        // 列表
        [{ list: "ordered" }, { list: "bullet" }],
        // 上下标
        [{ script: "sub" }, { script: "super" }],
        // 缩进
        [{ indent: "-1" }, { indent: "+1" }],
        // 对齐方式
        [{ align: [] }],
        ["image"] // ["link", "image", "video"]
        // 字体
        // [{ font: ["Microsoft YaHei", "Arial", "黑体", "宋体"] }],
      ],
      handlers: {
        image: function(value) {
          if (value) {
            // 触发input框选择图片文件
            document.querySelector(".avatar-uploader input").click();
          } else {
            this.quill.format("image", false);
          }
        }
      }
    },
    syntax: {
      highlight: text => {
        return hljs.highlightAuto(text).value; // 这里就是代码高亮需要配置的地方
      }
    }
  }
};
