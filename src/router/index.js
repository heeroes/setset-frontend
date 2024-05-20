import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/user/LoginView.vue";
import GroupFeedView from "@/views/group/GroupFeedView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/login/success",
      name: "login-success",
      beforeEnter: (to, from, next) => {
        const token = to.query.accessToken;
        console.log(token);
        const auth = useAuthStore();
        auth.setAccessToken(token);
        auth.getUserInfo();
        next({ path: "/" });
      },
    },
    {
      path:"/feed",
      name:"GroupFeed",
      component:GroupFeedView
    }
  ],
});

export default router;
