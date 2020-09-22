<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- //卡片 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 这是步骤条区 -->
      <el-steps align-center :space="200" :active="activeIndex-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- //tabs区域 -->
      <el-form
        ref="addformRef"
        label-position="top"
        :model="addform"
        :rules="addformRules"
        label-width="100px"
      >
        <el-tabs
          @tab-click="tabClicked"
          :before-leave="beforeTabLeave"
          v-model="activeIndex"
          tab-position="left"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addform.goods_name" placeholder="请输入内容" 可清空 密码框 首尾显示图标></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addform.goods_price" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addform.goods_weight" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addform.goods_number" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addform.goods_cat"
                :options="classify"
                :props="classProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item) in classifyGif" :key="item.attr_id">
              <!-- //复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(item1,index) in item.attr_vals"
                  :key="index"
                  :label="item1"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in classifystate"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- //图片区域 -->
            <!-- // action表示图片要上传到的api地址 -->
            <el-upload
              :action="upimg"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 副文本编辑器组件 -->
            <quill-editor v-model="addform. goods_introduce"></quill-editor>
            <!-- //添加商品的按钮 -->
            <el-button class="brnAdd" size="small" @click="add" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="previewPath" width="100%" alt />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      dialogVisible: false,
      previewPath: '',
      //这是图片上传组件的header
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //上传图片的url地址
      upimg: 'http://127.0.0.1:8888/api/private/v1/upload',
      //静态参数数据
      classifystate: [],
      //动态参数数据
      classifyGif: [],
      //级联选择选项
      classProps: {
        checkStrictly: 'true',
        expandTrigger: 'hover',
        children: 'children',
        label: 'cat_name',
        value: 'cat_id',
      },
      //商品分类数据
      classify: [],
      activeIndex: '0',
      addform: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      addformRules: {
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
        goods_cat: [{
          required: true, message: '请选择商品分类',
          trigger: 'blur'
        }],

      }
    }
  },
  created () {
    this.getShopClassify()
  },
  methods: {
    //添加商品按钮
    add () {
      console.log(this.addform)
      this.$refs.addformRef.validate(async vali => {
        if (!vali) return this.$message.error('请填写必要的表单项')
        //执行添加的业务逻辑
        const form = _.cloneDeep(this.addform)
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)
        //处理动态参数
        this.classifyGif.forEach(item => {
          const newclassifyGif = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addform.attrs.push(newclassifyGif)
        })
        this.classifystate.forEach(item => {
          const newclassifystate = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals

          }
          this.addform.attrs.push(newclassifystate)
        })
        form.attrs = this.addform.attrs
        console.log(form.attrs)

        //发起请求添加商品
        // 商品的名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    },
    //监听图片上传成功 的事件
    handleSuccess (response) {
      console.log(response)
      if (response.meta.status !== 200) return this.$message.error(response.meta.msg)
      this.$message.success(response.meta.msg)
      // 1.拼接得到一个图片信息
      const picinfo = {
        pic: response.data.tmp_path
      }
      // 2.将图片信息对象push到pics数组中
      this.addform.pics.push(picinfo)
      console.log(this.addform)
    },
    //处理移除图片的操作
    handleRemove (file) {
      console.log(file)
      const filepath = file.response.data.tmp_path
      const i = this.addform.pics.findIndex(x => {
        x.pic === filepath
      })
      this.addform.pics.splice(i, 1)
      if (file.response.meta.status !== 200) return this.$message.error(file.response.meta.msg)
      this.$message.success('删除成功 ')
      console.log(this.addform)
    },
    //处理图片预览效果
    handlePreview (file) {

      console.log(file)
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    //点击tabs时触发
    async tabClicked () {
      console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.classifID}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach((ele) => {
          ele.attr_vals = ele.attr_vals.length === 0 ? []
            : ele.attr_vals.split(' ')

        })
        this.classifyGif = res.data
        console.log(this.classifyGif)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.classifID}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        console.log(res)
        this.classifystate = res.data
      }


    },
    //tabs切换时的函数处理ab
    beforeTabLeave (activeName, oldActiveName) {
      console.log('进入' + activeName)
      console.log('离开' + oldActiveName)
      if (this.addform.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    //判断是否选择的是三级标签
    handleChange () {
      if (this.addform.goods_cat.length !== 3) {
        this.addform.goods_cat = []
      }
      console.log(this.addform.goods_cat)
    },
    // 获取商品分类
    async getShopClassify () {
      const { data: res } = await this.$http.get('categories')
      console.log(res)
      //判断请求是否成功
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.classify = res.data
    }
  },
  computed: {
    //获取分类商品的最后一个id
    classifID () {
      if (this.addform.goods_cat.length === 3) {
        return this.addform.goods_cat[2]
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.brnAdd {
  margin-top: 15px;
}
</style>