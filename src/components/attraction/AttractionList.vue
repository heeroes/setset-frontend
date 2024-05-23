<script setup>
import { ref, computed } from "vue";
import { defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import planApi from "@/api/plan";

const router = useRouter();

const props = defineProps({
  keyword: String,
  type: Number,
  attractions: {
    type: Array,
    default: () => [],
  },
  hasMore: Boolean,
  currentPage: Number,
  totalPages: Number,
});
const totalPages = props.totalPages;
const itemsPerPage = 5;
const totalPageGroups = computed(() =>
  Math.ceil(props.totalPages / itemsPerPage)
);
const currentGroup = ref(Math.ceil(props.currentPage / itemsPerPage));

console.log("attractionList totalPages,", totalPages);
console.log("type : ", props.type);
const emits = defineEmits(["load-more", "change-page"]);

const changePage = (page) => {
  emits("change-page", props.type, page);
};
const goToNextGroup = () => {
  if (currentGroup.value < totalPageGroups.value) {
    currentGroup.value++;
    const startPage = (currentGroup.value - 1) * itemsPerPage + 1;
    changePage(startPage);
  }
};

const goToLastGroup = () => {
  currentGroup.value = totalPageGroups.value;
  const startPage = (currentGroup.value - 1) * itemsPerPage + 1;
  changePage(startPage);
};

const goToPreviousGroup = () => {
  if (currentGroup.value > 1) {
    currentGroup.value--;
    const startPage = (currentGroup.value - 1) * itemsPerPage + 1;
    changePage(startPage);
  }
};
const goToFirstGroup = () => {
  currentGroup.value = 1;
  changePage(1);
};

const pageNumbers = computed(() => {
  const startPage = (currentGroup.value - 1) * itemsPerPage + 1;
  const endPage = Math.min(startPage + itemsPerPage - 1, props.totalPages);
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const plans = ref([]);
const getPlanList = async () => {
  const response = await planApi.get("");
  plans.value = response.data.result.plans;
  console.log("plans", response.data.result.plans);
};

const addToPlan = async (planId, attractionId) => {
  try {
    await planApi.post(`/detail`, {
      attractionId: attractionId,
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

const searchDetail = (id) => {
  router.push({ name: "AttractionDetail", params: { id } });
};

const truncateMessage = (message, maxLength) => {
  // 메시지를 줄일 최대 길이
  console.log(message);
  if (message) {
    if (message.length > maxLength) {
      return message.substring(0, maxLength) + "...";
    }
  }
  return message;
};

getPlanList();
</script>

<template>
  <div class="attraction-section">
    <div v-if="attractions.length" class="attraction-list">
      <div
        v-for="(attraction, index) in attractions"
        :key="attraction.id"
        class="attraction-item"
      >
        <div @click="searchDetail(attraction.id)" class="attraction-info">
          <div class="attraction-image">
            <img
              :src="attraction.image"
              :alt="attraction.title"
              v-if="attraction.image"
            />
            <div v-else class="no-image"></div>
          </div>
          <div class="attraction-details">
            <h3 style="font-size: 24px">{{ attraction.title }}</h3>
            <p style="color: #666; margin-bottom: 5px">
              {{ attraction.addr }}
            </p>
            <p>{{ truncateMessage(attraction.overview, 65) }}</p>
          </div>
        </div>
        <!-- 드롭다운 버튼 추가 -->
        <div class="dropdown" @click="toggleDropdown(index)">
          <button class="icon-btn add-btn">
            <div class="add-icon"></div>
            <div class="btn-txt">Add to Plan ▶</div>
          </button>
          <div v-if="dropdownIndex === index" class="dropdown-content">
            <button
              v-for="plan in plans"
              :key="plan.id"
              :value="plan.id"
              @click="addToPlan(plan.id, attraction.id)"
            >
              {{ plan.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>검색 결과가 없습니다.</p>
    </div>
    <div class="pagination">
      <button @click="goToFirstGroup" :disabled="currentGroup === 1">««</button>
      <button @click="goToPreviousGroup" :disabled="currentGroup === 1">
        «
      </button>

      <button
        v-for="page in pageNumbers"
        :key="page"
        :class="{ active: page === props.currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <button
        @click="goToNextGroup"
        :disabled="currentGroup === totalPageGroups"
      >
        »
      </button>
      <button
        @click="goToLastGroup"
        :disabled="currentGroup === totalPageGroups"
      >
        »»
      </button>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: absolute; /* 드롭다운 버튼에 대해 position: absolute; 설정 */
  top: -130px; /* 원하는 위치 조정 */
  left: 650px;
  cursor: pointer;
}
.attraction-section {
  margin-bottom: 40px;
}

.attraction-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 10px #aaa;
}

.attraction-item {
  width: 100%;
  height: 170px;
  border-bottom: 1px solid #ccc;
  border-radius: 4px;
  /* margin: 10px; */
  padding: 20px;
  position: relative; /* 부모 요소에 대해 position: relative; 설정 */
}
.attraction-image {
  width: 30%;
  height: auto;
  max-height: 120px;
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.attraction-item img {
  width: 100%;
  height: auto;
  max-height: 120px;
  border-radius: 4px;
}

.dropdown-content {
  position: absolute;
  top: 50%;
  left: 100%;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 1000;
}

.dropdown-content button {
  display: block;
  width: 120px;
  padding: 8px 12px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-content button:hover {
  background-color: #f1f1f1;
}
.attraction-info {
  display: flex;
  align-items: center;
}

.attraction-details {
  flex: 1;
  margin-left: 30px;
}

.attraction-details h3 {
  margin: 0 0 5px 0;
}

.attraction-details p {
  margin: 0;
}

/* 계획 추가 버튼 */
.icon-btn {
  width: 50px;
  height: 50px;
  border: 1px solid #cdcdcd;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
  transition: width 0.2s ease-in-out;
  font-weight: 500;
  font-family: inherit;
}

.add-btn:hover {
  width: 120px;
}

.add-btn::before,
.add-btn::after {
  transition: width 0.2s ease-in-out, border-radius 0.2s ease-in-out;
  content: "";
  position: absolute;
  height: 4px;
  width: 10px;
  top: calc(50% - 2px);
  background: seagreen;
}

.add-btn::after {
  right: 14px;
  overflow: hidden;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.add-btn::before {
  left: 14px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.icon-btn:focus {
  outline: none;
}

.btn-txt {
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 11px;
}

.add-btn:hover::before,
.add-btn:hover::after {
  width: 4px;
  border-radius: 2px;
}

.add-btn:hover .btn-txt {
  opacity: 1;
}

.add-icon::after,
.add-icon::before {
  transition: all 0.2s ease-in-out;
  content: "";
  position: absolute;
  height: 20px;
  width: 2px;
  top: calc(50% - 10px);
  background: seagreen;
  overflow: hidden;
}

.add-icon::before {
  left: 22px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.add-icon::after {
  right: 22px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.add-btn:hover .add-icon::before {
  left: 15px;
  height: 4px;
  top: calc(50% - 2px);
}

.add-btn:hover .add-icon::after {
  right: 15px;
  height: 4px;
  top: calc(50% - 2px);
}

/* no image */
.no-image {
  width: 64px;
  height: 64px;
  position: relative;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-image:before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 40px;
  transform: rotate(45deg) translate(30%, 40%);
  background: #ff9371;
  box-shadow: 32px -34px 0 5px #ff3d00;
  animation: slide 2s infinite ease-in-out alternate;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-image:after {
  content: "";
  position: absolute;
  left: 10px;
  top: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ff3d00;
  transform: rotate(0deg);
  transform-origin: 35px 145px;
  animation: rotate 2s infinite ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes slide {
  0%,
  100% {
    bottom: -35px;
  }

  25%,
  75% {
    bottom: -2px;
  }

  20%,
  80% {
    bottom: 2px;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(-15deg);
  }

  25%,
  75% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(25deg);
  }
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}

.pagination button.active {
  background-color: #ccc;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.dropdown {
  position: relative;
  cursor: pointer;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 1000;
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
