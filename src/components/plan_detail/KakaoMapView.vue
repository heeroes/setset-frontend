<script setup>
import { defineProps, ref } from "vue";
import {
  KakaoMap,
  KakaoMapMarkerPolyline,
  KakaoMapMarker,
} from "vue3-kakao-maps";

import mapMarker0 from "@/assets/img/map/map_marker_0.png";
import safeApi from "@/api/safe";

// props 정의
const props = defineProps(["planDetailArrays", "planId"]);

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
  const idx = i % 15;
  const image = {
    imageSrc: `/src/assets/img/map/map_marker_${idx}.png?t=1716269766674`,
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
    lat.value = detail.attraction.latitude;
    lng.value = detail.attraction.longitude;
    defaultMarkers.value.push({
      lat: detail.attraction.latitude,
      lng: detail.attraction.longitude,
      attTitle: detail.attraction.title,
    });
  }
}
// 안전 정보 마커 리스트
const hospitalInfo = ref([]);
const policeInfo = ref([]);
const guardHouseInfo = ref([]);

const isHospital = ref(false);
const isPoliceInfo = ref(false);
const isGuardHouse = ref(false);
//안전정보 마커 설정
const getSafeMap = async (agencyType) => {
  try {
    console.log("props.planId", props.planId);
    if (agencyType == "hospital") {
      isHospital.value = !isHospital.value;
      if (!isHospital.value) {
        return;
      } else {
        preHospitalInfo();
      }
    }

    if (agencyType == "police") {
      isPoliceInfo.value = !isPoliceInfo.value;
      if (!isPoliceInfo.value) {
        return;
      } else {
        fetchSafeMap(agencyType);
      }
    }

    if (agencyType == "guardHouse") {
      isGuardHouse.value = !isGuardHouse.value;
      if (!isGuardHouse.value) {
        return;
      } else {
        fetchSafeMap(agencyType);
      }
    }
  } catch (error) {
    console.log("안전정보 마커 에러", error);
  }
};

const fetchSafeMap = async (agencyType) => {
  const response = await safeApi.get(
    `/map/${props.planId}?agencyType=${agencyType}&size=30`
  );

  console.log("response", response);

  const safeLocationList = response.data.result;
  console.log("safeLocationList:", safeLocationList);
  const safeMapMarkers = ref(null);
  for (const safe of safeLocationList) {
    if (agencyType == "police") {
      safeMapMarkers.value = policeInfo.value;
    }
    if (agencyType == "guardHouse") {
      safeMapMarkers.value = guardHouseInfo.value;
    }
    safeMapMarkers.value.push({
      lat: safe.latitude,
      lng: safe.longitude,
      name: safe.name,
      address: safe.address,
      tel: safe.tel,
      image: `/src/assets/img/map/${agencyType}_marker.png`,
    });
  }
};

const preHospitalInfo = async () => {
  try {
    const response = await safeApi.get(
      `/map/${props.planId}?agencyType=hospital`
    );
    const safeLocationList = response.data.result;
    for (const safe of safeLocationList) {
      hospitalInfo.value.push({
        lat: safe.latitude,
        lng: safe.longitude,
        name: safe.name,
        address: safe.address,
        tel: safe.tel,
        image: `/src/assets/img/map/hospital_marker.png`,
      });
    }
  } catch (error) {
    console.log("안전정보 마커 에러", error);
  }
};

// 페이지 로딩될 때 미리 데이터 받아 놓기
preHospitalInfo();
</script>

<template>
  <div class="map-container">
  <div class="agencyType" style="background-color: white; width: 100%;">
    <button @click="getSafeMap(`police`)"><span class="safe-info-icon">🚔</span> 근처 경찰서</button>
    <button @click="getSafeMap(`hospital`)"><span class="safe-info-icon">🚑</span> 근처 응급센터</button>
    <button @click="getSafeMap(`guardHouse`)"><span class="safe-info-icon">🚨</span> 근처 안전지킴이집</button>
  </div>
  <KakaoMap width="100%" height="calc(100% - 150px)" :lat="lat" :lng="lng" :level="8">
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
        :image="{
          imageSrc: `${mapMarker0}`,
          imageWidth: 48,
          imageHeight: 48,
          imageOption: {},
        }"
      />
    </template>

    <template v-for="marker in hospitalInfo" :key="marker.lat + marker.lng">
      <KakaoMapMarker
        :lat="marker.lat"
        :lng="marker.lng"
        :image="{
          imageSrc: `${marker.image}`,
          imageWidth: 40,
          imageHeight: 40,
          imageOption: {},
        }"
        v-if="isHospital"
      />
    </template>
    <template v-for="marker in policeInfo" :key="marker.lat + marker.lng">
      <KakaoMapMarker
        :lat="marker.lat"
        :lng="marker.lng"
        :image="{
          imageSrc: `${marker.image}`,
          imageWidth: 40,
          imageHeight: 40,
          imageOption: {},
        }"
        v-if="isPoliceInfo"
      />
    </template>
    <template v-for="marker in guardHouseInfo" :key="marker.lat + marker.lng">
      <KakaoMapMarker
        :lat="marker.lat"
        :lng="marker.lng"
        :image="{
          imageSrc: `${marker.image}`,
          imageWidth: 40,
          imageHeight: 40,
          imageOption: {},
        }"
        v-if="isGuardHouse"
      />
    </template>
  </KakaoMap>
  </div>
</template>

<style scoped>

.map-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: white;
  border: none;
}
.agencyType {
  display: flex;
  justify-content: center;
  margin-bottom: 1em;
}
.map-container KakaoMap {
  flex: 1;
}

button {
  margin: 0 0.5em;
  padding: 0.5em 1em;
  background-color: white;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #F5F5F5;
}

.safe-info-icon{
  border-radius: 99%;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 4px;
}
</style>
