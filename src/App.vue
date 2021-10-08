<template>
  <div class="flex flex-col items-center justify-center">
    <nav class="w-full flex items-center justify-between">
      <h1>Timelimo</h1>
      <button @click="isOpen = true">Add Story</button>
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

userState.user = supabase.auth.user()
const getUserData = async () => {
  if (userState.user) {
    const { data, error } = await supabase.from<Profile>("profiles").select("*").eq("id", userState.user.id).single()
    if (!error) userState.profiles = data
  }
}
getUserData()

// modal
const isOpen = ref(false)

const triggerFetch = () => {
  isOpen.value = false
  console.log("now should trigger refresh")
}
</script>
