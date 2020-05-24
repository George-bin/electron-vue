import {
  createNoteRequest,
  getNoteListRequest,
  getRecycleBinNoteListRequest,
  restoreNoteRequest,
  deleteNoteRequest,
  updateNoteRequest,
  clearNoteRequest,
  getNoteByIdRequest
} from '../../api/home'
import {
  recursionUpdateNoteNum
} from '../../utils/home'
import moment from 'moment'

const note = {
  state: {
    // 笔记列表
    noteList: [],
    // 当前编辑笔记
    activeNote: {},
    // 右键菜单位置
    noteRightMenuPosition: null
  },
  mutations: {
    SET_NOTE_RIGHT_MENU_POSITION(state, data) {
      state.noteRightMenuPosition = data
    },
    // 设置笔记列表
    SET_NOTE_LIST(state, data) {
      state.noteList = data
    },
    // 当前编辑笔记
    SET_ACTIVE_NOTE(state, data) {
      state.activeNote = JSON.parse(JSON.stringify(data))
    },
    // 添加笔记
    ADD_NOTE(state, data) {
      state.noteList.unshift(data)
    },
    // 删除笔记
    DELETE_NOTE(state, data) {
      let { note, notebookTree } = data
      let index = state.noteList.findIndex(item => {
        return item._id === note._id
      })
      state.noteList.splice(index, 1)
      recursionUpdateNoteNum(
        notebookTree,
        note.notebookId,
        'deleteNote'
      )
    },
    // 直接删除笔记
    CLEAR_NOTE(state, data) {
      let { note, notebookTree } = data
      let index = state.noteList.findIndex(item => {
        return item._id === note._id
      })
      state.noteList.splice(index, 1)
      recursionUpdateNoteNum(
        notebookTree,
        note.notebookId,
        'deleteNote'
      )
    },
    // 还原笔记
    RESTORE_NOTE(state, data) {
      let { note, notebookTree } = data
      let index = state.noteList.findIndex(item => {
        return item._id === note._id
      })
      state.noteList.splice(index, 1)
      recursionUpdateNoteNum(notebookTree, note.notebookId, 'addNote')
    },
    // 更新笔记
    UPDATE_NOTE(state, data) {
      let index = state.noteList.findIndex(item => {
        return item._id === data._id
      })
      state.noteList.splice(index, 1)
      state.noteList.unshift(data)
    }
  },
  actions: {
    // 创建笔记
    CreateNote({ commit }, data) {
      return new Promise((resolve, reject) => {
        createNoteRequest(data)
          .then(res => {
            let {errcode, note} = res.data
            if (errcode === 0) {
              note = JSON.parse(JSON.stringify(note))
              let { notebookId } = note
              commit('ADD_NOTE', {
                ...note,
                rightKeyMenu: false
              })
              commit('UPDATE_NOTEBOOK_NOTENUM', {
                notebookId: notebookId,
                type: 'addNote'
              })
              note.content = note.content.replace(/src="\/file\/uploads\/images\/blog/g, 'src="http://39.105.55.137/file/uploads/images/blog')
              commit('SET_ACTIVE_NOTE', note)
            }
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取笔记本笔记
    GetNoteList({ commit }, data) {
      return new Promise((resolve, reject) => {
        getNoteListRequest(data)
          .then(res => {
            let { errcode, noteList } = res.data
            if (errcode === 0) {
              commit('SET_ACTIVE_MODULE', 'tree')
              noteList.forEach(item => {
                item.rightKeyMenu = false
              })
              commit('SET_NOTE_LIST', noteList)
            }
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取笔记内容
    GetNoteById({ commit }, data) {
      return new Promise((resolve, reject) => {
        getNoteByIdRequest(data)
          .then(res => {
            let { data } = res
            if (data.errcode === 0) {
              let note = JSON.parse(JSON.stringify(data.note))
              let str =  note.content.replace(/src="\/file\/uploads\/images\/blog/g, 'src="http://39.105.55.137/file/uploads/images/blog')
              note.content = str
              commit('SET_ACTIVE_NOTE', note)
            }
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 更新笔记
    UpdateNote({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateNoteRequest(data)
          .then(res => {
            let { errcode, note } = res.data;
            if (errcode === 0) {
              note = JSON.parse(JSON.stringify(note));
              note.content =  note.content.replace(/src="\/file\/uploads\/images\/blog/g, 'src="http://39.105.55.137/file/uploads/images/blog');
              commit('UPDATE_NOTE', JSON.parse(JSON.stringify(note)));
              commit('SET_ACTIVE_NOTE', JSON.parse(JSON.stringify(note)));
            }
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          })
      })
    },
    // 更新笔记属性：type、img、introduction等
    UpdateNoteAttr({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateNoteRequest(data)
          .then(res => {
            let { errcode, note } = res.data;
            if (errcode === 0) {
              commit('UPDATE_NOTE', JSON.parse(JSON.stringify(note)));
            }
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          })
      })
    },
    // 获取废纸篓中的数据
    GetRecycleBinNoteList({ commit }) {
      return new Promise((resolve, reject) => {
        getRecycleBinNoteListRequest()
          .then(res => {
            let { errcode, noteList } = res.data
            if (errcode === 0) {
              commit('SET_ACTIVE_MODULE', 'recycleBin')
              noteList.forEach(item => {
                item.createTime = moment(item.createTime).format(
                  'YYYY-MM-DD HH:mm:ss'
                )
                item.rightKeyMenu = false
              })
              commit('SET_NOTE_LIST', noteList)
            }
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除笔记(移入回收站)
    DeleteNote({ commit, rootState }, data) {
      return new Promise((resolve, reject) => {
        deleteNoteRequest(data)
          .then(res => {
            let { errcode, note } = res.data
            if (errcode === 0) {
              commit('DELETE_NOTE', {
                note,
                notebookTree: rootState.notebook.notebookTree
              })
            }
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 还原笔记(移出回收站)
    RestoreNote({ commit, rootState }, data) {
      return new Promise((resolve, reject) => {
        restoreNoteRequest(data)
          .then(res => {
            let { errcode, note } = res.data
            console.log(rootState)
            if (errcode === 0) {
              commit('RESTORE_NOTE', {
                note,
                notebookTree: rootState.notebook.notebookTree
              })
            }
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 永久性删除笔记
    ClearNote({ dispatch, commit, rootState }, data) {
      let { note, type } = data;
      return new Promise((resolve, reject) => {
        clearNoteRequest(note._id)
          .then(res => {
            let { errcode } = res.data
            if (errcode === 0) {
              commit('CLEAR_NOTE', {
                note,
                notebookTree: rootState.notebook.notebookTree
              })
            }
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default note;