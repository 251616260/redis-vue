<template>
  <div class="bg" style="width: 100%;height: 100vh ;overflow: hidden">
    <div style="width: 300px;margin: 150px auto">
      <div style="color:#ccc;font-size: 30px;text-align: center;padding: 30px 0">欢迎登录</div>
      <el-form ref="form" :model="form">

        <el-form-item prop="userTel">
          <el-input prefix-icon="User" v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input prefix-icon="Lock" v-model="form.password"  placeholder="请输入密码"
                    @keydown.enter="login"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" type="primary"
                     @click="login" >登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/assets/css/global.css'
import api from "@/api/user"

export default {
  name: "Login",
  data(){
    return{
      form:{
        username:'',
        password:''
      },
    }
  },
  methods: {
    login: function () {
      api.login(this.form).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "登录成功！"
          })
          console.log(res.data)
          sessionStorage.setItem("user", JSON.stringify(res.data))//缓存用户信息
          this.$router.push("/chat")
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.bg{
  background: #9053c7;
  background: -webkit-linear-gradient(-135deg, #c850c0, #4158d0);
  background: -o-linear-gradient(-135deg, #c850c0, #4158d0);
  background: -moz-linear-gradient(-135deg, #c850c0, #4158d0);
  background: linear-gradient(-135deg, #c850c0, #4158d0);
}
</style>
