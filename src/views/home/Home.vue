<template>
  <el-container class="home-container">
    <!-- //头部区域 -->

    <el-header>
      <div>
        <img width="100%" src="../../assets/logoimg.jpg" alt />

        <span>电商后台管理系统</span>
      </div>
      <el-button size="mini"  type="danger" @click="clickback">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse?'64px':'200px'">
        <div class="button_toggle" @click="click_toggle">
          <i :class="iscollapse?'el-icon-plus':'el-icon-minus'"></i>
        </div>
        <!-- //侧边栏菜单区 -->
        <el-menu
          :default-active="active"
          router
          :collapse="iscollapse"
          unique-opened
          background-color="rgb(1, 75, 88)"
          text-color="rgb(255, 255, 255)"
          active-text-color="#78C950"
          :collapse-transition="false"
        >
          <!-- //这是一级菜单 -->
          <el-submenu :index="item.id+''" v-for="(item, index) in list_item" :key="index">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- //图标 -->
              <i :class="list_icon[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              @click="click_pathData('/'+item1.path)"
              :index="'/'+item1.path"
              v-for="(item1, index) in item.children"
              :key="index"
            >
              <!-- 二级菜单的模板区 -->
              <template slot="title">
                <!-- //图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{item1.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { home_list_shop } from '../../api/user'
export default {
  data () {
    return {
      // 被激活的链接地址
      active: '',
      iscollapse: false,
      list_item: [],
      list_icon: {
        "125": "iconfont icon-user",
        "103": 'iconfont icon-tijikongjian ',
        "101": 'iconfont icon-shangpin',
        "102": 'iconfont icon-danju',
        "145": 'iconfont icon-baobiao',
      }
    }
  },
  created () {
    this.home_list_shop()
    this.active = window.sessionStorage.getItem('active')
  },
  methods: {
    //保存链接激活状态
    click_pathData (path) {
      window.sessionStorage.setItem('active', path)
      this.active = path
    },
    //退出登录
    clickback () {
      window.sessionStorage.clear()
      this.$router.push('./login')
      this.$message.success('成功退出登陆')
    },
    //点击按钮实现列表的折叠和展开
    click_toggle () {
      this.iscollapse = !this.iscollapse
    },
    async home_list_shop () {
      const res = await home_list_shop()
      if (res.meta.status !== 200) return this.$message.error(res.meta)
      // console.log(res)
      this.list_item = res.data
    }
  }
}
</script>

<style scoped>
.el-menu {
  border-right: 0px;
}
.iconfont {
  margin-right: 10px;
}
.home-container {
  height: 100vh;
}

.el-header img {

  box-shadow: 0px 0px 10px rgb(0, 0, 0);
  width: 45px;
  height: 45px;
  margin-right: 15px;
  border-radius: 50% 50%;
  margin-left: -12px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header {
  color: white;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(1, 75, 88);
}
.el-aside {
  background-color: rgb(1, 75, 88);
}
.el-main {
  background-color: rgb(255, 255, 255);
}
.button_toggle {
  background: rgb(3, 96, 112);
  color: rgb(255, 0, 0);
  display: flex;
  justify-content: center;
  height: 30px;
  width: 100%;
  align-items: center;

  cursor: pointer;
}
.button_toggle i {
  margin-right: 8px;
}
</style>
