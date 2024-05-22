<script setup>
import { RouterLink, RouterView } from "vue-router";
import UserInfoView from "@/components/user/UserInfoView.vue";
import MyGroupView from "@/components/user/MyGroupView.vue";
import PlanListView from "@/components/plan/PlanListView.vue";
</script>

<template>
  <div class="page-container">
    <div class="header"></div>
    <div class="content-container">
      <UserInfoView class="left-panel" />
      <div class="right-panel">
        <div class="travel-plans">
          <h2>🎈나의 여행 계획</h2>
          <PlanListView />
        </div>
        <div class="groups">
          <h2>그룹</h2>
          <MyGroupView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  min-height: 100vh;
}

.header {
  width: 100%;
  height: 200px;
  background-color: rgba(230, 249, 114, 0.47);
}

.content-container {
  display: flex;
  width: 90%;
  max-width: 1200px;
  background-color: #fcfcfc;
  padding: 20px;
  border-radius: 10px;
  margin-top: -100px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.left-panel {
  flex: 1;
  max-width: 270px;
  margin-right: 20px;
}

.right-panel {
  flex: 3;
  display: flex;
  flex-direction: column;
}

.travel-plans,
.groups {
  margin-top: 20px;
}

.travel-plans h2,
.groups h2 {
  margin-bottom: 10px;
}

.plans {
  display: flex;
  justify-content: space-around;
}

.plan-card {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 200px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.group-list {
  display: flex;
  flex-direction: column;
}

.group,
.add-group {
  padding: 10px;
  background-color: white;
  margin: 5px 0;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
