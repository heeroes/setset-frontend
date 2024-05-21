<script setup>
import { ref } from "vue";
import groupApi from "@/api/group";
const emit = defineEmits(["groupSelected"]);
// 그룹 목록 상태 변수
const groups = ref([]);

const getGroupList = async () => {
  const { data } = await groupApi.get();
  console.log("response : ", data);
  groups.value = data.result;
};
getGroupList();

// 그룹 선택 이벤트를 발생시키는 함수
const selectGroup = (group) => {
  // 부모 컴포넌트로 선택된 그룹을 emit하여 전달합니다.
  emit("groupSelected", group);
};
</script>

<template>
  <div>
    <h2>🚩내가 속한 그룹</h2>
    <ul>
      <li v-for="group in groups" :key="group.id">
        <!-- 그룹을 클릭하면 해당 그룹을 선택하는 이벤트를 발생시킵니다. -->
        <a href="#" @click="selectGroup(group)">{{ group.name }}</a>
        <p>{{ group.userCnt }} people</p>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
