<script setup>
import { ref } from "vue";
import groupApi from "@/api/group";
import groupImage from "@/assets/img/Group-icon.png"
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
  <div style="padding: 10px;  border-radius: 10px;
  border: 1px solid #ddd;
">
    <h2 style="font-size: 18px; margin-bottom: 18px;">🚩 내가 속한 그룹</h2>
    <ul>
      <li class="group-item"  v-for="group in groups" :key="group.id">
        <!-- 그룹을 클릭하면 해당 그룹을 선택하는 이벤트를 발생시킵니다. -->
        <div class="img-wrapper">
          <img class="group-image" :src=groupImage alt="Group Image" />
        </div>
        <div class="content">
        <a href="#" @click="selectGroup(group)">{{ group.name }}</a>
        <p style="color: rgba(69, 69, 69, 1); font-size: 14px;">{{ group.userCnt }} people</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.group-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.img-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background-color: rgba(230, 249, 114, 0.47);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px; /* 이미지와 내용 사이의 간격 조정 */
}

.group-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
</style>
