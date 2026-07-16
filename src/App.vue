<template>
  <div class="app">
    <div class="sidebar">
      <ControlPanel />
    </div>
    <div class="map-area">
      <MapContainer />
    </div>
  </div>
</template>

<script setup lang="ts">
import MapContainer from '@/components/MapContainer.vue'
import ControlPanel from '@/components/ControlPanel.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.sidebar {
  width: 380px;
  min-width: 380px;
  height: 100%;
  overflow: hidden;
  background: white;
  z-index: 10;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
}

.map-area {
  flex: 1;
  height: 100%;
  position: relative;
}
</style>