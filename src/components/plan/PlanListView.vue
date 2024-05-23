<script setup>
import { ref, onMounted } from "vue";
import { useRouter, RouterView } from "vue-router";
import planApi from "@/api/plan";
import PlanCreateView from "@/components/plan/PlanCreateView.vue";

const router = useRouter();
const plans = ref([]);

const getPlanList = async () => {
  const { data } = await planApi.get();
  console.log("response : ", data);

  plans.value = data.result.plans;
  console.log("plans : ", plans.value);
};

const isVisible = ref(false);
const addPlan = () => {
  isVisible.value = !isVisible.value;
};
const detailPlan = (plan) => {
  console.log("plan id : ", plan.id);
  router.push({ name: "PlanDetail", params: { id: plan.id } });
};

const close = () => {
  isVisible.value = false;
  getPlanList();
};

const removePlan = async (id) => {
  const answer = confirm("정말 삭제하시겠습니까?");
  if (!answer) return;
  await planApi.delete(`/${id}`);
  getPlanList();
};

getPlanList();
</script>

<template>
  <PlanCreateView :isVisible="isVisible" @close="close" />

  <div class="plans">
    <div>
      <button @click="addPlan" class="icon-btn add-btn">
        <div class="add-icon"></div>
        <div class="btn-txt">Add Plan</div>
      </button>
    </div>

    <div style="display: flex; flex-direction: row">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="m-2 group px-10 py-5 bg-white/10 rounded-lg flex flex-col items-center justify-center gap-2 relative after:absolute after:h-full after:bg-[#abd373] z-20 shadow-lg after:-z-20 after:w-full after:inset-0 after:rounded-lg transition-all duration-300 hover:transition-all hover:duration-300 after:transition-all after:duration-500 after:hover:transition-all after:hover:duration-500 overflow-hidden cursor-pointer after:-translate-y-full after:hover:translate-y-0 [&amp;_p]:delay-200 [&amp;_p]:transition-all"
        @click="detailPlan(plan)"
      >
        <div class="image-container">
          <img
            class="planImg"
            v-if="
              plan.planDetailList &&
              plan.planDetailList.length > 0 &&
              plan.planDetailList[0].attraction
            "
            :src="plan.planDetailList[0].attraction.image"
            alt=""
          />
          <div v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              class="w-44 card1img aspect-square text-[#abd373] group-hover:bg-gray-800 text-5xl rounded-full p-2 transition-all duration-300 group-hover:transition-all group-hover:duration-300 group-hover:-translate-y-2 mx-auto"
              viewBox="0 0 256 256"
              xml:space="preserve"
            >
              <defs></defs>
              <g
                style="
                  stroke: none;
                  stroke-width: 0;
                  stroke-dasharray: none;
                  stroke-linecap: butt;
                  stroke-linejoin: miter;
                  stroke-miterlimit: 10;
                  fill: none;
                  fill-rule: nonzero;
                  opacity: 1;
                "
                transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
              >
                <path
                  d="M 37.712 41.541 c -2.437 -10.14 2.919 -19.609 8.772 -25.137 c -6.221 11.54 -7.41 20.104 -3.461 33.177 l 2.29 -0.854 c -0.882 -2.464 -1.413 -4.873 -1.685 -7.241 c 8.23 -2.355 13.883 -7.209 15.231 -15.926 C 59.796 13.651 52.042 6.72 43.718 0.117 c 3.04 9.758 -11.581 17.964 -10.296 30.949 c 0.271 2.741 0.697 5.33 1.326 7.825"
                  style="
                    stroke: none;
                    stroke-width: 1;
                    stroke-dasharray: none;
                    stroke-linecap: butt;
                    stroke-linejoin: miter;
                    stroke-miterlimit: 10;
                    fill: rgb(127, 178, 65);
                    fill-rule: nonzero;
                    opacity: 1;
                  "
                  transform="matrix(1 0 0 1 0 0)"
                  stroke-linecap="round"
                ></path>
                <path
                  d="M 34.069 30.999 c 0.917 -12.923 13.599 -21.098 9.649 -30.883 c 1.394 8.216 -9.771 12.38 -12.663 22.195 c -1.575 5.836 -1.151 11.452 3.693 16.579 C 34.119 36.396 33.937 33.751 34.069 30.999 z"
                  style="
                    stroke: none;
                    stroke-width: 1;
                    stroke-dasharray: none;
                    stroke-linecap: butt;
                    stroke-linejoin: miter;
                    stroke-miterlimit: 10;
                    fill: rgb(113, 156, 64);
                    fill-rule: nonzero;
                    opacity: 1;
                  "
                  transform="matrix(1 0 0 1 0 0)"
                  stroke-linecap="round"
                ></path>
                <polygon
                  points="68.77,61.09 70.46,47.61 43.69,47.61 19.54,47.61 21.23,61.09"
                  style="
                    stroke: none;
                    stroke-width: 1;
                    stroke-dasharray: none;
                    stroke-linecap: butt;
                    stroke-linejoin: miter;
                    stroke-miterlimit: 10;
                    fill: rgb(160, 126, 99);
                    fill-rule: nonzero;
                    opacity: 1;
                  "
                  transform="matrix(1 0 0 1 0 0)"
                ></polygon>
                <polyline
                  points="63.11,61.09 59.5,90 44.01,90 30.5,90 26.89,61.09"
                  style="
                    stroke: none;
                    stroke-width: 1;
                    stroke-dasharray: none;
                    stroke-linecap: butt;
                    stroke-linejoin: miter;
                    stroke-miterlimit: 10;
                    fill: rgb(160, 126, 99);
                    fill-rule: nonzero;
                    opacity: 1;
                  "
                  transform="matrix(1 0 0 1 0 0)"
                ></polyline>
                <polygon
                  points="62.61,65.09 63.11,61.09 26.89,61.09 27.39,65.09"
                  style="
                    stroke: none;
                    stroke-width: 1;
                    stroke-dasharray: none;
                    stroke-linecap: butt;
                    stroke-linejoin: miter;
                    stroke-miterlimit: 10;
                    fill: rgb(145, 107, 77);
                    fill-rule: nonzero;
                    opacity: 1;
                  "
                  transform="matrix(1 0 0 1 0 0)"
                ></polygon>
              </g>
            </svg>
          </div>
        </div>
        <button class="delete-button" @click.stop="removePlan(plan.id)">
          <svg class="delete-svgIcon" viewBox="0 0 448 512">
            <path
              d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
            ></path>
          </svg>
        </button>
        <p
          class="cardtxt font-semibold text-gray-700 tracking-wider group-hover:text-gray-100 text-xl"
        >
          {{ plan.title }}
        </p>
        <p class="blueberry font-semibold text-gray-400 text-xs">
          {{ plan.startDate }} ~ {{ plan.endDate }}
        </p>
        <div class="ordernow flex flex-row justify-between items-center w-full">
          <p
            class="ordernow-text text-[#abd373] font-semibold group-hover:text-gray-800"
          >
            {{ plan.region }}
          </p>
          <p
            class="btun4 lg:inline-flex items-center gap-3 group-hover:bg-white/10 bg-[#abd373] shadow-[10px_10px_150px_#ff9f0d] cursor-pointer py-2 px-4 text-sm font-semibold rounded-full butn"
          >
            더보기
          </p>
        </div>
      </div>

      <div></div>
    </div>
  </div>
</template>

<style scoped>
.plans {
  display: flex;
  justify-content: space-evenly;
  overflow-x: auto;
  padding: 10px;
  flex-wrap: nowrap; /* 아이템을 여러 줄에 걸쳐 배치하지 않도록 설정합니다. */
}

.plan-card {
  width: 400px;
  height: 400px; /* 카드의 높이를 강제로 지정합니다. */
  padding-bottom: 20px;
  margin-right: 20px;
}
.planImg {
  width: 175px;
  height: 175px;
}

.image-container {
  position: relative;
}

.image-container img {
  width: 175px;
  height: 175px; /* 이미지의 높이를 100%로 설정하여 이미지가 이미지 컨테이너를 채울 수 있도록 합니다. */
}

.delete-button {
  position: absolute;
  top: 7px;
  right: 7px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 999;
  transition-duration: 0.3s;
  overflow: hidden;
}

.delete-svgIcon {
  width: 15px;
  transition-duration: 0.3s;
}

.delete-svgIcon path {
  fill: white;
}

.delete-button::before {
  display: none;
  content: "Delete";
  color: white;
  transition-duration: 0.3s;
  font-size: 2px;
}

/* 계획 추가 버튼 */
.icon-btn {
  width: 50px;
  height: 50px;
  border: 1px solid #cdcdcd;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
  transition: width 0.2s ease-in-out;
  font-weight: 500;
  font-family: inherit;
}

.add-btn:hover {
  width: 120px;
}

.add-btn::before,
.add-btn::after {
  transition: width 0.2s ease-in-out, border-radius 0.2s ease-in-out;
  content: "";
  position: absolute;
  height: 4px;
  width: 10px;
  top: calc(50% - 2px);
  background: seagreen;
}

.add-btn::after {
  right: 14px;
  overflow: hidden;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.add-btn::before {
  left: 14px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.icon-btn:focus {
  outline: none;
}

.btn-txt {
  opacity: 0;
  transition: opacity 0.2s;
}

.add-btn:hover::before,
.add-btn:hover::after {
  width: 4px;
  border-radius: 2px;
}

.add-btn:hover .btn-txt {
  opacity: 1;
}

.add-icon::after,
.add-icon::before {
  transition: all 0.2s ease-in-out;
  content: "";
  position: absolute;
  height: 20px;
  width: 2px;
  top: calc(50% - 10px);
  background: seagreen;
  overflow: hidden;
}

.add-icon::before {
  left: 22px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.add-icon::after {
  right: 22px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.add-btn:hover .add-icon::before {
  left: 15px;
  height: 4px;
  top: calc(50% - 2px);
}

.add-btn:hover .add-icon::after {
  right: 15px;
  height: 4px;
  top: calc(50% - 2px);
}
</style>
