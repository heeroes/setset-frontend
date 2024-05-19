<script setup>
import { ref } from "vue";
import planApi from "@/api/plan";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";

const route = useRoute();
const id = ref(route.params.id);

console.log("receive : ", id.value);

const plan = ref("");
const getDetail = async () => {
  const url = `/${id.value}`;
  console.log(url);
  const { data } = await planApi.get(url);
  console.log("plan detail : ", data);
};
getDetail();
</script>
<template>
  <div><h1>상세조회</h1></div>
</template>
<style scoped></style>
