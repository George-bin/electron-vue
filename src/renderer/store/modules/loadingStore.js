
const loading = {
  state: {
    loadingShow: false // 控制加载动画显示/隐藏
  },
  mutations: {
    // 显示加载动画
    showLoading (state) {
      state.loadingShow = true;
    },
    // 隐藏加载动画
    hideLoading (state) {
      state.loadingShow = false;
    }
  }
}

export default loading
