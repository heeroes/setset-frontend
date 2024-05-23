<script setup>
import { ref } from "vue";
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
    <div class="logo">
      <img src="@/assets/img/logo.png" alt="세트쉐투 로고" />
    </div>
    <div class="text text-gray-300">
      <p>
        (34153) 대전 유성구 동서대로 98-39 (삼성화재 유성캠퍼스) 교육동 206호
        <br />
        희어로즈(heeroes)
      </p>
      <p>ⓒ 2024. SSAFY Corp. all rights reserved.</p>
    </div>
  </div>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40vh;
}

.footer-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo img {
  max-width: 100%;
  height: 100px;
}

.text p {
  margin: 0.5rem 0;
}
</style>
