<template>
  <div class="control-panel">
    <section class="panel-section">
      <div class="section-heading">
        <span class="section-icon"><PhSlidersHorizontal :size="19" weight="duotone" /></span>
        <div>
          <h2>وزن معیارها</h2>
          <p>اهمیت هر معیار را برای محاسبه مطلوبیت تنظیم کنید.</p>
        </div>
      </div>

      <div class="weight-list">
        <div v-for="item in weightItems" :key="item.key" class="weight-item">
          <div class="weight-label">
            <span class="label-title">
              <component :is="item.icon" :size="18" weight="duotone" />
              {{ item.label }}
            </span>
            <span class="weight-value">{{ Math.round(weights[item.key] * 100) }}٪</span>
          </div>
          <input
            type="range"
            :value="weights[item.key] * 100"
            min="0"
            max="100"
            :aria-label="item.label"
            @input="updateWeight(item.key, $event)"
          />
        </div>
      </div>

      <div class="total-weight">
        <span>مجموع وزن‌ها</span>
        <strong>{{ Math.round(weightsStore.totalWeight * 100) }}٪</strong>
      </div>

      <div v-if="Math.abs(weightsStore.totalWeight - 1) > 0.001" class="warning">
        <PhWarningCircle :size="17" weight="fill" />
        مجموع وزن‌ها باید ۱۰۰٪ باشد.
      </div>

      <button type="button" class="reset-btn" @click="resetWeights">
        <PhArrowCounterClockwise :size="18" weight="bold" />
        بازنشانی وزن‌ها
      </button>
    </section>

    <section class="panel-section layers-section">
      <div class="section-heading compact">
        <span class="section-icon"><PhStack :size="19" weight="duotone" /></span>
        <div>
          <h2>لایه‌های نقشه</h2>
          <p>نمایش اطلاعات روی نقشه را مدیریت کنید.</p>
        </div>
      </div>

      <div class="layer-list">
        <label v-for="(value, key) in activeLayers" :key="key" class="layer-toggle">
          <span class="layer-name">
            <component :is="getLayerIcon(key)" :size="19" weight="duotone" />
            {{ getLayerName(key) }}
          </span>
          <input
            type="checkbox"
            :checked="value"
            @change="toggleLayer(key as keyof typeof activeLayers)"
          />
          <span class="toggle-ui" aria-hidden="true"></span>
        </label>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  PhArrowCounterClockwise,
  PhFactory,
  PhMapTrifold,
  PhRoadHorizon,
  PhSlidersHorizontal,
  PhCloudFog,
  PhStack,
  PhTree,
  PhWarningCircle
} from '@phosphor-icons/vue'
import { useWeightsStore } from '@/stores/weightsStore'
import { useMapStore } from '@/stores/mapStore'
import type { Weights } from '@/types'

const weightsStore = useWeightsStore()
const mapStore = useMapStore()

const weights = computed(() => weightsStore.weights)
const activeLayers = computed(() => mapStore.activeLayers)

const weightItems: Array<{
  key: keyof Weights
  label: string
  icon: Component
}> = [
  { key: 'pollution', label: 'آلودگی (معکوس)', icon: PhCloudFog },
  { key: 'industry', label: 'فاصله از صنایع', icon: PhFactory },
  { key: 'green', label: 'تراکم فضای سبز', icon: PhTree },
  { key: 'road', label: 'دسترسی به راه', icon: PhRoadHorizon }
]

const layerNames: Record<string, string> = {
  greenSpaces: 'فضای سبز',
  roads: 'راه‌ها',
  industries: 'مراکز صنعتی'
}

const layerIcons: Record<string, Component> = {
  greenSpaces: PhTree,
  roads: PhRoadHorizon,
  industries: PhFactory
}

function updateWeight(key: keyof Weights, event: Event) {
  const target = event.target as HTMLInputElement
  weightsStore.updateWeight(key, Number(target.value) / 100)
}

function resetWeights() {
  weightsStore.resetWeights()
}

function toggleLayer(key: keyof typeof activeLayers.value) {
  mapStore.toggleLayer(key)
}

function getLayerName(key: string): string {
  return layerNames[key] ?? key
}

function getLayerIcon(key: string) {
  return layerIcons[key] ?? PhMapTrifold
}
</script>

<style scoped>
.control-panel {
  height: 100%;
  min-width: 0;
  padding: 18px;
  overflow-x: hidden;
  overflow-y: auto;
  direction: rtl;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.panel-section + .panel-section {
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid #e8eef2;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 18px;
}

.section-icon {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: grid;
  place-items: center;
  color: #0f766e;
  background: #e6fffa;
  border-radius: 10px;
}

.section-heading h2 {
  margin: 0;
  color: #1f2937;
  font-size: 15px;
  line-height: 1.6;
}

.section-heading p {
  margin: 2px 0 0;
  color: #7b8794;
  font-size: 11px;
  line-height: 1.7;
}

.weight-list {
  display: grid;
  gap: 15px;
}

.weight-label,
.label-title,
.total-weight,
.layer-toggle,
.layer-name,
.reset-btn,
.warning {
  display: flex;
  align-items: center;
}

.weight-label,
.total-weight,
.layer-toggle {
  justify-content: space-between;
}

.label-title,
.layer-name,
.reset-btn,
.warning {
  gap: 8px;
}

.label-title {
  min-width: 0;
  color: #4b5563;
  font-size: 12px;
  font-weight: 600;
}

.label-title svg,
.layer-name svg {
  flex: 0 0 auto;
  color: #0f766e;
}

.weight-value {
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
}

.weight-item input[type='range'] {
  width: 100%;
  height: 5px;
  margin: 9px 0 0;
  appearance: none;
  direction: ltr;
  background: #dfe7ec;
  border-radius: 999px;
  outline: none;
  accent-color: #0f766e;
}

.weight-item input[type='range']::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
  appearance: none;
  cursor: pointer;
  background: #0f766e;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 1px 5px rgba(15, 118, 110, 0.35);
}

.total-weight {
  margin-top: 18px;
  padding: 10px 12px;
  color: #5d6975;
  background: #f6f8fa;
  border: 1px solid #e8edf1;
  border-radius: 11px;
  font-size: 12px;
}

.total-weight strong {
  color: #17212b;
  font-size: 13px;
}

.warning {
  margin-top: 8px;
  color: #b45309;
  font-size: 11px;
}

.reset-btn {
  width: 100%;
  justify-content: center;
  margin-top: 12px;
  padding: 9px 12px;
  color: #0f766e;
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  border-radius: 11px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: background-color 160ms ease, transform 160ms ease;
}

.reset-btn:hover {
  background: #ccfbf1;
}

.reset-btn:active {
  transform: translateY(1px);
}

.layer-list {
  display: grid;
  gap: 8px;
}

.layer-toggle {
  position: relative;
  min-width: 0;
  padding: 10px 11px;
  background: #f8fafb;
  border: 1px solid #e8edf1;
  border-radius: 11px;
  cursor: pointer;
}

.layer-name {
  min-width: 0;
  color: #4b5563;
  font-size: 12px;
  font-weight: 600;
}

.layer-toggle input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.toggle-ui {
  position: relative;
  width: 34px;
  height: 20px;
  flex: 0 0 34px;
  background: #cbd5e1;
  border-radius: 999px;
  transition: background-color 160ms ease;
}

.toggle-ui::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 160ms ease;
}

.layer-toggle input:checked + .toggle-ui {
  background: #0f766e;
}

.layer-toggle input:checked + .toggle-ui::after {
  transform: translateX(14px);
}

.layer-toggle:focus-within {
  outline: 2px solid #5eead4;
  outline-offset: 2px;
}

@media (max-width: 860px) {
  .control-panel {
    overflow-y: visible;
  }

  .panel-section {
    min-width: 0;
  }
}
</style>
