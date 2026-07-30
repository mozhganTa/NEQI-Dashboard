import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BlockDisplayInfo } from '@/types'

export const useMapStore = defineStore('map', () => {
  const selectedBlock = ref<BlockDisplayInfo | null>(null)
  
  // ✅ وضعیت لایه‌های فعال
  const activeLayers = ref({
    greenSpaces: true,
    roads: true,
    industries: true
  })

  function setSelectedBlock(block: BlockDisplayInfo) {
    selectedBlock.value = block
  }

  function clearSelectedBlock() {
    selectedBlock.value = null
  }

  // ✅ تابع تغییر وضعیت لایه
  function toggleLayer(layerName: keyof typeof activeLayers.value) {
    activeLayers.value[layerName] = !activeLayers.value[layerName]
    console.log(`✅ لایه ${layerName} شد:`, activeLayers.value[layerName])
  }

  return {
    selectedBlock,
    activeLayers,
    setSelectedBlock,
    clearSelectedBlock,
    toggleLayer
  }
})