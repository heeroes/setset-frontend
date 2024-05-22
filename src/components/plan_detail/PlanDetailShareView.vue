<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import planApi from "@/api/plan";
import groupApi from "@/api/group";

const props = defineProps({
  isVisible: Boolean,
  planId: Number,
});
console.log(props.planId);

const emit = defineEmits();
const selectedList = ref("");
const router = useRouter();
const groups = ref([]);
const getGroups = async () => {
  const { data } = await groupApi.get();
  groups.value = data.result;
  console.log("그룹 : ", groups.value);
};
getGroups();
const sharePlan = () => {
  if (selectedList.value === "summary") summaryPlan();
  else getLink();
};

const selectedGroup = ref({});
const summaryPlan = async () => {
  console.log("group : ", selectedGroup.value);
  planApi
    .get(`/share/summary?id=${props.planId}&groupId=${selectedGroup.value}`)
    .then(alert("공유 완료"));
  close();
};

const shareLink = ref("");
const isGetLink = ref(false);
const getLink = async () => {
  const { data } = await planApi.get(`/share/${props.planId}`);
  shareLink.value = data.result;
  isGetLink.value = true;
  console.log(shareLink.value);
};

const close = () => {
  emit("close");
};
const updateOptions = () => {
  // selectedGroup.value = "";
};
</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <div>
        <label>공유 방법</label>
        <select v-model="selectedList" @change="updateOptions">
          <option value="summary">게시판 공유</option>
          <option value="link">링크 공유</option>
        </select>
      </div>
      <div v-if="selectedList === 'summary'">
        <label>옵션 선택:</label>
        <select v-model="selectedGroup">
          <option v-for="group in groups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
      </div>
      <div v-if="isGetLink">{{ shareLink }}</div>
      <button @click="sharePlan">공유하기</button>
      <button @click="close">close</button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  max-width: 100%;
  z-index: 9999;
}
</style>
