import { request } from "../utils/request";

// 获取笔记本结构树
export function getNotebookTreeRequest(data) {
  return request({
    url: `/notebook`,
    method: "get",
    params: data
  });
}

// 创建笔记本
export function createNotebookRequest(data) {
  return request({
    url: "/notebook",
    method: "post",
    data: data
  });
}

// 创建笔记
export function createNoteRequest(data) {
  return request({
    url: "/note",
    method: "post",
    data: data
  })
}

// 删除笔记本
export function deleteNotebookRequest(id) {
  return request({
    url: `/notebook/${id}`,
    method: "delete"
  })
}

// 更新笔记本
export function updateNotebookRequest(data) {
  return request({
    url: `/notebook`,
    method: "put",
    data: data
  });
}

// 获取笔记列表
export function getNoteListRequest(id) {
  return request({
    url: `/notelist/${id}`,
    method: "get"
  });
}

// 获取笔记内容
export function getNoteByIdRequest(id) {
  return request({
    url: `/note/${id}`,
  });
}

// 更新笔记
export function updateNoteRequest(data) {
  return request({
    url: `/note`,
    method: "put",
    data: data
  });
}

// 获取废纸篓数据
export function getRecycleBinNoteListRequest() {
  return request({
    url: "/trash",
    method: "get"
  });
}

// 还原笔记
export function restoreNoteRequest(_id) {
  return request({
    url: `/noteToNotebook/${_id}`,
    method: "put"
  });
}

// 永久性删除笔记
export function clearNoteRequest(_id) {
  return request({
    url: `/note/${_id}`,
    method: "delete"
  });
}

// 删除笔记(移入回收站)
export function deleteNoteRequest(_id) {
  return request({
    url: `/noteToTrash/${_id}`,
    method: "put"
  });
}
