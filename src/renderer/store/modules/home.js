import {
  getNotebookTreeRequest,
  createNotebookRequest,
  deleteNotebookRequest,
  createNoteRequest,
  getNoteListRequest,
  addEventRequest,
  getEventListRequest,
  getEventListForRecycleBinRequest,
  deleteNoteRequest,
  endEventRequest,
  destoryEventRequest,
  outInRecycleBinRequest,
  addToNoEndEventRequest,
  updateNoteRequest
} from "../../api/home";
import {
  recursionSetTreeNode,
  recoverSetTreeNode,
  recursionSetRightKeyMenuNode,
  recursionShowNode,
  recursionDeleteNotebook,
  recursionInsertNode,
  recursionUpdateNoteNum
} from '../../utils/home'
import moment from 'moment'

const home = {
  state: {
    // 事项列表
    eventList: [],
    endEventList: [],
    recycleBinList: [],
    // 当前编辑事件
    editEvent: {},
    // 显示左侧导航
    showLeftMenuFlag: true,
    // 笔记本树结构
    notebookTree: [],
    // 创建笔记本的父级节点
    parentNode: null,
    // 当前选中的笔记本
    activeNotebook: {},
    // 笔记列表
    noteList: [],
    // 当前编辑笔记
    activeNote: {}
  },
  mutations: {
    // 当前选中的笔记本
    SET_ACTIVE_NOTEBOOK (state, data) {
      state.activeNotebook = data
    },
    // 当前编辑笔记
    SET_ACTIVE_NOTE (state, data) {
      state.activeNote = JSON.parse(JSON.stringify(data))
    },
    SET_PARENT_NODE (state, data) {
      state.parentNode = JSON.parse(JSON.stringify(data))
    },
    SET_NOTEBOOK_TREE (state, data) {
      state.notebookTree = data
      recursionSetTreeNode(state.notebookTree)
      console.log(state.notebookTree)
    },
    RECOVER_NOTEBOOK_TREE (state) {
      recoverSetTreeNode(state.notebookTree)
    },
    // 设置显示右键菜单的节点
    SET_RIGHT_KEY_MENU_TREE (state, data) {
      recursionSetRightKeyMenuNode(state.notebookTree, data)
    },
    // 显示对应节点/设置选中节点
    SET_ACTIVE_NODE (state, data) {
      recursionShowNode(state.notebookTree, data)
    },
    // 删除笔记本
    DELETE_NOTEBOOK_TREE (state, _id) {
      recursionDeleteNotebook(state.notebookTree, _id)
    },
    // 插入节点
    RESERT_NODE_TREE (state, node) {
      recursionInsertNode(state.notebookTree, node)
    },
    // 更新笔记本中的笔记数量
    UPDATE_NOTEBOOK_NOTENUM (state, { notebookCode, type }) {
      recursionUpdateNoteNum(state.notebookTree, notebookCode, type)
    },
    // 设置笔记列表
    SET_NOTE_LIST (state, data) {
      data.forEach(item => {
        item.createTime = moment(item.createTime).format('YYYY/MM/DD')
      })
      state.noteList = data
    },
    // 添加笔记
    ADD_NOTE (state, data) {
      state.noteList.push(data)
    },
    // 删除笔记
    DELETE_NOTE (state, _id) {
      let index = state.noteList.findIndex(item => {
        return item._id === _id
      })
      state.noteList.splice(index, 1)
    },
    // 获取到事件列表后，分配给各个列表
    SET_ALL_EVENT_LIST (state, data) {
      state.eventList = data.noEndEvent.list.filter(item => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        return item
      })
      state.endEventList = data.endEvent.list.filter(item => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        return item
      })
      state.recycleBinList = data.recycleBin.list.filter(item => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        return item
      })
    },
    SET_SHOW_LEFT_MENU_FLAG (state, data) {
      state.showLeftMenuFlag = data
    },
    SET_EVENT_LIST (state, data) {
      state.eventList = data
    },
    SET_RECYCLE_EVENT_LIST (state, data) {
      state.recycleBinList = data
    },
    ADD_EVENT (state, data) {
      state.eventList.unshift(data)
    },
    // 从完成移至未完成
    ADD_EVENT_FROM_END (state, data) {
      let index = state.endEventList.findIndex(item => {
        return item._id === data._id
      })
      state.endEventList.splice(index, 1)
      state.eventList.push(data)
    },
    // 设置完成事件
    SET_END_EVENT (state, data) {
      state.endEventList = data
    },
    // 添加到完成事件
    ADD_EVENT_END (state, data) {
      let index = state.eventList.findIndex(item => {
        return item._id === data._id
      })
      state.eventList.splice(index, 1)
      state.endEventList.push(data)
    },
    // 更新笔记
    UPDATE_NOTE (state, data) {
      let index = state.noteList.findIndex(item => {
        return item._id === data._id
      })
      state.noteList.splice(index, 1, data)
    },
    DELETE_EVENT_RECYCLE (state, data) {
      let index = state.recycleBinList.findIndex(item => {
        return item._id === data._id
      })
      state.recycleBinList.splice(index, 1)
      state.eventList.push(data)
    },
    DELETE_EVENT (state, _id) {
      state.eventList.forEach((item, index) => {
        if (item._id === _id) {
          state.eventList.splice(index, 1)
        }
      })
    },
    DELETE_EVENT_TO_RECYCLE (state, _id) {
      let index = state.recycleBinList.findIndex(item => {
        return item._id === _id
      })
      if (index > -1) {
        state.recycleBinList.splice(index, 1)
      }
    }
  },
  actions: {
    // 获取笔记本结构树
    GetNotebookTree ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getNotebookTreeRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit('SET_NOTEBOOK_TREE', response.data.tree)
              resolve()
              return
            }
            reject(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 创建笔记本
    CreateNotebook ({ commit }, data) {
      return new Promise((resolve, reject) => {
        createNotebookRequest(data)
          .then(response => {
             if (response.data.errcode === 0) {
               commit('RESERT_NODE_TREE', {
                 ...response.data.notebook,
                 label: response.data.notebook.notebookName
               })
               resolve()
               return
             }
             reject(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除笔记本
    DeleteNotebook ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteNotebookRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit('DELETE_NOTEBOOK_TREE', response.data._id)
              resolve()
              return
            }
            reject(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 创建笔记
    CreateNote ({ commit }, data) {
      return new Promise((resolve, reject) => {
        createNoteRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit('ADD_NOTE', response.data.note)
              commit('UPDATE_NOTEBOOK_NOTENUM', {notebookCode: response.data.note.notebookCode, type: 'addNote'})
              return resolve()
            }
            reject(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取笔记本笔记
    GetNoteList ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getNoteListRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit('SET_NOTE_LIST', response.data.noteList)
              return resolve()
            }
            reject(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 更新笔记
    UpdateNote ({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateNoteRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit('UPDATE_NOTE', {
                ...response.data.note,
                createTime: moment(response.data.note.createTime).format('YYYY/MM/DD')
              })
              commit('SET_ACTIVE_NOTE', JSON.parse(JSON.stringify({
                ...response.data.note,
                createTime: moment(response.data.note.createTime).format('YYYY/MM/DD')
              })))
              return resolve()
            }
            reject(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 新增事项
    AddEvent ({ commit }, data) {
      return new Promise((resolve, reject) => {
        addEventRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit('ADD_EVENT', response.data.event)
              resolve()
              return
            }
            reject()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 从完成移至未完成
    AddToNoEndEvent ({ commit }, data) {
      return new Promise((resolve, reject) => {
        addToNoEndEventRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit('ADD_EVENT_FROM_END', response.data.event)
              resolve()
              return
            }
            reject(response.data)
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
            if (response.data.errcode === 0) {
              commit('ADD_EVENT_END', response.data.event)
              resolve()
              return
            }
            reject(response.data)
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
            if (response.data.errcode === 0) {
              commit('SET_ALL_EVENT_LIST', response.data.event)
              resolve()
              return
            }
            reject(response.data)
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
    // 删除笔记(移入回收站)
    DeleteNote ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteNoteRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit('DELETE_NOTE', response.data._id)
              resolve()
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
              resolve()
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
              resolve()
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
