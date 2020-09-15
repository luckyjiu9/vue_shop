import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// element
import "@/ui/element"
Vue.config.productionTip = false
// 导入字体图标
//axios请求根路径
import axios from 'axios'
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})

import "./assets/fonts/iconfont.css"
//导入全局样式表
import "../src/assets/css/global.css"
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
