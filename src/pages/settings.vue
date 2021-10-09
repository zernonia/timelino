<template>
  <div class="flex flex-col w-full max-w-screen-sm">
    <h2 class="my-8 text-3xl font-bold">Settings</h2>
    <div>
      <button
        @click="target.click()"
        class="
          h-32
          w-32
          relative
          rounded-full
          overflow-hidden
          border border-gray-300
          ring ring-transparent
          transition
          focus:outline-transparent focus:ring-blue-400
        "
      >
        <div class="flex items-center justify-center">
          <i-mdi:plus class="w-12 h-12 text-gray-400"></i-mdi:plus>
          <input class="hidden" ref="target" type="file" @input="pickFile" accept="image/*" />
        </div>
        <img v-if="form.avatar_url" :src="form.avatar_url" alt="" class="absolute top-0 left-0 w-full object-cover" />
      </button>
    </div>
    <label for="username">Username</label>
    <input type="text" name="username" id="username" v-model="form.username" />
    <label for="full_name">Full name</label>
    <input type="text" name="full_name" id="full_name" v-model="form.full_name" />
    <label for="introduction">Introduction</label>
    <textarea name="introduction" id="introduction" rows="4" v-model="form.introduction"></textarea>
    <div class="flex justify-end">
      <button class="btn mt-4" @click="submit">Submit</button>
    </div>
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
      userState.profiles = data
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

// image upload
const target = ref()
const pickFile = (e: any) => {
  let files = target.value?.files as FileList
  const file = files[0]
  let reader = new FileReader()
  reader.onload = async (e) => {
    const result = e.target?.result as string
    let r = (Math.random() + 1).toString(36).substring(7)
    form.value.avatar_url = result
    const file_name = r + "-" + file.name
    const { data, error } = await supabase.storage.from("avatars").upload(file_name, file)
    if (data) {
      const { publicURL } = supabase.storage.from("avatars").getPublicUrl(file_name)
      if (publicURL) {
        form.value.avatar_url = publicURL
      }
    }
  }
  reader.readAsDataURL(file)
}
</script>
