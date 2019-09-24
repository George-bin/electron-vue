export default [
  // 字体样式
  ["bold", "italic", "underline", "strike"],
  // 代码编写
  ["blockquote", "code-block"],
  // 标题，键值对的形式；1、2表示字体大小
  // [{ 'header': 1 }, { 'header': 2 }],
  // 几级标题
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  // 字体颜色，字体背景颜色
  [{ color: [] }, { background: [] }],
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
];
