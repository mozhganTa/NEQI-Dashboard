<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5-42b883?style=for-the-badge&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-4.0-f7d336?style=for-the-badge&logo=vue.js&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![RTL](https://img.shields.io/badge/RTL-Supported-0f766e?style=for-the-badge)

</div>

# 🗺️ NEQI Dashboard | داشبورد کیفیت محیطی

یک داشبورد تعاملی برای **ارزیابی و مقایسه کیفیت محیطی مناطق شهری** بر پایه داده‌های مکانی و معیارهای قابل تنظیم.

این پروژه با **Vue 3**، **TypeScript**، **Pinia** و **Leaflet** توسعه داده شده و با نمایش لایه‌های GeoJSON، امتیاز مطلوبیت هر منطقه را روی نقشه محاسبه و مصورسازی می‌کند.

## 🌱 درباره پروژه

داشبورد NEQI به کاربر اجازه می‌دهد تأثیر معیارهای محیطی مختلف را بررسی کند و با تغییر وزن هر معیار، نتیجه مطلوبیت مناطق را به‌صورت لحظه‌ای ببیند.

با استفاده از این داشبورد می‌توانید:

- ✅ مناطق شهری را روی نقشه مشاهده و مقایسه کنید
- ✅ وزن معیارهای ارزیابی را تغییر دهید
- ✅ لایه‌های فضای سبز، راه‌ها و مراکز صنعتی را مدیریت کنید
- ✅ جزئیات و امتیاز هر منطقه را با کلیک روی نقشه ببینید
- ✅ فاصله از صنایع را به‌صورت امتیاز نرمال‌شده ۰ تا ۱۰۰ بررسی کنید
- ✅ از راهنمای داخلی فارسی و انگلیسی استفاده کنید

### ✨ ویژگی‌های کلیدی

- ✅ **نقشه تعاملی شهری** بر پایه Leaflet و OpenStreetMap
- ✅ **محاسبه امتیاز مطلوبیت** با وزن‌های قابل تنظیم
- ✅ **چهار معیار محیطی** شامل آلودگی، فاصله از صنایع، تراکم فضای سبز و دسترسی به راه
- ✅ **نرمال‌سازی فاصله از صنایع** برای نمایش صحیح در بازه ۰ تا ۱۰۰
- ✅ **رنگ‌بندی مناطق** بر اساس امتیاز نهایی
- ✅ **نمایش جزئیات منطقه** در پاپ‌آپ اختصاصی
- ✅ **کنترل لایه‌های GeoJSON** از طریق سایدبار
- ✅ **راهنمای دوزبانه فارسی و انگلیسی** داخل داشبورد
- ✅ **طراحی واکنش‌گرا** برای دسکتاپ، تبلت و موبایل
- ✅ **پشتیبانی کامل از RTL**

## 🧭 معیارهای ارزیابی

| معیار | نحوه اثرگذاری | مقدار بهتر |
| :--- | :--- | :---: |
| **آلودگی** | امتیاز آلودگی به‌صورت معکوس در مطلوبیت محاسبه می‌شود | کمتر |
| **فاصله از صنایع** | فاصله خام میان کمترین و بیشترین مقدار داده‌ها نرمال می‌شود | بیشتر |
| **تراکم فضای سبز** | درصد پوشش یا تراکم فضای سبز منطقه | بیشتر |
| **دسترسی به راه** | میزان دسترسی منطقه به شبکه راه‌ها | بیشتر |

وزن اولیه هر معیار `۲۵٪` است. امتیاز نهایی از مجموع وزن‌دار مقادیر نرمال‌شده به دست می‌آید:

```text
Final Score =
  Pollution Score × Pollution Weight +
  Industry Distance Score × Industry Weight +
  Green Density Score × Green Weight +
  Road Accessibility Score × Road Weight
```

## 🛠️ تکنولوژی‌ها

| تکنولوژی | کاربرد |
| :--- | :--- |
| **Vue 3** | پیاده‌سازی رابط کاربری با Composition API و `<script setup>` |
| **TypeScript** | تایپ‌دهی و افزایش اطمینان در توسعه |
| **Pinia** | مدیریت وزن معیارها، لایه‌ها و منطقه انتخاب‌شده |
| **Leaflet** | نمایش و تعامل با نقشه |
| **Vue Leaflet** | اتصال کامپوننتی Leaflet به Vue |
| **Turf.js** | ابزارهای تحلیل داده‌های مکانی |
| **GeoJSON** | نگهداری مرز مناطق و عوارض مکانی |
| **Phosphor Icons** | آیکن‌های رابط کاربری |
| **Vite** | توسعه و build سریع پروژه |

## 📁 ساختار پروژه

```text
neqi-dashboard/
├── public/
│   └── data/
│       ├── blocks.geojson
│       ├── green_spaces.geojson
│       ├── industries.geojson
│       └── roads.geojson
├── src/
│   ├── components/
│   │   ├── BlockInfo.vue
│   │   ├── ControlPanel.vue
│   │   ├── Legend.vue
│   │   └── MapContainer.vue
│   ├── composables/
│   │   └── useSuitability.ts
│   ├── stores/
│   │   ├── mapStore.ts
│   │   └── weightsStore.ts
│   ├── styles/
│   │   └── main.css
│   ├── types/
│   │   └── index.ts
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 نصب و اجرا

ابتدا repository را clone کنید:

```bash
git clone https://github.com/mozhganTa/NEQI-Dashboard.git
cd NEQI-Dashboard
```

وابستگی‌ها را نصب و محیط توسعه را اجرا کنید:

```bash
npm install
npm run dev
```

سرور توسعه به‌صورت پیش‌فرض روی آدرس زیر اجرا می‌شود:

```text
http://localhost:3000
```

برای ساخت نسخه production:

```bash
npm run build
```

و برای مشاهده نسخه buildشده:

```bash
npm run preview
```

## 🧠 معماری پروژه

### مدیریت State با Pinia

| Store | مسئولیت |
| :--- | :--- |
| **weightsStore** | نگهداری، نرمال‌سازی و بازنشانی وزن معیارها |
| **mapStore** | مدیریت لایه‌های فعال و منطقه انتخاب‌شده روی نقشه |

### محاسبه مطلوبیت

منطق محاسبه امتیازها در `useSuitability.ts` قرار دارد. این composable:

1. مقدار هر معیار را به بازه ۰ تا ۱ تبدیل می‌کند.
2. آلودگی را به‌صورت معکوس محاسبه می‌کند.
3. فاصله خام از صنایع را نسبت به بازه داده‌های موجود نرمال می‌کند.
4. امتیازهای نرمال‌شده را در وزن انتخابی کاربر ضرب می‌کند.
5. امتیاز نهایی و پیشنهاد متناسب با آن را برمی‌گرداند.

## 🗂️ داده‌های مکانی

داده‌های نقشه در پوشه `public/data` و با فرمت GeoJSON نگهداری می‌شوند:

| فایل | محتوا |
| :--- | :--- |
| `blocks.geojson` | مرز مناطق و مقادیر معیارهای محیطی |
| `green_spaces.geojson` | محدوده‌های فضای سبز |
| `industries.geojson` | مراکز و محدوده‌های صنعتی |
| `roads.geojson` | شبکه راه‌های شهری |

برای جایگزین‌کردن داده‌ها، ساختار propertyهای مورد استفاده در `blocks.geojson` باید حفظ شود:

```json
{
  "id": 14,
  "name": "منطقه 14",
  "pollutionScore": 29,
  "industryDistance": 3709,
  "greenDensity": 96,
  "roadAccessibility": 94
}
```

## 🖱️ نحوه استفاده

1. با اسلایدرهای سایدبار وزن معیارها را تنظیم کنید.
2. لایه‌های دلخواه نقشه را روشن یا خاموش کنید.
3. روی یکی از مناطق نقشه کلیک کنید.
4. درصد معیارها، امتیاز نهایی و پیشنهاد منطقه را مشاهده کنید.
5. برای آموزش داخل برنامه، روی آیکن `?` کنار عنوان داشبورد کلیک کنید.
6. زبان راهنما را بین **فارسی** و **English** تغییر دهید.

## 🎨 راهنمای رنگ امتیازها

| امتیاز | وضعیت | رنگ |
| :---: | :--- | :---: |
| `۸۰ تا ۱۰۰` | مطلوبیت بالا | 🟢 سبز |
| `۶۰ تا ۷۹` | نسبتاً مطلوب | 🟡 زرد |
| `۴۰ تا ۵۹` | مطلوبیت متوسط | 🟠 نارنجی |
| `۰ تا ۳۹` | نامطلوب | 🔴 قرمز |

## 🤝 مشارکت

اگر پیشنهاد یا ایده‌ای برای بهبود پروژه دارید، می‌توانید:

- یک **Issue** ایجاد کنید
- یک **Pull Request** ارسال کنید
- یا از طریق GitHub با توسعه‌دهنده در ارتباط باشید

---

**توسعه‌دهنده:** Mozhgan

**GitHub:** [github.com/mozhganTa](https://github.com/mozhganTa)
