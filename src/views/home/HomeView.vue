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
    <div class="content">
      <RankingView />
      <SafeGuideView />
      <div class="safe_info">
        <DisasterInfoView />
        <NewsView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  margin: 0 15%; /* Adjust the margin value as needed */
}
.safe_info {
  display: flex;
  justify-content: space-evenly;
  align-items: stretch; /* Ensure children have the same height */
  margin: 0 -20px; /* Negate the content margin for safe_info */
}
.safe_info > * {
  margin: 0 20px; /* Apply margin to the children of safe_info */
  flex: 1; /* Make each child take an equal amount of space */
  display: flex;
  flex-direction: column; /* Ensure content within the children is properly aligned */
}
</style>
