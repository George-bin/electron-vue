import request from '../utils/script/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logon() {
  return request({
    utl: '/logon'
  })
}
