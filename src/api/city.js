import axios from "axios";

const cityApi = axios.create({
  baseURL: "http://localhost:80/api/v1/city/search",
});

cityApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  console.log("token:" + token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default cityApi;