<template>
  <div style="padding: 10px; margin-bottom: 50px">
    <el-row>
      <el-col :span="4">
        <el-card style="width: 300px; height: 300px; color: #333">
          <div style="padding-bottom: 10px; border-bottom: 1px solid #ccc">在线用户<span style="font-size: 12px">（点击用户名开始聊天）</span></div>
          <div style="padding: 10px 0" v-for="user in users.list" :key="user.username">
            <span  @click="chat(user)">{{ user.username }}</span>
            <span style="font-size: 12px;color: limegreen; margin-left: 5px" v-if="user.username === chatUser.username">chatting...</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="20">
        <div style="width: 800px; margin: 0 auto; background-color: white;
                    border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <div style="text-align: center; line-height: 50px;">
            Web聊天室（{{ chatUser.username }}）
          </div>
          <div style="height: 330px; overflow:auto; border-top: 1px solid #ccc">
            <span v-for="msg in msg.All" v-html="createContent(msg)"></span>
          </div>
          <div style="height: 170px">
            <textarea v-model="text" style="height: 120px; width: 100%; padding: 20px; border: none; border-top: 1px solid #ccc;
             border-bottom: 1px solid #ccc; outline: none; resize:none;" @keydown.enter="send"></textarea>
            <div style="text-align: right; padding-right: 10px; padding-top: 5px">
              <el-button type="danger" @click="deleteHistory">清空聊天历史</el-button>
              <el-button type="success" @click="history">查看历史记录</el-button>
              <el-button type="primary"  @click="send">发送</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import request from "@/utils/request"
import {reactive, ref} from '@vue/reactivity'
import {onMounted} from "vue"
import api from '@/api/msg'
import {ElMessage, ElMessageBox} from "element-plus"

export default {
  name: "chat",
  setup(){
    let msg=reactive({SendMsg:[],ReceiverMsg:[],All:[]})
    let user=reactive({})
    let users=reactive({list:[]})
    let chatUser=reactive({
      username:'',
      avatar:''
    })
    let text=ref()
    let showText=ref()
    onMounted(()=>{
      init()
    })
    function init(){
      //从session中获取当前登录user的信息
      user = sessionStorage.getItem("user")?JSON.parse(sessionStorage.getItem("user")):{}
      request.get("/user/findAll").then(res=>{
        if(res.code===200){
          //获取全部用户，将当前登录的用户过滤掉
          users.list = res.data.filter(list => list.username !== user.username)
        }
      })
    }
    function chat(u){
      msg.All=[]
      chatUser.username=u.username
      chatUser.avatar=u.avatar
      api.receive(user.username,chatUser.username).then(res=>{
        if(res.code===200){
          msg.All=JSON.parse(JSON.stringify(res.data))
          createContent(msg)
        }
      })
    }
    function send(){
      let msg = {
        send:user.username,
        receiver:chatUser.username,
        msg:text.value
      }
      api.send(msg).then((res)=>{
        if(res.code===200) {
          ElMessage({
            message:"发送成功",
            type:'success'
          })
          history()
          text.value=''
        }
      })
    }
    async function history(){
      let list=[]
      await api.getAllMsg(user.username,chatUser.username).then(res=>{
        list = res.data
      })
      //将聊天记录按时间排序
      list.sort((a,b)=>{
        let obj1 = a['createTime']
        let obj2 = b['createTime']
        const val1 = Math.floor(new Date(obj1).getTime() / 1000)
        const val2 = Math.floor(new Date(obj2).getTime() / 1000)
        return val1 - val2
      })
      msg.All=list
    }
    function createContent(msg) {
      let html
      if (msg.send===user.username) {
        html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
            "  <div class=\"el-col el-col-22\" style=\"text-align: right; padding-right: 10px\">\n" +
            "    <div class=\"tip left\">" + msg.msg + "</div>\n" +
            "  </div>\n" +
            "  <div class=\"el-col el-col-2\">\n" +
            "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
            "    <img src=" + user.avatar + " style=\"object-fit: cover;\">\n" +
            "  </span>\n" +
            "  </div>\n" +
            "</div>";
      }
      else{
        html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
            "  <div class=\"el-col el-col-2\" style=\"text-align: right\">\n" +
            "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
            "    <img src=" + chatUser.avatar + " style=\"object-fit: cover;\">\n" +
            "  </span>\n" +
            "  </div>\n" +
            "  <div class=\"el-col el-col-22\" style=\"text-align: left; padding-left: 10px\">\n" +
            "    <div class=\"tip right\">" + msg.msg + "</div>\n" +
            "  </div>\n" +
            "</div>";
      }
      return html
    }
    function deleteHistory(){
      ElMessageBox.confirm(
          '确定要清空聊天记录吗?',
          'Warning',
          {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        api.deleteMsg(user.username,chatUser.username).then(res=>{
          if(res.code===200){
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
            history()
          }
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '删除失败',
        })
      })
    }
    return{
      msg,
      user,
      users,
      chat,
      chatUser,
      send,
      text,
      history,
      createContent,
      deleteHistory,
      showText
    }
  }
}
</script>
<style>
.tip {
  color: white;
  text-align: center;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  width:auto;
  display:inline-block !important;
  display:inline;
}
.right {
  background-color: deepskyblue;
}
.left {
  background-color: forestgreen;
}
</style>
