import request from '../utils/request'

// 编辑事件
export function editEventRequest (data) {
  return request({
    url: `/editevent/${data._id}`,
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
export function addRecycleBinRequest(data) {
  return request({
    url: `/addRecycleBin/${data._id}`,
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
