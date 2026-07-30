import { computed } from 'vue'
import type { BlockProperties, BlockDisplayInfo } from '@/types'
import { useWeightsStore } from '@/stores/weightsStore'

export function useSuitability(blocks: BlockProperties[]) {
  const weightsStore = useWeightsStore()
  
  // محاسبه امتیاز نهایی برای هر بلوک
  const calculateScores = computed(() => {
    const industryDistances = blocks
      .map(block => Number(block.industryDistance))
      .filter(Number.isFinite)
    const minIndustryDistance = industryDistances.length > 0
      ? Math.min(...industryDistances)
      : 0
    const maxIndustryDistance = industryDistances.length > 0
      ? Math.max(...industryDistances)
      : 0
    const industryDistanceRange = maxIndustryDistance - minIndustryDistance
    const toRatio = (value: number) => Math.min(1, Math.max(0, Number(value) / 100))

    return blocks.map(block => {
      // نرمال‌سازی امتیازات به بازه 0-1
      const normalizedPollution = 1 - toRatio(block.pollutionScore) // معکوس
      // فاصله صنعت در داده بر حسب فاصله است، نه یک امتیاز 0 تا 100.
      const industryDistance = Number(block.industryDistance)
      const normalizedIndustry = Number.isFinite(industryDistance) && industryDistanceRange > 0
        ? (industryDistance - minIndustryDistance) / industryDistanceRange
        : 0.5
      const normalizedGreen = toRatio(block.greenDensity)
      const normalizedRoad = toRatio(block.roadAccessibility)
      
      // محاسبه وزن‌دار
      const finalScore = 
        (normalizedPollution * weightsStore.weights.pollution) +
        (normalizedIndustry * weightsStore.weights.industry) +
        (normalizedGreen * weightsStore.weights.green) +
        (normalizedRoad * weightsStore.weights.road)
      
      // تعیین توصیه بر اساس امتیاز
      let recommendation = ''
      if (finalScore >= 0.8) {
        recommendation = 'منطقه بسیار مطلوب برای سکونت ✓'
      } else if (finalScore >= 0.6) {
        recommendation = 'منطقه نسبتاً مطلوب، نیاز به بهبود جزئی'
      } else if (finalScore >= 0.4) {
        recommendation = 'منطقه با مطلوبیت متوسط، نیاز به برنامه‌ریزی'
      } else {
        recommendation = 'منطقه نامطلوب، نیاز به مداخله فوری'
      }
      
      return {
        id: block.id,
        name: block.name,
        scores: {
          pollution: block.pollutionScore,
          industryDistance: Math.round(normalizedIndustry * 100),
          greenDensity: block.greenDensity,
          roadAccessibility: block.roadAccessibility
        },
        finalScore: Math.round(finalScore * 100), // تبدیل به درصد
        recommendation
      } as BlockDisplayInfo
    })
  })

  // پیدا کردن بهترین و بدترین بلوک‌ها
  const topBlocks = computed(() => {
    return [...calculateScores.value]
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 5)
  })

  const worstBlocks = computed(() => {
    return [...calculateScores.value]
      .sort((a, b) => a.finalScore - b.finalScore)
      .slice(0, 5)
  })

  // تابع رنگ‌بندی بر اساس امتیاز
  function getColorByScore(score: number): string {
    if (score >= 80) return '#22c55e' // سبز
    if (score >= 60) return '#eab308' // زرد
    if (score >= 40) return '#f97316' // نارنجی
    return '#ef4444' // قرمز
  }

  return {
    calculateScores,
    topBlocks,
    worstBlocks,
    getColorByScore
  }
}
