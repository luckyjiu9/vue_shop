import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入副文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入副文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// element
import "@/ui/element"
Vue.config.productionTip = false
// 导入字体图标
//axios请求根路径
import axios from 'axios'
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
Vue.prototype.$http = axios
//在request拦截器中,展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.done()
  return config;
})
//在request拦截器中,隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
import TreeTable from 'vue-table-with-tree-grid'
Vue.filter('dataForm', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  // const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}`
  // : ${ ss }
})
//副文本全局注册
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.component('tree-table', TreeTable)
import "./assets/fonts/iconfont.css"
//导入全局样式表
import "../src/assets/css/global.css"
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
