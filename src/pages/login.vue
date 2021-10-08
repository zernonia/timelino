<template>
  <div class="flex flex-col w-72 items-center mt-20">
    <h1 class="text-2xl font-bold text-gray-900">Login</h1>
    <button class="btn mt-4 items-center w-full flex justify-center" @click="loginGoogle">
      Login with <i-mdi:google class="ml-2"></i-mdi:google>
    </button>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "@/supabase"

const loginGoogle = async () => {
  const { user, session, error } = await supabase.auth.signIn(
    {
      provider: "google",
    },
    { redirectTo: window.location.origin + "/redirect" }
  )
}
</script>
