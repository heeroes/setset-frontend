<template>
  <div>
    <h1>뉴스 데이터</h1>
    <ul>
      <li v-for="item in paginatedNews" :key="item.id" @click="showModal(item)">
        <h3>{{ item.title }}</h3>
        <p>{{ item.author }} | {{ item.date }}</p>
      </li>
    </ul>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        이전
      </button>
      <button
        v-for="page in visiblePageNumbers"
        :key="page"
        @click="changePage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPageCount"
      >
        다음
      </button>
    </div>

    <!-- 모달 -->
    <div v-if="selectedNews" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ selectedNews.title }}</h2>
        <p>작성자: {{ selectedNews.author }}</p>
        <p>날짜: {{ selectedNews.date }}</p>
        <p>{{ selectedNews.content }}</p>
        <button @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const news = ref([]);
const selectedNews = ref(null); // 선택된 뉴스를 저장하는 ref
const currentPage = ref(1);
const itemsPerPage = 5;
const pagesPerGroup = 5;

const getNewData = async () => {
  const url = `http://localhost/api/v1/safe/info/news`;
  const { data } = await axios.get(url);
  console.log("response : ", data.result);
  news.value = data.result.news;
};

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return news.value.slice(start, end);
});

const totalPageCount = computed(() => {
  return Math.ceil(news.value.length / itemsPerPage);
});

const showModal = (item) => {
  selectedNews.value = item;
};

const closeModal = () => {
  selectedNews.value = null;
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPageCount.value) {
    currentPage.value = page;
  }
};

const visiblePageNumbers = computed(() => {
  const startPage =
    Math.floor((currentPage.value - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPageCount.value);
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

getNewData();
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  cursor: pointer;
}

li:hover {
  background-color: #f5f5f5;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination button.active {
  font-weight: bold;
  text-decoration: underline;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  max-width: 100%;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.modal h2 {
  margin-top: 0;
}

.modal button {
  margin-top: 20px;
}
</style>
