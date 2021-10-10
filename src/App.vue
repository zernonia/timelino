<template>
  <div class="flex flex-col items-center justify-center">
    <nav class="px-8 py-4 w-full flex items-center justify-between">
      <h1
        @click="$router.push({ name: userState.user?.id ? 'home' : 'index' })"
        class="text-4xl font-bold text-blue-700 cursor-pointer"
      >
        Timelimo
      </h1>
      <div v-if="userState.profiles?.username" class="flex items-center space-x-4">
        <Notification></Notification>
        <ProfileDropdown></ProfileDropdown>
        <button class="btn" @click="isOpen = true">Add Story</button>
      </div>
      <div v-else>
        <button @click="$router.push({ name: 'login' })" class="btn">Login</button>
      </div>
    </nav>
    <router-view></router-view>
    <ModalStory v-if="isOpen" @close="isOpen = false" @success="triggerFetch"></ModalStory>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Profile } from "./interface"
import { userState } from "./store"
import { supabase } from "./supabase"
import { useEventBus, useWindowSize, useResizeObserver } from "@vueuse/core"

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
}
</script>
