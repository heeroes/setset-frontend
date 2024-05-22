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
      ><img class="logo" src="@/assets/img/logo.png" alt="홈 버튼"
    /></RouterLink>

    <nav>
      <ul v-if="userInfo == null">
        <li><RouterLink :to="{ name: 'Login' }">로그인</RouterLink></li>
      </ul>
      <ul v-else class="right-menu"> 
        <li><RouterLink :to="{ name: 'GroupFeed' }">피드</RouterLink></li>
        <li><RouterLink :to="{ name: 'Plan' }">My Plan</RouterLink></li>
        <li>
          <RouterLink to="/my-page">
            {{userInfo.nickname}}님
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/my-page">
            <img class="profile" :src="imageUrl" alt="" />
          </RouterLink>
        </li>
          
      </ul>
    </nav>
  </header>
</template>

<style scoped>
* {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

header {
  border: 1px solid black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 110px;
  padding: 0 20px;
}

.logo {
  height: 90px;
  margin-bottom: 5px;
}

nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
}

ul {
  display: flex;
  align-items: center;
}

li {
  margin-left: 30px;
}

.profile {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.right-menu {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
