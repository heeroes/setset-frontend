<script setup>
import { ref } from "vue";
import axios from "axios";

const news = ref();

const getNewData = async () => {
  const url = `http://localhost/api/v1/safe/info/news`;
  const { data } = await axios.get(url);
  console.log("response : ", data);
};
</script>

<template>
  <div>
    <h1>뉴스 데이터</h1>
  </div>
</template>

<style scoped></style>
