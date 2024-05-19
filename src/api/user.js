import axios from "axios";
import { localAxios } from "@/api/http-commons";

// const local = localAxios();

// async function findById(user, success, fail){
//     const token = localStorage.getItem("access-token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     console.log("findById header : " + localStorage.getItem("access-token"))
//     await local.get(`/user/profile`).then(success).catch(fail);
// }
const userApi = axios.create({
    baseURL: "http://localhost:80/api/v1/user",
  });
  
userApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access-token");
    console.log("token:" + token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export default userApi;