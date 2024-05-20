<script setup>
import { ref, computed } from "vue";
import groupApi from "@/api/group";
const groupList = ref([]);

const isAddUserModalOpen = ref(false);
const emailInput = ref("");
const emails = ref([]);
const maxEmails = 5;
const showWarning = computed(() => emails.value.length >= maxEmails);
const groupId = ref(null);

const getGroupList = async () => {
  const { data } = await groupApi.get();
  console.log("response : ", data);
  groupList.value = data.result;
};
getGroupList();

// 그룹 추가 모달 관련
const isCreateGroupModalOpen = ref(false);
const groupName = ref("");
const groupInfo = ref({
  name: groupName.value,
});

const openCreateGroupModal = () => {
  console.log("그룹 모달 오픈");
  isCreateGroupModalOpen.value = true;
};

const closeCreateGroupModal = () => {
  groupName.value = "";
  isCreateGroupModalOpen.value = false;
};

const createGroup = async () => {
  if (groupName.value != "") {
    try {
      groupInfo.value.name = groupName.value;
      console.log("그룹이름 :", groupInfo.value);
      const response = await groupApi.post("", groupInfo.value);
      alert("그룹 생성이 완료되었습니다.");
      getGroupList();
      closeCreateGroupModal();
    } catch (error) {}
  } else {
    alert("그룹 이름을 입력해주세요.");
  }
};

// 구성원 초대 모달 관련 함수

const openAddUserModal = (id) => {
  isAddUserModalOpen.value = true;
  groupId.value = id;
};

const closeAddUserModal = () => {
  emails.value = [];
  isAddUserModalOpen.value = false;
};

const addEmail = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(emailInput.value)) {
    alert("유효한 이메일 형식이 아닙니다.");
    return;
  }
  if (
    emails.value.length < maxEmails &&
    emailInput.value &&
    !emails.value.includes(emailInput.value)
  ) {
    emails.value.push(emailInput.value);
    emailInput.value = "";
  }
};

const removeEmail = (index) => {
  emails.value.splice(index, 1);
};

const inviteMembers = async () => {
  if (emails.value.length > 0) {
    try {
      const response = await groupApi.post(
        "/" + groupId.value + "/invite",
        emails.value
      );
      alert("구성원 초대가 완료되었습니다");
      closeAddUserModal();
    } catch (error) {
      if (error.response.data && error.response.data.result) {
        alert(`초대 실패: ${error.response.data.result}`);
      } else {
        alert("초대 실패: 알 수 없는 오류가 발생했습니다.");
      }
    }
  }
};

const leaveGroup = async (groupId) => {
  try {
    alert("정말 탈퇴하시겠습니까?");
    const response = await groupApi.delete("/" + groupId + "/user");
    alert("탈퇴되었습니다.");
    getGroupList();
  } catch (error) {
    if (error.response.data && error.response.data.result) {
      alert(`그룹 탈퇴 실패: ${error.response.data.result}`);
    }
  }
};
</script>

<template>
  <h1>나의 그룹 리스트</h1>
  <div class="section">
    <div v-for="group in groupList" class="card">
      <span class="title">{{ group.name }}</span>
      <button @click="openAddUserModal(group.id)">+</button>
      <button @click="leaveGroup(group.id)">-</button>
    </div>
  </div>
  <div class="addGroup">
    <button @click="openCreateGroupModal">+ Add new Group</button>
  </div>

  <!--그룹 추가 모달-->
  <div v-if="isCreateGroupModalOpen" class="modal">
    <div class="modal-content">
      <!-- 닫기버튼 -->
      <span class="close" @click="closeCreateGroupModal">&times;</span>
      <!-- 모달내용 -->
      <h2>그룹 생성</h2>
      그룹 이름 : <input v-model="groupName" type="text" />
      <h3>구성원</h3>
      <input
        v-model="emailInput"
        @keyup.enter="addEmail"
        placeholder="초대할 이메일을 입력해주세요"
        type="email"
      />
      <div v-if="showWarning" class="warning">
        최대 5개의 이메일만 추가할 수 있습니다.
      </div>

      <div v-for="(email, index) in emails" :key="index" class="email-item">
        {{ email }}
        <button @click="removeEmail(index)">x</button>
      </div>
      <button @click="createGroup">그룹 생성</button>
    </div>
  </div>

  <!--구성원 추가 모달-->
  <div v-if="isAddUserModalOpen" class="modal">
    <div class="modal-content">
      <!-- 닫기버튼 -->
      <span class="close" @click="closeAddUserModal">&times;</span>
      <!-- 모달내용 -->
      <h2>구성원 추가</h2>
      <input
        v-model="emailInput"
        @keyup.enter="addEmail"
        placeholder="초대할 이메일을 입력해주세요"
        type="email"
      />
      <div v-if="showWarning" class="warning">
        최대 5개의 이메일만 추가할 수 있습니다.
      </div>

      <div v-for="(email, index) in emails" :key="index" class="email-item">
        {{ email }}
        <button @click="removeEmail(index)">x</button>
      </div>
      <button @click="inviteMembers">초대</button>
    </div>
  </div>
</template>

<style scoped>
/* 모달 스타일 */
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.email-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e5f291;
  padding: 5px;
  margin: 5px 0;
  border-radius: 4px;
}

.email-item button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
}

.warning {
  color: red;
  margin: 5px 0;
}
</style>
