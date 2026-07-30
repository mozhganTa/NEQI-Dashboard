<template>
  <main class="app-shell" dir="rtl">
    <aside class="sidebar-column">
      <header class="title-card">
        <div class="title-icon" aria-hidden="true">
          <PhMapTrifold :size="28" weight="duotone" />
        </div>
        <div class="title-copy">
          <p class="eyebrow">NEQI</p>
          <h1>داشبورد کیفیت محیطی</h1>
        </div>
        <button
          type="button"
          class="help-button"
          aria-label="راهنمای استفاده از داشبورد"
          title="راهنما / Help"
          @click="isHelpOpen = true"
        >
          <PhQuestion :size="23" weight="bold" />
        </button>
      </header>

      <section class="info-card">
        <ControlPanel />
      </section>
    </aside>

    <section class="map-card" aria-label="نقشه کیفیت محیطی">
      <MapContainer />
    </section>

    <Teleport to="body">
      <div v-if="isHelpOpen" class="help-backdrop" @click.self="closeHelp">
        <section
          class="help-dialog"
          :dir="helpLanguage === 'fa' ? 'rtl' : 'ltr'"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="helpLanguage === 'fa' ? 'help-title-fa' : 'help-title-en'"
        >
          <header class="help-header">
            <div class="help-heading">
              <span class="help-heading-icon"><PhQuestion :size="22" weight="bold" /></span>
              <div>
                <p>{{ helpLanguage === 'fa' ? 'راهنمای سریع' : 'Quick guide' }}</p>
                <h2 :id="helpLanguage === 'fa' ? 'help-title-fa' : 'help-title-en'">
                  {{ helpLanguage === 'fa' ? 'چطور با داشبورد کار کنیم؟' : 'How to use the dashboard' }}
                </h2>
              </div>
            </div>
            <button type="button" class="help-close" :aria-label="helpLanguage === 'fa' ? 'بستن' : 'Close'" @click="closeHelp">
              <PhX :size="20" weight="bold" />
            </button>
          </header>

          <div class="language-switch" aria-label="Guide language">
            <button type="button" :class="{ active: helpLanguage === 'fa' }" @click="helpLanguage = 'fa'">فارسی</button>
            <button type="button" :class="{ active: helpLanguage === 'en' }" @click="helpLanguage = 'en'">English</button>
          </div>

          <div v-if="helpLanguage === 'fa'" class="guide-list">
            <article class="guide-item">
              <span><PhSlidersHorizontal :size="21" weight="duotone" /></span>
              <div><h3>۱. وزن معیارها را تنظیم کنید</h3><p>اهمیت آلودگی، فاصله از صنایع، فضای سبز و دسترسی به راه را با اسلایدرها تغییر دهید. مجموع وزن‌ها باید ۱۰۰٪ باشد.</p></div>
            </article>
            <article class="guide-item">
              <span><PhStack :size="21" weight="duotone" /></span>
              <div><h3>۲. لایه‌های نقشه را انتخاب کنید</h3><p>نمایش فضای سبز، راه‌ها و مراکز صنعتی را از سایدبار روشن یا خاموش کنید.</p></div>
            </article>
            <article class="guide-item">
              <span><PhCursorClick :size="21" weight="duotone" /></span>
              <div><h3>۳. یک منطقه را انتخاب کنید</h3><p>روی هر محدوده نقشه کلیک کنید تا درصد معیارها، امتیاز نهایی و پیشنهاد مربوط به آن نمایش داده شود.</p></div>
            </article>
            <article class="guide-item">
              <span><PhChartBar :size="21" weight="duotone" /></span>
              <div><h3>۴. نتیجه را مقایسه کنید</h3><p>امتیاز بالاتر و رنگ سبز نشان‌دهنده مطلوبیت بیشتر است. با تغییر وزن‌ها، امتیاز مناطق دوباره محاسبه می‌شود.</p></div>
            </article>
          </div>

          <div v-else class="guide-list">
            <article class="guide-item">
              <span><PhSlidersHorizontal :size="21" weight="duotone" /></span>
              <div><h3>1. Adjust criteria weights</h3><p>Use the sliders to set the importance of pollution, distance from industries, green space, and road access. The weights should add up to 100%.</p></div>
            </article>
            <article class="guide-item">
              <span><PhStack :size="21" weight="duotone" /></span>
              <div><h3>2. Choose map layers</h3><p>Use the sidebar to show or hide green spaces, roads, and industrial centers.</p></div>
            </article>
            <article class="guide-item">
              <span><PhCursorClick :size="21" weight="duotone" /></span>
              <div><h3>3. Select an area</h3><p>Click an area on the map to view its criteria scores, final score, and recommendation.</p></div>
            </article>
            <article class="guide-item">
              <span><PhChartBar :size="21" weight="duotone" /></span>
              <div><h3>4. Compare the results</h3><p>Higher scores and greener colors indicate better suitability. Area scores update when you change the weights.</p></div>
            </article>
          </div>
        </section>
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  PhChartBar,
  PhCursorClick,
  PhMapTrifold,
  PhQuestion,
  PhSlidersHorizontal,
  PhStack,
  PhX
} from '@phosphor-icons/vue'
import MapContainer from '@/components/MapContainer.vue'
import ControlPanel from '@/components/ControlPanel.vue'

const isHelpOpen = ref(false)
const helpLanguage = ref<'fa' | 'en'>('fa')

function closeHelp() {
  isHelpOpen.value = false
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && isHelpOpen.value) closeHelp()
}

onMounted(() => window.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', handleEscape))
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
  gap: clamp(8px, 1vw, 14px);
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
  gap: 8px;
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

.title-copy {
  min-width: 0;
  flex: 1;
}

.help-button,
.help-close {
  display: grid;
  place-items: center;
  border: 0;
  cursor: pointer;
}

.help-button {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  color: #0f766e;
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  border-radius: 12px;
  transition: background-color 160ms ease, transform 160ms ease;
}

.help-button:hover {
  background: #ccfbf1;
  transform: translateY(-1px);
}

.help-button:focus-visible,
.help-close:focus-visible,
.language-switch button:focus-visible {
  outline: 3px solid rgba(20, 184, 166, 0.28);
  outline-offset: 2px;
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

.help-backdrop {
  position: fixed;
  z-index: 2000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(15, 23, 42, 0.52);
  backdrop-filter: blur(4px);
}

.help-dialog {
  width: min(620px, 100%);
  max-height: min(720px, calc(100dvh - 36px));
  overflow-y: auto;
  padding: 22px;
  color: #17212b;
  background: #fff;
  border: 1px solid #dfe7ec;
  border-radius: 22px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
}

.help-header,
.help-heading {
  display: flex;
  align-items: center;
}

.help-header {
  justify-content: space-between;
  gap: 16px;
}

.help-heading {
  min-width: 0;
  gap: 11px;
}

.help-heading-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  color: #0f766e;
  background: #ccfbf1;
  border-radius: 13px;
}

.help-heading p,
.help-heading h2,
.guide-item h3,
.guide-item p {
  margin: 0;
}

.help-heading p {
  color: #0f766e;
  font-size: 11px;
  font-weight: 800;
}

.help-heading h2 {
  margin-top: 2px;
  font-size: 19px;
  line-height: 1.45;
}

.help-close {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 10px;
}

.help-close:hover {
  color: #17212b;
  background: #e2e8f0;
}

.language-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin: 20px 0 16px;
  padding: 4px;
  background: #f1f5f9;
  border-radius: 12px;
}

.language-switch button {
  padding: 8px 12px;
  color: #64748b;
  background: transparent;
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
}

.language-switch button.active {
  color: #0f766e;
  background: #fff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.guide-list {
  display: grid;
  gap: 10px;
}

.guide-item {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 11px;
  padding: 13px;
  background: #f8fafc;
  border: 1px solid #e7edf2;
  border-radius: 13px;
}

.guide-item > span {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  color: #0f766e;
  background: #e6fffa;
  border-radius: 10px;
}

.guide-item h3 {
  color: #334155;
  font-size: 13px;
  line-height: 1.7;
}

.guide-item p {
  margin-top: 2px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.75;
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
    gap: 8px;
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

  .help-backdrop {
    padding: 10px;
  }

  .help-dialog {
    max-height: calc(100dvh - 20px);
    padding: 17px;
    border-radius: 17px;
  }

  .help-heading h2 {
    font-size: 16px;
  }
}
</style>
