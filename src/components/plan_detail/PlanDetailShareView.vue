<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import planApi from "@/api/plan";
import groupApi from "@/api/group";

const props = defineProps({
  isVisible: Boolean,
  planId: Number,
});
console.log("planId:",props.planId);

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
  console.log("child close")
  emit("close");
  
};
const updateOptions = () => {
  // selectedGroup.value = "";
};
</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <button @click="close" style="margin-bottom: 5px;">X</button>
      <div class="modal-content" style="text-align: center;">
      <h3 class="heading"> Share Your Plan </h3>
      <div>
        <label style="margin-right: 15px;">공유 방법</label>
        <select v-model="selectedList" @change="updateOptions" style="border-radius: 20px;  box-shadow: #cff0ff 0px 10px 10px -5px;">
          <option value="summary">게시판 공유</option>
          <option value="link">링크 공유</option>
        </select>
      </div>
      <div v-if="selectedList === 'summary'">
        <label style="margin-right: 15px;">옵션 선택:</label>
        <select v-model="selectedGroup" style="border-radius: 20px;  box-shadow: #cff0ff 0px 10px 10px -5px;">
          <option v-for="group in groups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
      </div>
    </div>
      <div v-if="isGetLink" style="margin-top: 10px; font-size: 18px;">{{ shareLink }}</div>
      <button class="share-btn" @click="sharePlan">공유하기</button>
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
  z-index: 2;
}

.modal {
  /* background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  max-width: 100%;
  z-index: 3; */
  max-width: 350px;
  background: #F8F9FD;
  background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
  border-radius: 40px;
  padding: 25px 35px;
  border: 5px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
  margin: 20px;
}

.heading {
  text-align: center;
  font-weight: 900;
  font-size: 30px;
  color: rgb(16, 137, 211);
}

.share-btn{
  display: block;
  width: 100%;
  font-weight: bold;
  background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
  color: white;
  padding-block: 15px;
  margin: 20px auto;
  border-radius: 20px;
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
  border: none;
  transition: all 0.2s ease-in-out;
}
</style>
