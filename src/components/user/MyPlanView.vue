<script setup>
// import planApi from "@/api/plan";
// const planList = ref([]);

// const getPlanList = async () => {
//   const { data } = await planApi.get();
//   console.log("response : ", data);
//   plans.value = data.result.plans.map((plan) => ({
//     ...plan,
//     imageUrl: fetchRandomImage(),
//   }));
// };
// function fetchRandomImage() {
//   return `https://picsum.photos/600/400?random=${Math.random()}`;
// }
// getPlanList();
</script>

<template>
  <h1>나의 여행계획</h1>
  <!-- <div class="section">
    <div v-for="plan in planList" class="card" @click="상세조회;">
      <div class="image">
        <img :src="plan.imageUrl" :alt="plan.title" />
      </div>
      <span class="title">{{ att.title }}</span>
      <span class="cont">
        {{ att.addr }}
        <br />
        추가 수 : {{ att.popularity }}
      </span>
      <div class="overlay" :class="{ active: att.isActive }">
        {{ att.overlayText }}
      </div>
    </div>
  </div> -->
</template>

<style scoped></style>
