import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Weights } from '@/types'

export const useWeightsStore = defineStore('weights', () => {
  // حالت اولیه - وزن‌های مساوی
  const weights = ref<Weights>({
    pollution: 0.25,
    industry: 0.25,
    green: 0.25,
    road: 0.25
  })

  // محاسبه مجموع وزن‌ها (باید برابر 1 باشد)
  const totalWeight = computed(() => {
    return weights.value.pollution + 
           weights.value.industry + 
           weights.value.green + 
           weights.value.road
  })

  // متد بروزرسانی وزن
  function updateWeight(key: keyof Weights, value: number) {
    weights.value[key] = value
    // نرمال‌سازی خودکار
    normalizeWeights()
  }

  // نرمال‌سازی وزن‌ها به جمع 1
  function normalizeWeights() {
    const total = totalWeight.value
    if (total !== 1 && total > 0) {
      for (const key in weights.value) {
        weights.value[key as keyof Weights] = weights.value[key as keyof Weights] / total
      }
    }
  }

  // ریست به حالت اولیه
  function resetWeights() {
    weights.value = {
      pollution: 0.25,
      industry: 0.25,
      green: 0.25,
      road: 0.25
    }
  }

  return {
    weights,
    totalWeight,
    updateWeight,
    resetWeights
  }
})