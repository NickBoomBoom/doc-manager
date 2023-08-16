import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Splitpanes, Pane } from 'splitpanes'
import App from './App.vue'
import router from './router'
import './assets/less/index.less'
import 'virtual:uno.css'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
import 'splitpanes/dist/splitpanes.css'
const app = createApp(App)
app.component('Splitpanes', Splitpanes)
app.component('Pane', Pane)
app.use(createPinia())
app.use(router)
app.mount('#app')
