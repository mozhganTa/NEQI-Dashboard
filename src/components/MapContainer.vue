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
      
      <!-- ✅ لایه بلوک‌ها (فقط مرزها - بدون رنگ) -->
      <l-geo-json
        v-if="blocksData"
        :geojson="blocksData"
        :options="blocksOptions"
        :options-style="blockStyle"
        @ready="onBlocksReady"
      />
      
      <!-- ✅ لایه فضای سبز -->
      <l-geo-json
        v-if="greenSpacesData && greenSpacesData.features && greenSpacesData.features.length > 0 && activeLayers.greenSpaces"
        :geojson="greenSpacesData"
        :options-style="greenSpaceStyle"
      />

      <!-- ✅ لایه مراکز صنعتی -->
      <l-geo-json
        v-if="industriesData && industriesData.features && industriesData.features.length > 0 && activeLayers.industries"
        :geojson="industriesData"
        :options-style="industryStyle"
      />

      <!-- ✅ لایه راه‌ها (ضخامت کم و بالاتر از پلی‌گون‌ها) -->
      <l-geo-json
        v-if="roadsData && roadsData.features && roadsData.features.length > 0 && activeLayers.roads"
        :geojson="roadsData"
        :options-style="roadStyle"
        @ready="onRoadsReady"
      />

    </l-map>
    
    <!-- پاپ‌آپ اطلاعات بلوک -->
    <div v-if="selectedBlock" class="custom-popup">
      <button class="close-btn" aria-label="بستن" @click.stop="clearSelectedBlock">
        <PhX :size="18" weight="bold" />
      </button>
      <h3>{{ selectedBlock.name }}</h3>
      <div class="score-grid">
        <div class="score-item">
          <span class="score-label"><PhTree :size="17" weight="duotone" /> فضای سبز</span>
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
          <span class="score-label"><PhCloudFog :size="17" weight="duotone" /> آلودگی</span>
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
          <span class="score-label"><PhFactory :size="17" weight="duotone" /> فاصله از صنایع</span>
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
          <span class="score-label"><PhRoadHorizon :size="17" weight="duotone" /> دسترسی به راه</span>
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
import { PhCloudFog, PhFactory, PhRoadHorizon, PhTree, PhX } from '@phosphor-icons/vue'
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
const greenSpacesData = ref<any>(null)
const industriesData = ref<any>(null)

// ============================================
// وضعیت‌ها
// ============================================
const activeLayers = computed(() => mapStore.activeLayers)
const selectedBlock = computed(() => mapStore.selectedBlock)

// ✅ متغیر برای تشخیص کلیک روی بلوک
let isClickOnBlock = false

// ============================================
// ✅ رنگ‌بندی بلوک‌ها بر اساس امتیاز نهایی مطلوبیت
// ============================================
function blockStyle(feature?: any) {
  const score = Number(feature?.properties?.finalScore ?? 0)

  return {
    fill: true,
    fillColor: getColorByScore(score),
    fillOpacity: 0.48,
    color: '#374151',
    opacity: 0.9,
    weight: 1.2
  }
}

const blocksOptions = computed(() => {
  if (!blocksData.value) return {}

  return {
    onEachFeature: (feature: any, layer: any) => {
      layer.on({
        click: (e: any) => {
          if (e.originalEvent) {
            e.originalEvent.stopPropagation()
          }
          selectBlock(feature)
        },
        mouseover: (e: any) => {
          const layer = e.target
          layer.setStyle({
            color: '#000',
            weight: 2,
            fillOpacity: 0.68
          })
        },
        mouseout: (e: any) => {
          e.target.setStyle(blockStyle(feature))
        }
      })
    }
  }
})

// ============================================
// ✅ آپشن‌های لایه راه‌ها (ضخامت کم)
// ============================================
function roadStyle() {
  return {
    color: '#475569',
    weight: 0.55,
    opacity: 0.72,
    lineCap: 'round' as const,
    lineJoin: 'round' as const
  }
}

// ============================================
// آپشن‌های لایه فضای سبز (چندضلعی - سبز)
// ============================================
function greenSpaceStyle() {
  return {
    fillColor: '#22c55e',
    fillOpacity: 0.55,
    color: '#15803d',
    weight: 0.8,
    opacity: 0.9
  }
}

// ============================================
// آپشن‌های لایه مراکز صنعتی (نقطه‌ای - بنفش)
// ============================================
function industryStyle() {
  return {
    fillColor: '#8b5cf6',
    fillOpacity: 0.62,
    color: '#5b21b6',
    weight: 1,
    opacity: 0.95
  }
}


// ============================================
// تابع انتخاب بلوک
// ============================================
function selectBlock(feature: any) {
  isClickOnBlock = true
  
  const props = feature.properties
  console.log('✅ کلیک روی بلوک:', props.name)
  
  const blockInfo: BlockDisplayInfo = {
    id: props.id,
    name: props.name,
    scores: {
      pollution: props.pollutionScore,
      industryDistance: props.industryDistanceScore ?? 0,
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
  return 'منطقه نامطلوب، نیاز به مداخله فوری'
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
// تابع onBlocksReady
// ============================================
function onBlocksReady() {
  console.log('✅ بلوک‌ها بارگذاری شدند')
  
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
            console.log('✅ لایه راه‌ها به جلو آورده شد')
          }
        }
      })
    }
  }, 300)
}

function onRoadsReady(layer: any) {
  layer.bringToFront()
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
    
    if (blocksData.value && blocksData.value.features) {
      const blocks = blocksData.value.features.map((f: any) => f.properties)
      const { calculateScores } = useSuitability(blocks)
      const scoredBlocks = calculateScores.value
      
      blocksData.value.features.forEach((feature: any, index: number) => {
        feature.properties.finalScore = scoredBlocks[index]?.finalScore ?? 50
        feature.properties.industryDistanceScore = scoredBlocks[index]?.scores.industryDistance ?? 0
      })
      
      console.log('✅ امتیازات محاسبه شد')
    }
    
    // ✅ بارگذاری راه‌ها
    try {
      const roadsResp = await fetch('/data/roads.geojson')
      if (roadsResp.ok) {
        roadsData.value = await roadsResp.json()
        console.log('✅ لایه راه‌ها بارگذاری شد:', roadsData.value.features?.length || 0, 'راه')
      } else {
        console.warn('⚠️ لایه راه‌ها پیدا نشد')
        roadsData.value = { type: 'FeatureCollection', features: [] }
      }
    } catch (error) {
      console.warn('⚠️ خطا در بارگذاری راه‌ها:', error)
      roadsData.value = { type: 'FeatureCollection', features: [] }
    }

    // ✅ بارگذاری فضای سبز
    try {
      const greenResp = await fetch('/data/green_spaces.geojson')
      if (greenResp.ok) {
        greenSpacesData.value = await greenResp.json()
        console.log('✅ لایه فضای سبز بارگذاری شد:', greenSpacesData.value.features?.length || 0, 'مورد')
      } else {
        console.warn('⚠️ لایه فضای سبز پیدا نشد')
        greenSpacesData.value = { type: 'FeatureCollection', features: [] }
      }
    } catch (error) {
      console.warn('⚠️ خطا در بارگذاری فضای سبز:', error)
      greenSpacesData.value = { type: 'FeatureCollection', features: [] }
    }

    // ✅ بارگذاری مراکز صنعتی
    try {
      const industriesResp = await fetch('/data/industries.geojson')
      if (industriesResp.ok) {
        industriesData.value = await industriesResp.json()
        console.log('✅ لایه مراکز صنعتی بارگذاری شد:', industriesData.value.features?.length || 0, 'مورد')
      } else {
        console.warn('⚠️ لایه مراکز صنعتی پیدا نشد')
        industriesData.value = { type: 'FeatureCollection', features: [] }
      }
    } catch (error) {
      console.warn('⚠️ خطا در بارگذاری مراکز صنعتی:', error)
      industriesData.value = { type: 'FeatureCollection', features: [] }
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
      feature.properties.finalScore = scoredBlocks[index]?.finalScore ?? 50
      feature.properties.industryDistanceScore = scoredBlocks[index]?.scores.industryDistance ?? 0
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
  min-width: 0;
  position: relative;
  overflow: hidden;
  border-radius: inherit;
}

.map-wrapper :deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  background: #e8eef1;
}

.custom-popup {
  position: absolute;
  bottom: 18px;
  right: 18px;
  width: min(380px, calc(100% - 36px));
  background: white;
  padding: 20px;
  border: 1px solid #dfe7ec;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  max-width: 380px;
  min-width: 0;
  z-index: 1000;
  max-height: 80vh;
  direction: rtl;
  text-align: right;
  overflow-x: hidden;
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
  left: 10px;
  display: grid;
  place-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 6px;
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
  grid-template-columns: minmax(108px, auto) minmax(56px, 1fr) 42px;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.score-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #374151;
  font-weight: 500;
}

.score-label svg {
  flex: 0 0 auto;
  color: #0f766e;
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

@media (max-width: 520px) {
  .custom-popup {
    right: 10px;
    bottom: 10px;
    width: calc(100% - 20px);
    padding: 16px;
  }

  .score-item {
    grid-template-columns: minmax(100px, auto) minmax(45px, 1fr) 38px;
    gap: 7px;
    font-size: 12px;
  }
}
</style>
