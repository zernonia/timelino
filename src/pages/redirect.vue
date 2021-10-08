<template>
  <div class="flex flex-col w-full max-w-screen-md">redirecting...</div>
</template>

<script setup lang="ts">
import { Profile } from "@/interface"
import { userState } from "@/store"
import { supabase } from "@/supabase"
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

watch(
  () => route.hash,
  async (n) => {
    userState.user = supabase.auth.user()
    if (userState.user?.id) {
      const { data, error } = await supabase.from<Profile>("profiles").select("*").eq("id", userState.user.id).single()
      userState.profiles = data
      if (data?.username) {
        router.replace({ name: "u-username", params: { username: data?.username } })
      } else {
        router.replace({ name: "settings" })
      }
    }
  }
)
</script>
