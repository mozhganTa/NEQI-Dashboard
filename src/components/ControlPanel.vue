<template>
  <div class="control-panel">
    <h2>🎛️ داشبورد NEQI</h2>
    
    <!-- بخش وزن‌ها -->
    <div class="section">
      <h3>تنظیم وزن معیارها</h3>
      <p class="hint">وزن‌ها را تنظیم کنید تا نقشه به‌روز شود</p>
      
      <div class="weight-item">
        <label>☣️ آلودگی (معکوس)</label>
        <input 
          type="range" 
          :value="weights.pollution * 100"
          @input="updateWeight('pollution', $event)"
          min="0" 
          max="100"
        />
        <span class="weight-value">{{ Math.round(weights.pollution * 100) }}%</span>
      </div>
      
      <div class="weight-item">
        <label>🏭 فاصله از صنایع</label>
        <input 
          type="range" 
          :value="weights.industry * 100"
          @input="updateWeight('industry', $event)"
          min="0" 
          max="100"
        />
        <span class="weight-value">{{ Math.round(weights.industry * 100) }}%</span>
      </div>
      
      <div class="weight-item">
        <label>🌿 تراکم فضای سبز</label>
        <input 
          type="range" 
          :value="weights.green * 100"
          @input="updateWeight('green', $event)"
          min="0" 
          max="100"
        />
        <span class="weight-value">{{ Math.round(weights.green * 100) }}%</span>
      </div>
      
      <div class="weight-item">
        <label>🚗 دسترسی به راه</label>
        <input 
          type="range" 
          :value="weights.road * 100"
          @input="updateWeight('road', $event)"
          min="0" 
          max="100"
        />
        <span class="weight-value">{{ Math.round(weights.road * 100) }}%</span>
      </div>
      
      <div class="total-weight">
        مجموع وزن‌ها: {{ Math.round(weightsStore.totalWeight * 100) }}%
        <span v-if="weightsStore.totalWeight !== 1" class="warning">
          ⚠️ باید برابر 100% باشد
        </span>
      </div>
      
      <button @click="resetWeights" class="reset-btn">
        ↻ ریست به حالت اولیه
      </button>
    </div>
    
    <!-- بخش کنترل لایه‌ها -->
    <div class="section">
      <h3>🗺️ نمایش لایه‌ها</h3>
      <div class="layer-toggle" v-for="(value, key) in activeLayers" :key="key">
        <label>
          <input 
            type="checkbox" 
            :checked="value"
            @change="toggleLayer(key as keyof typeof activeLayers)"
          />
          {{ getLayerName(key) }}
        </label>
      </div>
    </div>
    
    <!-- بخش بلوک‌های برتر -->
    <div class="section" v-if="suitabilityData">
      <h3>🏆 بهترین محله‌ها</h3>
      <div 
        v-for="block in suitabilityData.topBlocks" 
        :key="block.id"
        class="top-block"
        @click="selectBlock(block)"
      >
        <span class="rank">#{{ block.id }}</span>
        <span class="name">{{ block.name }}</span>
        <span class="score" :style="{ color: getColorByScore(block.finalScore) }">
          {{ block.finalScore }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeightsStore } from '@/stores/weightsStore'
import { useMapStore } from '@/stores/mapStore'
import { useSuitability } from '@/composables/useSuitability'
import type { BlockDisplayInfo } from '@/types'

const weightsStore = useWeightsStore()
const mapStore = useMapStore()

const weights = computed(() => weightsStore.weights)
const activeLayers = computed(() => mapStore.activeLayers)

// داده‌های مطلوبیت (باید از والد دریافت شود)
const suitabilityData = computed(() => {
  // اینجا باید داده‌ها از والد دریافت شوند
  return null
})

function updateWeight(key: string, event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value) / 100
  weightsStore.updateWeight(key as keyof typeof weights.value, value)
}

function resetWeights() {
  weightsStore.resetWeights()
}

function toggleLayer(key: keyof typeof activeLayers.value) {
  mapStore.toggleLayer(key)
}

function getLayerName(key: string): string {
  const names: Record<string, string> = {
    greenSpaces: 'فضای سبز',
    pollution: 'لایه آلودگی',
    roads: 'راه‌ها',
    industries: 'مراکز صنعتی'
  }
  return names[key] || key
}

function selectBlock(block: BlockDisplayInfo) {
  mapStore.setSelectedBlock(block)
}

function getColorByScore(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#eab308'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}
</script>

<style scoped>
.control-panel {
  background: white;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #e5e7eb;
}

.control-panel h2 {
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 20px;
}

.section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.section h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #374151;
}

.hint {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 15px 0;
}

.weight-item {
  margin-bottom: 15px;
}

.weight-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 5px;
}

.weight-item input[type="range"] {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
}

.weight-item input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}

.weight-value {
  display: inline-block;
  margin-top: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.total-weight {
  margin-top: 15px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.warning {
  color: #ef4444;
  margin-left: 10px;
  font-weight: 600;
}

.reset-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #e5e7eb;
}

.layer-toggle {
  margin: 8px 0;
}

.layer-toggle label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
}

.top-block {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  margin: 5px 0;
  background: #f9fafb;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.top-block:hover {
  background: #f3f4f6;
}

.rank {
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
}

.name {
  flex: 1;
  font-weight: 500;
  color: #1f2937;
}

.score {
  font-weight: 700;
  font-size: 16px;
}
</style>