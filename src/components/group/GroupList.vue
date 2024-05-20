<script setup>
import { ref } from 'vue';
const emit = defineEmits(["groupSelected"])


// 그룹 목록 상태 변수
const groups = ref([
  { id: 1, name: '그룹 1' },
  { id: 2, name: '그룹 2' },
  { id: 3, name: '그룹 3' },
  // 다른 그룹들도 추가할 수 있습니다.
]);

// 그룹 선택 이벤트를 발생시키는 함수
const selectGroup = (group) => {
  // 부모 컴포넌트로 선택된 그룹을 emit하여 전달합니다.
  emit('groupSelected', group);
};
</script>

<template>
  <div>
    <h2>그룹 목록</h2>
    <ul>
      <li v-for="group in groups" :key="group.id">
        <!-- 그룹을 클릭하면 해당 그룹을 선택하는 이벤트를 발생시킵니다. -->
        <a href="#" @click="selectGroup(group)">{{ group.name }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
