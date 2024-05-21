<script setup>
import { ref, watch } from "vue";
import groupApi from "@/api/group";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

const { VITE_IMAGE_BASE_URL } = import.meta.env;
const authStore = useAuthStore();
const { userInfo } = storeToRefs(authStore);

// 선택된 그룹의 게시글 목록 상태 변수
const selectedGroupPosts = ref([]);
const groupId = ref(0);
// 부모 컴포넌트로부터 선택된 그룹을 전달받는 props
const props = defineProps({
  selectedGroup: Object,
});

// 선택된 그룹이 변경될 때마다 해당 그룹의 게시글 목록을 업데이트
watch(
  () => props.selectedGroup,
  (newVal) => {
    if (newVal) {
      // 선택된 그룹의 게시글을 가져오는 비동기 로직을 수행하고 selectedGroupPosts 업데이트
      getGroupFeed(newVal);
      groupId.value = newVal.id;
    } else {
      selectedGroupPosts.value = [];
    }
  }
);

// 선택된 그룹의 게시글을 가져오는 비동기 함수
const getGroupFeed = async (group) => {
  const { data } = await groupApi.get("/" + group.id + "/article");
  selectedGroupPosts.value = data.result.map((post) => ({
    ...post,
    currentImageIndex: 0, // 각 게시글에 currentImageIndex 추가
    showComments: false, // 댓글 표시 여부
    comments: [], // 댓글 목록
    newComment: "", // 새로운 댓글 내용
  }));
  console.log(selectedGroupPosts.value);
};

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
};
const nextImage = (postIndex) => {
  const post = selectedGroupPosts.value[postIndex];
  post.currentImageIndex = (post.currentImageIndex + 1) % post.images.length;
};

const prevImage = (postIndex) => {
  const post = selectedGroupPosts.value[postIndex];
  post.currentImageIndex =
    (post.currentImageIndex - 1 + post.images.length) % post.images.length;
};
const toggleComments = (postIndex) => {
  const post = selectedGroupPosts.value[postIndex];
  post.showComments = !post.showComments;
  if (post.showComments && post.comments.length === 0) {
    loadComments(post.id, postIndex);
  }
};
const loadComments = async (postId, postIndex) => {
  const comments = await groupApi.get(
    "/" + groupId.value + "/article/" + postId + "/comment"
  );
  console.log("댓글", comments);
  selectedGroupPosts.value[postIndex].comments = comments.data.result;
};

const addComment = async (postIndex) => {
  const post = selectedGroupPosts.value[postIndex];
  if (post.newComment.trim()) {
    post.comments.push({
      id: Date.now(),
      content: post.newComment,
      userNickname: userInfo.value.result.nickname,
      userImageKey: userInfo.value.result.imageKey,
      createdAt: new Date().toISOString(),
    });
    const response = await groupApi.post(
      "/" + groupId.value + "/article/" + post.id + "/comment",
      {
        content: post.newComment,
      }
    );
    post.newComment = "";
  }
};
</script>

<template>
  <div>
    <h2>게시글 목록 - {{ selectedGroup ? selectedGroup.name : "전체" }}</h2>
    <ul v-if="selectedGroup">
      <div class="feed">
        <div
          v-for="(article, index) in selectedGroupPosts"
          :key="article.id"
          class="post"
        >
          <div class="post-header">
            <img
              :src="`${VITE_IMAGE_BASE_URL}${article.userImageKey}`"
              alt="프로필 이미지"
              class="profile-image"
            />
            <div class="user-info">
              <span class="nickname">{{ article.nickname }}</span>
              <span class="created-at">{{
                formatDate(article.createdAt)
              }}</span>
            </div>
          </div>
          <div class="post-images">
            <button
              v-if="article.images.length > 1"
              @click="prevImage(index)"
              class="arrow left"
            >
              &lt;
            </button>
            <img
              v-if="article.images[article.currentImageIndex]"
              :src="`${VITE_IMAGE_BASE_URL}${
                article.images[article.currentImageIndex]
              }`"
              alt="게시글 이미지"
              class="post-image"
            />
            <button
              v-if="article.images.length > 1"
              @click="nextImage(index)"
              class="arrow right"
            >
              &gt;
            </button>
          </div>

          <div class="post-content">
            <p>{{ article.content }}</p>
          </div>
          <div class="comments-section">
            <button @click="toggleComments(index)">댓글 {{ 1 }}개</button>
            <div v-if="article.showComments" class="comments">
              <div
                v-for="comment in article.comments"
                :key="comment.id"
                class="comment"
              >
                <img
                  :src="`${VITE_IMAGE_BASE_URL}${comment.userImageKey}`"
                  alt="댓글 작성자 프로필 이미지"
                  class="comment-profile-image"
                />
                <div class="comment-content-wrapper">
                  <div class="comment-header">
                    <span class="comment-user">{{ comment.userNickname }}</span>
                    <span class="comment-date">{{
                      formatDate(comment.createdAt)
                    }}</span>
                  </div>
                  <span class="comment-content">{{ comment.content }}</span>
                </div>
              </div>
              <div class="comment-form">
                <input
                  v-model="article.newComment"
                  placeholder="댓글을 입력하세요"
                />
                <button @click="addComment(index)">댓글 작성</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ul>
    <p v-else>그룹을 선택해주세요.</p>
  </div>
</template>

<style scoped>
.feed {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.post {
  border: 1px solid #ddd;
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-weight: bold;
}

.created-at {
  color: #888;
  font-size: 0.8em;
}

.post-images {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.post-image {
  max-width: 100%;
  border-radius: 10px;
}

.post-content {
  font-size: 1em;
}
.comments-section {
  margin-top: 10px;
}

.comments {
  margin-top: 10px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.comment {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.comment-profile-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.comment-content-wrapper {
  display: flex;
  flex-direction: column;
}
.comment-header {
  display: flex;
  align-items: center;
}
.comment-user {
  font-weight: bold;
  margin-right: 10px;
}
.comment-date {
  color: #888;
  font-size: 0.8em;
}
.comment-content {
  flex-grow: 1;
}

.comment-form {
  display: flex;
  margin-top: 10px;
}

.comment-form input {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.comment-form button {
  padding: 5px 10px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.comment-form button:hover {
  background-color: #0056b3;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
}
.arrow.left {
  left: 10px;
}

.arrow.right {
  right: 10px;
}
</style>
