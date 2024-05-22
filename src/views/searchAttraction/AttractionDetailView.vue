<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import planApi from "@/api/plan";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

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
  const url = `http://localhost/api/v1/attraction/${attId.value}`;
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
  <div v-if="!isGuest" class="dropdown" @click="toggleDropdown(index)">
    계획 추가하기
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
  <div class="destination-details">
    <div class="destination-image">
      <img :src="attraction.image" alt="attraction Image" />
    </div>
    <div class="destination-info">
      <h2 class="destination-title">{{ attraction.title }}</h2>
      <h5>{{ attraction.addr }}</h5>
      <p class="destination-overview">{{ attraction.overview }}</p>
      <div class="destination-popularity">
        <p>👍: {{ attraction.popularity }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.destination-details {
  display: flex;
  align-items: center;
}

.destination-image img {
  width: 50vw;
  max-width: 400px;
  height: auto;
  padding: 40px;
}

.destination-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.destination-overview {
  margin-bottom: 20px;
}

.destination-popularity {
  font-style: italic;
}
.dropdown-content button {
  display: block;
  width: 100px;
  padding: 8px 12px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-content button:hover {
  background-color: #f1f1f1;
}
</style>
