import { createRouter, createWebHistory } from 'vue-router'
import Login from "../views/Login"
import Chat from "../views/chat"

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
