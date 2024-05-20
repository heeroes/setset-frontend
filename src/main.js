// import './assets/main.css'

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { useKakao } from "vue3-kakao-maps/@utils";

const { VITE_KAKAO_SERVICE_KEY } = import.meta.env;

import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

useKakao(VITE_KAKAO_SERVICE_KEY);
app.use(pinia);
app.use(router);

app.mount("#app");
