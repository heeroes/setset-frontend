<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const attractions = ref([]);

const attractionRanking = async () => {
  const url = `http://localhost/api/v1/attraction/rank`;
  const { data } = await axios.get(url);
  console.log("response : ", data);
  attractions.value = data.result.map((attraction) => ({
    ...attraction,
    isActive: false,
  }));
};
attractionRanking();

const overlayText = ref("알아볼까?");
const addToCart = (att) => {
  overlayText.value = "검색";
  searchDetail(att.id);
};

const searchDetail = (id) => {
  router.push({ name: "AttractionDetail", params: { id } });
};
</script>

<template >
  <div class="container" style="margin-top: 20px; height: 350px;">
  <h1 style="font-size:larger;">👍 인기 여행지 순위</h1>
  <div class="section">
    <div v-for="att in attractions" :key="att.id" class="card">
      <div @click="addToCart(att)">
        <div class="image">
          <img :src="att.image" :alt="att.title" />
        </div>
        <span class="title">{{ att.title }}</span>
        <span class="cont">
          {{ att.addr }}
          <br />
          👀 : {{ att.popularity }}
        </span>
        <div class="overlay" :class="{ active: att.isActive }">
          {{ overlayText }}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.section {
  display: flex;
  gap: 1em;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden; /* 세로 스크롤 감추기 */
  width: 100%;
}
.section::-webkit-scrollbar {
  height: 8px; /* Custom scrollbar height */
}

.section::-webkit-scrollbar-thumb {
  background: #ccc; /* Custom scrollbar color */
  border-radius: 4px;
}

.section::-webkit-scrollbar-thumb:hover {
  background: #888; /* Scrollbar color on hover */
}
.card {
  /* position: relative; */
  width: 800px;
  height: 16.5em;
  box-shadow: 0px 1px 13px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 120ms;
  display: flex;
  flex-direction: column; /* Align items vertically */
  align-items: center;
  justify-content: space-between; /* Add space between items */
  background: #fff;
  padding: 0.5em;
}

.card::after {
  content: "검색";
  padding-top: 1.25em;
  padding-left: 1.25em;
  position: absolute;
  left: 0;
  bottom: -60px;
  background: #f6e58d;
  color: #f6e58d;
  height: 2.5em;
  width: 90%;
  transition: all 80ms;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0;
}

.card .title {
  font-family: Arial, Helvetica, "Arial Narrow Bold", sans-serif;
  font-size: 0.9em; /* Increase font size */
  position: relative; /* Changed from absolute */
  bottom: 0;
  font-weight: 400;
  color: #000;
  margin-top: 0.5em; /* Add margin for spacing */
}

.card .cont {
  font-family: Impact, Haettenschweiler, sans-serif;
  font-size: 0.8em; /* Increase font size */
  position: relative; /* Changed from absolute */
  bottom: 0;
  color: #000;
  text-align: center; /* Center text */
  margin-bottom: 0.5em; /* Add margin for spacing */
}

.card:hover .overlay {
  bottom: 0;
  opacity: 1;
}

.card:active {
  transform: scale(0.98);
}

.text {
  max-width: 55px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure image covers the container */
}

.image {
  background: rgb(241, 241, 241);
  width: 100%;
  height: 70%; /* Adjust height to fit content */
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  position: absolute;
  left: 0;
  bottom: -60px;
  background: #f6e58d;
  color: #888;
  height: 2.5em;
  width: 90%;
  transition: all 80ms;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.overlay.active {
  bottom: 0;
  opacity: 1;
  height: 3.125em;
}
</style>
