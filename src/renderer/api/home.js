import request from '../utils/request'

// 新增待办事项
export function addEventRequest(data) {
  return request({
    url: '/addevent',
    method: 'post',
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
