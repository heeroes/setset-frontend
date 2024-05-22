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
        <!-- 드롭다운 버튼 추가 -->
        <div class="dropdown" @click="toggleDropdown(index)">
          +
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
        <div @click="searchDetail(attraction.id)">
          <h3>{{ attraction.title }}</h3>
          <img :src="attraction.image" :alt="attraction.title" />
          <p>{{ attraction.addr }}</p>
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
.attraction-section {
  margin-bottom: 40px;
}

.attraction-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.attraction-item {
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 10px;
  padding: 20px;
  box-shadow: 2px 2px 12px #aaa;
}

.attraction-item img {
  width: 80%;
  height: 60%;
  border-radius: 4px;
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
