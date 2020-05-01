import {
  getNotebookTreeRequest,
  createNotebookRequest,
  deleteNotebookRequest,
  updateNotebookRequest,
} from '../../api/home'
import {
  recursionSetTreeNode,
  recursionShowNode,
  recursionDeleteNotebook,
  recursionInsertNode,
  recursionUpdateNoteNum,
  recursionUpdateNoteBook
} from '../../utils/home'
const notebook = {
  state: {
    // 右键菜单位置
    notebookRightMenuPosition: null,
    // 当前操作笔记本
    activeNotebook: {},
    // 笔记本树结构
    notebookTree: []
  },
  mutations: {
    // 设置笔记本右键菜单
    SET_RIGHT_MENU_POSITION(state, data) {
      state.notebookRightMenuPosition = data
    },
    // 当前选中的笔记本
    SET_ACTIVE_NOTEBOOK(state, data) {
      state.activeNotebook = data
    },
    // 递归更新笔记
    UPDATE_NOTEBOOK(state, notebook) {
      recursionUpdateNoteBook(state.notebookTree, notebook)
    },
    // 递归设置树节点
    SET_NOTEBOOK_TREE(state, data) {
      state.notebookTree = data
      recursionSetTreeNode(state.notebookTree)
      // console.log(state.notebookTree)
    },
    // 显示对应节点/设置选中节点
    SET_ACTIVE_NODE(state, data) {
      recursionShowNode(state.notebookTree, data)
    },
    // 删除笔记本
    DELETE_NOTEBOOK_TREE(state, _id) {
      recursionDeleteNotebook(state.notebookTree, _id)
    },
    // 插入节点
    RESERT_NODE_TREE(state, node) {
      recursionInsertNode(state.notebookTree, node)
    },
    // 更新笔记本中的笔记数量
    UPDATE_NOTEBOOK_NOTENUM(state, { notebookId, type }) {
      recursionUpdateNoteNum(state.notebookTree, notebookId, type)
    }
  },
  actions: {
    // 获取笔记本结构树
    GetNotebookTree({ commit }, data) {
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
    CreateNotebook({ commit }, data) {
      return new Promise((resolve, reject) => {
        createNotebookRequest(data)
          .then(res => {
            let { errcode, notebook } = res.data;
            if (errcode === 0) {
              commit('RESERT_NODE_TREE', {
                ...notebook
              });
            }
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          })
      })
    },
    // 删除笔记本
    DeleteNotebook({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteNotebookRequest(data)
          .then(res => {
            let { data } = res
            if (data.errcode === 0) {
              commit('DELETE_NOTEBOOK_TREE', data._id)
            }
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 更新笔记本
    UpdateNotebook({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateNotebookRequest(data)
          .then(res => {
            let { data } = res
            if (data.errcode === 0) {
              commit('UPDATE_NOTEBOOK', data.notebook)
            }
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
  }
}

export default notebook;
