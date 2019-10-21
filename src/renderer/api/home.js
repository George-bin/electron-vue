import { request } from "../utils/request";

// 获取笔记本结构树
export function getNotebookTreeRequest(data) {
  return request({
    url: `/getNotebookTree`,
    method: "get",
    params: data
  });
}

// 获取笔记本废纸篓笔记数量
export function getRecycleBinNoteNumRequest() {
  return request({
    url: "/getRecycleBinNoteNum",
    method: "get"
  });
}

// 创建笔记本
export function createNotebookRequest(data) {
  return request({
    url: "/createNotebook",
    method: "post",
    data: data
  });
}

// 创建笔记
export function createNoteRequest(data) {
  return request({
    url: "/createNote",
    method: "post",
    data: data
  });
}

// 删除笔记本
export function deleteNotebookRequest(data) {
  return request({
    url: "/deleteNotebook",
    method: "post",
    data: data
  });
}

// 更新笔记本
export function updateNotebookRequest(data) {
  return request({
    url: `/updateNotebook/${data._id}`,
    method: "put",
    data: data
  });
}

// 获取笔记列表
export function getNoteListRequest(data) {
  return request({
    url: "/getNoteListByClassify",
    method: "get",
    params: data
  });
}

// 获取笔记内容
export function getNoteByIdRequest(data) {
  return request({
    url: `/getNoteById`,
    params: {
      _id: data
    }
  });
}

// 更新笔记
export function updateNoteRequest(data) {
  return request({
    url: `/updateNote/${data._id}`,
    method: "put",
    data: data
  });
}

// 获取废纸篓数据
export function getRecycleBinNoteListRequest() {
  return request({
    url: "/getRecycleBinNoteList",
    method: "get"
  });
}

// 还原笔记
export function restoreNoteRequest(data) {
  return request({
    url: `/restoreNote/${data._id}`,
    method: "put",
    data: data
  });
}

// 永久性删除笔记
export function clearNoteRequest(data) {
  return request({
    url: `/clearNote/${data._id}`,
    method: "put",
    data: data
  });
}

// 删除(移入回收站)
export function deleteNoteRequest(data) {
  return request({
    url: `/deleteNote/${data._id}`,
    method: "put",
    data: data
  });
}
