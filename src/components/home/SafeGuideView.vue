<script setup>
import { ref, computed } from "vue";
import Guide1 from "@/assets/img/safe_guide/search_yellow.svg";
import Guide2 from "@/assets/img/safe_guide/position_yellow.svg";
import Guide3 from "@/assets/img/safe_guide/Emergency_yellow.svg";
import Guide4 from "@/assets/img/safe_guide/party_yellow.svg";
import Guide5 from "@/assets/img/safe_guide/Alone_yellow.svg";
import Guide6 from "@/assets/img/safe_guide/Beer_yellow.svg";

const cards = ref([
  {
    id: 1,
    image: Guide1,
    title: "반드시 여행지에 대해 사전조사 하기",
    description: `사람들이 많이 모이는 여행지나 관광지 이외에 트레킹을 하거나 알려지지 않은 해변이나 오름 등을 여행할 경우에는 \n
                  반드시 사전에 조사하여 위험 요소가 없는지 확인하는 것이 좋아요!`,
  },
  {
    id: 2,
    image: Guide2,
    title: "자신의 위치를 가족들이나 지인에게 알리기",
    description: `지인이나 가족들과 세트쉐투 피드 등을 사용해 지속적으로 소통하는 것이 좋아요.\n
     여행하며 찍은 사진도 보여주니 풍경의 즐거움을 나눌 수 있고, 또 가족들이나 지인들은 어디서 어떻게 여행하고 있다는 것을 보고 안심할 수 있으니 좋아요! \n
     조심해서 여행하고 있더라도 언제 어떤 일이 일어날지 예측할 수 없기 때문에, 이렇게 올린 사진 한 장이 만약의 상황에서 중요한 역할을 할 수 있습니다.`,
  },
  {
    id: 3,
    image: Guide3,
    title: "위급 상황을 대비할 것",
    description: `위급한 상황이 발생할 경우를 대비해 주변 경찰서나 병원, 안전 지킴이집 등을 파악하고 있는 것이 좋아요.
                세트쉐투에서는 계획한 여행지 동선에서 가까운 안전 시설을 확인할 수 있으니 꼭 참고해주세요!`,
  },
  {
    id: 4,
    image: Guide4,
    title: "파티와 만남이 있는 곳은 주의",
    description: `혼자 온 여행객들을 대상으로 친목을 도모하는 차원에서 열리는 이벤트이지만 이를 악용하는 사례들이 생기고 있다. \n
                  여행지에서 낯섦과 새로움을 즐기려면 안전이 담보되어야 한다는 것을 잊지마세요!`,
  },
  {
    id: 5,
    image: Guide5,
    title: "인적이 드문 곳에 혼자가지 않기",
    description: `인적이 드문 곳은 비상 상황이 생겼을 때 대응할 수 있는 방법이 많지 않아요. \n
                  특히, 야간에는 인적이 드문 곳에 혼자 가는 것은 절대 금지입니다!`,
  },
  {
    id: 6,
    image: Guide6,
    title: "지나친 음주는 하지 않기",
    description: `음주는 크고 많은 사고를 불러와요. \n
    여행지에 와서 음주를 즐기며 스트레스를 풀고 자유로움을 만끽하는 것은 좋지만 술은 늘 사건사고의 원인이 된다는 점을 명심하세요.`,
  },
  // 필요한 만큼 카드 추가
]);

const currentPage = ref(1);
const cardsPerPage = 2;

const visibleCards = computed(() => {
  const start = (currentPage.value - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  return cards.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < 3) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="nav">
        <span class="active">안전여행가이드</span>
      </div>
    </div>
    <div class="content">
      <div class="guide">
        <h2>여행 전 반드시 읽어야 할 안전여행가이드</h2>
        <p>떠나기 전 꼭 읽어보세요. 여행도 안전이 최우선입니다.</p>
        <div class="pagination">
          <button @click="prevPage">‹</button>
          {{ currentPage }} / 3
          <button @click="nextPage">›</button>
        </div>
      </div>
      <div class="cards">
        <div v-for="card in visibleCards" :key="card.id" class="card">
          <img :src="card.image" :alt="card.title" />
          <p>{{ card.title }}</p>
          <p>{{ card.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.highlight {
  color: #1abc9c;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.nav .active {
  border-bottom: 2px solid #1abc9c;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.guide {
  text-align: center;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.cards {
  display: flex;
  gap: 20px;
  overflow-x: scroll;
  width: 100%;
}

.card {
  min-width: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  text-align: center;
}

.card img {
  width: 100%;
  height: auto;
}

.card p {
  padding: 10px;
}
</style>
