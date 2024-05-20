<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { userInfo, imageUrl } = storeToRefs(authStore);
</script>

<template>
  <div>
    <h1>유저정보</h1>
    <ul>
      <img class="profile-image" :src="imageUrl" alt="" />
      <li>{{ userInfo.result.nickname }}</li>
      <li>{{ userInfo.result.email }}</li>
    </ul>
  </div>
</template>

<style scoped>
* {
  list-style-type: none;
}
.profile-image {
  border-radius: 50%;
  height: 124px;
  width: 124px;
}
</style>
