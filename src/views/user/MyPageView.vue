<script setup>
import { RouterLink, RouterView } from "vue-router";
import DisasterInfoView from "@/components/home/DisasterInfoView.vue";
import UserInfoView from "@/components/user/UserInfoView.vue"
import MyPlanView from "@/components/user/MyPlanView.vue"
import MyGroupView from "@/components/user/MyGroupView.vue"

</script>

<template>
  <div>
    <UserInfoView />
    <MyPlanView />
    <MyGroupView/>
  </div>
</template>

<style scoped></style>
