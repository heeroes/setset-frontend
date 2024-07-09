<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import SearchBar from "@/components/attraction/SearchBar.vue";
import SearchResult from "@/components/attraction/SearchResult.vue";

const route = useRoute();
const keyword = route.query.keyword;
</script>

<template>
  <div class="container">
    <SearchBar style="margin-top: 30px; margin-bottom: 20px; width: 100%" />
    <SearchResult :keyword="keyword" />
  </div>
</template>

<style scoped>
.container {
  margin-left: 25%;
  margin-right: 25%;
  width: 50% /* 전체 너비에서 좌우 마진을 빼고 나머지를 너비로 설정 */
}
</style>
