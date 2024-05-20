<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { userInfo, imageUrl } = storeToRefs(authStore);

console.log("header userInfo", userInfo);
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
        <li>마이플랜</li>
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
