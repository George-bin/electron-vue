import axios from 'axios'

// 创建axios实例
const service = axios.create({
  // api的base_url
  baseURL: 'http://localhost:3000/admin-tools/api',
  // 请求超时时间
  timeout: 60000,
  // 允许携带cookie
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  })

export default service


// 创建axios实例
// const service = axios.create({
//   // baseURL: "http://www.gengshaobin.top:3000/admin-tools/api", // api 的 base_url,相当于http://localhost:3000
//   baseURL: "http://localhost:3000/admin-tools/api", // api 的 base_url,相当于http://localhost:3000
//   timeout: 5000 // 请求超时时间
// })
//
// function ajax({ url, method, data }) {
//   return new Promise((resolve, reject) => {
//     if (method === 'get') {
//       service({
//         url: url
//       })
//         .then(response => {
//           resolve(response.data)
//         })
//         .catch(err => {
//           reject(err)
//         })
//       return
//     }
//     service({
//       url: url,
//       method: method,
//       data
//     })
//       .then(response => {
//         resolve(response.data);
//       })
//       .catch(err => {
//         reject(err);
//       })
//   })
// }
//
// export default ajax

// export default  {
  // 数据请求
  // ajax (url, method, options, callback) {
  //   if (method === 'get') {
  //     return service({
  //       url: url
  //     })
  //       .then(res => {
  //         callback(res);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       })
  //     return;
  //   }
  //   return service({
  //     url: url,
  //     method: method,
  //     data: options
  //   })
  //     .then(res => {
  //       callback(res);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     })
  // },

  // 用户登录
  // login (url, method, options, callback) {
  //   this.ajax(url, method, options, callback)
  // },

  // 用户注册
  // register(url, method, options, callback){
  //   this.ajax(url, method, options, callback)
  // },

  // 用户注销
  // logon (url, method, options, callback) {
  //   this.ajax(url, method, options, callback);
  // },

  // 获取事项列表
  // geteventlist (url, method, options, callback) {
  //   this.ajax(url, method, options, callback);
  // },

  // 新增事项
  // addevent (url, method, options, callback) {
  //   this.ajax(url, method, options, callback)
  // },

  // 将事件添加至回收站
  // addrecyclebin (url, method, options, callback) {
  //   this.ajax(url, method, options, callback)
  // },

  // 移出回收站
  // outinrecyclebin (url, method, options, callback) {
  //   this.ajax(url, method, options, callback)
  // },

  // 添加至今日完成事件
  // addnowendeventlist (url, method, options, callback) {
  //   this.ajax(url, method, options, callback)
  // },

  // 添加至完成事件
  // endevent (url, method, options, callback) {
  //   this.ajax(url, method, options, callback);
  // },

  // 编辑事项
  // editevent (url, method, options, callback) {
  //   this.ajax(url, method, options, callback);
  // },

  // 将完成事件移至未完成事件
  // tonoendevent (url, method, options, callback) {
  //   this.ajax(url, method, options, callback);
  // },

  // 销毁事项
  // clearevent (url, method, options, callback) {
  //   this.ajax(url, method, options, callback);
  // }
// }
