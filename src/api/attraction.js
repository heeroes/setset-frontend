import axios from "axios";

const attractionApi = axios.create({
  baseURL: "http://localhost/api/v1/attraction",
});

attractionApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  console.log("token:" + token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default attractionApi;
