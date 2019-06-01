import request from '../utils/request'

// 获取笔记本结构树
export function getNotebookTreeRequest (data) {
  return request({
    url: `/getNotebookTree`,
    method: 'get',
    params: data
  })
}

// 创建笔记本
export function createNotebookRequest (data) {
  return request({
    url: '/createNotebook',
    method: 'post',
    data: data
  })
}

// 创建笔记
export function createNoteRequest (data) {
  return request({
    url: '/createNote',
    method: 'post',
    data: data
  })
}

// 删除笔记本
export function deleteNotebookRequest (data) {
  return request({
    url: '/deleteNotebook',
    method: 'post',
    data: data
  })
}

// 更新笔记本
export function updateNotebookRequest (data) {
  return request({
    url: `/updateNotebook/${data._id}`,
    method: 'put',
    data: data
  })
}

// 获取笔记列表
export function getNoteListRequest (data) {
  return request({
    url: '/getNoteList',
    method: 'get',
    params: data
  })
}

// 编辑事件
export function updateNoteRequest (data) {
  return request({
    url: `/updateNote/${data._id}`,
    method: 'put',
    data: data
  })
}

// 获取废纸篓数据
export function getRecycleBinNoteListRequest (data) {
  return request({
    url: '/getRecycleBinNoteList',
    method: 'get',
    params: data
  })
}

// 还原笔记
export function restoreNoteRequest (data) {
  return request({
    url: `/restoreNote/${data._id}`,
    method: 'put',
    data: data
  })
}

// 新增待办事项
export function addEventRequest(data) {
  return request({
    url: '/addevent',
    method: 'post',
    data: data
  })
}

// 完成事件
export function endEventRequest(data) {
  return request({
    url: `/endevent/${data._id}`,
    method: 'put',
    data: data
  })
}

// 获取事项列表
export function getEventListRequest(data) {
  return request({
    url: '/geteventlist',
    method: 'get',
    params: data
  })
}

// 获取废弃数据
export function getEventListForRecycleBinRequest(data) {
  return request({
    url: '/getEventListForRecycleBin',
    method: 'get',
    params: data
  })
}

// 删除(移入回收站)
export function deleteNoteRequest(data) {
  return request({
    url: `/deleteNote/${data._id}`,
    method: 'put',
    data: data
  })
}

// 销毁事件
export function destoryEventRequest(data) {
  return request({
    url: '/clearEvent',
    method: 'post',
    data: data
  })
}

// 移出回收站
export function outInRecycleBinRequest(data) {
  return request({
    url: `/outInRecycleBin/${data._id}`,
    method: 'put',
    data: data
  })
}

// 从完成移至未完成
export function addToNoEndEventRequest(data) {
  return request({
    url: `/toNoEndEvent/${data._id}`,
    method: 'put',
    data: data
  })
}
