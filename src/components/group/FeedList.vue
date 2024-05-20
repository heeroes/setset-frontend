<script setup>
import { ref, watch } from 'vue';
import groupApi from "@/api/group";

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
    getGroupFeed(newVal);
  } else {
    selectedGroupPosts.value = [];
  }
});

// 선택된 그룹의 게시글을 가져오는 비동기 함수
const getGroupFeed = async (group) => {

  const { data } = await groupApi.get("/" + group.id + "/article");  
   // 선택된 그룹의 게시글 목록 업데이트
  selectedGroupPosts.value = data.result;
 
};
</script>

<template>
  <div>
    <h2>게시글 목록 - {{ selectedGroup ? selectedGroup.name : '전체' }}</h2>
    <ul v-if="selectedGroup">
      <li v-for="article in selectedGroupPosts" :key="article.id">
        내용 : {{ article.content }}
        유저 : {{ article.userId}}
        생성일 : {{ article.createdAt }}
      </li>
    </ul>
    <p v-else>그룹을 선택해주세요.</p>
  </div>
</template>

<style scoped></style>
