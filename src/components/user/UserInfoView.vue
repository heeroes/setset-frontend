<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import userApi from "@/api/user";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const { userInfo, imageUrl } = storeToRefs(authStore);
const showModal = ref(false);
const newProfileImage = ref(null);
const nickname = ref(userInfo.value.nickname);
const updateForm = ref(null);
const editProfile = () => {
  console.log("수정 버튼 누르기");
  showModal.value = true;
  console.log("수정 value:", showModal.value);
};

const closeModal = () => {
  showModal.value = false;
  newProfileImage.value = null; // 모달을 닫을 때 새로운 프로필 이미지를 초기화
};

const updateProfileImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      newProfileImage.value = reader.result;
    };
    newProfileImage.value = file;
    reader.readAsDataURL(file);
  }
};

const updateProfile = async () => {
  try {
    const formData = new FormData(updateForm.value);

    const response = await userApi.post("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    alert("프로필 수정이 완료되었습니다.");
    authStore.getUserInfo();
    closeModal();
  } catch (error) {
    console.error("유저 정보 수정:", error);
    if (error.response.data && error.response.data.result) {
      alert(`유저 프로필 수정 실패: ${error.response.data.result}`);
    }
  }
};

const logout = () => {
  if (!confirm("로그아웃 하시겠습니까?")) return;
  authStore.logout();
  router.push("/"); //홈으로 이동
};
</script>

<template>
  <div class="profile-container">
    <div>
      <img class="profile-image" :src="imageUrl" alt="" />
      <button class="edit-button" @click="editProfile">
        <svg class="edit-svgIcon" viewBox="0 0 512 512">
          <path
            d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
          ></path>
        </svg>
      </button>
    </div>
    <div class="userInfo">
      <p class="text-lg font-extrabold mb-3">{{ userInfo.nickname }}</p>
      <p>{{ userInfo.email }}</p>
      <button class="Btn" @click="logout">
        <div class="sign">
          <svg viewBox="0 0 512 512">
            <path
              d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
            ></path>
          </svg>
        </div>
        <div class="text">Logout</div>
      </button>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <div class="container">
        <div class="heading">Edit Profile</div>
        <form class="form" @submit.prevent="updateProfile" ref="updateForm">
          <img
            class="profile-image"
            :src="newProfileImage || imageUrl"
            alt="프로필 이미지"
          />
          <input type="file" name="userImage" @change="updateProfileImage" />
          <input
            id="nickname"
            name="nickname"
            type="text"
            class="input"
            required=""
            v-model="nickname"
          />
          <input value="Update" type="submit" class="update-button" />
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  list-style-type: none;
}
.profile-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10%;
  padding-top: 5%;
}
.profile-image {
  width: 150px; /* 프로필 이미지의 너비에 맞게 조절 */
  height: 120px; /* 자동 높이 조절 */
  border-radius: 50%; /* 원형 프로필 이미지로 설정 */
  object-fit: cover;
}
.userInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 10px;
}
/* 로그아웃 버튼 */
.Btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: 0.4s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to right, #e5f291, #e74c3c);
  margin-top: 5%;
}

.sign {
  width: 100%;
  transition-duration: 0.4s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sign svg {
  width: 17px;
}

.sign svg path {
  fill: white;
}

.text {
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: #ecf0f1;
  font-size: 1em;
  font-weight: 600;
  transition-duration: 0.4s;
}

.Btn:hover {
  width: 150px;
  border-radius: 20px;
  transition-duration: 0.4s;
  background: linear-gradient(to right, #e5f291, #e74c3c);
}

.Btn:hover .sign {
  width: 30%;
  transition-duration: 0.4s;
  padding-left: 12px;
}

.Btn:hover .text {
  opacity: 1;
  width: 70%;
  transition-duration: 0.4s;
  padding-right: 10px;
}

.Btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.2);
}

.edit-button {
  position: absolute;
  top: -35px; /* 원하는 위치에 맞게 조절 */
  right: -90px; /* 원하는 위치에 맞게 조절 */
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgb(20, 20, 20);
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
  cursor: pointer;
  transition-duration: 0.3s;
  overflow: hidden;
  position: relative;
  text-decoration: none !important;
}

.edit-svgIcon {
  width: 17px;
  transition-duration: 0.3s;
}

.edit-svgIcon path {
  fill: white;
}

.edit-button:hover {
  width: 120px;
  border-radius: 50px;
  transition-duration: 0.3s;
  background-color: rgb(255, 69, 69);
  align-items: center;
}

.edit-button:hover .edit-svgIcon {
  width: 20px;
  transition-duration: 0.3s;
  transform: translateY(60%);
  -webkit-transform: rotate(360deg);
  -moz-transform: rotate(360deg);
  -o-transform: rotate(360deg);
  -ms-transform: rotate(360deg);
  transform: rotate(360deg);
}

.edit-button::before {
  display: none;
  content: "Edit";
  color: white;
  transition-duration: 0.3s;
  font-size: 2px;
}

.edit-button:hover::before {
  display: block;
  padding-right: 10px;
  font-size: 13px;
  opacity: 1;
  transform: translateY(0px);
  transition-duration: 0.3s;
}
/* 수정 모달 */
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;

  overflow: auto;

  max-width: 450px;
  max-height: 400px;
  background: #f8f9fd;
  background: linear-gradient(
    0deg,
    rgb(255, 255, 255) 0%,
    rgb(244, 247, 251) 100%
  );
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

.form {
  margin-top: 20px;
}

.form .input {
  width: 100%;
  background: white;
  border: none;
  padding: 15px 20px;
  border-radius: 20px;
  margin-top: 15px;
  box-shadow: #cff0ff 0px 10px 10px -5px;
  border-inline: 2px solid transparent;
}

.form .input::-moz-placeholder {
  color: rgb(170, 170, 170);
}

.form .input::placeholder {
  color: rgb(170, 170, 170);
}

.form .input:focus {
  outline: none;
  border-inline: 2px solid #12b1d1;
}

.form .update-button {
  display: block;
  width: 100%;
  font-weight: bold;
  background: linear-gradient(
    45deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  color: white;
  padding-block: 15px;
  margin: 20px auto;
  border-radius: 20px;
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
  border: none;
  transition: all 0.2s ease-in-out;
}

.form .update-button:hover {
  transform: scale(1.03);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
}

.form .update-button:active {
  transform: scale(0.95);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
}
</style>
