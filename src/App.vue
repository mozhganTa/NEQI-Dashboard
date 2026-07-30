<template>
  <main class="app-shell" dir="rtl">
    <aside class="sidebar-column">
      <header class="title-card">
        <div class="title-icon" aria-hidden="true">
          <PhMapTrifold :size="28" weight="duotone" />
        </div>
        <div>
          <p class="eyebrow">NEQI</p>
          <h1>داشبورد کیفیت محیطی</h1>
        </div>
      </header>

      <section class="info-card">
        <ControlPanel />
      </section>
    </aside>

    <section class="map-card" aria-label="نقشه کیفیت محیطی">
      <MapContainer />
    </section>
  </main>
</template>

<script setup lang="ts">
import { PhMapTrifold } from '@phosphor-icons/vue'
import MapContainer from '@/components/MapContainer.vue'
import ControlPanel from '@/components/ControlPanel.vue'
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  min-width: 0;
  min-height: 100%;
  margin: 0;
  overflow-x: hidden;
}

body {
  background: #f3f6f8;
  color: #17212b;
  font-family: Vazirmatn, IRANSans, Tahoma, 'Segoe UI', sans-serif;
}

button,
input {
  font: inherit;
}

.app-shell {
  width: 100%;
  height: 100dvh;
  min-width: 0;
  display: grid;
  direction: ltr;
  grid-template-columns: minmax(270px, 330px) minmax(0, 1fr);
  gap: clamp(12px, 1.4vw, 22px);
  padding: clamp(12px, 1.8vw, 26px);
  overflow: hidden;
}

.sidebar-column {
  grid-column: 1;
  direction: rtl;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
}

.title-card,
.info-card,
.map-card {
  min-width: 0;
  background: #fff;
  border: 1px solid #dfe7ec;
  border-radius: 22px;
  box-shadow: 0 12px 35px rgba(31, 48, 61, 0.07);
}

.title-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}

.title-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: #0f766e;
  background: #ccfbf1;
}

.eyebrow {
  margin: 0 0 2px;
  color: #0f766e;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.title-card h1 {
  margin: 0;
  color: #17212b;
  font-size: clamp(17px, 1.5vw, 21px);
  line-height: 1.4;
}

.info-card {
  min-height: 0;
  overflow: hidden;
}

.map-card {
  grid-column: 2;
  grid-row: 1 / -1;
  direction: ltr;
  min-height: 0;
  overflow: hidden;
  isolation: isolate;
}

@media (max-width: 860px) {
  .app-shell {
    height: auto;
    min-height: 100dvh;
    grid-template-columns: minmax(0, 1fr);
    overflow: visible;
  }

  .sidebar-column,
  .map-card {
    grid-column: 1;
  }

  .sidebar-column {
    grid-row: 1;
    grid-template-rows: auto auto;
  }

  .info-card {
    overflow: visible;
  }

  .map-card {
    grid-row: 2;
    height: max(520px, 68dvh);
  }
}

@media (max-width: 480px) {
  .app-shell {
    gap: 10px;
    padding: 10px;
  }

  .title-card,
  .info-card,
  .map-card {
    border-radius: 17px;
  }

  .map-card {
    height: 62dvh;
    min-height: 440px;
  }
}
</style>
