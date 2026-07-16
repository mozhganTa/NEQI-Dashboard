// انواع داده‌های بلوک شهری
export interface BlockProperties {
  id: number;
  name: string;
  population: number;
  area: number;
  // امتیازات اولیه (از 0 تا 100)
  pollutionScore: number;        // هرچه کمتر بهتر
  industryDistance: number;      // هرچه دورتر بهتر
  greenDensity: number;          // هرچه بیشتر بهتر
  roadAccessibility: number;     // دسترسی مناسب
  // امتیاز نهایی محاسبه شده
  finalScore?: number;
}

// ساختار وزنی
export interface Weights {
  pollution: number;     // 0 تا 1
  industry: number;      // 0 تا 1
  green: number;         // 0 تا 1
  road: number;          // 0 تا 1
}

// اطلاعات نمایشی برای پاپ‌آپ
export interface BlockDisplayInfo {
  id: number;
  name: string;
  scores: {
    pollution: number;
    industryDistance: number;
    greenDensity: number;
    roadAccessibility: number;
  };
  finalScore: number;
  recommendation: string;
}

// پاسخ کلیک روی نقشه
export interface MapClickEvent {
  latlng: { lat: number; lng: number };
  layer?: any;
}