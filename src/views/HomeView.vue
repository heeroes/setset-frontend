<script setup>
import { RouterLink, RouterView } from "vue-router";
import DisasterInfoView from "@/components/home/DisasterInfoView.vue";
import NewsView from "@/components/home/NewsView.vue";
import RankingView from "@/components/home/RankingView.vue";
import SafeGuideView from "@/components/home/SafeGuideView.vue";
import SearchView from "@/components/home/SearchView.vue";
</script>

<template>
  <div>
    <SearchView />
    <RankingView />
    <SafeGuideView />
    <DisasterInfoView />
    <NewsView />
  </div>
</template>

<style scoped></style>
