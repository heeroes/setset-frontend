<script setup>
import { ref } from "vue";
import planApi from "@/api/plan";
import PlanDetailShareView from "@/components/plan_detail/PlanDetailShareView.vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteLeave,
  RouterLink,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import KakaoMapView from "@/components/plan_detail/KakaoMapView.vue";
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

const scrollToDay = (index) => {
  const dayElement = document.getElementById(`day-${index}`);
  if (dayElement) {
    dayElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
const isVisible = ref(false);
const savePlan = () => {};
const sharePlan = () => {
  isVisible.value = !isVisible.value;
};
const removePD = async (pdId) => {
  await planApi.delete(`/detail/${pdId}`);
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
          v-if="planDetailArrays"
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
        <div class="tabs">
          <button
            class="tab"
            v-for="index in planDetailArrays.length"
            :key="index"
            @click="scrollToDay(index)"
          >
            {{ index === 1 ? "Default" : "Day " + (index - 1) }}
          </button>
        </div>
        <div
          id="day-{{ index }}"
          class="content-area"
          v-for="(details, index) in planDetailArrays"
          :key="index"
        >
          <h2>{{ index === 0 ? "Default" : "Day " + index }}</h2>
          <div class="content-grid">
            <div v-for="(pd, idx) in details" :key="idx" class="content-card">
              <div class="image-container">
                <img :src="pd.attraction.image" />
                <button
                  class="close-button"
                  v-if="!isGuest"
                  @click="removePD(pd.id)"
                >
                  X
                </button>
              </div>
              <h3>{{ pd.attraction.title }}</h3>
              <p>{{ pd.addr }}</p>
            </div>
          </div>
        </div>
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
.image-container {
  position: relative;
}

.image-container img {
  max-width: 100%;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
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

.day-plan {
  margin-bottom: 20px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.content-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.content-card:hover {
  transform: translateY(-5px);
}
</style>
