import { ref } from 'vue'
import { defineStore } from 'pinia'
import authApi from "@/api/authApi";
import { jwtDecode } from 'jwt-decode';


export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null);
  const user = ref(null);

  const setAccessToken = (
    token
  )=>{
    accessToken.value = token;
    user.value = jwtDecode(accessToken.value).userId;
    console.log(user.value)
    localStorage.setItem("access-token", token)
  }

  const logout = () => {
    //토큰 정보 및 유저 정보 삭제
    accessToken.value = null;
    user.value = null;
    localStorage.clear();
  }
  return {setAccessToken,logout, accessToken,user}
})
