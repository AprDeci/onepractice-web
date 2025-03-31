import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from './route/router'
import { plugin, defaultConfig } from '@formkit/vue'
import config from '../formkit.config.js'
import pinia from './store/index.js'
import { GesturePlugin } from '@vueuse/gesture'
const app = createApp(App)
app.use(router)
app.use(plugin, defaultConfig(config))
app.use(GesturePlugin)
app.use(pinia)
app.mount('#app')
