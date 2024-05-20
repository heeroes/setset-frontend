import { ref } from "vue";
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import userApi from "@/api/user";
const { VITE_IMAGE_BASE_URL } = import.meta.env;

export const useAuthStore = defineStore(
  "auth",
  () => {
    const accessToken = ref(null);
    const user = ref(null);
    const userInfo = ref(null);
    const imageUrl = ref(null);

    const setAccessToken = (token) => {
      accessToken.value = token;
      user.value = jwtDecode(accessToken.value).userId;
      console.log(user.value);
      localStorage.setItem("access-token", token);
    };

    const logout = () => {
      //토큰 정보 및 유저 정보 삭제
      accessToken.value = null;
      user.value = null;
      userInfo.value = null;
      localStorage.clear();
    };

    const getUserInfo = async () => {
      const { data } = await userApi.get("/profile");
      console.log(data);
      userInfo.value = data.result;
      if (userInfo.value) {
        imageUrl.value = VITE_IMAGE_BASE_URL + userInfo.value.imageKey;
        console.log("imageKey : " + imageUrl.value);
      }
    };

    return {
      setAccessToken,
      logout,
      accessToken,
      user,
      userInfo,
      imageUrl,
      getUserInfo,
    };
  },
  {
    persist: true,
  }
);
