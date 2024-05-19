<template>
  <div>
    <h1>Random Image</h1>
    <button @click="fetchRandomImage">Get Random Image</button>
    <div v-if="imageUrl">
      <img :src="imageUrl" alt="Random Image" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";


const imageUrl = ref("");

function fetchRandomImage() {
  // picsum.photos에서 랜덤 이미지 URL 생성
  imageUrl.value = `https://picsum.photos/600/400?random=${Math.random()}`;
}
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin-top: 20px;
}
</style>
