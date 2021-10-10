<template>
  <div class="flex flex-col w-auto items-center mt-20">
    <h1 class="text-3xl font-bold text-gray-900">Login</h1>
    <div class="flex flex-col">
      <label for="email">Email</label>
      <input type="email" name="email" id="email" v-model="form.email" />
      <label for="password">Password</label>
      <input @keypress.enter="loginEmail" type="password" name="password" id="password" v-model="form.password" />
      <div class="grid grid-cols-2 mt-4 gap-2">
        <button @click="registerEmail" class="btn btn-pale">Register</button>
        <button @click="loginEmail" class="btn">Login</button>
      </div>
    </div>
    <div class="error" v-if="errorText">* {{ errorText }}</div>

    <div class="h-1px my-6 bg-gray-200 w-full"></div>

    <button class="btn items-center w-full flex justify-center" @click="loginGoogle">
      Login with <i-mdi:google class="ml-2"></i-mdi:google>
    </button>
  </div>
</template>

<script setup lang="ts">
import { userState } from "@/store"
import { supabase } from "@/supabase"
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const errorText = ref("")
const form = ref({
  email: "",
  password: "",
})

const registerEmail = async () => {
  const { user, session, error } = await supabase.auth.signUp(
    {
      email: form.value.email,
      password: form.value.password,
    },
    { redirectTo: window.location.origin + "/redirect" }
  )
  if (error) {
    errorText.value = error.message
  } else {
    errorText.value = "Check your inbox for confirmation."
  }
}
const loginEmail = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    email: form.value.email,
    password: form.value.password,
  })
  if (error) {
    errorText.value = error.message
  } else {
    router.push("/redirect#login_type=email")
  }
}
const loginGoogle = async () => {
  const { user, session, error } = await supabase.auth.signIn(
    {
      provider: "google",
    },
    { redirectTo: window.location.origin + "/redirect" }
  )
}
</script>
