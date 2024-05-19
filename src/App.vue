<script setup>
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import Header from "@/components/layout/HeaderView.vue";
import Footer from "@/components/layout/FooterView.vue";
</script>

<template>
  <Header />
  <div>
    <RouterLink :to="Home"></RouterLink>
    <RouterView />
  </div>
  <Footer />
</template>

<style scoped></style>
