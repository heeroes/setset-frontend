<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const attractions = ref([]);

const attractionRanking = async () => {
  const url = `http://setset.site:8080/api/v1/attraction/rank`;
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

<template>
  <div class="container" style="margin-top: 20px; height: 350px">
    <h1 style="font-size: x-large">👍 인기 여행지 순위</h1>
    <div class="section">
      <div v-for="att in attractions" :key="att.id" class="card">
        <div @click="addToCart(att)">
          <div class="image">
            <img
              v-if="att.image !== ''"
              :src="att.image"
              :alt="att.title"
              width="20%"
            />
            <div v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
                class="w-44 card1img aspect-square text-[#abd373] group-hover:bg-gray-800 text-5xl rounded-full p-2 transition-all duration-300 group-hover:transition-all group-hover:duration-300 group-hover:-translate-y-2 mx-auto"
                viewBox="0 0 256 256"
                xml:space="preserve"
                height="80"
              >
                <defs></defs>
                <g
                  style="
                    stroke: none;
                    stroke-width: 0;
                    stroke-dasharray: none;
                    stroke-linecap: butt;
                    stroke-linejoin: miter;
                    stroke-miterlimit: 10;
                    fill: none;
                    fill-rule: nonzero;
                    opacity: 1;
                  "
                  transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                >
                  <path
                    d="M 37.712 41.541 c -2.437 -10.14 2.919 -19.609 8.772 -25.137 c -6.221 11.54 -7.41 20.104 -3.461 33.177 l 2.29 -0.854 c -0.882 -2.464 -1.413 -4.873 -1.685 -7.241 c 8.23 -2.355 13.883 -7.209 15.231 -15.926 C 59.796 13.651 52.042 6.72 43.718 0.117 c 3.04 9.758 -11.581 17.964 -10.296 30.949 c 0.271 2.741 0.697 5.33 1.326 7.825"
                    style="
                      stroke: none;
                      stroke-width: 1;
                      stroke-dasharray: none;
                      stroke-linecap: butt;
                      stroke-linejoin: miter;
                      stroke-miterlimit: 10;
                      fill: rgb(127, 178, 65);
                      fill-rule: nonzero;
                      opacity: 1;
                    "
                    transform="matrix(1 0 0 1 0 0)"
                    stroke-linecap="round"
                  ></path>
                  <path
                    d="M 34.069 30.999 c 0.917 -12.923 13.599 -21.098 9.649 -30.883 c 1.394 8.216 -9.771 12.38 -12.663 22.195 c -1.575 5.836 -1.151 11.452 3.693 16.579 C 34.119 36.396 33.937 33.751 34.069 30.999 z"
                    style="
                      stroke: none;
                      stroke-width: 1;
                      stroke-dasharray: none;
                      stroke-linecap: butt;
                      stroke-linejoin: miter;
                      stroke-miterlimit: 10;
                      fill: rgb(113, 156, 64);
                      fill-rule: nonzero;
                      opacity: 1;
                    "
                    transform="matrix(1 0 0 1 0 0)"
                    stroke-linecap="round"
                  ></path>
                  <polygon
                    points="68.77,61.09 70.46,47.61 43.69,47.61 19.54,47.61 21.23,61.09"
                    style="
                      stroke: none;
                      stroke-width: 1;
                      stroke-dasharray: none;
                      stroke-linecap: butt;
                      stroke-linejoin: miter;
                      stroke-miterlimit: 10;
                      fill: rgb(160, 126, 99);
                      fill-rule: nonzero;
                      opacity: 1;
                    "
                    transform="matrix(1 0 0 1 0 0)"
                  ></polygon>
                  <polyline
                    points="63.11,61.09 59.5,90 44.01,90 30.5,90 26.89,61.09"
                    style="
                      stroke: none;
                      stroke-width: 1;
                      stroke-dasharray: none;
                      stroke-linecap: butt;
                      stroke-linejoin: miter;
                      stroke-miterlimit: 10;
                      fill: rgb(160, 126, 99);
                      fill-rule: nonzero;
                      opacity: 1;
                    "
                    transform="matrix(1 0 0 1 0 0)"
                  ></polyline>
                  <polygon
                    points="62.61,65.09 63.11,61.09 26.89,61.09 27.39,65.09"
                    style="
                      stroke: none;
                      stroke-width: 1;
                      stroke-dasharray: none;
                      stroke-linecap: butt;
                      stroke-linejoin: miter;
                      stroke-miterlimit: 10;
                      fill: rgb(145, 107, 77);
                      fill-rule: nonzero;
                      opacity: 1;
                    "
                    transform="matrix(1 0 0 1 0 0)"
                  ></polygon>
                </g>
              </svg>
            </div>
          </div>
          <span class="title" style="font-size: 15px; font-family: wavve">{{
            att.title
          }}</span>
          <br />
          <span class="cont" style="font-size: 11px">
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
  position: relative;
  width: 300px;
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
  font-size: 0.9em; /* Increase font size */
  position: relative; /* Changed from absolute */
  bottom: 0;
  height: 176px;
  font-weight: bold;
  color: #000;
  margin-top: 0.5em; /* Add margin for spacing */
  text-align: center; /* Center text */
}

.card .cont {
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
  width: 200px;
  height: 100px;
  max-width: none;
}

.image {
  background: rgb(241, 241, 241);
  width: 100%;
  height: 70%; /* Adjust height to fit content */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
}

.overlay {
  position: absolute;
  left: 0;
  bottom: -60px;
  background: #efe092;
  color: #31332f;
  height: 2.5em;
  width: 100%;
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
