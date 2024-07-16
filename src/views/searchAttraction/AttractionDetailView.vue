<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import planApi from "@/api/plan";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

const attractionTypes = {
  12: "관광지",
  14: "문화시설",
  15: "축제공연행사",
  28: "레포츠",
  32: "숙박",
  38: "쇼핑",
  39: "음식점",
};
const authStore = useAuthStore();
const { userInfo } = storeToRefs(authStore);
const isGuest = ref(true);
const pageSetting = () => {
  console.log("유저 : ", userInfo);
  if (userInfo.value) isGuest.value = false;
};
pageSetting();
const attraction = ref({});
const route = useRoute();
const attId = ref(route.params.id);
const plans = ref({});
const getAttractionDetail = async () => {
  const url = `https://setset.site/api/v1/attraction/${attId.value}`;
  const { data } = await axios.get(url);
  attraction.value = data.result;
  console.log("attraction", attraction);
};

const getPlanList = async () => {
  const response = await planApi.get("");
  plans.value = response.data.result.plans;
  console.log("plans", response.data.result.plans);
};

const addToPlan = async (planId) => {
  try {
    await planApi.post(`/detail`, {
      attractionId: attId.value,
      planId: planId,
    });
    alert(`계획에 여행지 추가가 완료되었습니다!`);
  } catch (error) {
    console.error("Error adding attraction to plan:", error);
    alert("Failed to add attraction to plan");
  }
};
const dropdownIndex = ref(null);
const toggleDropdown = (index) => {
  dropdownIndex.value = dropdownIndex.value === index ? null : index;
};
getAttractionDetail();
getPlanList();
</script>
<template>
  <div v-if="!isGuest" class="dropdown">
    <button class="icon-btn add-btn" @click="toggleDropdown(index)">
      <div class="add-icon"></div>
      <div class="btn-txt">Add to Plan ▶</div>
    </button>
    <div v-if="dropdownIndex === index" class="dropdown-content">
      <button
        v-for="plan in plans"
        :key="plan.id"
        :value="plan.id"
        @click="addToPlan(plan.id)"
      >
        {{ plan.title }}
      </button>
    </div>
  </div>
  <div>
    <div class="destination-title">
      <p class="title_collect">
        <h2>
        {{ attraction.title }} &nbsp;&nbsp;&nbsp;&nbsp;
      </h2>
        <button class="cssbuttons-io-button">
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M1 14.5a6.496 6.496 0 0 1 3.064-5.519 8.001 8.001 0 0 1 15.872 0 6.5 6.5 0 0 1-2.936 12L7 21c-3.356-.274-6-3.078-6-6.5zm15.848 4.487a4.5 4.5 0 0 0 2.03-8.309l-.807-.503-.12-.942a6.001 6.001 0 0 0-11.903 0l-.12.942-.805.503a4.5 4.5 0 0 0 2.029 8.309l.173.013h9.35l.173-.013zM13 12h3l-4 5-4-5h3V8h2v4z"
            fill="currentColor"
          ></path>

          <span>  # {{ attractionTypes[attraction.contentTypeId] }}</span>
        </button>
      </p>
      <h2 class="destination-popularity">👍 {{ attraction.popularity }}</h2>
    </div>
    <h5>주소 : {{ attraction.addr }}</h5>
    <div class="destination-details">
      <div class="attraction-image">
        <img
          :src="attraction.image"
          :alt="attraction.title"
          v-if="attraction.image"
        />
      </div>
      <div class="destination-info">
        {{ attraction.overview }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.cssbuttons-io-button {
  display: flex;
  align-items: center;
  font-family: inherit;
  font-weight: 500;
  font-size: 17px;
  padding: 0.8em 1.5em 0.8em 1.2em;
  color: white;
  background-color: #9deda5;

  border: none;
  letter-spacing: 0.05em;
  border-radius: 20em;
}
.destination-details {
  margin:3% 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
h5 {
  margin-top: 2%;
  margin-left: 10%;
}
.title_collect {
  display: flex;
  justify-content: start;
}
.destination-image img {
  width: 100%;
}

.destination-title {
  font-size: 24px;
  margin-bottom: 10px;
  margin-left: 10%;
  margin-right: 15%;
  display: flex;
  justify-content: space-between;
}

.destination-info {
  overflow: auto;
  width: 100%;
  padding: 3% 0px;
}

.destination-popularity {
  font-style: italic;
}
.dropdown {
  display: inline-block; /* 인라인 블록으로 변경하여 버튼 옆에 위치 */
  position: relative;
}

.dropdown-content {
  position: absolute;
  top: 50%; /* 버튼 바로 아래에 위치 */
  left: 90%; /* 버튼의 왼쪽에 맞춤 */
  background-color: white;
  border: 1px solid #ccc;
  z-index: 1000;
  width: 120px; /* 너비 조정 */
  margin-top: 5px; /* 버튼과의 간격 조정 */
}

/* 나머지 스타일은 그대로 유지 */


.dropdown-content button {
  display: block;
  width: 120px;
  padding: 8px 12px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-content button:hover {
  background-color: #f1f1f1;
}

.icon-btn {
  margin: 2em;
  width: 50px;
  height: 50px;
  border: 1px solid #cdcdcd;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
  transition: width 0.2s ease-in-out;
  font-weight: 500;
  font-family: inherit;
}

.add-btn:hover {
  width: 120px;
}

.add-btn::before,
.add-btn::after {
  transition: width 0.2s ease-in-out, border-radius 0.2s ease-in-out;
  content: "";
  position: absolute;
  height: 4px;
  width: 10px;
  top: calc(50% - 2px);
  background: seagreen;
}

.add-btn::after {
  right: 14px;
  overflow: hidden;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.add-btn::before {
  left: 14px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.icon-btn:focus {
  outline: none;
}

.btn-txt {
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 11px;
}

.add-btn:hover::before,
.add-btn:hover::after {
  width: 4px;
  border-radius: 2px;
}

.add-btn:hover .btn-txt {
  opacity: 1;
}

.add-icon::after,
.add-icon::before {
  transition: all 0.2s ease-in-out;
  content: "";
  position: absolute;
  height: 20px;
  width: 2px;
  top: calc(50% - 10px);
  background: seagreen;
  overflow: hidden;
}

.add-icon::before {
  left: 22px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.add-icon::after {
  right: 22px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.add-btn:hover .add-icon::before {
  left: 15px;
  height: 4px;
  top: calc(50% - 2px);
}

.add-btn:hover .add-icon::after {
  right: 15px;
  height: 4px;
  top: calc(50% - 2px);
}
</style>
