import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/user/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
      {
        path:"/login/success",
        name:"login-success",
        beforeEnter:(to,from,next)=>{
          const token = to.query.accessToken;
          console.log(token);
          const auth = useAuthStore();
          auth.setAccessToken(token);
          next({path:'/'});
        }
    }
  ]
})

export default router
