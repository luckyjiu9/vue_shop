<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区 -->
    <el-card>
      <div>
        <!--搜索与添加区域 -->
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input
              @clear="users_item_get"
              clearable
              v-model="users_item.query"
              placeholder="请输入内容"
            >
              <el-button @click="users_item_get" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="success" @click="Visible=true">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户列表区域 -->
        <el-table stripe border :data="users_item_data">
          <el-table-column type="index" label="# "></el-table-column>
          <el-table-column prop="username" label="姓名 "></el-table-column>
          <el-table-column prop="email" label="邮箱 "></el-table-column>
          <el-table-column prop="mobile" label="电话 "></el-table-column>
          <el-table-column prop="role_name" label="角色 "></el-table-column>
          <el-table-column label="状态 ">
            <!--作用域插槽 -->
            <template slot-scope="scope">
              <!--swicth开关 -->
              <el-switch
                @change="userchange(scope.row)"
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column width="180px" label="操作 ">
            <!--作用域插槽 -->
            <template slot-scope="scope">
              <!--修改按钮 -->
              <el-button
                type="success"
                @click="show_alter(scope.row.id)"
                icon="el-icon-edit"
                circle
              ></el-button>
              <!--删除按钮 -->
              <el-button
                type="danger"
                @click="onclick_close(scope.row.id)"
                icon="el-icon-delete"
                circle
              ></el-button>
              <!--分配角色按钮 -->
              <el-tooltip effect="dark" content="分配角色" placement="top">
                <el-button
                  @click="onclickallot(scope.row)"
                  type="primary"
                  icon="el-icon-setting"
                  circle
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="users_item.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="users_item.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
        <!--这是添加用户的对话框 -->
        <el-dialog title="添加用户" @close="closeinput" :visible.sync="Visible" width="30%">
          <!--内容主题区 -->
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!--底部按钮区 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="Visible = false">取 消</el-button>
            <el-button type="primary" @click="input_ok">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 这是修改用户数据的对话框 -->
        <el-dialog @close="alert_close" title="修改用户信息" :visible.sync="dialogVisible" width="30%">
          <!-- 这是修改用户数据的表单 -->
          <el-form ref="formRef" :rules="formrules" :model="alert_item" label-width="70px">
            <el-form-item label="用户名称">
              <el-input v-model="alert_item.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="alert_item.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="alert_item.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="alert_input_ok">确 定</el-button>
          </span>
        </el-dialog>
        <!-- //分配角色的对话框 -->
        <el-dialog @close="setclose" title="分配角色" :visible.sync="allotVisible" width="30%">
          <div>
            <p>当前的用户：{{userinfo.username}}</p>
            <p>当前的角色：{{userinfo.role_name}}</p>
            <p>
              分配新角色：
              <el-select size="20" v-model="valueRole" placeholder="请选择">
                <el-option
                  v-for="item in roleslist"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="allotVisible = false">取 消</el-button>
            <el-button type="primary" @click="close_allotVisible">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>

import { users_item_get, users_item_post, users_state_put } from '../../api/user'
export default {
  data () {

    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号码的正则表达式
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      // 已选中的角色id值
      valueRole: [],
      // 分配权限消息
      userinfo: {

      },
      // 这是添加表单的验证规则对象 
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 14, message: '长度在 6 到 14个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],

      },
      // 这是修改表单的验证规则对象 
      formrules: {
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
      },

      // 这是添加用户的表单数据
      ruleForm: {
        email: '',
        username: '',
        password: '',
        mobile: ''
      },
      //所有角色的数据列表
      roleslist: [],
      // 控制添加用户对话框的显示与隐藏
      Visible: false,
      // 控制修改用户对话框的显示与隐藏
      dialogVisible: false,
      //查询修改用户信息
      alert_item: {},
      // 获取用户列表信息
      users_item: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      users_item_data: [],
      total: 0,
      //分配角色的显示隐藏
      allotVisible: false,

    }
  },
  created () {
    this.users_item_get()
  },
  methods: {
    //分配角色的确定修改
    async close_allotVisible () {
      if (!this.valueRole) return this.$message.error('请选择要分配角色')
      const { data: res } = await this.$http.put(`users/${this.userinfo.id}/role`, {
        rid: this.valueRole
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.users_item_get()
      this.allotVisible = false
    },
    //监听分配角色对话框的关闭事件
    setclose () {
      this.valueRole = ''
      this.userinfo = {}
    },
    //分配角色的对话框
    async onclickallot (scope) {

      //在展示对话框之前获取所有角色列表

      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res)
      // 返回值是200 的消息提示
      this.userinfo = scope
      this.roleslist = res.data
      this.allotVisible = true

    },
    //删除用户信息
    async onclick_close (id) {
      //弹框询问用户是否删除
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确认删除,则返回字符串 confirm
      //如果用户取消删除,则返回字符串 cancel
      // console.log(res)
      if (res !== "confirm") return this.$message.info('已取消删除')
      //请求后台数据删除
      const { data: dele } = await this.$http.delete("users/" + id)
      // if判断如果 返回值 不是 200 的消息提示
      if (dele.meta.status !== 200) return this.$message.error(dele.meta.msg)
      // 返回值是200 的消息提示
      this.$message.success(dele.meta.msg)
      //刷新请求数据
      this.users_item_get()
    },
    //确定修改用户的表单预加载 和 修改
    alert_input_ok () {
      this.$refs.formRef.validate(async vali => {
        if (!vali) return
        //发起修改用户信息请求
        const { data: res } = await this.$http.put('users/' + this.alert_item.id, {
          email: this.alert_item.email, mobile: this.alert_item.mobile

        })
        //判断是否修改成功
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 关闭对话框
        this.dialogVisible = false
        //刷新数据列表
        this.users_item_get()
      })
    },
    // 展示编辑用户的对话框
    async show_alter (id) {
      this.dialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg) 
      this.alert_item = res.data
    },
    // 点击确定添加用户预验证 以及添加
    input_ok () {
      this.$refs.ruleForm.validate(async valid => {
        //判断是否通过验证
        if (!valid) return
        // 可以发起添加用户的网络请求
        const res = await users_item_post(this.ruleForm)
        //判断是否请求成功
        if (res.meta.status !== 201) this.message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        //关闭对话框
        this.Visible = false
        //刷新数据列表
        this.users_item_get()
      })
    },
    // 监听添加用户对话框的关闭事件
    closeinput () {
      this.$refs.ruleForm.resetFields()
    },
    // 监听修改用户对话框的关闭事件
    alert_close () {
      this.$refs.formRef.resetFields()
    },
    //获取用户数据页
    async users_item_get () {
      const res = await users_item_get(this.users_item, {})
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.users_item_data = res.data.users
      this.total = res.data.total
    },
    // 监听分页 的 改变事件
    handleSizeChange (newSize) {
      this.users_item.pagesize = newSize
      this.users_item_get()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.users_item.pagenum = newPage
      this.users_item_get()
    },
    // 监听 switech 开关状态
    async userchange (state) {

      const { data: res } = await this.$http.put(`users/${state.id}/state/${state.mg_state}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }
  },
}
</script>

<style scoped>
</style>