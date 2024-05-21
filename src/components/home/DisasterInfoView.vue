<script setup>
import { ref } from "vue";
import axios from "axios";

const alarms = ref("");
const getDisasterAlarm = async () => {
  const url = "http://localhost/api/v1/safe/info/disaster";
  const { data } = await axios.get(url);
  console.log("response : ", data.result);
  alarms.value = data.result.alarms;
};
getDisasterAlarm();
</script>

<template>
  <div>
    <h1>재난문자</h1>
    <ul>
      <li></li>
    </ul>
  </div>
</template>

<style scoped></style>
