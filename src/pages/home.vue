<template>
  <div class="w-full mt-8 max-w-screen-lg flex flex-col md:flex-row px-6">
    <div class="w-full flex flex-col sm:mr-10 overflow-hidden sm:sticky top-6 h-max">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900">
        Hi, <span v-if="userState.profiles?.id">{{ userState.profiles?.full_name }}</span>
      </h2>
      <div class="mt-4 md:mt-8">
        <h3 class="text-xl md:text-2xl font-bold text-gray-900 inline-flex items-center">
          <i-mdi:star class="text-xl mr-2 text-blue-700"></i-mdi:star>
          Suggested user
        </h3>
        <ul class="mt-4 flex flex-col space-y-4">
          <router-link
            :to="{ name: 'u-username', params: { username: user.username } }"
            v-for="user in userList"
            :key="user.id"
          >
            <div
              class="
                w-full
                text-left
                px-4
                py-2
                bg-opacity-50 bg-blue-200
                rounded-lg
                transition
                hover:bg-opacity-30
                focus:outline-transparent
              "
            >
              <li class="flex items-center w-full">
                <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img class="w-full h-full object-cover" :src="user.avatar_url" alt="" />
                </div>
                <div class="ml-4 flex flex-col overflow-hidden">
                  <h5 class="text font-bold text-blue-700">{{ user.full_name }}</h5>
                  <p class="text-sm text-gray-900 truncate">{{ user.introduction }}</p>
                </div>
              </li>
            </div>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="mt-6 md:mt-0 w-full max-w-screen-sm lg:flex-shrink-0">
      <div v-if="storyList.length">
        <router-link
          :to="{ name: 'u-username', params: { username: value.user_data?.username } }"
          v-for="value in storyList"
          :key="value.id"
        >
          <div
            class="
              relative
              border border-gray-200
              rounded-lg
              p-6
              mb-8
              w-full
              shadow-transparent
              transition
              hover:shadow-md
              focus:outline-transparent
            "
          >
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full overflow-hidden">
                <img :src="value.user_data?.avatar_url" class="object-cover" alt="" />
              </div>
              <div class="ml-4 flex flex-col">
                <h5 class="text font-bold text-blue-700 text-left">{{ value.user_data?.full_name }}</h5>
                <p class="inline-flex items-center text-sm text-left text-gray-500 truncate">
                  <i-mdi:clock class="mr-2 w-4 h-4"></i-mdi:clock>
                  {{ dayjs(value.date).format("MMM DD, YYYY") }}
                </p>
              </div>
            </div>
            <div v-if="value.tags[0] != null" class="mt-4 flex items-center space-x-2">
              <Badge v-for="tag in value.tags" :key="tag.name" :value="tag.name" :color="tag.color"></Badge>
            </div>
            <div class="mt-2 cursor-pointer">
              <div class="ql-editor px-0" v-html="value.story"></div>
              <img v-if="value.image" class="w-full rounded-xl" :src="value.image" alt="" />
            </div>
          </div>
        </router-link>
      </div>
      <div v-else class="w-full flex justify-center mt-12">
        <p class="w-80 text-center text-gray-400">No story from the users you followed yet...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Story } from "@/interface"
import { userState } from "@/store"
import { supabase } from "@/supabase"
import { ref } from "vue"
import dayjs from "dayjs"

const userList = ref<any[]>([])
const getUserToFollow = async () => {
  const { data, error } = await supabase.rpc("get_suggested_user").limit(5).neq("username", null)
  if (data) userList.value = data
}

const storyList = ref<Story[]>([])
const getFollowingStory = async () => {
  const { data, error } = await supabase.rpc<Story>("get_following_stories").order("created_at", { ascending: false })
  if (data) storyList.value = data
}
getUserToFollow()
getFollowingStory()
</script>

<style>
.cursor-pointer .ql-editor * {
  @apply cursor-pointer;
}
</style>
