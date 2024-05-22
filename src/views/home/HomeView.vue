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
    <div class="safe_info">
      <DisasterInfoView />
      <NewsView />
    </div>
  </div>
</template>

<style scoped>
.safe_info {
  display: flex;
  justify-content: space-evenly;
}
</style>
