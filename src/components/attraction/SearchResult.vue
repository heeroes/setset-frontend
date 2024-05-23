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
const dropdownStates = ref({});
const toggleDropdown = (attractionId) => {
  dropdownStates.value[attractionId] = !dropdownStates.value[attractionId];
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
  <div>
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
    <div class="search-keyword">
      <span style="font-size: 26px; color: #e74c3c">{{ keyword }}</span>
      <span style="font-size: 20px">를 검색한 결과입니다.</span>
    </div>

    <div v-if="activeType === 'all'">
      <div
        v-for="type in attractionTypes"
        :key="type.value"
        class="attraction-section"
      >
        <h2
          style="
            font-size: 25px;
            margin-bottom: 10px;
            margin-top: 10px;
            padding-left: 10px;
          "
        >
          🚩 {{ type.name }}
        </h2>
        <div v-if="attractions[type.value] != []" class="attraction-list">
          <div
            v-for="(attraction, index) in attractions[type.value]"
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
            <div class="dropdown" @click="toggleDropdown(attraction.id)">
              <button class="icon-btn add-btn">
                <div class="add-icon"></div>
                <div class="btn-txt">Add to Plan ▶</div>
              </button>
              <div
                v-if="dropdownStates[attraction.id]"
                class="dropdown-content"
              >
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
          <button @click="goToType(type.value)" style="height: 80px">
            + 더보기
          </button>
        </div>
      </div>
    </div>
    <!-- <div v-else>
      <p>검색 결과가 없습니다.</p>
    </div> -->
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
  background-color: #fff;
  box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15),
    0 6px 12px 0 rgba(24, 94, 224, 0.15);
  padding: 0.75rem;
  border-radius: 99px;
  position: relative;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.tabs button.active {
  background-color: #abd373;
  border-radius: 99px;
  color: white;
}
.search-keyword {
  padding-left: 20px;
  margin-bottom: 30px;
  margin-top: 20px;
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
  border-top: 1px solid #ccc;
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

.dropdown {
  position: absolute; /* 드롭다운 버튼에 대해 position: absolute; 설정 */
  top: 10px; /* 원하는 위치 조정 */
  right: 10px; /* 원하는 위치 조정 */
  cursor: pointer;
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
</style>
