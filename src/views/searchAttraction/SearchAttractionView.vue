<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import SearchBar from "@/components/attraction/SearchBar.vue";
import SearchResult from "@/components/attraction/SearchResult.vue";

const route = useRoute();
const keyword = route.query.keyword;
</script>

<template>
  <div>
    <SearchBar />
    <SearchResult :keyword="keyword" />
  </div>
</template>

<style scoped></style>
