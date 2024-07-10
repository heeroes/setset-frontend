<script setup>
import { ref, watch } from "vue";
import planApi from "@/api/plan";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import KakaoMapView from "@/components/plan_detail/KakaoMapView.vue";
import PlanDetailListView from "@/components/plan_detail/PlanDetailListView.vue";
import SidebarSearch from "@/components/plan_detail/SidebarSearch.vue";
import RegionDisasterInfoView from "@/components/plan_detail/RegionDisasterInfoView.vue";
import PlanUpdateView from "@/components/plan_detail/PlanUpdateView.vue";

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
const startDate = ref("");
const endDate = ref("");
const days = ref("");
const planRegionList = ref("");

const getDetail = async () => {
  const url = `/${id.value}`;
  console.log(url);
  const { data } = await planApi.get(url);
  console.log("plan detail : ", data);
  plan.value = data.result;
  plan.value.region = plan.value.region.split(",");
  planRegionList.value = plan.value.region;
};

watch(
  plan,
  () => {
    console.log("시작 : ", plan.value.startDate);
    console.log("끝 : ", plan.value.endDate);

    startDate.value = new Date(plan.value.startDate);
    endDate.value = new Date(plan.value.endDate);

    const timeDifference = endDate.value - startDate.value;
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24) + 1;
    console.log("여행 일수 호출 : ", Math.ceil(dayDifference));

    days.value = Math.ceil(dayDifference); // 날짜 차이를 반올림해서 반환합니다

    planDetailArrays.value = Array.from({ length: days.value + 1 }, () => []);

    // Fill planDetailArrays based on detail.day
    plan.value.planDetailList.forEach((detail) => {
      if (planDetailArrays.value[detail.day]) {
        planDetailArrays.value[detail.day].push(detail);
      }
    });
    console.log("plandetail list : ", planDetailArrays.value.length);
  },
  { deep: true }
);

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

const isUpdateShow = ref(false);
const updateShow = () => {
  isUpdateShow.value = !isUpdateShow.value;
};

const close = () => {
  getDetail();
  isUpdateShow.value = false;
};

getDetail();
</script>
<template>
  <div
    :class="['app-container', { 'sidebar-open': isSidebarOpen }]"
    style="margin-right: 5%"
  >
    <button
      class="hamburger"
      @click="toggleSidebar"
      :style="{ zIndex: isSidebarOpen ? '1001' : '0' }"
    >
      {{ isSidebarOpen ? "X" : "☰" }}
    </button>
    <div class="sidebar" v-if="isSidebarOpen">
      <SidebarSearch />
    </div>
    <div class="content">
      <div class="plan_info" style="margin-bottom: 20px">
        <div class="title-container">
          <h1 class="title" style="font-size: 30px">{{ plan.title }}</h1>
          <h3 v-for="region in plan.region" :key="region" class="location-tag">
            #{{ region }}
          </h3>
        </div>
        <h3 style="color: gray">{{ plan.startDate }} ~ {{ plan.endDate }}</h3>
        <button
          class="updatePlan-btn"
          @click="updateShow"
          v-show="!isGuest"
          style="
            border-radius: 99px;
            border: 2px solid #333; /* 경계선 추가 및 색상 지정 */
          "
        >
          수정
        </button>
        <PlanUpdateView
          v-if="isUpdateShow"
          :plan="plan"
          :id="id"
          :planRegionList="planRegionList"
          @close="close"
        />
      </div>

      <div class="main-content">
        <div class="left-content">
          <div class="map">
            <KakaoMapView
              :key="planDetailArrays"
              :planDetailArrays="planDetailArrays"
              :planId="plan.id"
            />
          </div>
          <div class="disaster">
            <RegionDisasterInfoView :planRegionList="planRegionList" />
          </div>
        </div>
        <div class="content-area">
          <PlanDetailListView
            :key="planDetailArrays"
            :planDetailArrays="planDetailArrays"
            :planId="id"
            :isGuest="isGuest"
            @changePlan="changePlan"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.app-container {
  display: flex;
  position: relative;
  /* transition: margin-left 0.3s; */
  margin-top: 10px;
}
.hamburger {
  font-size: 40px;
  cursor: pointer;
  position: fixed;
  left: 10px;
  z-index: 1001;
  transition: top 0.3s; /* top 속성에 대한 전환 효과 추가 */
}
.sidebar {
  width: 30%;
  height: 100%;
  position: fixed;
  top: 0;
  left: -30%; /* 초기 위치를 화면 밖으로 */
  transition: transform 0.3s;
  z-index: 999;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-open {
  transform: translateX(30%);
  /* 사이드바를 보이도록 이동 */
}

/* 사이드바 제외 부분 */
.content {
  margin-left: 40px;
  width: calc(100% - 40px);
}
.plan_info {
  margin-bottom: 20px;
  margin-left: 20px;
}

.title-container {
  display: flex;
  align-items: center; /* 타이틀과 location-tag를 수직 정렬 */
  margin-bottom: 5px;
}
.title {
  margin-right: 20px;
}
.location-tag {
  background-color: #abd373;
  border-radius: 99px;
  color: white;
  width: 12%;
  text-align: center;
  padding: 5px 10px; /* location-tag의 내용과 여백 조절 */
  margin-right: 5px;
}
.main-content {
  display: flex;
  flex: 1;
  margin-top: 10px; /* 헤더의 높이에 맞춰 조정 */
  overflow: hidden;
}
.left-content {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-left: 1%;
}
.disaster {
  margin-top: 10%;
}
.map-container {
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.map {
  width: 40vw;
  height: 80vh;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
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

/* 수정 모달 */
.updatePlan-btn {
  border-radius: 99px;
  border: 2px solid #333; /* 경계선 추가 및 색상 지정 */
  padding: 5px 10px; /* location-tag의 내용과 여백 조절 */
  font-size: 12px;
}

.heading {
  text-align: center;
  font-weight: 900;
  font-size: 30px;
  color: rgb(16, 137, 211);
}

.form {
  margin-top: 20px;
}

.form .update-btn {
  transform: scale(1.03);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
}

.form .update-btn {
  transform: scale(0.95);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
}
.title-and-map {
  display: flex;
}
</style>
