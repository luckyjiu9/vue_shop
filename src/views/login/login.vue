<template>
  <div>
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="logo_box">
        <img src="../../assets/logoimg.jpg" alt />
      </div>
      <!-- //登陆表单区 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        :model="loginForm"
        :rules="loginFormRules"
        class="from_login"
      >
        <!-- //用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input show-password v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- //按钮区域 -->
        <el-form-item class="btns_input">
          <el-button type="success" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginshop_login } from '../../api/user'
export default {
  data () {
    return {
      //这是数据表单的数据表单对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //这是表单验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 14, message: '长度在 6到 14个字符', trigger: 'blur' }
        ]
      }

    }

  },
  methods: {
    //表单的重置
    resetLoginForm () {
      // console.log(this)
      //ref表单的引对象
      // resetFields重置表单
      this.$refs.loginFormRef.resetFields()
    },
    //表单的预验证
    login () {
      // validate验证表单格式
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const res = await loginshop_login(this.loginForm)

        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登录成功')
        //保存到sessionStorage
        // console.log(res.data.token)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('./home')
      })
    }
  },
}
</script>

<style scoped>
.from_login {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
}
.btns_input {
  display: flex;
  justify-content: center;
}
.logo_box img {
  height: 130px;
  width: 130px;
  border-radius: 50% 50%;
}
.logo_box {
  height: 130px;
  box-shadow: 0 0 10px rgb(123, 241, 241);
  width: 130px;
  border-radius: 50% 50%;
  position: absolute;
  border: 2px solid rgb(0, 0, 0);
  background: white;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login_box {
  width: 400px;
  height: 300px;
  background: white;
  border-radius: 10px 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
