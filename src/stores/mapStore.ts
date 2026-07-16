import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BlockProperties, BlockDisplayInfo } from '@/types'

export const useMapStore = defineStore('map', () => {
  // بلوک انتخاب شده
  const selectedBlock = ref<BlockDisplayInfo | null>(null)
  
  // لیست تمام بلوک‌ها با امتیاز نهایی
  const allBlocks = ref<BlockDisplayInfo[]>([])
  
  // وضعیت لایه‌های فعال
  const activeLayers = ref({
    greenSpaces: true,
    pollution: true,
    roads: true,
    industries: true
  })

  function setSelectedBlock(block: BlockDisplayInfo) {
    selectedBlock.value = block
  }

  function clearSelectedBlock() {
    selectedBlock.value = null
  }

  function toggleLayer(layerName: keyof typeof activeLayers.value) {
    activeLayers.value[layerName] = !activeLayers.value[layerName]
  }

  return {
    selectedBlock,
    allBlocks,
    activeLayers,
    setSelectedBlock,
    clearSelectedBlock,
    toggleLayer
  }
})