import { createApp } from "vue"
import App from "./App.vue"
import routes from "virtual:generated-pages"
import { createRouter, createWebHistory } from "vue-router"
import "virtual:windi.css"
import "./assets/main.css"

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  // console.log({ to, from })
  // const access_token = to.hash.split("access_token=")[1]
  // if (access_token) {
  //   next({ name: "settings" })
  // } else {
  //   next()
  // }
  next()
})

createApp(App).use(router).mount("#app")
