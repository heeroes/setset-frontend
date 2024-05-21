<script setup>
import { ref } from "vue";
import attractionApi from "@/api/attraction";
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
const pageSize = 5;

// 각 타입별로 초기화
attractionTypes.forEach((type) => {
  attractions.value[type.value] = [];
  hasMore.value[type.value] = true;
});

const getAttractionListByKeyword = async (keyword) => {
  try {
    const { data } = await attractionApi.get("/search?keyword=" + keyword);
    console.log("response : ", data.result.attractions);
    attractions.value = data.result.attractions;
  } catch (error) {
    if (error.response.data && error.response.data.result) {
      alert(`여행지 검색 실패: ${error.response.data.result}`);
    }
  }
};
const fetchAttractions = async (keyword, type, page = 1) => {
  try {
    const response = await attractionApi.get("/search?keyword=" + keyword, {
      params: {
        contentTypeId: type,
        page: page,
      },
    });
    const data = response.data.result.attractions[type] || [];

    // 현재 데이터를 새로 불러온 데이터와 합치기
    if (!attractions.value[type]) {
      attractions.value[type] = [];
    }
    attractions.value[type] = [...attractions.value[type], ...data];
    console.log("data length", data.length);
    // 더 불러올 데이터가 있는지 확인
    hasMore.value[type] = data.length === pageSize;
  } catch (error) {
    console.error("Error fetching attractions:", error);
  }
};
const loadMore = (type) => {
  const currentPage =
    Math.ceil((attractions.value[type]?.length || 0) / pageSize) + 1;
  fetchAttractions(keyword.value, type, currentPage);
};
getAttractionListByKeyword(keyword.value);
</script>

<template>
  <div>
    <h1>검색 결과 리스트</h1>
    <div class="tabs">
      <button
        v-for="type in attractionTypes"
        :key="type.value"
        :class="{ active: activeType === type.value }"
        @click="setActiveType(type.value)"
      >
        {{ type.name }}
      </button>
    </div>
    <div
      v-for="type in attractionTypes"
      :key="type.value"
      class="attraction-section"
    >
      <h2>{{ type.name }}</h2>
      <div v-if="attractions[type.value]" class="attraction-list">
        <div
          v-for="attraction in attractions[type.value]"
          :key="attraction.id"
          class="attraction-item"
        >
          <h3>{{ attraction.title }}</h3>
          <img :src="attraction.image" :alt="attraction.title" />
          <p>{{ attraction.addr }}</p>
        </div>
        <button v-if="hasMore[type.value]" @click="loadMore(type.value)">
          +더보기
        </button>
      </div>
      <div v-else>
        <p>검색 결과가 없습니다.</p>
      </div>
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
</style>
