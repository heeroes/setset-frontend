<script setup>
import { ref } from "vue";
import planApi from "@/api/plan";
import PlanDetailShareView from "@/components/plan_detail/PlanDetailShareView.vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import KakaoMapView from "@/components/plan_detail/KakaoMapView.vue";
import PlanDetailListView from "@/components/plan_detail/PlanDetailListView.vue";
import { onMounted } from "vue";

const authStore = useAuthStore();
const { userInfo } = storeToRefs(authStore);
const isGuest = ref(true);
const pageSetting = () => {
  console.log("유저 : ", userInfo);
  if (userInfo.value) isGuest.value = false;
};
pageSetting();
const route = useRoute();
const id = ref(route.params.id);

console.log("receive : ", id.value);

const plan = ref("");
const planDetailArrays = ref("");
const getDetail = async () => {
  const url = `/${id.value}`;
  console.log(url);
  const { data } = await planApi.get(url);
  console.log("plan detail : ", data);
  plan.value = data.result;

  planDetailArrays.value = plan.value.planDetailList.reduce((acc, detail) => {
    // day가 존재하지 않는 경우에는 빈 배열을 만들어 줍니다.
    acc[detail.day] = acc[detail.day] || [];
    // 현재 요소를 해당 day 배열에 추가합니다.
    acc[detail.day].push(detail);
    return acc;
  }, []);
  console.log("plandetail list : ", planDetailArrays.value);
};

onMounted(() => {
  getDetail();
});

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const isVisible = ref(false);
const sharePlan = () => {
  isVisible.value = !isVisible.value;
};
const changePlan = () => {
  getDetail();
};
const close = () => {
  isVisible.value = false;
};
</script>
<template>
  <div :class="['app-container', { 'sidebar-open': isSidebarOpen }]">
    <button class="hamburger" @click="toggleSidebar">☰</button>
    <div class="title-container title-and-map">
      <h1>{{ plan.title }}</h1>
    </div>
    <div class="sidebar" v-if="isSidebarOpen">
      <!-- 사이드바 내용 -->
      <p>Sidebar Content</p>
    </div>

    <div class="main-content">
      <div class="map">
        <KakaoMapView
          :key="planDetailArrays"
          :planDetailArrays="planDetailArrays"
        />
      </div>
      <div class="content-area">
        <div class="tabs" v-show="!isGuest">
          <button @click="sharePlan">공유</button>
          <PlanDetailShareView
            :isVisible="isVisible"
            :planId="id"
            @close="close"
          />
          <button @click="savePlan">저장</button>
        </div>
        <PlanDetailListView
          :key="planDetailArrays"
          :planDetailArrays="planDetailArrays"
          @changePlan="changePlan"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.app-container {
  display: flex;
  transition: margin-left 0.3s;
}

.title-and-map {
  display: flex;
}

.title-container {
  margin-bottom: 20px;
}

.hamburger {
  font-size: 24px;
  cursor: pointer;
  margin-right: 10px;
}

.sidebar {
  width: 200px;
  background-color: #333;
  color: white;
  height: 100%;
  position: fixed;
  top: 0;
  left: -200px; /* 초기 위치를 화면 밖으로 */
  transition: transform 0.3s;
  z-index: 999;
}

.sidebar-open {
  transform: translateX(200px); /* 사이드바를 보이도록 이동 */
}

.main-content {
  display: flex;
  flex: 1;
  margin-top: 50px; /* 헤더의 높이에 맞춰 조정 */
  overflow: hidden;
}

.map-container {
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.map {
  width: 40vw;
  height: 80vh;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tab {
  margin-right: 10px;
  background-color: #eee;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
}
</style>
