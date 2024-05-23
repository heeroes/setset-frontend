<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import groupApi from "@/api/group";

// 라우터 객체 생성
const router = useRouter();
const route = useRoute();
const groupId = ref(route.params.id);

// 게시글 내용과 이미지 관련 데이터
const content = ref("");
const imageFiles = ref([]);
const imagePreviews = ref([]);
// 이미지 업로드 핸들러
const handleImageUpload = (event) => {
  const files = event.target.files;
  // 각 파일을 순회하며 이미지 프리뷰 생성 및 파일 목록에 추가
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      imagePreviews.value.push(imageDataUrl);
    };
    reader.readAsDataURL(file);
    imageFiles.value.push(file);
  }
};
const updateForm = ref(null);
// 게시글 제출 핸들러
const submitPost = async () => {
  // 게시글 데이터와 이미지 파일을 서버에 전송하는 로직을 여기에 추가
  const formData = new FormData(updateForm.value);
  console.log("formData:", formData);
  const response = await groupApi.post(
    "/" + groupId.value + "/article",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response);
  alert("게시글 작성이 완료되었습니다.");

  router.push("/feed");
};
</script>

<template>
    <div class="outer-container">

  <div class="container">
    <h2 class="heading">새 게시글 작성</h2>
    <form @submit.prevent="submitPost" ref="updateForm">
      <div v-if="imagePreviews.length > 0">
        <div
          v-for="(preview, index) in imagePreviews"
          :key="index"
          class="image-preview"
        >
          <img :src="preview" alt="업로드된 이미지" />
        </div>
      </div>
      <div>
        <textarea id="content" v-model="content" name="content"></textarea>
      </div>
      <div class="button-group">
        <label for="images" class="btn-upload">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
              stroke="#fffffff"
              stroke-width="2"
            ></path>
            <path
              d="M17 15V18M17 21V18M17 18H14M17 18H20"
              stroke="#fffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path></svg>
          >ADD FILE
        </label>
        <input
          type="file"
          id="images"
          name="attachedFile"
          multiple
          @change="handleImageUpload"
        />
        <button type="submit">게시글 작성</button>
      </div>
    </form>
  </div>
  </div>
</template>

<style scoped>
.outer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}
.container {
  max-width: 1000px;
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

.form {
  margin-top: 20px;
}

.image-preview {
  margin-right: 10px;
  margin-bottom: 10px;
  display: inline-block;
}
.image-preview img {
  max-width: 100px;
  max-height: 100px;
}

textarea {
  width: calc(
    100% - 2.75rem
  ); /* 버튼과의 간격을 유지하기 위해 버튼 너비만큼 빼줍니다. */
  height: 30vh;
  resize: none;
  margin-bottom: 10px; /* 버튼 아래 여백 추가 */
  width: 100%;
  background: white;
  border: none;
  padding: 15px 20px;
  border-radius: 20px;
  margin-top: 15px;
  box-shadow: #cff0ff 0px 10px 10px -5px;
  border-inline: 2px solid transparent;

}


.button-group {
  display: flex;
  justify-content: flex-end; /* 내용과 버튼을 오른쪽으로 정렬합니다. */
}
.btn-upload {
  border: none;
  display: flex;
  padding: 0.75rem 1.5rem;
  background-color: #488aec;
  color: #ffffff;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  align-items: center;
  border-radius: 0.5rem;
  user-select: none;
  gap: 0.75rem;
  box-shadow: 0 4px 6px -1px #488aec31, 0 2px 4px -1px #488aec17;
  transition: all 0.6s ease;
  cursor: pointer; /* 마우스 포인터를 포인팅으로 변경합니다. */
}
.btn-upload svg {
  width: 1.25rem;
  height: 1.25rem;
}

#images {
  display: none;
}

/* 게시글 작성 버튼 스타일 */
button[type="submit"] {
  /* padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: #ffffff;
  font-size: 0.875rem;
  line-height: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px; */

  font-weight: bold;
  background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  /* padding-block: 15px; */
  margin-left: 10px;
  border-radius: 20px;
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
  border: none;
  transition: all 0.2s ease-in-out;
}

button[type="submit"]:hover {
  background-color: #45a049;
}
</style>
