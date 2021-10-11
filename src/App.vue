<template>
  <div class="flex flex-col items-center justify-center" v-if="$route.name != 'index'">
    <nav class="px-6 sm:px-8 py-4 w-full flex items-center justify-between">
      <h1
        @click="$router.push({ name: userState.user?.id ? 'home' : 'index' })"
        class="text-2xl inline-flex items-center sm:text-4xl font-bold text-blue-700 cursor-pointer"
      >
        <img class="h-12 mr-4" :src="Logo" alt="" />
        Timelino
      </h1>
      <div v-if="userState.profiles?.username">
        <div class="hidden sm:flex items-center space-x-4">
          <Notification></Notification>
          <ProfileDropdown></ProfileDropdown>
          <button class="btn" @click="isOpen = true">Add Story</button>
        </div>
        <div class="block sm:hidden">
          <button @click="isMenuOpen = true" class="btn-icon">
            <i-mdi:menu class="text-xl"></i-mdi:menu>
          </button>
          <transition name="slide-top-down">
            <div
              @click.self="isMenuOpen = false"
              v-if="isMenuOpen"
              class="
                z-1000
                fixed
                top-0
                left-0
                w-screen
                h-screen
                bg-white bg-opacity-50
                flex
                justify-center
                backdrop-filter backdrop-blur-sm
              "
            >
              <div
                class="w-max h-min mt-8 rounded-md px-4 py-2 bg-white flex items-center justify-center space-x-4 shadow"
              >
                <button class="btn" @click=";(isOpen = true), (isMenuOpen = false)">Add Story</button>
                <ProfileDropdown></ProfileDropdown>
                <Notification></Notification>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div class="py-2" v-else>
        <button @click="$router.push({ name: 'login' })" class="btn">Login</button>
      </div>
    </nav>
    <router-view></router-view>
    <ModalStory v-if="isOpen" @close="isOpen = false" @success="triggerFetch"></ModalStory>
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { Profile } from "./interface"
import { userState } from "./store"
import { supabase } from "./supabase"
import { useEventBus, useWindowSize, useResizeObserver } from "@vueuse/core"
import { useRoute, useRouter } from "vue-router"
import Logo from "@/assets/logo.png"

const route = useRoute()
const router = useRouter()
const { width } = useWindowSize()
const getUserData = async () => {
  if (userState.user && !userState.profiles?.id) {
    const { data, error } = await supabase.from<Profile>("profiles").select("*").eq("id", userState.user.id).single()
    if (!error) userState.profiles = data
  }
}
onMounted(() => {
  userState.user = supabase.auth.user()
  getUserData()
  supabase.auth.onAuthStateChange((event, session) => {
    if (event == "SIGNED_IN") {
      userState.user = supabase.auth.user()
      getUserData()
    } else if (event == "SIGNED_OUT") {
      userState.user = null
      userState.profiles = null
    }
  })

  useResizeObserver(document.documentElement, (entries) => {
    const entry = entries[0]
    const box = entry.contentRect
    document.documentElement.style.setProperty("--scrollbarWidth", width.value - box.width + "px")
  })
})

// modal
const isOpen = ref(false)
const bus = useEventBus<string>("add-story")

const triggerFetch = () => {
  isOpen.value = false
  bus.emit("done")
  router.push({ name: "u-username", params: { username: userState.profiles?.username } })
}

// mobile menu
const isMenuOpen = ref(false)
watch(route, () => (isMenuOpen.value = false))
</script>
