import { shop_login, home_list, goods_item, categories, roles_add, users_item } from './index'
// axios
import request from '@/utils/request'

// 获取登录信息
export function loginshop_login (data = {}) {
  return request({
    url: shop_login,
    method: 'post',
    data,
    hideloading: false
  })
}

// 获取侧边栏信息
export function home_list_shop (params = { type: "pop", page: 1 }) {
  return request({
    url: home_list,
    method: 'get',
    params,
    hideloading: false
  })
}

// 获取用户信息
export function users_item_get (params = {}) {
  return request({
    url: users_item,
    method: 'get',
    params,
    hideloading: false
  })
}
// 添加用户

export function users_item_post (data = {}) {
  return request({
    url: users_item,
    method: 'post',
    data,
    hideloading: false
  })
}
//添加角色
export function roles_add_post (data = {}) {
  return request({
    url: roles_add,
    method: 'post',
    data,
    hideloading: false
  })
}
//分类角色信息
export function categories_get (params = {}) {
  return request({
    url: categories,
    method: 'get',
    params,
    hideloading: false
  })
}
export function goods_item_get (params = {}) {
  return request({
    url: goods_item,
    method: 'get',
    params,
    hideloading: false
  })
}

