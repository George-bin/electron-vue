import {
  addEventRequest,
  getEventListRequest,
  getEventListForRecycleBinRequest,
  addRecycleBinRequest,
  endEventRequest,
  destoryEventRequest,
  outInRecycleBinRequest
} from "../../api/home";

const home = {
  state: {
    // 事项列表
    eventList: [],
    endEventList: [],
    eventlistForRecycleBin: [],
    activePage: '/home/addEvent'
  },
  mutations: {
    SET_EVENT_LIST (state, data) {
      state.eventList = data
    },
    SET_RECYCLE_EVENT_LIST (state, data) {
      state.eventlistForRecycleBin = data
    },
    ADD_EVENT (state, data) {
      state.eventList.unshift(data)
    },
    ADD_EVENT_RECYCLE (state, data) {
      let index = state.eventList.findIndex(item => {
        return item._id === data._id
      })
      state.eventList.splice(index, 1)
      data.status = 2;
      state.eventlistForRecycleBin.push(data)
    },
    // 设置完成事件
    SET_END_EVENT (state, data) {
      state.endEventList = data
    },
    // 添加到完成事件
    ADD_EVENT_END (state, data) {
      state.endEventList.push(data)
    },
    UPDATE_EVENT (state, data) {
      state.eventList.forEach((item, index) => {
        if (item._id === data._id) {
          state.eventList[index].status = data.status
        }
      })
    },
    DELETE_EVENT_RECYCLE (state, data) {
      let index = state.eventlistForRecycleBin.findIndex(item => {
        return item._id === data._id
      })
      state.eventlistForRecycleBin.splice(index, 1)
    },
    DELETE_EVENT (state, _id) {
      state.eventList.forEach((item, index) => {
        if (item._id === _id) {
          state.eventList.splice(index, 1)
        }
      })
    },
    DELETE_EVENT_TO_RECYCLE (state, _id) {
      let index = state.eventlistForRecycleBin.findIndex(item => {
        return item._id === _id
      })
      if (index > -1) {
        state.eventlistForRecycleBin.splice(index, 1)
      }
    }
  },
  actions: {
    // 新增事项
    AddEvent ({ commit }, data) {
      return new Promise((resolve, reject) => {
        addEventRequest(data)
          .then(response => {
            if (response.data.errcode === 0) commit('ADD_EVENT', response.data.event)
            resolve(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 完成事件
    EndEvent ({ commit }, data) {
      return new Promise((resolve, reject) => {
        endEventRequest(data)
          .then(response => {
            if (response.data.errcode === 0) commit('ADD_EVENT', response.data.event)
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
    },
    // 获取某天完成的事件列表
    GetEventListToEnd (data) {
      return new Promise((resolve, reject) => {
        getEventListToEndRequest(data)
          .then(response => {
            // if (response.data.errcode === 0)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取回收站事项列表
    GetEventListForRecycle ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getEventListForRecycleBinRequest(data)
          .then(response => {
            if (response.data.errcode === 0) commit('SET_RECYCLE_EVENT_LIST', response.data.eventList)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除(移入回收站)
    AddRecycleBin ({ commit }, data) {
      return new Promise((resolve, reject) => {
        addRecycleBinRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit('ADD_EVENT_RECYCLE', response.data.event)
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
    // 销毁事件
    DestoryEvent ({ commit }, data) {
      return new Promise((resolve, reject) => {
        destoryEventRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit('DELETE_EVENT_TO_RECYCLE', response.data._id)
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
    // 移出回收站
    OutInRecycleBin ({ commit }, data) {
      return new Promise((resolve, reject) => {
        outInRecycleBinRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit('DELETE_EVENT_RECYCLE', response.data.event)
              resolve(response.data)
              return
            }
            reject(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default home;
