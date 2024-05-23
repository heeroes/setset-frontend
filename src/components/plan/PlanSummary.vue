<script setup>
import { ref, computed } from "vue";
import { parse } from "vue/compiler-sfc";
import { useRouter } from "vue-router";

// 라우터 객체 생성
const router = useRouter();

// 부모 컴포넌트로부터 선택된 그룹을 전달받는 props
const props = defineProps(["content"]);
const rawContent = ref(props.content);
console.log("raw content,", rawContent.value);
const travelPlan = ref(null);

const isValidJson = computed(() => {
  try {
    const parsed = JSON.parse(rawContent.value);
    if (
      parsed.region &&
      parsed.start_date &&
      parsed.days &&
      parsed.total_attraction !== undefined &&
      parsed.planId &&
      parsed.groupId &&
      parsed.userId &&
      parsed.contentTypes
    ) {
      travelPlan.value = {
        ...parsed,
        contentTypes: JSON.parse(parsed.contentTypes),
      };
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
});

const getTagLabel = (type) => {
  const labels = {
    12: "#관광지",
    14: "#문화시설",
    15: "#축제공연행사",
    28: "#레포츠",
    32: "#숙박",
    38: "#쇼핑",
    39: "#음식점",
  };
  return labels[type] || `#${type}`;
};

const goPlanDetail = (planId) => {
  router.push({ name: "PlanDetail", params: { id: planId } });
};
</script>
<template>
  <div>
    <div v-if="isValidJson">
      <div class="travel-plan" @click="goPlanDetail(travelPlan.planId)">
        <div class="header">
          <h3 style="font-size: large;  border-bottom: 2px solid #1abc9c;
">📌 {{ travelPlan.region }} 여행 계획</h3>
        </div>
        <div class="summary">
          <div class="days-circle">{{ travelPlan.days }}</div>
          <ul class="details-list">
            <li>출발 날짜: {{ travelPlan.start_date }}</li>
            <li>여행지역: {{ travelPlan.region }}</li>
            <li>총 {{ travelPlan.total_attraction }}개 여행지 🎉</li>
          </ul>
        </div>
        <div class="tags">
          <span
            class="tag"
            v-for="type in travelPlan.contentTypes"
            :key="type"
            >{{ getTagLabel(type) }}</span
          >
        </div>
      </div>
    </div>
    <div v-else>
      <pre>{{ rawContent }}</pre>
    </div>
  </div>
</template>

<style scoped>
.travel-plan {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  background-color: #f9f9f9;
  position: relative;
  display: flex;
  flex-direction: column;

}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.summary {
  display: flex;
  align-items: center;
}

.days-circle {
  background-color: #95D03A;
  color: white;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  margin-right: 20px;
}

.details-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.details-list li {
  margin: 5px 0;
}

.tags {
  display: flex;
  justify-content: flex-end; /* 오른쪽으로 정렬 */
  margin-top: 10px;
}

.tag {
  display: inline-block;
  background-color: #e0e0e0;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 5px 5px 0 0;
}
</style>
