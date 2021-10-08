<template>
  <div class="flex flex-col w-full max-w-screen-md">
    <label for="username">Username</label>
    <input type="text" name="username" id="username" v-model="form.username" />
    <label for="full_name">Full name</label>
    <input type="text" name="full_name" id="full_name" v-model="form.full_name" />
    <label for="introduction">introduction</label>
    <input type="text" name="introduction" id="introduction" v-model="form.introduction" />
    <button @click="submit">Submit</button>
  </div>
</template>

<script setup lang="ts">
import { Profile } from "@/interface"
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
  full_name: "",
})
const submit = async () => {
  if (userState.user?.id) {
    const { data, error } = await supabase
      .from<Profile>("profiles")
      .upsert({ id: userState.user.id, ...form.value })
      .single()
    if (!error) {
      router.push({ name: "u-username", params: { username: data?.username } })
    }
  }
}
const getData = async () => {
  if (userState.user?.id) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userState.user.id).single()
    if (!error) {
      form.value = data
    }
  }
}

getData()
</script>
