const state = {
  resState: 'normal', // 操作状态：success error normal
  resMessage: '', // 操作状态服务器返回信息
  stateTemplateShow: false, // 控制状态组件显示
}

const mutations = {
  // 显示提示
  showTips (state, data) {
    state.stateTemplateShow = true;
    state.resMessage = data.message;
    if (data.type === 'success') {
      state.resState = 'success';
      return;
    }
    state.resState = 'fail';
  },

  // 隐藏提示
  hiddenTips (state) {
    state.stateTemplateShow = false;
    state.resState = 'normal';
    state.resMessage = '';
  }
}

const actions = {
  changeTipsState (context) {
    setTimeout(() => {
      context.commit('hiddenTips');
    }, 1500);
  }
}

export default {
  state,
  mutations,
  actions
}