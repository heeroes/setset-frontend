<script setup>
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import userApi from "@/api/user";
const { VITE_IMAGE_BASE_URL } = import.meta.env;

const authStore = useAuthStore();
const userInfo = ref(null);

const imageUrl = ref("");
// console.log("image : ", imageURL.value);

const getUserInfo = async () => {
  const { data } = await userApi.get("/profile");
  console.log(data);
  userInfo.value = data;
  if (userInfo.value) {
    imageUrl.value = VITE_IMAGE_BASE_URL + userInfo.value.result.imageKey;
    console.log("imageKey : " + imageUrl.value);
  }
};

getUserInfo();
console.log("user", userInfo);
</script>

<template>
  <header>
    <RouterLink to="/"
      ><img src="@/assets/img/logo.png" alt="홈 버튼"
    /></RouterLink>
    <nav>
      <ul v-if="userInfo == null">
        <li><RouterLink to="/login">로그인</RouterLink></li>
      </ul>
      <ul v-else>
        <li>피드</li>
        <li><RouterLink to="/plan">마이플랜</RouterLink></li>
        <li>
          <img class="profile" :src="imageUrl" alt="" />{{
            userInfo.result.nickname
          }}님
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
* {
  list-style-type: none;
}
header {
  border: 1px solid black;
  display: flex;
  justify-content: space-between;
}
ul {
  border: 1px solid blue;
  display: flex;
  justify-content: right;
  align-items: center;
}
li {
  padding-left: 30px;
}
.profile {
  width: 100px;
}
</style>
