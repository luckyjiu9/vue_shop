import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    component: () => import('../App.vue'),
    meta: {
      title: '登录',
      keepAlive: true
    },
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/login.vue'),
        meta: {
          title: '登录',
          keepAlive: true
        },
      },
      {
        path: '/home',
        name: 'home',
        redirect: './welcome',
        component: () => import('../views/home/Home.vue'),
        meta: {
          title: '首页',
          keepAlive: true
        },
        children: [
          {
            path: '/welcome',
            name: 'welcome',
            component: () => import('../views/welcome/welcome.vue'),
            meta: {
              title: '欢迎页',
              keepAlive: true
            },
          },
          {
            path: '/users',
            name: 'users',
            component: () => import('../views/users/users.vue'),
            meta: {
              title: '用户列表',
              keepAlive: true
            },
          },
          {
            path: '/roles',
            name: 'roles',
            component: () => import('../views/roles/roles.vue'),
            meta: {
              title: '角色列表',
              keepAlive: true
            },
          },
          {
            path: '/rights',
            name: 'rights',
            component: () => import('../views/rights/rights.vue'),
            meta: {
              title: '权限列表',
              keepAlive: true
            },
          },
          {
            path: '/categories',
            name: 'categories',
            component: () => import('../views/categories/categories.vue'),
            meta: {
              title: '商品分类',
              keepAlive: true
            },
          },
          {
            path: '/params',
            name: 'params',
            component: () => import('../views/params/params.vue'),
            meta: {
              title: '分类参数',
              keepAlive: true
            },
          },
          {
            path: '/goods',
            name: 'goods',
            component: () => import('../views/goods/goods.vue'),
            meta: {
              title: '商品列表',
              keepAlive: true
            },
          },
          {
            path: '/goods/add',
            name: 'add',
            component: () => import('../views/goods/add.vue'),
            meta: {
              title: '添加商品',
              keepAlive: true
            },
          },
          {
            path: '/orders',
            name: 'orders',
            component: () => import('../views/orders/orders.vue'),
            meta: {
              title: '添加商品',
              keepAlive: true
            },
          },
          {
            path: '/reports',
            name: 'reports',
            component: () => import('../views/reports/reports.vue'),
            meta: {
              title: '添加商品',
              keepAlive: true
            },
          }



        ]
      },


    ]

  },


]


const router = new VueRouter({
  mode: 'hash',
  routes,
  scrollBehavior (to, from, savedPosition) {
    // console.log("------", to, from, savedPosition, to.meta.savedPosition, "-----")
    // return {x:0,y:0}
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  },


})
//为路由对象,添加beforeEach导航守卫
router.beforeEach((to, from, next) => {
  //如果用户访问的登陆页,直接放行
  if (to.path === '/login') return next()
  //从sessionStorage中获取到保存的token值
  const tokenstr = window.sessionStorage.getItem('token')
  //没有token,强制跳转登录页
  if (!tokenstr) return next('/login')
  next()
})

export default router
