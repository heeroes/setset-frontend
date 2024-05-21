import { ref } from "vue";
import { defineStore } from "pinia";

export const useplanDetailStore = defineStore(
  "plan_detail",
  () => {
    const planDetailArrays = ref();

    return { planDetailArrays };
  },
  {
    persist: true,
  }
);
