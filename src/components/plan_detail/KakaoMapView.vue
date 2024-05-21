<script setup>
import { defineProps, ref } from "vue";
import {
  KakaoMap,
  KakaoMapMarkerPolyline,
  KakaoMapMarker,
} from "vue3-kakao-maps";

import mapMarker0 from "@/assets/img/map/map_marker_0.png";

// props 정의
const props = defineProps(["planDetailArrays"]);

// 마커 리스트 초기화
const markerList = ref([]);

// 초기 좌표
const lat = ref(33.452);
const lng = ref(126.573);

// 기본 마커 리스트
const defaultMarkers = ref([]);

// 일별 마커 정보 설정
for (let i = 1; i < props.planDetailArrays.length; i++) {
  const markersForDay = [];
  const image = {
    imageSrc: `/src/assets/img/map/map_marker_${i}.png?t=1716269766674`,
    imageWidth: 48,
    imageHeight: 48,
    imageOption: {},
  };
  if (props.planDetailArrays[i]) {
    for (const detail of props.planDetailArrays[i]) {
      lat.value = detail.attraction.latitude;
      lng.value = detail.attraction.longitude;
      console.log(typeof lat.value);
      markersForDay.push({
        lat: detail.attraction.latitude,
        lng: detail.attraction.longitude,
        image,
        orderBottomMargin: "37px",
        order: i,
      });
    }
  }

  markerList.value.push(markersForDay);
}

// 기본 마커 정보 설정
if (props.planDetailArrays[0]) {
  const firstDay = props.planDetailArrays[0];
  for (const detail of firstDay) {
    defaultMarkers.value.push({
      lat: detail.attraction.latitude,
      lng: detail.attraction.longitude,
      attTitle: detail.attraction.title,
    });
  }
}

const visibleRef = ref(false);

const mouseOverKakaoMapMarker = () => {
  visibleRef.value = true;
};

const mouseOutKakaoMapMarker = () => {
  visibleRef.value = false;
};
</script>

<template>
  <KakaoMap width="100%" height="100%" :lat="lat" :lng="lng">
    <template v-for="(markers, index) in markerList" :key="index">
      <KakaoMapMarkerPolyline
        :endArrow="true"
        :markerList="markers"
        :showMarkerOrder="true"
        strokeColor="#C74C5E"
        :strokeOpacity="1"
      />
    </template>

    <template v-for="marker in defaultMarkers" :key="marker.lat + marker.lng">
      <KakaoMapMarker
        :lat="marker.lat"
        :lng="marker.lng"
        :clickable="true"
        :infoWindow="{ content: `${marker.attTitle}`, visible: visibleRef }"
        @mouseOverKakaoMapMarker="mouseOverKakaoMapMarker"
        @mouseOutKakaoMapMarker="mouseOutKakaoMapMarker"
        :image="{
          imageSrc: `${mapMarker0}`,
          imageWidth: 48,
          imageHeight: 48,
          imageOption: {},
        }"
      />
    </template>
  </KakaoMap>
</template>

<style scoped></style>
