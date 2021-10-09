<template>
  <div class="flex flex-col items-center justify-center">
    <nav class="px-8 py-4 w-full flex items-center justify-between">
      <h1 @click="$router.push({ name: 'index' })" class="text-4xl font-bold text-blue-700 cursor-pointer">Timelimo</h1>
      <div v-if="userState.profiles?.username" class="flex items-center space-x-4">
        <Notification></Notification>
        <img
          @click="$router.push({ name: 'u-username', params: { username: userState.profiles?.username } })"
          class="w-10 h-10 rounded-full cursor-pointer object-cover"
          :src="userState.profiles.avatar_url"
        />
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
import { ref } from "vue"
import { Profile } from "./interface"
import { userState } from "./store"
import { supabase } from "./supabase"
import { useEventBus } from "@vueuse/core"

userState.user = supabase.auth.user()
console.log(userState)
const getUserData = async () => {
  if (userState.user) {
    const { data, error } = await supabase.from<Profile>("profiles").select("*").eq("id", userState.user.id).single()
    if (!error) userState.profiles = data
  }
}
getUserData()

// modal
const isOpen = ref(false)
const bus = useEventBus<string>("add-story")

const triggerFetch = () => {
  isOpen.value = false
  bus.emit("done")
}
</script>
