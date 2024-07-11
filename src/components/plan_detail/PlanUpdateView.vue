<script setup>
import { ref, defineProps, defineEmits, toRef } from "vue";
import planApi from "@/api/plan";
import cityApi from "@/api/city";

const emit = defineEmits();
const props = defineProps(["plan", "planRegionList", "id"]);

const plan = toRef(props, "plan");
const planRegionList = toRef(props, "planRegionList");
const id = toRef(props, "id");

const sidoList = ref([]);
const guList = ref([]);
const dongList = ref([]);
const selectedSido = ref("");
const selectedGu = ref("");
const selectedDong = ref("");
const close = async () => {
  emit("close");
};

const updatePlan = async () => {
  plan.value.region = planRegionList.value.join(",");
  planApi
    .put(`/${id.value}`, plan.value)
    .then((response) => {
      console.log(response.data);
      emit("close");
    })
    .catch((error) => {
      console.error(error);
    });
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
  if (planRegionList.value.length == 3) {
    alert("지역은 3개 이하로만 선택이 가능합니다.");
    return;
  }
  if (!selectedSido.value) {
    alert("지역을 선택하세요.");
    return;
  }
  const newRegion = `${selectedSido.value} ${selectedGu.value} ${selectedDong.value}`;
  if (!planRegionList.value.includes(newRegion))
    planRegionList.value.push(newRegion);
};

const deleteRegion = (index) => {
  planRegionList.value.splice(index, 1);
};

getSidos();
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <button @click="close" style="margin-bottom: 5px">X</button>
      <div class="heading">Edit Plan</div>
      <form @submit.prevent="updatePlan">
        <input class="update-info" type="text" v-model="plan.title" />
        <div class="select-region update-info">
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
          v-for="(region, index) in planRegionList"
          :key="region"
          class="region-item"
        >
          <p>{{ region }}</p>
          <p @click="deleteRegion(index)">X</p>
        </div>
        <div class="update-info">
          <input type="date" v-model="plan.startDate" :max="plan.endDate" />
          ~
          <input type="date" v-model="plan.endDate" :min="plan.startDate" />
        </div>
        <input class="update-btn" type="submit" value="수정하기" />
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
  max-width: 50vw;
  background: #f8f9fd;
  background: linear-gradient(
    0deg,
    rgb(255, 255, 255) 0%,
    rgb(244, 247, 251) 100%
  );
  border-radius: 40px;
  padding: 25px 35px;
  border: 5px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.878) 0px 30px 30px -20px;
  margin: 20px;
  width: 30vw;
}

.heading {
  text-align: center;
  font-weight: 900;
  font-size: 30px;
  color: rgb(16, 137, 211);
  margin-bottom: 20px;
}

.update-info {
  width: 100%;
  background: white;
  border: none;
  padding: 15px 20px;
  border-radius: 20px;
  margin-top: 15px;
  box-shadow: 0px 10px 10px -5px #cff0ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.update-info input[type="date"] {
  flex: 1;
  margin: 0 5px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.update-btn {
  display: block;
  width: 100%;
  font-weight: bold;
  background: linear-gradient(
    45deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  color: white;
  padding: 15px;
  margin: 20px auto;
  border-radius: 20px;
  box-shadow: rgba(133, 189, 215, 0.878) 0px 20px 10px -15px;
  border: none;
  transition: all 0.2s ease-in-out;
}

.update-btn:hover {
  transform: scale(1.03);
  box-shadow: rgba(133, 189, 215, 0.878) 0px 23px 10px -20px;
}

.update-btn:active {
  transform: scale(0.95);
  box-shadow: rgba(133, 189, 215, 0.878) 0px 15px 10px -10px;
}

.select-region {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}

.select-region select {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.select-region button {
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.region-item {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.region-item p {
  margin: 0;
  margin-right: 5px;
  cursor: pointer;
}
.region-item p:last-child {
  cursor: pointer;
  color: red;
}
</style>
