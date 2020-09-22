<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区 -->
    <el-card>
      <div>
        <!-- 添加用户区域 -->
        <el-row :gutter="10">
          <el-col :span="4">
            <el-button type="success" @click="Visible=true">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户列表区域 -->
        <el-table :data="roles_item_data" border stripe style="width: 100%">
          <!-- <展开列> -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row
                :class="['elbottom' ,index===0 ?'eltop':'' ,'el-flex']"
                v-for="(item, index) in scope.row.children"
                :key="item.id"
              >
                <!-- 一级权限循环 -->
                <el-col :span="5">
                  <el-tag effect="dark">{{item.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- //二级权限循环和三级权限循环 -->
                <el-col :span="19">
                  <!-- //通过for循环 嵌套渲染 二级权限 -->
                  <el-row
                    :class="[ ,index1===0 ?'':'eltop' ,,'el-flex']"
                    v-for="(item1, index1) in item.children"
                    :key="item1.id"
                  >
                    <el-col :span="6">
                      <el-tag effect="dark" type="success">{{item1.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        effect="dark"
                        @close="removeRight(scope.row,item2.id)"
                        closable
                        v-for="(item2) in item1.children"
                        :key="item2.id"
                        type="danger"
                      >{{item2.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作" width="180">
            <!--作用域插槽 -->
            <template slot-scope="scope">
              <!--修改按钮 -->
              <el-button
                type="success"
                @click="show_alter(scope.id.row.id)"
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
                  @click="allot_user(scope.row)"
                  type="primary"
                  icon="el-icon-setting"
                  circle
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="添加角色" @close="closeinput" :visible.sync="Visible" width="30%">
        <!--内容主题区 -->
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="ruleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="ruleForm.roleDesc"></el-input>
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
        <el-form ref="formRef" :rules="formrules" :model="alert_item" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="alert_item.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="alert_item.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="alert_input_ok">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 这是分配角色的对话框 -->
      <el-dialog title="分配权限" @close="serightclose" :visible.sync="userdialogVisible" width="30%">
        <!-- 这是树形控件 -->
        <el-tree
          node-key="id"
          :default-expand-all="true"
          :data="userdialog_data"
          show-checkbox
          :default-checked-keys="defKeys"
          :props="treeProps"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="userdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { roles_add_post } from '../../api/user'
export default {
  data () {
    return {
      //当前准备分配权限的角色id
      scopeId: '',
      // 默认选中的树形复选框
      defKeys: [],
      //这是树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 角色列表数据
      roles_item_data: [],
      // 这是添加用户的表单数据
      ruleForm: {
        roleName: '',
        roleDesc: '',
      },
      // 控制添加用户对话框的显示与隐藏
      Visible: false,
      // 这是添加表单的验证规则对象 
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 6, max: 14, message: '长度在 6 到 14个字符', trigger: 'blur' }
        ],
      },
      // 这是修改用户的表单数据
      alert_item: {
        roleName: '',
        roleDesc: '',
      },
      // 控制修改用户对话框的显示与隐藏
      dialogVisible: false,
      // 这是修改表单的验证规则对象 
      formrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 4, max: 14, message: '长度在 6 到 14个字符', trigger: 'blur' }
        ],
      },
      // 控制分配角色对话框的显示与隐藏
      userdialogVisible: false,
      //分配角色的获取数据
      userdialog_data: {}
    }
  },

  created () {
    this.roles_item()
  },
  methods: {
    //关闭对话框时清空数组
    serightclose () {
      this.defKeys = []
    },
    //删除用户权限
    async removeRight (scope, item) {
      //弹框提示
      const confim = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confim !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`roles/${scope.id}/rights/${item}`)
        this.$message.success(res.meta.msg)
      scope.children = res.data
    
    },
    //分配角色确定提交
    async allotRights () {
      const keyco = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keyco1 = keyco.join(',')
      const { data: res } = await this.$http.post(`roles/${this.scopeID}/rights`, {
        rids: keyco1

      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.$message.success(res.meta.msg)
      this.roles_item()
      this.userdialogVisible = false
    },
    //隐藏显示分配角色
    async allot_user (scope) {
      //需要拿到我们勾选项 的id
      this.scopeID = scope.id
      const { data: res } = await this.$http.get('rights/' + 'tree ')
      this.userdialog_data = res.data
      console.log(res)
      //判断是否获取成功
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //递归获取三级节点的id
      this.getLeafKeys(scope, this.defKeys)
      this.userdialogVisible = true
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
      const { data: dele } = await this.$http.delete("roles/" + id)
      // if判断如果 返回值 不是 200 的消息提示
      if (dele.meta.status !== 200) return this.$message.error(dele.meta.msg)
      // 返回值是200 的消息提示
      this.$message.success(dele.meta.msg)
      //刷新请求数据
      this.roles_item()
    },
    //确定修改用户的表单预加载 和 修改
    alert_input_ok () {
      this.$refs.formRef.validate(async vali => {
        if (!vali) return
        //发起修改用户信息请求
        const { data: res } = await this.$http.put('roles/' + this.alert_item.roleId, {
          roleName: this.alert_item.roleName, roleDesc: this.alert_item.roleDesc

        })
        //判断是否修改成功
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 关闭对话框
        this.dialogVisible = false
        //刷新数据列表
        this.roles_item()
      })
    },
    // 展示编辑用户的对话框
    async show_alter (id) {
      this.dialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
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
        const res = await roles_add_post(this.ruleForm)
        //判断是否请求成功
        if (res.meta.status !== 201) this.message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        //关闭对话框
        this.Visible = false
        //刷新数据列表
        this.roles_item()
      })
    },
    // 监听添加角色对话框的关闭事件
    closeinput () {
      this.$refs.ruleForm.resetFields()
    },
    // 监听修改角色对话框的关闭事件
    alert_close () {
      this.$refs.formRef.resetFields()
    },
    //请求角色列表
    async roles_item () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      //判断是否获取成功
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roles_item_data = res.data

    },
    //通过递归的形式 获取角色下所有三级权限的id,并保存到this.defKeys中
    getLeafKeys (node, arr) {
      //如果node节点不包含children 属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(ele => {
        this.getLeafKeys(ele, arr)
      })
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.elbottom {
  border-bottom: 1px solid rgb(226, 225, 225);
}
.eltop {
  border-top: 1px solid rgb(226, 225, 225);
}
.el-flex {
  display: flex;
  align-items: center;
}
</style>