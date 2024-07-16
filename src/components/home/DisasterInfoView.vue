<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const alarms = ref([]);
const selectedAlarm = ref(null); // 선택된 알람을 저장하는 ref
const currentPage = ref(1);
const itemsPerPage = 5;
const pagesPerGroup = 5;

const getDisasterAlarm = async () => {
  const url = "https://setset.site/api/v1/safe/info/disaster";
  const { data } = await axios.get(url);
  console.log("response : ", data.result);
  alarms.value = data.result.alarms;
};

const paginatedAlarms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return alarms.value.slice(start, end);
});

const totalPageCount = computed(() => {
  return Math.ceil(alarms.value.length / itemsPerPage);
});

const showModal = (item) => {
  selectedAlarm.value = item;
};

const closeModal = () => {
  selectedAlarm.value = null;
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

const truncateMessage = (message, maxLength) => {
  // 메시지를 줄일 최대 길이
  if (message.length > maxLength) {
    return message.substring(0, maxLength) + "...";
  }
  return message;
};

getDisasterAlarm();
</script>
<template>
  <div>
    <h1 style="font-size: x-large; margin-bottom: 15px">🚨 재난 알림</h1>
    <ul>
      <li
        v-for="item in paginatedAlarms"
        :key="item.id"
        @click="showModal(item)"
      >
        <h3>{{ truncateMessage(item.message, 40) }}</h3>
        <p color="#828282">
          {{ item.type }} | {{ truncateMessage(item.region, 20) }} |
          {{ item.createdAt }}
        </p>
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
    <div v-if="selectedAlarm" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <article class="modal-container">
          <header class="modal-container-header">
            <span class="modal-container-title">
              <span class="shrink-0 rounded-full bg-emerald-400 p-2 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-4 w-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
              재난 알림 상세</span
            >
            <span class="created-at">{{ selectedAlarm.createdAt }}</span>
          </header>
          <section class="modal-container-body rtf">
            <span>{{ selectedAlarm.message }}</span>
            <p>{{ selectedAlarm.region }}</p>
          </section>
          <footer class="modal-container-footer">
            <button class="button is-ghost" @click="closeModal">닫기</button>
          </footer>
        </article>
      </div>
    </div>
  </div>
</template>

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
/* 

/* 모달 가지고 온거 */
.button,
.input,
.select,
.textarea {
  font: inherit;
}

a {
  color: inherit;
}

.modal-container {
  max-height: 400px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.25);
}

@media (max-width: 600px) {
  .modal-container {
    width: 90%;
  }
}

.modal-container-header {
  padding: 16px 32px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-container-title {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1;
  font-weight: 700;
  font-size: 1.125;
}

.modal-container-body {
  padding: 24px 32px 51px;
  overflow-y: auto;
}

.rtf h1,
.rtf h2,
.rtf h3,
.rtf h4,
.rtf h5,
.rtf h6 {
  font-weight: 700;
}

.rtf h1 {
  font-size: 1.5rem;
  line-height: 1.125;
}

.rtf h2 {
  font-size: 1.25rem;
  line-height: 1.25;
}

.rtf h3 {
  font-size: 1rem;
  line-height: 1.5;
}

.rtf > * + * {
  margin-top: 1em;
}

.rtf > * + :is(h1, h2, h3) {
  margin-top: 2em;
}

.rtf > :is(h1, h2, h3) + * {
  margin-top: 0.75em;
}

.rtf ul,
.rtf ol {
  margin-left: 20px;
  list-style-position: inside;
}

.rtf ol {
  list-style: numeric;
}

.rtf ul {
  list-style: disc;
}

.modal-container-footer {
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid #ddd;
  gap: 12px;
  position: relative;
}

.modal-container-footer:after {
  content: "";
  display: block;
  position: absolute;
  top: -51px;
  left: 24px;
  right: 24px;
  height: 50px;
  flex-shrink: 0;
  background-image: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.75),
    transparent
  );
  pointer-events: none;
}

.button {
  padding: 12px 20px;
  border-radius: 8px;
  background-color: transparent;
  border: 0;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s ease;
}

.button.is-ghost:hover,
.button.is-ghost:focus {
  background-color: #dfdad7;
}
.created-at {
  font-size: 0.875rem;
  color: #828282;
}
</style>
