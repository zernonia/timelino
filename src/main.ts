import { createApp } from "vue"
import App from "./App.vue"
import routes from "virtual:generated-pages"
import { createRouter, createWebHistory } from "vue-router"
import "virtual:windi.css"

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount("#app")
