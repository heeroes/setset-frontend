<script setup>
import { RouterLink, RouterView } from "vue-router";
import PlanListView from "@/components/plan/PlanListView.vue";
</script>

<template>
  <div>
    <div class="img">
      <h1>🎈나의 여행 계획</h1>
    </div>
  </div>
  <PlanListView />
</template>

<style scoped>
.img {
  height: 300px;
  background-image: url("@/assets/img/plan/plan_list.png");
  background-position: center;
  background-size: cover;
}
</style>
