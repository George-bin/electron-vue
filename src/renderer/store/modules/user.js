import {
  loginRequest,
  registerRequest,
  logonRequest
} from "../../api/user";

const user = {
  state: {
    // 用户名
    username: ''
  },
  muations: {
    SET_USERNAME: function(state, data) {
      state.username = data
    }
  },
  actions: {
    // 用户登录
    Login ({ commit }, data) {
      return new Promise((resolve, reject) => {
        loginRequest(data)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 用户注册
    Register ({ commit }, data) {
      return new Promise((resolve, reject) => {
        registerRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              resolve(response.data)
              return
            }
            reject(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 注销登录
    Logon ({ commit }, data) {
      return new Promise((resolve, reject) => {
        logonRequest(data)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default user;
