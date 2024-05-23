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
  <div class="container">
    <div class="group-list-view">
      <GroupListView @groupSelected="onGroupSelected"/>
    </div>
    <div class="feed-list-view">
      <FeedListView :selectedGroup="selectedGroup"/>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  margin-left: 10%;
  margin-right: 10%;
  margin-top : 20px;
}

.group-list-view {
  width: 30%;
  margin-right: 20px;
  padding: 10px;
}

.feed-list-view {
  flex: 1;
}
</style>
