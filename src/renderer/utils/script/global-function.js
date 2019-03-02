import Vue from 'vue';

// 全局函数-显示提示框
Vue.prototype.showTips = function (res) {
  let data = {};
  data.message = res.data.message;
  if (res.data.errcode === 0) {
    data.type = 'success';
  } else {
    data.type = 'fail';
  }
  this.$store.commit('showTips', data);
  this.$store.dispatch('changeTipsState');
}

