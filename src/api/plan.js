import axios from "axios";

const planApi = axios.create({
  baseURL: "https://setset.site/api/v1/plan",
});

planApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  console.log("token:" + token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default planApi;
