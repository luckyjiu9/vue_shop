<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区 -->
    <el-card>
      <el-row :gutter="10">
        <!-- ===搜索框==== -->
        <el-col :span="8">
          <el-input clearable @clear="info_goods" v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="info_goods" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- ===添加按钮==== -->
        <el-col :span="4">
          <el-button @click="addshop()" type="success">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表单渲染区域 -->
      <el-table border stripe :data="info_goods_Data" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">{{ scope.row.add_time | dataForm }}</template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column width="115px" label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button @click="alterform(scope.row)" type="success" icon="el-icon-edit" circle></el-button>
            <!-- 删除 -->
            <el-button @click="clear(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- //分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[5, 6 , 7]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
      <!-- //编辑对话框 -->

      <el-dialog title="编辑商品" :visible.sync="dialogVisible" width="30%">
        <!-- //form表单 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="ruleForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input type="number" v-model="ruleForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input type="number" v-model="ruleForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input type="number" v-model="ruleForm.goods_weight"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="alterdialogVisible">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //编辑需要的id
      alterId: '',
      //编辑弹出框的显示和隐藏
      dialogVisible: false,
      //编辑验证
      rules: {
        goods_name: [{
          required: true, message: '请输入商品名称',
          trigger: 'blur'
        }],
        goods_price: [{
          required: true, message: '请输入商品价格',
          trigger: 'blur'
        }],
        goods_weight: [{
          required: true, message: '请输入商品重量',
          trigger: 'blur'
        }],
        goods_number: [{
          required: true, message: '请输入商品数量',
          trigger: 'blur'
        }],
      },
      //编辑数据
      ruleForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0

      },
      //总条数
      total: 0,
      //列表数据请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //列表数据
      info_goods_Data: []
    }

  },


  methods: {
    //编辑确定
    alterdialogVisible () {
      this.$refs.ruleFormRef.validate(async vali => {
        if (!vali) return
        const { data: res } = await this.$http.put(`goods/${this.alterId}`, 
       this.ruleForm
      )
        console.log(res)
      })
      this.alterdialogVisible = false
    },
    // 修改
    alterform (row) {
      console.log(row)
      row.goods_id
      this.dialogVisible = true

    },
    //添加商品
    addshop () {
      console.log(11)
      this.$router.push('/goods/add')
    },
    //删除
    async clear (scope) {
      const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirm !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`goods/${scope.goods_id}`)
      // console.log(res)
      if (res.meta.status !== 200) this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.info_goods()
    },
    //分页数据条数
    handleSizeChange (NewSize) {
      this.queryInfo.pagesize = NewSize
      console.log(NewSize)
      this.info_goods()
    },
    //分页数据页数
    handleCurrentChange (Newnum) {
      this.queryInfo.pagenum = Newnum
      console.log(Newnum)
      this.info_goods()
    },
    //所有列表数据
    async info_goods () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      this.info_goods_Data = res.data.goods
      console.log(res.data.goods)
      this.total = res.data.total
    }
  },
  created () {
    this.info_goods()
  },

}
</script>

<style>
</style>