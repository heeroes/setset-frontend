<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import axios, { HttpStatusCode } from "axios";
import { jwtDecode } from "jwt-decode";
// import {findById} from "@/api/user"
import userApi from "@/api/user";
const { VITE_IMAGE_BASE_URL } = import.meta.env;

const authStore = useAuthStore();
const router = useRouter();

const NAVER_URL = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=QNfPn8BRWlnEF4unf3Q9&state=hLiDdL2uhPtsftcU&redirect_uri=http://localhost:80/api/v1/user/login/naver'
const GOOGLE_URL = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=358553454680-ptcnidp5s8vufv27nr5l0l63cs9db48l.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A80%2Fapi%2Fv1%2Fuser%2Flogin%2Fgoogle&response_type=code&scope=email%20profile&approval_prompt=force&access_type=offline&service=lso&o2v=1&ddm=0&flowName=GeneralOAuthFlow'


// const user = computed(() => authStore.user);
const user =  ref(null)

const login = async (url) =>{
    try{
        window.location.href=url

    }catch(error){
        console.log("에러");
        alert("실패")
    }
}

const logout = () => {
    if(!confirm("로그아웃 하시겠습니까?")) return;
    authStore.logout();
    user.value = null;
    router.push("/")    //홈으로 이동
}
const userInfo = ref(null);
const imageUrl = ref(null);

const getUserInfo = async() =>{
    const {data} = await userApi.get("/profile")
    console.log(data)
    userInfo.value = data;
    if(userInfo.value){
        imageUrl.value = VITE_IMAGE_BASE_URL + userInfo.value.result.imageKey
        console.log("imageKey : " + imageUrl.value)
    }
}
if(localStorage.getItem("access-token") != null){
    user.value = jwtDecode(localStorage.getItem("access-token"));
    getUserInfo();
}

</script>

<template>
  <main>
    <h1>로그인</h1>
    <div v-if="user==null">
        <button @click="login(GOOGLE_URL)">구글로그인</button>
        <button @click="login(NAVER_URL)">네이버로그인</button>
    </div>
    <div v-else> 
        <img :src="`${imageUrl}`" alt="">
        <li @click="logout">로그아웃</li>
    </div>
  </main>
</template>

<style scoped></style>
