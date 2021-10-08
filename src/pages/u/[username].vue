<template>
  <div class="w-full max-w-screen-sm">
    <div v-if="userData">
      <img :src="userData.avatar_url" class="w-32 rounded-full" />
      <h1>{{ userData.full_name }}</h1>
      <h1>@{{ userData.username }}</h1>
      <p>{{ userData.introduction }}</p>
      <ul>
        <li v-for="link in userData.links">
          {{ link }}
        </li>
      </ul>
      <h1>{{ userData }}</h1>
    </div>

    <div class="mt-6">
      <h1>Timeline</h1>
      <p>{{ userStory }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Profile, Story } from "@/interface"
import { userState } from "@/store"
import { supabase } from "@/supabase"
import { ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const userData = ref<Profile | null>()
const getUserData = async () => {
  const { data, error } = await supabase
    .from<Profile>("profiles")
    .select("*")
    .eq("username", route.params.username)
    .single()
  if (!error) userData.value = data
}
getUserData()

const userStory = ref<Story[] | null>()
const getUserStory = async () => {
  const { data, error } = await supabase.from("stories").select("*").eq("profiles.username", route.params.username)
  console.log({ data, error })
  if (!error) userStory.value = data
}
getUserStory()
</script>
