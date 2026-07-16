import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// ✅ این خط را حتماً اضافه کنید
import 'leaflet/dist/leaflet.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')