<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import attractionApi from "@/api/attraction";
import AttractionList from "@/components/attraction/AttractionList.vue";
import planApi from "@/api/plan";

const route = useRoute();
const router = useRouter();

const attractionTypes = [
  { value: 12, name: "관광지" },
  { value: 14, name: "문화시설" },
  { value: 15, name: "축제공연행사" },
  { value: 28, name: "레포츠" },
  { value: 32, name: "숙박" },
  { value: 38, name: "쇼핑" },
  { value: 39, name: "음식점" },
];

// 부모 컴포넌트로부터 검색 키워드를 전달받는 props
const props = defineProps({
  keyword: String,
});

const keyword = ref(props.keyword);
const attractions = ref({});
const hasMore = ref({});
const pageSize = 10;
const currentPage = ref({});
const totalPages = ref({});
const activeType = ref(parseInt(route.query.type) || "all");
const isCalled = ref(false);

// 각 타입별로 초기화
attractionTypes.forEach((type) => {
  attractions.value[type.value] = [];
  hasMore.value[type.value] = true;
  currentPage.value[type.value] = 1;
  totalPages.value[type.value] = 1;
});

const getAttractionListByKeyword = async (keyword) => {
  try {
    const { data } = await attractionApi.get("/search?keyword=" + keyword);
    console.log("response : ", data.result.attractions[12]);
    attractions.value = data.result.attractions;
  } catch (error) {
    console.log("error", error);
    // if (error.response.data && error.response.data.result) {
    //   alert(`여행지 검색 실패: ${error.response.data.result}`);
    // }
  }
};
const fetchAttractions = async (keyword, type, page = 1) => {
  console.log("fetch type", type);
  try {
    const response = await attractionApi.get("/search?keyword=" + keyword, {
      params: {
        contentTypeId: type,
        pageSize,
        page: page,
      },
    });
    console.log("fetch attractions", response.data.result.attractions[type]);
    const data = response.data.result.attractions[type] || [];
    attractions.value[type] = data;
    hasMore.value[type] = data.length === pageSize;
    console.log("fetch total page", response.data.result.totalPages);
    totalPages.value[type] = response.data.result.totalPages;
    isCalled.value = true;
  } catch (error) {
    console.error("Error fetching attractions:", error);
  }
};
const loadMore = (type) => {
  const nextPage = currentPage.value[type] + 1;
  fetchAttractions(keyword.value, type, nextPage);
  currentPage.value[type] = nextPage;
};

const setActiveType = (type) => {
  isCalled.value = false;
  activeType.value = type;
  if (type !== "all") {
    console.log("setActiveType : ", type);
    fetchAttractions(keyword.value, type);
  }
  router.push({ query: { keyword: keyword.value, type: type } });
  console.log("setActiveType isCalled", isCalled.value);
};

const changePage = (type, page) => {
  fetchAttractions(keyword.value, type, page);
  currentPage.value[type] = page;
};

//탭 이동
const goToType = (type) => {
  setActiveType(type);
};

watch(
  () => route.query.keyword,
  (newKeyword) => {
    keyword.value = newKeyword;
    attractionTypes.forEach((type) => {
      fetchAttractions(newKeyword, type.value);
    });
  }
);
getAttractionListByKeyword(keyword.value);

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
  <div>
    <h1>검색 결과 리스트</h1>
    <div class="tabs">
      <button
        v-for="type in [{ value: 'all', name: '전체' }, ...attractionTypes]"
        :key="type.value"
        :class="{ active: activeType === type.value }"
        @click="setActiveType(type.value)"
      >
        {{ type.name }}
      </button>
    </div>
    <div v-if="activeType === 'all'">
      <div
        v-for="type in attractionTypes"
        :key="type.value"
        class="attraction-section"
      >
        <h2>{{ type.name }}</h2>
        <div v-if="attractions[type.value] != []" class="attraction-list">
          <div
            v-for="(attraction, index) in attractions[type.value]"
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
          <button @click="goToType(type.value)">+ 더보기</button>
        </div>
        <div v-else>
          <p>검색 결과가 없습니다.</p>
        </div>
      </div>
    </div>
    <AttractionList
      :keyword="keyword"
      :type="activeType"
      :attractions="attractions[activeType]"
      :has-more="hasMore[activeType]"
      :current-page="currentPage[activeType]"
      :total-pages="totalPages[activeType]"
      @load-more="loadMore"
      @change-page="changePage"
      v-if="isCalled"
    />
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
}

.tabs button.active {
  background-color: #ccc;
}

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
