<script setup>
// import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { computed, ref, reactive } from "vue";

// const authStore = useAuthStore();
const router = useRouter();
const user = ref(null);

// const user = computed(() => authStore.user);
// const logout = () => {
//   if (!confirm("로그아웃 하시겠습니까?")) return;
//   authStore.logout();

//   router.push("/"); //홈으로
// };
</script>

<template>
  <header>
    <RouterLink to="/"
      ><img src="@/assets/img/logo.png" alt="홈 버튼"
    /></RouterLink>
    <nav>
      <ul>
        <li>피드</li>
        <li>마이플랜</li>
        <li>프로필</li>
        <!-- 프로필 -> 마이페이지 -->

        <!-- <li v-if="">검색창</li> -->
        <!-- <li><RouterLink to="">피드</RouterLink></li>
        <li><RouterLink to=">`My plan`</RouterLink></li>
        <li><RouterLink to="">마이페이지</RouterLink></li> -->
      </ul>

      <ul v-if="user == null">
        <!-- <li><RouterLink to="/login">로그인</RouterLink></li> -->
        <li>로그인</li>
      </ul>
      <ul v-else>
        <!-- <li>{{ user.id }}님 접속 중</li>
        <li @click="logout">로그아웃</li> -->
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

  ul {
    display: flex;
    justify-content: space-around;
    margin-left: 5px;
  }
}
</style>
