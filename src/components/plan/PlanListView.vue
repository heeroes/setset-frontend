<script setup>
import { ref, onMounted } from "vue";
import { useRouter, RouterView } from "vue-router";
import planApi from "@/api/plan";
import PlanCreateView from "@/components/plan/PlanCreateView.vue";

const router = useRouter();
const plans = ref([]);

const getPlanList = async () => {
  const { data } = await planApi.get();
  console.log("response : ", data);

  plans.value = data.result.plans;
  console.log("plans : ", plans.value);
};

const isVisible = ref(false);
const addPlan = () => {
  isVisible.value = !isVisible.value;
};
const detailPlan = (plan) => {
  console.log("plan id : ", plan.id);
  router.push({ name: "PlanDetail", params: { id: plan.id } });
};

const close = () => {
  isVisible.value = false;
  getPlanList();
};

const removePlan = async (id) => {
  await planApi.delete(`/${id}`);
  getPlanList();
};

getPlanList();
</script>

<template>
  <div>
    <div v-for="plan in plans" :key="plan.id" class="card">
      <div @click="detailPlan(plan)">
        <div class="image-container">
          <img
            class="planImg"
            v-if="
              plan.planDetailList &&
              plan.planDetailList.length > 0 &&
              plan.planDetailList[0].attraction
            "
            :src="plan.planDetailList[0].attraction.image"
            alt=""
          />
          <img
            v-else
            src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
            alt=""
          />
          <button class="close-button" @click.stop="removePlan(plan.id)">
            X
          </button>
        </div>

        <div>{{ plan.title }}</div>
        <div>
          <span>{{ plan.region }}</span>
          <br />
          <span>{{ plan.startDate }} ~ {{ plan.endDate }}</span>
        </div>
      </div>
    </div>
    <div class="card" @click="addPlan"><h1>+</h1></div>
    <PlanCreateView :isVisible="isVisible" @close="close" />
  </div>
</template>

<style scoped>
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
  z-index: 999;
}
</style>
