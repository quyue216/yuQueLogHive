import './assets/base.less'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import  "./assets/tailwind.css";

const app= createApp(App)
.use(ElementPlus)
.mount('#app')

