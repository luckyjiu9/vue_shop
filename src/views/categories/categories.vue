
/*
 * @Author: luckyjiu9
 * @Email: luckyjiu9@gamil.com
 * @Date: 2020-09-17 15:07:24
 * @Last Modified by: luckyjiu9
 * @Last Modified time: 2020-09-17 18:41:35
 * @Description: Description
 */

<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="showcate" type="success">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- //表格 -->
      <tree-table
        class="tree-table"
        :data="cate_list_data"
        :expand-type="false"
        :selection-type="false"
        :columns="columns"
        :show-row-hover="false"
        border
        show-index
        index-text="#"
      >
        <!-- //是否可用插槽/ -->
        <template slot="isok" slot-scope="scope">
          <i style="color:#67C23A;" class="el-icon-success" v-if="scope.row.cat_deleted===false"></i>
          <i style="color:#F56C6C" class="el-icon-error" v-else></i>
        </template>
        <!-- 排序插槽 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0" effect="dark">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" effect="dark" type="success">二级</el-tag>
          <el-tag v-else effect="dark" type="danger">三级</el-tag>
        </template>
        <!-- //操作插槽 -->
        <template slot="opt" slot-scope="scope">
          <!--修改按钮 -->
          <el-button type="success" @click="addonclik(scope.row)" icon="el-icon-edit" circle></el-button>
          <!--删除按钮 -->
          <el-button
            @click="deleonclik(scope.row.cat_id)"
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 5, 6, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加分类的对话框 -->
      <el-dialog title="添加分类" @close="closefromref" :visible.sync="cateVisible" width="30%">
        <!-- 添加分类的表单 -->
        <el-form
          ref="addcartformformRef"
          :rules="addcartformformRules"
          :model="addcartform"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addcartform.cat_name"></el-input>
          </el-form-item>
          <!-- //options同来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-form-item label="父级分类">
            <el-cascader
              class="colflex"
              v-model="propsvalue"
              :options="getparentCatelist_data"
              :props="propsgetparent"
              @change="propschange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cateVisible = false">取 消</el-button>
          <el-button type="primary" @click="cateVisible_ok">确 定</el-button>
        </span>
      </el-dialog>
      <!-- //修改分类的对话框 -->
      <el-dialog title="添加分类" @close="closeref" :visible.sync="addVisible" width="30%">
        <!-- 修改分类的表单 -->
        <el-form
          ref="addcartformRef"
          :rules="addcartformformRules"
          :model="addform"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addform.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addVisible_ok">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { categories_get } from '../../api/user'
export default {

  data () {
    return {
      //修改分类的数据
      addform: {
      },
      //控制修改分类对话框的显示隐藏
      addVisible: false,
      //添加分类的表单数据对象
      addcartform: {
        //将要添加到 的分类的名称
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        //分类的等级默认要添加的 是一级分类
        cat_level: 0
      },
      //添加分类表单的验证规则对象
      addcartformformRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },

        ]
      },
      //选中 的父级分类的id数组
      propsvalue: [],
      //商品分类的数据筛选条件
      queryInfo: {
        type: 3,
        pagenum: 2,
        pagesize: 4
      },
      //添加分类的对话框的显示与隐藏
      cateVisible: false,
      // 指定级联选择器的配置对象
      propsgetparent: {
        checkStrictly: 'true',
        expandTrigger: 'hove',
        value: 'cat_id',
        label: 'cat_name',
        chilidren: 'chilidren'
      },
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'isok'
        },
        {
          label: '排序',
          //将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'order'
        },
        {
          label: '操作',
          //将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'opt'
        }
      ],
      //商品分类的数据列表
      cate_list_data: [],
      // 分类总数量
      total: 0,
      //父级分类的列表
      getparentCatelist_data: [],
      //修改分类id
      addformid: []
    }
  },
  created () {
    this.cate_list_data_get()
  },
  methods: {
    // 修改分类确定
    async addVisible_ok () {
      const { data: res } = await this.$http.put('categories/' + this.addformid, {
        cat_name: this.addform.cat_name
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.addVisible = false
      this.cate_list_data_get()
    },
    //关闭分类编辑事件
    closeref () {
      this.$refs.addcartformRef.resetFields()
    },
    // 打开添加编辑
    addonclik (scoped) {
      this.addform = scoped
      this.addformid = scoped.cat_id
      this.addVisible = true
    },
    //添加删除
    async deleonclik (scoped) {

      // console.log(scoped)
      const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirm)
      if (confirm !== 'confirm') return this.$message.info('已经取消删除')
      const { data: res } = await this.$http.delete('categories/' + scoped)
      // console.log(res)
      this.$message.success(res.meta.msg)
      this.cate_list_data_get()

    },
    closefromref () {
      this.$refs.addcartformformRef.resetFields()
      this.propsvalue = []
    },
    //确认添加
    cateVisible_ok () {
      // console.log(this.addcartform)
      this.$refs.addcartformformRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addcartform)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        // console.log(res)
        this.$message.success(res.meta.msg)
        this.cate_list_data_get()
        this.cateVisible = false
      })


    },
    //选择项发生变化触发这个函数
    propschange () {
      // console.log(this.propsvalue)
      // 如果propsvalue数组length大于0, 证明选择父级分类
      // 反之说明没有选择父级分类
      if (this.propsvalue.length > 0) {
        //父级分类的id
        this.addcartform.cat_pid = this.propsvalue[this.propsvalue.length - 1]
        this.addcartform.cat_level = this.propsvalue.length
        return
      } else {
        this.addcartform.cat_pid = 0
        this.addcartform.cat_level = 0
      }

    },
    //控制添加分类的隐藏显示
    showcate () {
      //先获取父级分类的数据列表
      this.getparentCatelist()
      this.cateVisible = true

    },
    //监听pagesize改变的事件
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.cate_list_data_get()
    },
    //监听pagenum的改变
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.cate_list_data_get()
    },
    async cate_list_data_get () {
      const res = await categories_get(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cate_list_data = res.data.result
      this.total = res.data.total
      // console.log(res)
    },
    //获取父级分类的数据列表
    async getparentCatelist () {
      const res = await categories_get({ type: 2 })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getparentCatelist_data = res.data
      // console.log(this.getparentCatelist_data)
    }
  }
}
</script>

<style scoped>
.colflex {
  width: 100%;
}
.tree-table {
  margin-top: 15px;
}
</style>