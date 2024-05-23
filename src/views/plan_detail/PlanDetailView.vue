<script setup>
import { ref, watch } from "vue";
import planApi from "@/api/plan";
import PlanDetailShareView from "@/components/plan_detail/PlanDetailShareView.vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import KakaoMapView from "@/components/plan_detail/KakaoMapView.vue";
import PlanDetailListView from "@/components/plan_detail/PlanDetailListView.vue";
import SidebarSearch from "@/components/plan_detail/SidebarSearch.vue";
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
const startDate = ref("");
const endDate = ref("");
const days = ref("");

const getDetail = async () => {
  const url = `/${id.value}`;
  console.log(url);
  const { data } = await planApi.get(url);
  console.log("plan detail : ", data);
  plan.value = data.result;
  console.log(plan.value);
};

watch(
  plan,
  () => {
    console.log("시작 : ", plan.value.startDate);
    console.log("끝 : ", plan.value.endDate);

    startDate.value = new Date(plan.value.startDate);
    endDate.value = new Date(plan.value.endDate);

    const timeDifference = endDate.value - startDate.value;
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
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
  isUpdateShow.value = false;
  isVisible.value = false;
};

const isUpdateShow = ref(false);
const updateShow = () => {
  isUpdateShow.value = !isUpdateShow.value;
};

const updatePlan = async () => {
  planApi
    .put(`/${id.value}`, plan.value)
    .then((response) => {
      console.log(response.data);
      getDetail();
      close();
    })
    .catch((error) => {
      console.error(error);
    });
};
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
          <h3 class="location-tag">#{{ plan.region }}</h3>
        </div>
        <h3 style="color: gray">{{ plan.startDate }} - {{ plan.endDate }}</h3>
        <button
          class="updatePlan-btn"
          @click="updateShow"
          style="
            border-radius: 99px;
            border: 2px solid #333; /* 경계선 추가 및 색상 지정 */
          "
        >
          수정
        </button>
        <div v-if="isUpdateShow" class="modal-overlay">
          <div class="modal">
            <form @submit.prevent="updatePlan">
              여행명 : <input type="text" v-model="plan.title" /> <br />
              여행 지역:
              <input type="text" v-model="plan.region" />
              <br />
              시작 날짜 :
              <input type="date" v-model="plan.startDate" :max="plan.endDate" />
              <br />
              끝 날짜 :
              <input type="date" v-model="plan.endDate" :min="plan.startDate" />
              <input type="submit" value="수정하기" />
              <input type="button" @click="close" value="닫기" />
            </form>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="map">
          <KakaoMapView
            :key="planDetailArrays"
            :planDetailArrays="planDetailArrays"
            :planId="plan.id"
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
          </div>
          <PlanDetailListView
            :key="planDetailArrays"
            :planDetailArrays="planDetailArrays"
            :planId="id"
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
  font-size: 24px;
  cursor: pointer;
  position: fixed;
  left: 10px;
  z-index: 1001;
  transition: top 0.3s; /* top 속성에 대한 전환 효과 추가 */
}
.sidebar {
  width: 300px;
  height: 100%;
  position: fixed;
  top: 0;
  left: -300px; /* 초기 위치를 화면 밖으로 */
  transition: transform 0.3s;
  z-index: 999;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-open {
  transform: translateX(300px);
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
  width: 5%;
  text-align: center;
  padding: 5px 10px; /* location-tag의 내용과 여백 조절 */
}
.main-content {
  display: flex;
  flex: 1;
  margin-top: 10px; /* 헤더의 높이에 맞춰 조정 */
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
/* 수정 모달 */

.updatePlan-btn {
  border-radius: 99px;
  border: 2px solid #333; /* 경계선 추가 및 색상 지정 */
  padding: 5px 10px; /* location-tag의 내용과 여백 조절 */
  font-size: 12px;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  max-width: 100%;
  z-index: 9999;
}

.title-and-map {
  display: flex;
}
</style>
