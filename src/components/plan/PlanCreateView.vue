<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import planApi from "@/api/plan";
import cityApi from "@/api/city";

const props = defineProps({
  isVisible: Boolean,
});
const emit = defineEmits();

const sidoList = ref([]);
const guList = ref([]);
const dongList = ref([]);
const selectedSido = ref("");
const selectedGu = ref("");
const selectedDong = ref("");

const router = useRouter();
const planInfo = ref({});
const selectedRegion = ref([]);

const createPlan = async () => {
  planInfo.value.region = selectedRegion.value.join(",");
  console.log("selected region : ", planInfo.value.region);
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
  const { data } = await cityApi.get("search");
  console.log("sido : ", data);
  sidoList.value = data.result;
  selectedSido.value = "";
};

const getGus = async () => {
  const { data } = await cityApi.get(`search?sido=${selectedSido.value}`);
  console.log("Gu : ", data);
  guList.value = data.result;
  selectedGu.value = "";
};

const getDongs = async () => {
  const { data } = await cityApi.get(
    `search?sido=${selectedSido.value}&gu=${selectedGu.value}`
  );
  console.log("dong : ", data);
  dongList.value = data.result;
  selectedDong.value = "";
};

const addRegion = () => {
  if (selectedRegion.value.length == 3) {
    alert("지역은 3개 이하로만 선택이 가능합니다.");
    return;
  }
  const newRegion = `${selectedSido.value} ${selectedGu.value} ${selectedDong.value}`;
  if (!selectedRegion.value.includes(newRegion))
    selectedRegion.value.push(newRegion);
};

const deleteRegion = (index) => {
  selectedRegion.value.splice(index, 1);
};

getSidos();
</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <form @submit.prevent="createPlan">
        계획명 : <input type="text" v-model="planInfo.title" required />
        <br />
        <div class="select-region">
          지역 :
          <select id="sido" v-model="selectedSido" @change="getGus">
            <option
              v-for="sido in sidoList"
              :key="sido.sido"
              :value="sido.sido"
            >
              {{ sido.sido }}
            </option>
          </select>
          <select
            id="gu"
            v-model="selectedGu"
            @change="getDongs"
            :disabled="!selectedSido"
          >
            <option v-for="gu in guList" :key="gu.gu" :value="gu.gu">
              {{ gu.gu }}
            </option>
          </select>
          <select id="dong" v-model="selectedDong" :disabled="!selectedGu">
            <option
              v-for="dong in dongList"
              :key="dong.dong"
              :value="dong.dong"
            >
              {{ dong.dong }}
            </option>
          </select>

          <button type="button" @click="addRegion">add</button>
        </div>
        <div
          v-for="(region, index) in selectedRegion"
          :key="region"
          class="region-item"
        >
          <p>{{ region }}</p>
          <p @click="deleteRegion(index)">X</p>
        </div>

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
  width: 500px;
  max-width: 100%;
}

.region-item {
  display: flex;
  align-items: center;
}

.region-item p {
  margin: 0 5px;
}

.region-item p:last-child {
  cursor: pointer;
  color: red;
}
</style>
