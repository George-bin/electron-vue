import {
  addEventRequest,
  getEventListRequest
} from "../../api/home";

const home = {
  state: {
    // 事项列表
    eventList: []
  },
  mutations: {
    SET_EVENT_LIST (state, data) {
      state.eventList = data
    }
  },
  actions: {
    // 新增事项
    AddEvent ({ commit }, data) {
      return new Promise((resolve, reject) => {
        addEventRequest(data)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取事项列表
    GetEventList ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getEventListRequest(data)
          .then(response => {
            if (response.data.errcode === 0) commit('SET_EVENT_LIST', response.data.eventList)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default home;
