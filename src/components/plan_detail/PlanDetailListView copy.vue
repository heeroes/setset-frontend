<script setup>
import { ref, defineProps, defineEmits } from "vue";
import planApi from "@/api/plan";
import Draggable from "vue3-draggable";

const emit = defineEmits();
const props = defineProps(["planDetailArrays"]);

const scrollToDay = (index) => {
  const dayElement = document.getElementById(`day-${index}`);
  if (dayElement) {
    dayElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
const savePlan = () => {};
const removePD = async (pdId) => {
  await planApi.delete(`/detail/${pdId}`);
  emit("changePlan");
};
</script>

<template>
  <div class="tabs">
    <button
      class="tab"
      v-for="index in planDetailArrays.length"
      :key="index"
      @click="scrollToDay(index)"
    >
      {{ index === 1 ? "🛫여기 언제❓" : "Day " + (index - 1) }}
    </button>
  </div>

  <div
    id="day-{{ index }}"
    class="content-area"
    v-for="(details, index) in planDetailArrays"
    :key="index"
  >
    <h2>{{ index === 0 ? "🛫여기 언제❓" : "Day " + index }}</h2>
    <div class="content-grid">
      <div v-for="(pd, idx) in details" :key="idx" class="content-card">
        <div class="image-container">
          <img :src="pd.attraction.image" />
          <button class="close-button" v-if="!isGuest" @click="removePD(pd.id)">
            X
          </button>
        </div>
        <h3>{{ pd.attraction.title }}</h3>
        <p>{{ pd.attraction.addr }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
}

.image-container img {
  width: 100%;
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
