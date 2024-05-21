<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import planApi from "@/api/plan";

const props = defineProps({
  isVisible: Boolean,
});
const emit = defineEmits();

const router = useRouter();
const planInfo = ref({});
const createPlan = async () => {
  planApi
    .post("", planInfo.value)
    .then((response) => {
      confirm("등록 성공");
      console.log(response.data);
      close();
    })
    .catch((error) => {
      console.error(error);
    });
  router.push({ name: "Plan" });
};

const close = () => {
  planInfo.value = {};
  emit("close");
};
</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <form @submit.prevent="createPlan">
        계획명 : <input type="text" v-model="planInfo.title" required />
        <br />
        지역 : <input type="text" v-model="planInfo.region" required />
        <br />
        시작 날짜:
        <input
          type="date"
          v-model="planInfo.startDate"
          :max="planInfo.endDate"
          required
        />
        <br />
        끝 날짜:
        <input
          type="date"
          v-model="planInfo.endDate"
          :min="planInfo.startDate"
          required
        />
        <br />
        <input type="submit" value="Create" /> &nbsp; &nbsp; &nbsp;
        <input type="button" @click="close" value="Close" />
      </form>
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
  z-index: 999;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  max-width: 100%;
}
</style>
