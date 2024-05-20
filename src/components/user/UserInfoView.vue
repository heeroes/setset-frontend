<script setup>
import { ref } from "vue";
import userApi from "@/api/user";

const { VITE_IMAGE_BASE_URL } = import.meta.env;
const userInfo = ref(null);
const imageUrl = ref("");

const getUserInfo = async () => {
  const { data } = await userApi.get("/profile");
  console.log(data);
  userInfo.value = data.result;
  if (userInfo.value) {
    imageUrl.value = VITE_IMAGE_BASE_URL + userInfo.value.imageKey;
    console.log("imageKey : " + imageUrl.value);
  }
};
getUserInfo();
</script>

<template>
  <div>
    <h1>유저정보</h1>
    <ul>
      <li>{{ userInfo.nickname}}</li>
    </ul>
  </div>
</template>

<style scoped></style>