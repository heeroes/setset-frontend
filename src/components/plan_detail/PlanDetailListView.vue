<script setup>
import { ref, defineProps, defineEmits, toRef } from "vue";
import planApi from "@/api/plan";
import draggable from "vuedraggable"; // draggable 컴포넌트를 import

const emit = defineEmits();
const props = defineProps(["planId", "planDetailArrays"]);
const planDetailArrays = toRef(props, "planDetailArrays");

const scrollToDay = (index) => {
  const dayElement = document.getElementById(`day-${index}`);
  if (dayElement) {
    dayElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
const savePlan = async () => {
  console.log("update arr : ", planDetailArrays.value);
  const { data } = await planApi.put(
    `/detail/${props.planId}`,
    planDetailArrays.value
  );
  console.log(data);
  emit("changePlan");
};
const removePD = async (pdId) => {
  await planApi.delete(`/detail/${pdId}`);
  emit("changePlan");
};
const log = (evt) => {
  window.console.log(evt);
};
</script>

<template>
  <div class="button-container">
    <button @click="savePlan">저장</button>
  </div>
  <div class="tabs">
    <button
      class="tab"
      v-for="index in planDetailArrays.length"
      :key="index"
      @click="scrollToDay(index - 1)"
    >
      {{ index === 1 ? "🛫여기 언제❓" : "Day " + (index - 1) }}
    </button>
  </div>

  <div
    class="content-area"
    v-for="(details, index) in planDetailArrays"
    :key="index"
  >
    <h2 :id="'day-' + index">
      {{ index === 0 ? "🛫여기 언제❓" : "Day " + index }}
    </h2>

    <draggable
      :list="details || []"
      group="planDetail"
      @change="log"
      itemKey="index"
    >
      <template #item="{ element, index }">
        <div class="content-grid">
          <div class="image-container">
            <img :src="element.attraction.image" />
            <button
              class="close-button"
              v-if="!isGuest"
              @click="removePD(element.id)"
            >
              X
            </button>
          </div>
          <div>
            <h3>{{ element.attraction.title }}</h3>
            <p>{{ element.attraction.addr }}</p>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
}

.image-container img {
  width: 100%;
}
.button-container {
  display: flex;
  justify-content: flex-end; /* 버튼을 오른쪽에 정렬 */
  margin-bottom: 10px; /* 버튼과 리스트 사이의 간격 */
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

.day-plan {
  margin-bottom: 20px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, max-content));
  gap: 10px;
  overflow-x: auto;
}

.content-card {
  width: 10vw;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.content-card:hover {
  transform: translateY(-5px);
}
</style>
