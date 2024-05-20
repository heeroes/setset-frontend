<script setup>
import { KakaoMap, KakaoMapMarkerPolyline } from "vue3-kakao-maps";
import { defineProps, ref } from "vue";

const image = {
  imageSrc: "https://vue3-kakao-maps.netlify.app/images/redMarker.png",
  imageWidth: 48,
  imageHeight: 48,
};

const props = defineProps(["planDetailArrays"]);

console.log("props : ", props.planDetailArrays);
const days = props.planDetailArrays.length;
console.log(days);

const markerList = ref([]);

for (let i = 0; i < days; i++) {
  const markersForDay = [];
  for (const detail of props.planDetailArrays[i]) {
    const markerInfo = {
      lat: detail.attraction.latitude,
      lng: detail.attraction.longitude,
      image: detail.attraction.image,
      orderBottomMargin: "37px",
      order: "출발", // 이 값은 임시로 설정된 것이므로 실제로 필요한 데이터로 대체해야 합니다.
    };
    markersForDay.push(markerInfo);
  }
  markerList.value.push(markersForDay);
}

props.planDetailArrays.forEach((dayDetails, index) => {
  dayDetails.forEach((detail) => {
    const markerInfo = {
      lat: detail.attraction.latitude,
      lng: detail.attraction.longitude,
      image,
      orderBottomMargin: "37px",
      order: index,
    };
    markerList.value.push(markerInfo);
  });
});

console.log("markerList: ", markerList.value);

// 마커 추가하기 버튼의 함수입니다
const addMarker = () => {
  markerList.value.push({
    lat: 33.4509 + Math.random() * 0.003,
    lng: 126.571 + Math.random() * 0.003,
    image,
    orderBottomMargin: "37px",
  });
};

const deleteMarker = () => {
  markerList.value.pop();
};
</script>

<template>
  <KakaoMap width="100%" height="100%" :lat="33.452" :lng="126.573"> </KakaoMap>
  <div>
    <button class="demo-button" @click="addMarker">마커 추가하기</button>
    <button class="demo-button" @click="deleteMarker">마커 삭제하기</button>
  </div>
</template>

<style scoped></style>
