<script setup>
import { ref } from 'vue';

import { RouterLink, RouterView } from "vue-router";
import GroupListView from "@/components/group/GroupList.vue";
import FeedListView from "@/components/group/FeedList.vue"

// 선택된 그룹을 추적하는 상태 변수
const selectedGroup = ref(null);

// GroupListView에서 발생한 그룹 선택 이벤트 핸들링
function onGroupSelected(group) {
  selectedGroup.value = group;
}
</script>

<template>
  <div>
    <h1>그룹 피드</h1>
    <GroupListView @groupSelected="onGroupSelected"/>
    <FeedListView :selectedGroup="selectedGroup"/>
  </div>
</template>

<style scoped></style>
