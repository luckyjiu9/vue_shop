
<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 警告框 -->
      <el-alert title="注意:只允许为三级分类设置相关参数" type="warning" show-icon></el-alert>
      <!-- 选择商品分类区 -->
      <el-row class="elmatgin">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 商品分类的级联选择框 -->
          <el-cascader
            v-model="hovevalue"
            :options="item_data"
            :props="hoveProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTABClick">
        <!-- ==============动态参数区域========================== -->
        <el-tab-pane class="style_color" label="动态参数" name="many">
          <!-- //添加动态参数 -->
          <el-button type="primary" :disabled="adddisabledclick" @click="adddialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTable" border stripe style="width: 100%">
            <!-- //这是展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- //循环渲染tag标签 -->
                <el-tag
                  @close="handClose(index,scope.row)"
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->

            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!--修改按钮 -->
                <el-button
                  @click="showeditclick(scope.row.attr_id)"
                  type="success"
                  icon="el-icon-edit"
                  circle
                ></el-button>
                <!--删除按钮 -->
                <el-button
                  @click="clickdeldte(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- ==============静态属性区域========================== -->
        <el-tab-pane label="静态属性" name="only">
          <!-- //添加动态参数 -->
          <el-button type="primary" :disabled="adddisabledclick" @click="adddialogVisible=true">添加属性</el-button>
          <!-- //静态属性表格 -->
          <el-table :data="onlyTable" border stripe style="width: 100%">
            <!-- //这是展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- //循环渲染tag标签 -->
                <el-tag
                  @close="handClose(index,scope.row)"
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!--修改按钮 -->
                <el-button
                  type="success"
                  @click="showeditclick(scope.row.attr_id)"
                  icon="el-icon-edit"
                  circle
                ></el-button>
                <!--删除按钮 -->
                <el-button
                  @click="clickdeldte(scope.row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- //这是添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="adddialogVisible"
      width="30%"
      @close="adddialogclose"
    >
      <!-- //这是添加参数的对话框 -->
      <el-form :model="addform" :rules="addformrules" ref="addformref" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adddialogVisible_ok">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //这是修改参数的对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="showedit"
      width="30%"
      @close="editdialogclose"
    >
      <!-- //这是修改参数的对话框 -->
      <el-form :model="editform" :rules="editformrules" ref="editformref" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showedit = false">取 消</el-button>
        <el-button type="primary" @click="showedit_ok">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { categories_get } from '../../api/user'
export default {
  data () {
    return {

      //修改的表单验证规则对象
      editformrules: {
        attr_name: [{
          required: true,
          message: '请输入参数名称', trigger: 'blur'
        }]
      },
      //修改表单数据对象
      editform: {

      },
      // 这是点击按钮展示修改的对话框
      showedit: false,
      //这是添加表单的验证规则对象
      addformrules: {
        attr_name: [{
          required: true,
          message: '请输入参数名称', trigger: 'blur'
        }]
      },
      //这是添加参数的表单数据对象
      addform: {
        attr_name: ''
      },
      //这是控制参数的显示隐藏
      adddialogVisible: false,
      //这是动态参数的数据
      manyTable: [],
      // 这是静态属性的数据
      onlyTable: [],
      //被激活的页签的名称
      activeName: 'many',
      //级联选择框双向绑定数组
      hovevalue: [],
      //级联选择器数据条件
      hoveProps: {
        checkStrictly: 'true ',
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //所有分类数据
      item_data: []
    }
  },
  computed: {
    //如果按钮需要被禁用则fanhuitrue

    adddisabledclick () {
      if (this.hovevalue.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.hovevalue.length === 3) {
        return this.hovevalue[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
  created () {

    this.getCatelist()
  },

  methods: {
    handClose (index, row) {
      row.attr_vals.splice(index, 1)
      console.log(1)
      this.fuyong(row)
    },
    // 点击按钮展示文本框
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 文本框失去焦点或按下enter键都会触发
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim()
      )
      row.inputValue = ''
      console.log('ok')
      this.fuyong(row)

    },
    async fuyong (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      console.log(res)
    },
    async clickdeldte (id) {
      const confim = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confim !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getparamsData()
    },
    //点击按钮展示对话框
    async showeditclick (id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editform = res.data

      this.showedit = true

    },
    editdialogclose () {
      this.$refs.editformref.resetFields()
    },
    //修改的点击按钮 修改参数
    showedit_ok () {
      this.$refs.editformref.validate(async vali => {
        if (!vali) return


        this.getparamsData()
        this.showedit = false
        // console.log(res)
      })

    },
    async isshow_ok () {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editform.attr_id}`, {
        attr_name: this.editform.attr_name, attr_sel: this.activeName
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    //点击按钮 添加参数
    adddialogVisible_ok () {
      this.$refs.addformref.validate(async vali => {
        if (!vali) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addform.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getparamsData()
        this.adddialogVisible = false
      })
    },
    //监听添加对话框的对话事件
    adddialogclose () {
      this.$refs.addformref.resetFields()
    },
    //级联选择框选中项变化,会触发这个函数
    async handleChange () {
      this.getparamsData()
    },
    async getparamsData () {
      //证明选中的不是三级分类
      if (this.hovevalue.length !== 3) {
        this.hovevalue = []
        this.manyTable = []
        this.onlyTable = []
        return
      }
      //根据所选分类的id,和当前所处的面板,获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)



      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ?
          item.attr_vals.split(' ') : []
        // 控制文本框的显示于隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTable = res.data
      } else {
        this.onlyTable = res.data
      }
    },
    //这是当前选中的三级分类的id

    //这是tab页签点击事件的处理函数
    handleTABClick () {
      this.getparamsData()
      // console.log(this.activeName)

    },

    //获取所有分类的数据列表
    async getCatelist () {
      const res = await categories_get({})
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.item_data = res.data
      // console.log(this.item_data)
    },


  }
}
</script>

<style scoped>
.elmatgin {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 89px;
  margin: 5px;
}
.button-new-tag {
  margin-left: 5px;
}
</style>