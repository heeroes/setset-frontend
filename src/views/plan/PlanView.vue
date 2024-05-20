<script setup>
import { ref, onMounted } from "vue";
import { useRouter, RouterView, RouterLink } from "vue-router";
import axios from "axios";
import planApi from "@/api/plan";

const router = useRouter();
const plans = ref([]);

// 랜덤 이미지 URL을 생성하는 함수
function fetchRandomImage() {
  return `https://picsum.photos/600/400?random=${Math.random()}`;
}

const getPlanList = async () => {
  const { data } = await planApi.get();
  console.log("response : ", data);
  plans.value = data.result.plans.map((plan) => ({
    ...plan,
    imageUrl: fetchRandomImage(),
  }));
};

const isVisible = ref(false);
const addPlan = () => {
  isVisible.value = !isVisible.value;
};
const inputInfo = ref({});
const detailPlan = (plan) => {
  console.log("plan id : ", plan.id);
  router.push({ name: "PlanDetail", params: { id: plan.id } });
};

const close = () => {
  isVisible.value = false;
};

onMounted(() => {
  getPlanList();
});
</script>

<template>
  <div>
    <div class="img">
      <h1>🎈나의 여행 계획</h1>
    </div>
    <div>
      <div v-for="plan in plans" :key="plan.id" class="card">
        <div @click="detailPlan(plan)">
          <img class="planImg" :src="plan.imageUrl" alt="Random Image" />
          <div>{{ plan.title }}</div>
          <div>
            <span>{{ plan.region }}</span>
            <br />
            <span>{{ plan.startDate }} ~ {{ plan.endDate }}</span>
          </div>
        </div>
      </div>
      <div class="card" @click="addPlan"><h1>+</h1></div>
      <div v-if="isVisible" class="modal-overlay">
        <div class="modal">
          <slot>
            <form @submit.prevent="createPlan">
              <input type="text" />
            </form>
          </slot>
          <button @click="close">Close</button>
        </div>
      </div>

      <!-- <RouterLink to="/create" @close="close"></RouterLink>
      <RouterView /> -->
    </div>
  </div>
</template>

<style scoped>
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
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  max-width: 100%;
}

.img {
  height: 300px;
  background-image: url("@/assets/img/plan/plan_list.png");
  background-position: center;
  background-size: cover;
}
.card {
  position: relative;
  width: 11.875em;
  height: 16.5em;
  box-shadow: 0px 1px 13px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 120ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0.5em;
}
.planImg {
  width: 100%;
}
</style>
