<template>
  <div class="w-full mt-8 max-w-screen-lg flex items-center">
    <div class="w-2/5 flex flex-col">
      <h2 class="text-3xl font-bold text-gray-900">
        Hi, <span v-if="userState.profiles?.id">{{ userState.profiles?.full_name }}</span>
      </h2>
      <div class="mt-8">
        <h3 class="text-2xl font-bold text-gray-900">Suggested user</h3>
        <ul class="mt-4 flex flex-col space-y-2">
          <button
            class="w-full text-left p-4 rounded-lg shadow-none transition hover:shadow-md focus:outline-transparent"
            v-for="user in userList"
            :key="user.id"
            @click="$router.push({ name: 'u-username', params: { username: user.username } })"
          >
            <li class="flex items-center w-full">
              <div class="w-12 h-12 rounded-full overflow-hidden">
                <img :src="user.avatar_url" alt="" />
              </div>
              <div class="ml-4">
                <h5 class="text font-bold text-blue-700">{{ user.full_name }}</h5>
                <p class="text-sm text-gray-500">{{ user.introduction }}</p>
              </div>
            </li>
          </button>
        </ul>
      </div>
    </div>
    <div class="w-3/5">
      <div class="w-full bg-blue-700"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userState } from "@/store"
import { supabase } from "@/supabase"
import { ref } from "vue"

const userList = ref<any[]>([])
const getUserToFollow = async () => {
  const { data, error } = await supabase.from("profiles").select("*").limit(5)
  if (data) userList.value = data
}
getUserToFollow()
</script>
