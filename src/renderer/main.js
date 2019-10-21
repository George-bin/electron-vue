import Vue from "vue";
import axios from "axios";

import App from "./App";
import router from "./router";
import store from "./store";

import VueQuillEditor from "vue-quill-editor";
// require styles 引入样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// 代码高亮
import "highlight.js/styles/xcode.css";

// 引入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

// 引入全局函数
import "./utils/script/global-function";

// 引入css文件
import "../../static/css/index.css";
import $ from "jquery";

Vue.use(VueQuillEditor);
Vue.prototype.moment = require("moment");

// 以web形式渲染，打包需注释
// process.env.IS_WEB = 'web'

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>"
}).$mount("#app");
