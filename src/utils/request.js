import axios from 'axios'
import store from '@/store/index'

// 根据环境不同引入不同api地址
// import { baseApi } from '@/config'
//配置请求根路径
const baseApi = 'http://127.0.0.1:8888/api/private/v1/'
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      // Toast.loading({
      //   forbidClick: true
      // })
    }
    //判断如果有vue里的token是否有值,如果有的话加入到请求头里
    if (window.sessionStorage.getItem('token')) {
      config.headers.Authorization = window.sessionStorage.getItem('token')
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    // Toast.clear()
    const res = response.data
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 401) {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    // Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service



