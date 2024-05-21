<script setup>
import { RouterLink, RouterView } from "vue-router";
import UserInfoView from "@/components/user/UserInfoView.vue"
import MyGroupView from "@/components/user/MyGroupView.vue"
import PlanListView from "@/components/plan/PlanListView.vue";

</script>

<template>
  <div>
    <UserInfoView />
    <h1>🎈나의 여행 계획</h1>
    <PlanListView />
    <MyGroupView/>
  </div>
</template>

<style scoped></style>
