<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const keyword = ref("");
const router = useRouter();
const searchKeyword = () => {
  router.push({ path: "/search", query: { keyword: keyword.value } });
};

const recommendedKeywords = ref([]);
const isRecommandDisplay = ref(false);
const isFetchingKeywords = ref(false);
const getRecommandKeywords = async () => {
  isFetchingKeywords.value = true;
  const url = "http://localhost/api/v1/chatGPT/recommand";
  const { data } = await axios.post(url, {});
  console.log(data.result);
  recommendedKeywords.value = data.result;
  isFetchingKeywords.value = false;
};
const recommandDisplay = () => {
  recommendedKeywords.value = [];
  isFetchingKeywords.value = true;
  getRecommandKeywords();
  isRecommandDisplay.value = !isRecommandDisplay.value;
};

const searchRecommendedKeywords = (recommendedKeyword) => {
  keyword.value = recommendedKeyword;
  searchKeyword();
};
</script>

<template>
  <div class="img">
    <div class="content">
      <h2>
        세트쉐투에서 <br />
        안전한 여행지를 찾아보세요
      </h2>
      <form class="form" @submit.prevent="searchKeyword">
        <button type="button">
          <svg
            width="17"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="search"
          >
            <path
              d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
              stroke="currentColor"
              stroke-width="1.333"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
        <input
          class="input"
          placeholder="어디로 떠날 예정인가요?"
          required
          type="text"
          v-model="keyword"
          @click="recommandDisplay"
        />
        <button
          class="reset"
          type="reset"
          @click="clearInput"
          :class="{ visible: keyword }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </form>
      <div v-if="isRecommandDisplay" class="recommended-keywords">
        <div v-if="isFetchingKeywords" class="recommended-keyword">
          추천 여행지를 가져오고 있습니다...
        </div>
        <div
          v-else
          v-for="(recommendedKeyword, index) in recommendedKeywords"
          :key="index"
        >
          <span
            class="recommended-keyword mouse-hover"
            @click="searchRecommendedKeywords(recommendedKeyword)"
          >
            <path
              fill="#7D8590"
              id="XMLID_1646_"
              d="m17.074 30h-2.148c-1.038 0-1.914-.811-1.994-1.846l-.125-1.635c-.687-.208-1.351-.484-1.985-.824l-1.246 1.067c-.788.677-1.98.631-2.715-.104l-1.52-1.52c-.734-.734-.78-1.927-.104-2.715l1.067-1.246c-.34-.635-.616-1.299-.824-1.985l-1.634-.125c-1.035-.079-1.846-.955-1.846-1.993v-2.148c0-1.038.811-1.914 1.846-1.994l1.635-.125c.208-.687.484-1.351.824-1.985l-1.068-1.247c-.676-.788-.631-1.98.104-2.715l1.52-1.52c.734-.734 1.927-.779 2.715-.104l1.246 1.067c.635-.34 1.299-.616 1.985-.824l.125-1.634c.08-1.034.956-1.845 1.994-1.845h2.148c1.038 0 1.914.811 1.994 1.846l.125 1.635c.687.208 1.351.484 1.985.824l1.246-1.067c.787-.676 1.98-.631 2.715.104l1.52 1.52c.734.734.78 1.927.104 2.715l-1.067 1.246c.34.635.616 1.299.824 1.985l1.634.125c1.035.079 1.846.955 1.846 1.993v2.148c0 1.038-.811 1.914-1.846 1.994l-1.635.125c-.208.687-.484 1.351-.824 1.985l1.067 1.246c.677.788.631 1.98-.104 2.715l-1.52 1.52c-.734.734-1.928.78-2.715.104l-1.246-1.067c-.635.34-1.299.616-1.985.824l-.125 1.634c-.079 1.035-.955 1.846-1.993 1.846zm-5.835-6.373c.848.53 1.768.912 2.734 1.135.426.099.739.462.772.898l.18 2.341 2.149-.001.18-2.34c.033-.437.347-.8.772-.898.967-.223 1.887-.604 2.734-1.135.371-.232.849-.197 1.181.089l1.784 1.529 1.52-1.52-1.529-1.784c-.285-.332-.321-.811-.089-1.181.53-.848.912-1.768 1.135-2.734.099-.426.462-.739.898-.772l2.341-.18h-.001v-2.148l-2.34-.18c-.437-.033-.8-.347-.898-.772-.223-.967-.604-1.887-1.135-2.734-.232-.37-.196-.849.089-1.181l1.529-1.784-1.52-1.52-1.784 1.529c-.332.286-.81.321-1.181.089-.848-.53-1.768-.912-2.734-1.135-.426-.099-.739-.462-.772-.898l-.18-2.341-2.148.001-.18 2.34c-.033.437-.347.8-.772.898-.967.223-1.887.604-2.734 1.135-.37.232-.849.197-1.181-.089l-1.785-1.529-1.52 1.52 1.529 1.784c.285.332.321.811.089 1.181-.53.848-.912 1.768-1.135 2.734-.099.426-.462.739-.898.772l-2.341.18.002 2.148 2.34.18c.437.033.8.347.898.772.223.967.604 1.887 1.135 2.734.232.37.196.849-.089 1.181l-1.529 1.784 1.52 1.52 1.784-1.529c.332-.287.813-.32 1.18-.089z"
            ></path>
            <path
              id="XMLID_1645_"
              fill="#7D8590"
              d="m16 23c-3.859 0-7-3.141-7-7s3.141-7 7-7 7 3.141 7 7-3.141 7-7 7zm0-12c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"
            ></path>
            {{ recommendedKeyword }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.img {
  height: 400px;
  background-image: url("@/assets/img/jeju-island-6929634_1920.jpg");
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  align-items: center;
  gap: 20px; /* Add some space between the h2 and form */
}
h2 {
  color: white;
  margin: 0;
  margin-bottom: 5px;
  font-size: 26px;
}
/* From uiverse.io by @satyamchaudharydev */
/* removing default style of button */

.form button {
  border: none;
  background: none;
  color: #8b8ba7;
}
/* styling of whole input container */
.form {
  --timing: 0.3s;
  --width-of-input: 600px;
  --height-of-input: 40px;
  --border-height: 2px;
  --input-bg: #fff;
  --border-color: #2f2ee9;
  --border-radius: 30px;
  --after-border-radius: 1px;
  position: relative;
  width: var(--width-of-input);
  height: var(--height-of-input);
  display: flex;
  align-items: center;
  padding-inline: 0.8em;
  border-radius: var(--border-radius);
  transition: border-radius 0.5s ease;
  background: var(--input-bg, #fff);
}
/* styling of Input */
.input {
  font-size: 0.9rem;
  background-color: transparent;
  width: 100%;
  height: 100%;
  padding-inline: 0.5em;
  padding-block: 0.7em;
  border: none;
}
/* styling of animated border */
.form:before {
  content: "";
  position: absolute;
  background: var(--border-color);
  transform: scaleX(0);
  transform-origin: center;
  width: 100%;
  height: var(--border-height);
  left: 0;
  bottom: 0;
  border-radius: 1px;
  transition: transform var(--timing) ease;
}
/* Hover on Input */
.form:focus-within {
  border-radius: var(--after-border-radius);
}

.input:focus {
  outline: none;
}
/* here is code of animated border */
.form:focus-within:before {
  transform: scale(1);
}
/* styling of close button */
/* == you can click the close button to remove text == */
.reset {
  border: none;
  background: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}
/* close button shown when typing */
.visible {
  opacity: 1;
  visibility: visible;
}
/* sizing svg icons */
.form svg {
  width: 17px;
  margin-top: 3px;
}

.recommended-keywords {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  justify-content: center;
  border-radius: 5px;
}

.recommended-keyword {
  background-color: transparent;
  border: none;
  padding: 10px;
  color: black;
  display: flex;
  position: relative;
  gap: 5px;
  cursor: pointer;
  padding-left: 2vw;
  border-radius: 4px;
}

.mouse-hover:not(:active):hover,
.mouse-hover:focus {
  background-color: #e5f291ae;
}

.mouse-hover:focus,
.mouse-hover:active {
  background-color: #e5f291;
  outline: none;
}

.recommended-keyword::before {
  position: absolute;
  top: 5px;
  left: -10px;
  width: 5px;
  height: 80%;
  border-radius: 5px;
  opacity: 0;
}

.recommended-keyword:focus::before,
.recommended-keyword:active::before {
  opacity: 1;
}

.recommended-keyword svg {
  width: 15px;
}
</style>
