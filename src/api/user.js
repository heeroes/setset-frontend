import axios from "axios";
import { localAxios } from "@/api/http-commons";

const userApi = axios.create({
  baseURL: "https://setset.site/api/v1/user",
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  console.log("token:" + token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default userApi;
