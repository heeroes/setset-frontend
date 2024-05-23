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
    const answer = confirm("정말 탈퇴하시겠습니까?");
    if (!answer) return;
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
  <div class="group-list">
    <div v-for="group in groupList" class="group">
      <div class="group-content">
        <span class="title">{{ group.name }}</span>
        <div class="buttons">
          <button class="add-button" @click="openAddUserModal(group.id)">
            <span class="span"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 23 21"
                height="15"
                width="17"
                class="svg-icon"
              >
                <path
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  stroke="black"
                  d="M1.97742 19.7776C4.45061 17.1544 7.80838 15.5423 11.5068 15.5423C15.2053 15.5423 18.5631 17.1544 21.0362 19.7776M16.2715 6.54229C16.2715 9.17377 14.1383 11.307 11.5068 11.307C8.87535 11.307 6.74212 9.17377 6.74212 6.54229C6.74212 3.91082 8.87535 1.77759 11.5068 1.77759C14.1383 1.77759 16.2715 3.91082 16.2715 6.54229Z"
                ></path></svg
            ></span>
            <span class="lable">Invite</span>
          </button>
          <!-- <button>-</button> -->
          <button class="delete-button" @click="leaveGroup(group.id)">
            <svg class="delete-svgIcon" viewBox="0 0 448 512">
              <path
                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="addGroup">
      <button @click="openCreateGroupModal">+ Add new Group</button>
    </div>
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
      <h2 class="text-lg font-semibold mb-4">구성원 초대</h2>
      <input
        v-model="emailInput"
        @keyup.enter="addEmail"
        class="border rounded p-2 w-full mb-4"
        placeholder="초대할 이메일을 입력해주세요"
        type="email"
      />
      <div v-if="showWarning" class="warning">
        최대 5개의 이메일만 추가할 수 있습니다.
      </div>
      <div class="space-y-2">
        <div v-for="(email, index) in emails" :key="index" class="email-item">
          {{ email }}
          <button @click="removeEmail(index)">x</button>
        </div>
      </div>
      <button
        @click="inviteMembers"
        class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        초대
      </button>
    </div>
  </div>
</template>

<style scoped>
.group-list {
  display: flex;
  flex-direction: column;
}
.group {
  /* padding: 10px;
  background-color: white;
  margin: 5px 0;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
}
.group-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.title {
  padding: 10px;
  background-color: white;
  margin: 5px 0;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
}
.buttons {
  display: flex;
  gap: 5px;
  position: relative; /* 추가 */
}
/* 구성원 추가 버튼 */
.add-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 9px 9px;
  gap: 8px;
  height: 35px;
  width: 120px;
  border: none;
  background: rgb(74, 180, 50);
  border-radius: 50px;
  cursor: pointer;
  position: relative;
}

.lable {
  line-height: 22px;
  font-size: 17px;
  color: #fff;
  margin-left: 20px;
  font-family: sans-serif;
  letter-spacing: 1px;
}

.add-button .span {
  border-radius: 50%;
  background-color: rgb(48, 129, 29);
  padding: 10px;
  position: absolute;
  left: 0;
}

.add-button:hover {
  background: rgb(48, 129, 29);
}

.add-button:hover .svg-icon {
  animation: slope 0.8s linear infinite;
}

@keyframes slope {
  0% {
  }

  50% {
    transform: rotate(15deg);
  }

  100% {
  }
}
/* 그룹 탈퇴 버튼 */
.delete-button {
  position: absolute; /* 추가 */
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 999;
  margin-left: auto;
}

.delete-svgIcon {
  width: 15px;
}

.delete-svgIcon path {
  fill: white;
}

/* 모달 스타일 */
.modal {
  display: block;
  position: fixed;
  z-index: 9999;
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
  z-index: 10000; /* Increase the z-index value */
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
