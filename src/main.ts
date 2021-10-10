import { createApp } from "vue"
import App from "./App.vue"
import routes from "virtual:generated-pages"
import { createRouter, createWebHistory } from "vue-router"
import "virtual:windi.css"
import "./assets/main.css"
import { userState } from "./store"

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  // if (to.name == "login" && userState.user?.id) {
  //   next({ name: "index" })
  // } else {
  // }
  next()
})

createApp(App).use(router).mount("#app")
