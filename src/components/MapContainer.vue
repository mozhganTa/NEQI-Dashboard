<template>
  <div class="map-wrapper">
    <l-map
      ref="mapRef"
      :center="[35.7, 51.4]"
      :zoom="12"
      :options="{ zoomControl: true }"
      @click="handleMapClick"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      
      <!-- ✅ لایه بلوک‌ها -->
      <l-geo-json
        v-if="blocksData"
        :geojson="blocksData"
        :options="blocksOptions"
        @ready="onBlocksReady"
      />
      
      <!-- ✅ لایه راه‌ها با z-index بالا (روی بلوک‌ها) -->
      <l-geo-json
        v-if="roadsData && roadsData.features && roadsData.features.length > 0"
        :geojson="roadsData"
        :options="roadsOptions"
        :z-index="1000"
      />
    </l-map>
    
    <!-- پاپ‌آپ اطلاعات بلوک -->
    <div v-if="selectedBlock" class="custom-popup">
      <button class="close-btn" @click.stop="clearSelectedBlock">✕</button>
      <h3>{{ selectedBlock.name }}</h3>
      <div class="score-grid">
        <div class="score-item">
          <span>🌿 فضای سبز</span>
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: selectedBlock.scores.greenDensity + '%' }"
              :class="getScoreClass(selectedBlock.scores.greenDensity)"
            ></div>
          </div>
          <span class="score-value">{{ selectedBlock.scores.greenDensity }}%</span>
        </div>
        <div class="score-item">
          <span>☣️ آلودگی</span>
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: selectedBlock.scores.pollution + '%' }"
              :class="getScoreClass(selectedBlock.scores.pollution, true)"
            ></div>
          </div>
          <span class="score-value">{{ selectedBlock.scores.pollution }}%</span>
        </div>
        <div class="score-item">
          <span>🏭 فاصله از صنایع</span>
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: selectedBlock.scores.industryDistance + '%' }"
              :class="getScoreClass(selectedBlock.scores.industryDistance)"
            ></div>
          </div>
          <span class="score-value">{{ selectedBlock.scores.industryDistance }}%</span>
        </div>
        <div class="score-item">
          <span>🚗 دسترسی به راه</span>
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: selectedBlock.scores.roadAccessibility + '%' }"
              :class="getScoreClass(selectedBlock.scores.roadAccessibility)"
            ></div>
          </div>
          <span class="score-value">{{ selectedBlock.scores.roadAccessibility }}%</span>
        </div>
      </div>
      <div class="final-score">
        <strong>امتیاز نهایی مطلوبیت:</strong>
        <span :style="{ color: getColorByScore(selectedBlock.finalScore) }">
          {{ selectedBlock.finalScore }}%
        </span>
      </div>
      <p class="recommendation">{{ selectedBlock.recommendation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { LMap, LTileLayer, LGeoJson } from '@vue-leaflet/vue-leaflet'
import { useMapStore } from '@/stores/mapStore'
import { useWeightsStore } from '@/stores/weightsStore'
import { useSuitability } from '@/composables/useSuitability'
import type { BlockDisplayInfo } from '@/types'
import 'leaflet/dist/leaflet.css'

// ============================================
// Storeها
// ============================================
const mapRef = ref<typeof LMap>()
const mapStore = useMapStore()
const weightsStore = useWeightsStore()

// ============================================
// داده‌های لایه‌ها
// ============================================
const blocksData = ref<any>(null)
const roadsData = ref<any>(null)

// ============================================
// وضعیت‌ها
// ============================================
const activeLayers = computed(() => mapStore.activeLayers)
const selectedBlock = computed(() => mapStore.selectedBlock)

// ✅ متغیر برای تشخیص کلیک روی بلوک
let isClickOnBlock = false

// ============================================
// آپشن‌های لایه بلوک‌ها
// ============================================
const blocksOptions = computed(() => {
  if (!blocksData.value) return {}
  
  return {
    style: (feature: any) => {
      const score = feature.properties.finalScore || 50
      return {
        fillColor: getColorByScore(score),
        fillOpacity: 0.5,
        color: '#333',
        weight: 1
      }
    },
    onEachFeature: (feature: any, layer: any) => {
      layer.on({
        click: (e: any) => {
          if (e.originalEvent) {
            e.originalEvent.stopPropagation()
          }
          selectBlock(feature, layer, e)
        },
        mouseover: (e: any) => {
          const layer = e.target
          layer.setStyle({
            weight: 3,
            color: '#000',
            fillOpacity: 0.8
          })
          layer.bringToFront()
        },
        mouseout: (e: any) => {
          const layer = e.target
          const score = feature.properties.finalScore || 50
          layer.setStyle({
            weight: 1,
            color: '#333',
            fillOpacity: 0.5,
            fillColor: getColorByScore(score)
          })
        }
      })
    }
  }
})

// ============================================
// آپشن‌های لایه راه‌ها
// ============================================
const roadsOptions = {
  style: {
    color: '#3B82F6',     // آبی
    weight: 3,
    opacity: 1,
    smoothFactor: 1
  }
}

// ============================================
// تابع انتخاب بلوک
// ============================================
function selectBlock(feature: any, layer: any, event: any) {
  isClickOnBlock = true
  
  const props = feature.properties
  console.log('✅ کلیک روی بلوک:', props.name)
  
  const blockInfo: BlockDisplayInfo = {
    id: props.id,
    name: props.name,
    scores: {
      pollution: props.pollutionScore,
      industryDistance: props.industryDistance,
      greenDensity: props.greenDensity,
      roadAccessibility: props.roadAccessibility
    },
    finalScore: props.finalScore || 50,
    recommendation: getRecommendation(props.finalScore || 50)
  }
  
  mapStore.setSelectedBlock(blockInfo)
  
  setTimeout(() => {
    isClickOnBlock = false
  }, 100)
}

// ============================================
// تابع‌های کمکی
// ============================================
function getColorByScore(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#eab308'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

function getScoreClass(score: number, reverse: boolean = false): string {
  if (reverse) {
    if (score <= 20) return 'good'
    if (score <= 40) return 'medium'
    if (score <= 60) return 'warning'
    return 'danger'
  }
  if (score >= 80) return 'good'
  if (score >= 60) return 'medium'
  if (score >= 40) return 'warning'
  return 'danger'
}

function getRecommendation(score: number): string {
  if (score >= 80) return 'منطقه بسیار مطلوب برای سکونت ✓'
  if (score >= 60) return 'منطقه نسبتاً مطلوب، نیاز به بهبود جزئی'
  if (score >= 40) return 'منطقه با مطلوبیت متوسط، نیاز به برنامه‌ریزی'
  return 'منطقه نامطلوب، نیاز به مداخله فوری ⚠️'
}

// ============================================
// رویدادهای نقشه
// ============================================
function handleMapClick(e: any) {
  if (isClickOnBlock) {
    return
  }
  
  if (!e.layer) {
    mapStore.clearSelectedBlock()
  }
}

function clearSelectedBlock() {
  mapStore.clearSelectedBlock()
}

// ============================================
// تابع onBlocksReady - لایه راه‌ها را به جلو می‌آورد
// ============================================
function onBlocksReady() {
  console.log('✅ بلوک‌ها بارگذاری شدند')
  
  // بعد از بارگذاری، لایه راه‌ها را به جلو بیاور
  setTimeout(() => {
    if (mapRef.value?.leafletObject) {
      const map = mapRef.value.leafletObject
      let roadsLayerFound = false
      
      map.eachLayer((layer: any) => {
        if (layer._geojson && layer._geojson.features && layer._geojson.features.length > 0) {
          const firstFeature = layer._geojson.features[0]
          if (firstFeature && firstFeature.geometry && 
              (firstFeature.geometry.type === 'LineString' || 
               firstFeature.geometry.type === 'MultiLineString')) {
            layer.bringToFront()
            roadsLayerFound = true
            console.log('✅ لایه راه‌ها به جلو آورده شد')
          }
        }
      })
      
      if (!roadsLayerFound) {
        console.log('ℹ️ لایه راه‌ها هنوز بارگذاری نشده، دوباره تلاش می‌شود...')
        setTimeout(() => {
          map.eachLayer((layer: any) => {
            if (layer._geojson && layer._geojson.features && layer._geojson.features.length > 0) {
              const firstFeature = layer._geojson.features[0]
              if (firstFeature && firstFeature.geometry && 
                  (firstFeature.geometry.type === 'LineString' || 
                   firstFeature.geometry.type === 'MultiLineString')) {
                layer.bringToFront()
                console.log('✅ لایه راه‌ها به جلو آورده شد (تلاش دوم)')
              }
            }
          })
        }, 1000)
      }
    }
  }, 300)
}

// ============================================
// بارگذاری داده‌ها
// ============================================
async function loadData() {
  try {
    console.log('🔄 شروع بارگذاری داده...')
    
    // ✅ بارگذاری بلوک‌ها
    const blocksResponse = await fetch('/data/blocks.geojson')
    blocksData.value = await blocksResponse.json()
    
    console.log('✅ داده‌های بلوک بارگذاری شد:', blocksData.value.features?.length || 0, 'بلوک')
    
    // محاسبه امتیاز نهایی
    if (blocksData.value && blocksData.value.features) {
      const blocks = blocksData.value.features.map((f: any) => f.properties)
      const { calculateScores } = useSuitability(blocks)
      const scoredBlocks = calculateScores.value
      
      blocksData.value.features.forEach((feature: any, index: number) => {
        feature.properties.finalScore = scoredBlocks[index]?.finalScore || 50
      })
      
      console.log('✅ امتیازات محاسبه شد')
    }
    
    // ✅ بارگذاری راه‌ها
    try {
      const roadsResp = await fetch('/data/roads.geojson')
      if (roadsResp.ok) {
        roadsData.value = await roadsResp.json()
        console.log('✅ لایه راه‌ها بارگذاری شد:', roadsData.value.features?.length || 0, 'راه')
        
        // بعد از بارگذاری راه‌ها، آن‌ها را به جلو بیاور
        setTimeout(() => {
          if (mapRef.value?.leafletObject) {
            const map = mapRef.value.leafletObject
            map.eachLayer((layer: any) => {
              if (layer._geojson && layer._geojson.features && layer._geojson.features.length > 0) {
                const firstFeature = layer._geojson.features[0]
                if (firstFeature && firstFeature.geometry && 
                    (firstFeature.geometry.type === 'LineString' || 
                     firstFeature.geometry.type === 'MultiLineString')) {
                  layer.bringToFront()
                  console.log('✅ لایه راه‌ها به جلو آورده شد (پس از بارگذاری)')
                }
              }
            })
          }
        }, 500)
      } else {
        console.warn('⚠️ لایه راه‌ها پیدا نشد')
        roadsData.value = { type: 'FeatureCollection', features: [] }
      }
    } catch (error) {
      console.warn('⚠️ خطا در بارگذاری راه‌ها:', error)
      roadsData.value = { type: 'FeatureCollection', features: [] }
    }
    
    console.log('✅ بارگذاری کامل شد')
    
  } catch (error) {
    console.error('❌ خطا در بارگذاری داده:', error)
  }
}

// ============================================
// واچرها
// ============================================
watch(() => weightsStore.weights, () => {
  if (blocksData.value && blocksData.value.features) {
    const blocks = blocksData.value.features.map((f: any) => f.properties)
    const { calculateScores } = useSuitability(blocks)
    const scoredBlocks = calculateScores.value
    
    blocksData.value.features.forEach((feature: any, index: number) => {
      feature.properties.finalScore = scoredBlocks[index]?.finalScore || 50
    })
    
    blocksData.value = { ...blocksData.value }
  }
}, { deep: true })

// ============================================
// lifecycle
// ============================================
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.custom-popup {
  position: absolute;
  bottom: 30px;
  right: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  max-width: 380px;
  min-width: 300px;
  z-index: 1000;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-popup .close-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.custom-popup .close-btn:hover {
  background: #f3f4f6;
}

.custom-popup h3 {
  margin: 0 0 15px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.score-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 15px 0;
}

.score-item {
  display: grid;
  grid-template-columns: 100px 1fr 50px;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.score-item span:first-child {
  color: #374151;
  font-weight: 500;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.good { background: #22c55e; }
.progress-fill.medium { background: #eab308; }
.progress-fill.warning { background: #f97316; }
.progress-fill.danger { background: #ef4444; }

.score-value {
  font-weight: 600;
  color: #1f2937;
  text-align: right;
}

.final-score {
  margin: 15px 0;
  padding: 10px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.final-score span {
  font-size: 20px;
  font-weight: 700;
}

.recommendation {
  margin: 0;
  padding: 10px;
  background: #f0fdf4;
  border-radius: 8px;
  color: #166534;
  font-size: 14px;
  text-align: center;
  font-weight: 500;
}
</style>