import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/home/HomeView.vue";
import LoginView from "@/views/user/LoginView.vue";
import PlanView from "@/views/plan/PlanView.vue";
import PlanDetailView from "@/views/plan_detail/PlanDetailView.vue";
import PlanListView from "@/components/plan/PlanListView.vue";
import GroupFeedView from "@/views/group/GroupFeedView.vue";
import { useAuthStore } from "@/stores/auth";
import MyPageView from "@/views/user/MyPageView.vue";
import NewArticle from "@/components/group/NewArticle.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/my-page",
      name: "MyPage",
      component: MyPageView,
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
      path: "/plan",
      name: "Plan",
      component: PlanView,
      children: [
        {
          path: "list",
          name: "PlanList",
          component: PlanListView,
        },
      ],
    },
    {
      path: "/plan/:id",
      name: "PlanDetail",
      component: PlanDetailView,
    },
    {
      path: "/feed",
      name: "GroupFeed",
      component: GroupFeedView,
    },
    {
      path: "/new-article/:id",
      name: "NewArticle",
      component: NewArticle,
    },
  ],
});

export default router;
