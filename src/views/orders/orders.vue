<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- //搜索框 -->
          <el-input v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="ordersGET" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- //表格 -->
        <el-table :data="ordersGET_data" style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="order_number" label="订单编号"></el-table-column>
          <el-table-column prop="order_price" label="订单价格"></el-table-column>
          <el-table-column prop="order_pay" label="是否付款">
            <template slot-scope="scope">
              <el-tag effect="dark" type="danger" v-if=" scope.row.order_pay==='0'">未付款</el-tag>
              <el-tag effect="dark" type="success" v-else>已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货"></el-table-column>
          <el-table-column prop="create_time" label="下单时间">
            <template slot-scope="scope">{{ scope.row.create_time | dataForm }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template >
              <el-button
                @click="showalter"
                style="font-size:12px"
                type="success"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-button
                @click="click_reap"
                style="font-size:12px"
                type="primary"
                icon="el-icon-location"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="this.queryInfo.pagenum"
      :page-sizes="[5, 6, 7, 8]"
      :page-size="this.queryInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total"
    ></el-pagination>
    <!-- //修改地址对话框/ -->
    <el-dialog @close="addclose" title="修改地址" :visible.sync="address" width="30%">
      <el-form
        :model="addressruleForm"
        :rules="addressrules"
        ref="addressruleFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            style="width:100%"
            v-model="addressruleForm.address1"
            :options="cityctData"
            hover
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressruleForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="address = false">取 消</el-button>
        <el-button type="primary" @click="address = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="dialogVisible" width="40%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in reap_list"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityctData from './citydata'
export default {
  data () {
    return {
      reap_list: [],

      //物流进度对话框
      dialogVisible: false,
      cityctData,
      // 修改地址对话框/的双向数据
      addressruleForm: {
        address1: [],
        address2: ''
      },
      // 修改地址对话框的表单验证
      addressrules: {
        address1: [
          {
            required: true, message: '请选择省市区/县', trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true, message: '请输入详细地址', trigger: 'blur'
          }
        ]
      },
      //修改地址的隐藏显示
      address: false,
      //全部数据
      total: 0,
      // 参数数组
      ordersGET_data: [],
      //列表请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      }
    }
  },
  methods: {
    async click_reap () {

      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.reap_list = res.data
      console.log(this.reap_list)
      this.dialogVisible = true
    },
    addclose () {
      this.$refs.addressruleFormRef.resetFields()
    },
    //展示修改地址的对话框 
    showalter () {
      this.address = true
    },
    //分页页数
    handleCurrentChange (newnum) {
      this.queryInfo.pagenum = newnum
      console.log(newnum)
      this.ordersGET()
    },
    //分页条数
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      console.log(newsize)
      this.ordersGET()
    },
    async ordersGET () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.ordersGET_data = res.data.goods
      console.log(res.data)
      this.total = res.data.total
    }
  },
  created () {
    this.ordersGET()
  },
}
</script>

<style>
</style>