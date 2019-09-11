import axios from 'axios'

// 创建axios实例
export let request = axios.create({
  // api的base_url
  baseURL: `${baseUrl()}/admin-tools/api`,
  // 请求超时时间
  timeout: 60000,
  // 允许携带cookie
  withCredentials: true
})

export function destoryAxios () {
  request = null
  request = axios.create({
    // api的base_url
    baseURL: `${baseUrl()}/admin-tools/api`,
    // 请求超时时间
    timeout: 60000,
    // 允许携带cookie
    withCredentials: true
  })
}

function baseUrl () {
  let baseUrl = localStorage.getItem('baseUrl')
  if (baseUrl) {
    return baseUrl
  } else {
    return 'http://localhost:3000'
  }
}

// request拦截器
request.interceptors.request.use(config => {
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
request.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)
