
const home = {
  state: {
    isMac: false,
    // 当前显示模块
    activeModule: ''
  },
  mutations: {
    SET_ISMAC(state, data) {
      state.isMac = data
    },
    // 设置当前显示模块
    SET_ACTIVE_MODULE(state, moduleName) {
      state.activeModule = moduleName
    }
  },
  actions: {}
}

export default home
