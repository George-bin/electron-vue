import request from '../utils/request'

// 用户登录
export function loginRequest (data) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

// 用户注册
export function registerRequest (data) {
  return request({
    url: '/register',
    method: 'post',
    data: data
  })
}
