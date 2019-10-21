import {
  getNotebookTreeRequest,
  createNotebookRequest,
  deleteNotebookRequest,
  updateNotebookRequest,
  createNoteRequest,
  getNoteListRequest,
  getRecycleBinNoteListRequest,
  restoreNoteRequest,
  deleteNoteRequest,
  updateNoteRequest,
  clearNoteRequest,
  getRecycleBinNoteNumRequest,
  getNoteByIdRequest
} from "../../api/home";
import {
  recursionSetTreeNode,
  recoverSetTreeNode,
  recursionSetRightKeyMenuNode,
  recursionShowNode,
  recursionDeleteNotebook,
  recursionInsertNode,
  recursionUpdateNoteNum,
  recursionUpdateNoteBook
} from "../../utils/home";
import moment from "moment";

const home = {
  state: {
    // 事项列表
    eventList: [],
    endEventList: [],
    // 废纸篓中笔记的数量
    recycleBinNoteNum: 0,
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
    // 将要更新的笔记本
    updateNotebook: {},
    // 笔记列表
    noteList: [],
    // 当前编辑笔记
    activeNote: {},
    // 当前显示模块
    activeModule: ""
  },
  mutations: {
    // 设置要更新的笔记本
    SET_UPDATE_NOTEBOOK(state, notebook) {
      state.updateNotebook = JSON.parse(JSON.stringify(notebook));
    },
    // 递归更新笔记
    UPDATE_NOTEBOOK(state, notebook) {
      recursionUpdateNoteBook(state.notebookTree, notebook);
    },
    // 废纸篓笔记数量
    SET_RECYCLE_BIN_NOTENUM(state, data) {
      state.recycleBinNoteNum = data;
    },
    // 当前选中的笔记本
    SET_ACTIVE_NOTEBOOK(state, data) {
      state.activeNotebook = data;
    },
    // 当前编辑笔记
    SET_ACTIVE_NOTE(state, data) {
      state.activeNote = JSON.parse(JSON.stringify(data));
    },
    // 设置父级节点
    SET_PARENT_NODE(state, data) {
      state.parentNode = JSON.parse(JSON.stringify(data));
    },
    SET_NOTEBOOK_TREE(state, data) {
      state.notebookTree = data;
      recursionSetTreeNode(state.notebookTree);
      // console.log(state.notebookTree)
    },
    RECOVER_NOTEBOOK_TREE(state) {
      recoverSetTreeNode(state.notebookTree);
    },
    // 设置显示右键菜单的节点
    SET_RIGHT_KEY_MENU_TREE(state, data) {
      recursionSetRightKeyMenuNode(state.notebookTree, data);
    },
    // 显示对应节点/设置选中节点
    SET_ACTIVE_NODE(state, data) {
      recursionShowNode(state.notebookTree, data);
    },
    // 删除笔记本
    DELETE_NOTEBOOK_TREE(state, _id) {
      recursionDeleteNotebook(state.notebookTree, _id);
    },
    // 插入节点
    RESERT_NODE_TREE(state, node) {
      recursionInsertNode(state.notebookTree, node);
    },
    // 更新笔记本中的笔记数量
    UPDATE_NOTEBOOK_NOTENUM(state, { notebookCode, type }) {
      recursionUpdateNoteNum(state.notebookTree, notebookCode, type);
    },
    // 设置当前显示模块
    SET_ACTIVE_MODULE(state, moduleName) {
      state.activeModule = moduleName;
    },
    // 设置笔记列表
    SET_NOTE_LIST(state, data) {
      state.noteList = data;
      // state.activeModule = 'tree'
    },
    // 显示某笔记右键菜单
    SET_NOTE_RIGHT_KEY_MENU(state, _id) {
      state.noteList.forEach(item => {
        if (item._id === _id) {
          item.rightKeyMenu = true;
        } else {
          item.rightKeyMenu = false;
        }
      });
    },
    // 添加笔记
    ADD_NOTE(state, data) {
      state.noteList.unshift(data);
    },
    // 删除笔记
    DELETE_NOTE(state, data) {
      state.recycleBinNoteNum += 1;
      let index = state.noteList.findIndex(item => {
        return item._id === data._id;
      });
      state.noteList.splice(index, 1);
      recursionUpdateNoteNum(
        state.notebookTree,
        data.notebookCode,
        "deleteNote"
      );
    },

    // 还原笔记
    RESTORE_NOTE(state, data) {
      state.recycleBinNoteNum -= 1;
      let index = state.noteList.findIndex(item => {
        return item._id === data._id;
      });
      state.noteList.splice(index, 1);
      recursionUpdateNoteNum(state.notebookTree, data.notebookCode, "addNote");
    },

    // 更新笔记
    UPDATE_NOTE(state, data) {
      let index = state.noteList.findIndex(item => {
        return item._id === data._id;
      });
      state.noteList.splice(index, 1);
      state.noteList.unshift(data);
    },

    // 永久性删除笔记
    CLEAR_NOTE(state, data) {
      let index = state.noteList.findIndex(item => {
        return item._id === data._id;
      });
      state.noteList.splice(index, 1);
    }
  },
  actions: {
    // 获取笔记本结构树
    GetNotebookTree({ commit }, data) {
      return new Promise((resolve, reject) => {
        getNotebookTreeRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit("SET_NOTEBOOK_TREE", response.data.tree);
              resolve();
              return;
            }
            reject(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 获取笔记本废纸篓笔记数量
    GetRecycleBinNoteNum({ commit }) {
      return new Promise((resolve, reject) => {
        getRecycleBinNoteNumRequest()
          .then(response => {
            let { recycleBinNoteNum } = response.data;
            commit("SET_RECYCLE_BIN_NOTENUM", recycleBinNoteNum);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 创建笔记本
    CreateNotebook({ commit }, data) {
      return new Promise((resolve, reject) => {
        createNotebookRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit("RESERT_NODE_TREE", {
                ...response.data.notebook,
                label: response.data.notebook.notebookName
              });
              resolve();
              return;
            }
            reject(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 删除笔记本
    DeleteNotebook({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteNotebookRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit("DELETE_NOTEBOOK_TREE", response.data._id);
            }
            resolve(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 更新笔记本
    UpdateNotebook({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateNotebookRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit("SET_UPDATE_NOTEBOOK", null);
              commit("UPDATE_NOTEBOOK", response.data.data);
              return resolve();
            }
            reject(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 创建笔记
    CreateNote({ commit }, data) {
      return new Promise((resolve, reject) => {
        createNoteRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit("ADD_NOTE", {
                ...response.data.note,
                createTime: moment(response.data.note.createTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                ),
                rightKeyMenu: false
              });
              commit("UPDATE_NOTEBOOK_NOTENUM", {
                notebookCode: response.data.note.notebookCode,
                type: "addNote"
              });
              commit("SET_ACTIVE_NOTE", response.data.note);
              return resolve();
            }
            reject(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 获取笔记本笔记
    GetNoteList({ commit }, data) {
      return new Promise((resolve, reject) => {
        getNoteListRequest(data)
          .then(response => {
            let { errcode, noteList } = response.data;
            if (errcode === 0) {
              commit("SET_ACTIVE_MODULE", "tree");
              noteList.forEach(item => {
                item.createTime = moment(item.createTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                item.rightKeyMenu = false;
              });
              commit("SET_NOTE_LIST", response.data.noteList);
            }
            resolve(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 获取笔记内容
    GetNoteById({ commit }, data) {
      return new Promise((resolve, reject) => {
        getNoteByIdRequest(data)
          .then(response => {
            let { errcode, note } = response.data;
            if (errcode === 0) {
              commit("SET_ACTIVE_NOTE", note);
            }
            resolve(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 更新笔记
    UpdateNote({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateNoteRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit("UPDATE_NOTE", {
                ...response.data.note,
                createTime: moment(response.data.note.createTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              });
              commit(
                "SET_ACTIVE_NOTE",
                JSON.parse(
                  JSON.stringify({
                    ...response.data.note,
                    createTime: moment(response.data.note.createTime).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  })
                )
              );
            }
            resolve(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 获取废纸篓中的数据
    GetRecycleBinNoteList({ commit }) {
      return new Promise((resolve, reject) => {
        getRecycleBinNoteListRequest()
          .then(response => {
            let { errcode, noteList } = response.data;
            if (errcode === 0) {
              commit("SET_ACTIVE_MODULE", "recycleBin");
              noteList.forEach(item => {
                item.createTime = moment(item.createTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                item.rightKeyMenu = false;
              });
              commit("SET_NOTE_LIST", noteList);
              return resolve(response.data.noteList);
            }
            reject(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 删除笔记(移入回收站)
    DeleteNote({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteNoteRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit("DELETE_NOTE", response.data.data);
              resolve();
              return;
            }
            reject(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 还原笔记(移出回收站)
    RestoreNote({ commit }, data) {
      return new Promise((resolve, reject) => {
        restoreNoteRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit("RESTORE_NOTE", data);
            }
            resolve(response.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 永久性删除笔记
    ClearNote({ dispatch, commit }, data) {
      return new Promise((resolve, reject) => {
        clearNoteRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              commit("CLEAR_NOTE", response.data);
              dispatch("GetRecycleBinNoteNum");
            }
            resolve(response.data);
          })
          .catch(err => {
            reject();
          });
      });
    }
  }
};

export default home;
