<script setup>
import { ref, watch } from 'vue';

// 선택된 그룹의 게시글 목록 상태 변수
const selectedGroupPosts = ref([]);

// 부모 컴포넌트로부터 선택된 그룹을 전달받는 props
const props = defineProps({
  selectedGroup: Object,
});

// 선택된 그룹이 변경될 때마다 해당 그룹의 게시글 목록을 업데이트
watch(() => props.selectedGroup, (newVal) => {
  if (newVal) {
    // 선택된 그룹의 게시글을 가져오는 비동기 로직을 수행하고 selectedGroupPosts 업데이트
    fetchGroupPosts(newVal);
  } else {
    selectedGroupPosts.value = [];
  }
});

// 선택된 그룹의 게시글을 가져오는 비동기 함수
const fetchGroupPosts = async (group) => {
  // 여기서는 가짜 데이터를 사용하겠습니다.
  // 실제로는 서버로부터 해당 그룹의 게시글을 가져와야 합니다.
  // 예를 들어 axios 또는 fetch를 사용하여 API를 호출할 수 있습니다.
  // 이 코드는 간단한 예제를 위한 것이므로 실제로는 적절한 API 호출을 수행해야 합니다.
  // 여기서는 setTimeout으로 가짜 비동기 처리를 흉내내었습니다.
  setTimeout(() => {
    // 가짜 데이터 생성
    const fakePosts = [
      { id: 1, title: '게시글 1' },
      { id: 2, title: '게시글 2' },
      { id: 3, title: '게시글 3' },
    ];
    // 선택된 그룹의 게시글 목록 업데이트
    selectedGroupPosts.value = fakePosts;
  }, 500); // 임의의 시간 설정 (예: 500ms)
};
</script>

<template>
  <div>
    <h2>게시글 목록 - {{ selectedGroup ? selectedGroup.name : '전체' }}</h2>
    <ul v-if="selectedGroup">
      <li v-for="article in selectedGroupPosts" :key="article.id">
        {{ article.title }}
      </li>
    </ul>
    <p v-else>그룹을 선택해주세요.</p>
  </div>
</template>

<style scoped></style>
