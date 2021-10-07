<template>
  <div class="flex flex-col w-full max-w-screen-md">
    <label for="username">Username</label>
    <input type="text" name="username" id="username" v-model="form.username" />
    <label for="introduction">introduction</label>
    <input type="text" name="introduction" id="introduction" v-model="form.introduction" />
    <button @click="submit">Submit</button>
  </div>
</template>

<script setup lang="ts">
import { userState } from "@/store"
import { supabase } from "@/supabase"
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const form = ref({
  username: "",
  avatar_url: "",
  introduction: "",
  links: [],
})
const submit = async () => {
  if (userState.user?.id) {
    const { data, error } = await supabase.from("profiles").upsert({ id: userState.user.id, ...form.value })
    console.log(data)
    if (!error) {
      router.push({ name: "u-id", params: { id: userState.user.id } })
    }
  }
}
const getData = async () => {
  if (userState.user?.id) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userState.user.id).single()
    console.log(data)
    if (!error) {
      form.value = data
    }
  }
}

getData()
</script>
