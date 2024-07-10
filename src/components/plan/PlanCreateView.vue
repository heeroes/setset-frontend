<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import planApi from "@/api/plan";
import cityApi from "@/api/city";

const props = defineProps({
  isVisible: Boolean,
});
const emit = defineEmits();

const cityList = ref([]);
const selectedSido = ref("");
const selectedGu = ref("");
const selectedDong = ref("");

const router = useRouter();
const planInfo = ref({});
const createPlan = async () => {
  planInfo.value.region = `${selectedSido.value} ${selectedGu.value} ${selectedDong.value}`;
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

const getSidos = async () => {
  const { data } = cityApi.get();
  console.log("sido : ", data);
  cityList.value = data;
  selectedSido.value = "";
};

const getGus = async () => {
  const { data } = cityApi.get(`?sido=${selectedSido.value}`);
  console.log("Gu : ", data);
  cityList.value = data;
  selectedGu.value = "";
};

const getDongs = async () => {
  const { data } = cityApi.get(
    `?sido=${selectedSido.value}&gu=${selectedGu.value}`
  );
  console.log("dong : ", data);
  cityList.value = data;
  selectedDong = "";
};
</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <form @submit.prevent="createPlan">
        계획명 : <input type="text" v-model="planInfo.title" required />
        <br />
        지역 :
        <label for="sido">시도:</label>
        <select id="sido" v-model="selectedSido" @change="fetchGus">
          <option v-for="sido in sidos" :key="sido" :value="sido">
            {{ sido }}
          </option>
        </select>

        <label for="gu">구:</label>
        <select
          id="gu"
          v-model="selectedGu"
          @change="fetchDongs"
          :disabled="!selectedSido"
        >
          <option v-for="gu in gus" :key="gu" :value="gu">{{ gu }}</option>
        </select>

        <label for="dong">동:</label>
        <select id="dong" v-model="selectedDong" :disabled="!selectedGu">
          <option v-for="dong in dongs" :key="dong" :value="dong">
            {{ dong }}
          </option>
        </select>

        <input type="text" v-model="planInfo.region" required />
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
