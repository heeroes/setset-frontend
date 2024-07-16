import axios from "axios";

const groupApi = axios.create({
  baseURL: "https://setset.site/api/v1/group",
});

groupApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  console.log("token:" + token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default groupApi;
