import {
  login
} from '../../api/login'

const loginStore = {
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
    Login: function({ commit }, data) {
      return new Promise((resolve, reject) => {
        login(data)
          .then(response => {
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default loginStore
