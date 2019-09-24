import axios from "axios";
import { Message } from "element-ui";
import router from "../router";

// 创建axios实例
export let request = axios.create({
  // api的base_url
  baseURL: `${baseUrl()}/api/blog-manage`,
  // 请求超时时间
  timeout: 60000,
  // 允许携带cookie
  withCredentials: true
});

export function destoryAxios() {
  request = null;
  request = axios.create({
    // api的base_url
    baseURL: `${baseUrl()}/api/blog-manage`,
    // 请求超时时间
    timeout: 60000,
    // 允许携带cookie
    withCredentials: true
  });
}

function baseUrl() {
  let baseUrl = localStorage.getItem("baseUrl");
  if (baseUrl) {
    return baseUrl;
  } else {
    return "http://localhost:3000";
  }
}

// request拦截器
request.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
request.interceptors.response.use(
  response => {
    let { errcode } = response.data;
    if (errcode === 991) {
      Message({
        type: "warning",
        message: "登录态失效!"
      });
      router.push("/login");
      return;
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);
