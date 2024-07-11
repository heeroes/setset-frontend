<script setup>
import { ref, defineProps, defineEmits, toRef } from "vue";
import planApi from "@/api/plan";
import draggable from "vuedraggable"; // draggable 컴포넌트를 import
import PlanDetailShareView from "@/components/plan_detail/PlanDetailShareView.vue";

const attractionTypes = [
  { value: 12, name: "관광지" },
  { value: 14, name: "문화시설" },
  { value: 15, name: "축제공연행사" },
  { value: 28, name: "레포츠" },
  { value: 32, name: "숙박" },
  { value: 38, name: "쇼핑" },
  { value: 39, name: "음식점" },
];

const emit = defineEmits();
const props = defineProps(["planId", "planDetailArrays", "isGuest"]);
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
const isVisible = ref(false);
const sharePlan = () => {
  isVisible.value = !isVisible.value;
};

const getCategoryName = (contentTypeId) => {
  const type = attractionTypes.find((type) => type.value === contentTypeId);
  return type ? type.name : "알 수 없음";
};
const close = () => {
  console.log("plandetailView close");
  isVisible.value = false;
};
</script>

<template>
  <div class="button-container" v-show="!props.isGuest">
    <button @click="savePlan" class="save">
      <svg
        viewBox="0 -0.5 25 25"
        height="20px"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="1.5"
          d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z"
          clip-rule="evenodd"
          fill-rule="evenodd"
        ></path>
      </svg>
      <span class="label">저장</span>
    </button>
    <button @click="sharePlan" class="share">
      <svg
        height="512"
        viewBox="0 0 512 512"
        width="512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title></title>
        <path
          d="M384,336a63.78,63.78,0,0,0-46.12,19.7l-148-83.27a63.85,63.85,0,0,0,0-32.86l148-83.27a63.8,63.8,0,1,0-15.73-27.87l-148,83.27a64,64,0,1,0,0,88.6l148,83.27A64,64,0,1,0,384,336Z"
        ></path>
      </svg>
      <span class="label">공유</span>
    </button>
    <PlanDetailShareView
      :isVisible="isVisible"
      :planId="props.planId"
      @close="close"
    />
  </div>
  <div class="tabs">
    <button
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
    <h2
      :id="'day-' + index"
      style="
        font-size: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #1abc9c;
        padding-bottom: 10px;
      "
    >
      {{ index === 0 ? "🛫여기 언제❓" : "Day " + index }}
    </h2>

    <draggable
      :list="details || []"
      group="planDetail"
      @change="log"
      itemKey="index"
      :disabled="isGuest"
      class="card-container"
    >
      <template #item="{ element, index }">
        <div class="card">
          <div class="card-image">
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
          </div>
          <div class="category">
            {{ getCategoryName(element.attraction.contentTypeId) }}
          </div>
          <div class="heading">
            {{ element.attraction.title }}
            <div class="addr">{{ element.attraction.addr }}</div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
/* 저장 버튼 */
.save {
  width: 100px;
  height: 32px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #95d03a;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
  transition: all 0.3s;
  margin-right: 20px;
}

.save:hover {
  opacity: 0.85;
  transform: translateY(-4px);
}

.save .label {
  font-size: 12px;
  line-height: 32px;
  color: #95d03a;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0 auto;
}

.save svg {
  fill: #95d03a;
  width: 17px;
  height: 17px;
}
/* 공유 버튼 */
.share {
  width: 100px;
  height: 32px;
  background-color: #95d03a;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
  transition: all 0.3s;
}

.share:hover {
  opacity: 0.85;
  transform: translateY(-4px);
}

.share .label {
  font-size: 12px;
  line-height: 32px;
  color: #fff;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0 auto;
}

.share svg {
  fill: #fff;
  width: 17px;
  height: 17px;
}
.card {
  width: 190px;
  background: white;
  padding: 0.4em;
  border-radius: 6px;
  box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15),
    0 6px 12px 0 rgba(24, 94, 224, 0.15);
}

.card-image {
  background-color: rgb(236, 236, 236);
  width: 100%;
  height: 130px;
  border-radius: 6px 6px 0 0;
}

.card-image:hover {
  transform: scale(0.98);
}

.category {
  text-transform: uppercase;
  font-size: 0.7em;
  font-weight: 600;
  color: rgb(63, 121, 230);
  padding: 10px 7px 0;
}

.category:hover {
  cursor: pointer;
}

.heading {
  font-weight: 600;
  color: rgb(88, 87, 87);
  padding: 7px;
}

.heading:hover {
  cursor: pointer;
}

.addr {
  color: gray;
  font-weight: 400;
  font-size: 11px;
  padding-top: 10px;
}

.name {
  font-weight: 600;
}

.name:hover {
  cursor: pointer;
}
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
  padding-left: 20px;
  overflow-x: auto; /* 가로 스크롤 활성화 */
  white-space: nowrap; /* 카드들이 한 줄로 정렬되도록 */
}

.day-plan {
  margin-bottom: 20px;
}
.card-container {
  display: flex; /* 카드들을 가로로 정렬 */
  margin-bottom: 50px;
}
.tabs {
  display: flex;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 0.75rem;
  border-radius: 99px;
  position: relative;
  width: 100%;
  /* height: 10%; */
  overflow-x: auto; /* 가로 스크롤을 활성화합니다. */
  white-space: nowrap; /* 탭이 넘칠 경우 한 줄로 표시합니다. */
}
/* 탭 스타일 */
.tabs button {
  padding: 10px 20px;
  border: 1px solid #abd373;
  border-radius: 99px;
  cursor: pointer;
  white-space: nowrap; /* 탭 텍스트가 넘칠 경우 한 줄로 표시합니다. */
  margin-right: 10px;
  box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15),
    0 6px 12px 0 rgba(24, 94, 224, 0.15);
}
/* 
.tabs button.active {
  background-color: #abd373;
  border-radius: 99px;
  color: white;
} */
</style>
