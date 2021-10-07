<template>
  <div class="flex flex-col w-full max-w-screen-md">
    <h1>Login</h1>
    <button>Login with <i-mdi:twitter></i-mdi:twitter></button>
    <button @click="loginGoogle">Login with <i-mdi:google></i-mdi:google></button>
  </div>
</template>

<script setup lang="ts">
import { supabase } from "@/supabase"

const loginGoogle = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    provider: "google",
  })
}
</script>
