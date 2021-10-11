<template>
  <div class="max-w-screen-sm w-full px-6 sm:px-0">
    <div v-if="userData && !isLoading">
      <div>
        <div class="flex items-center justify-between">
          <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-700">
            <img :src="userData.avatar_url" class="w-full h-full object-cover" />
          </div>
          <div v-if="isCurrentUser">
            <router-link :to="{ name: 'settings' }" class="btn btn-white">Settings</router-link>
          </div>
          <div v-else>
            <button v-if="!isFollowing" @click="followUser" class="btn btn-white">Follow</button>
            <button v-else @click="unfollowUser" class="btn btn-white">Following</button>
          </div>
        </div>
        <h1 class="mt-2 text-xl sm:text-2xl text-gray-900 font-bold">{{ userData.full_name }}</h1>
        <h2 class="text-sm sm:text-base text-gray-400">@{{ userData.username }}</h2>
        <p class="text-sm sm:text-base mt-4 whitespace-pre-line">{{ userData.introduction }}</p>
        <ul>
          <li v-for="link in userData.links" :key="link">
            {{ link }}
          </li>
        </ul>
      </div>

      <div class="h-1px w-full bg-gray-200 my-8"></div>

      <div class="">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-gray-900 inline-flex items-center">
            <i-mdi:star class="text-blue-700 mr-2 text-xl"></i-mdi:star>
            Story
          </h1>
          <button
            v-if="storyTagFilter"
            @click="storyFilter()"
            class="ml-4 text-gray-300 inline-flex p-1 focus:outline-transparent"
          >
            <i-mdi:filter-off></i-mdi:filter-off>
          </button>
        </div>
        <div class="relative mt-4 sm:mt-8">
          <div v-if="Object.keys(groupUserStory).length">
            <div
              class="relative border-l border-gray-200 timeline-track"
              v-for="(value, key) in groupUserStory"
              :key="key"
            >
              <div class="hidden lg:block absolute top-0 -left-6 transform -translate-x-full text-sm text-gray-400">
                {{ dayjs(key).format("MMM DD, YYYY") }}
              </div>
              <div v-for="item in value" :key="item.id" class="ml-4 sm:ml-10 mt-4 timeline-content">
                <div class="block lg:hidden text-sm text-gray-400 mb-2">
                  {{ dayjs(item.date).format("MMM DD, YYYY") }}
                </div>
                <div v-if="item.tags[0] != null" class="flex items-center space-x-2">
                  <Badge
                    v-for="tag in item.tags"
                    :key="tag.name"
                    :value="tag.name"
                    :color="tag.color"
                    @click="storyFilter(tag)"
                  ></Badge>
                </div>
                <div class="mt-2">
                  <div class="ql-editor px-0" v-html="item.story"></div>
                  <img v-if="item.image" class="w-full rounded-xl border border-gray-200" :src="item.image" alt="" />
                </div>
                <div v-if="isCurrentUser" class="helper hidden items-center absolute top-0 right-0">
                  <button @click="buttonEdit(item.id)" class="btn-helper">
                    <i-mdi:square-edit-outline></i-mdi:square-edit-outline>
                  </button>
                  <button @click="buttonDelete(item.id)" class="btn-helper">
                    <i-mdi:trash-can-outline></i-mdi:trash-can-outline>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-400">No story yet...</div>
        </div>
      </div>
    </div>
    <div v-else-if="!isLoading" class="flex flex-col items-center space-y-2">
      <h2 class="text-2xl text-gray-900 font-bold">User not found...</h2>
      <button class="btn" @click="$router.push({ name: 'index' })">Home</button>
    </div>

    <ModalStory v-if="isOpen" @close="isOpen = false" @success="triggerFetch" :id="modalId"></ModalStory>
    <ModalDelete v-if="isDeleteOpen" @close="isDeleteOpen = false" @success="triggerDelete"></ModalDelete>
  </div>
</template>

<script setup lang="ts">
import { Profile, Story, Tag } from "@/interface"
import { userState } from "@/store"
import { supabase } from "@/supabase"
import { ref, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import dayjs from "dayjs"
import { watchOnce, useEventBus } from "@vueuse/core"

userState
const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const isCurrentUser = computed(() => userState.profiles?.username == route.params.username)
const userData = ref<Profile | null>()
const getUserData = async () => {
  const { data, error } = await supabase
    .from<Profile>("profiles")
    .select("*")
    .eq("username", route.params.username)
    .single()
  if (!error) userData.value = data
  isLoading.value = false
}
getUserData()

const storyTagFilter = ref<Tag>()
const storyFilter = (tag?: Tag) => {
  if (tag) {
    storyTagFilter.value = tag
  } else {
    storyTagFilter.value = undefined
  }
  getUserStory()
}
const userStory = ref<Story[] | null>(null)
const getUserStory = async () => {
  if (storyTagFilter.value) {
    const { data, error } = await supabase
      .rpc("get_tagged_stories", {
        user_name: route.params.username,
        tag_id: storyTagFilter.value.id,
      })
      .order("date", { ascending: false })
    console.log({ data, error })
    if (!error) userStory.value = data
  } else {
    const { data, error } = await supabase
      .rpc("get_stories", {
        user_name: route.params.username,
      })
      .order("date", { ascending: false })
    console.log({ data, error })
    if (!error) userStory.value = data
  }
}
interface GroupStory {
  [key: string]: Story[]
}
const groupUserStory = computed(() => {
  if (userStory.value) {
    return userStory.value.reduce((prev, curr) => {
      prev[curr.date] = prev[curr.date] || []
      prev[curr.date].push(curr)
      return prev
    }, Object.create(null)) as GroupStory
  } else {
    return {}
  }
})
getUserStory()

//
const bus = useEventBus<string>("add-story")
const listener = (event: string) => {
  getUserStory()
}
const unsubscribe = bus.on(listener)

// modal
const isOpen = ref(false)
const isDeleteOpen = ref(false)
const modalId = ref("")
const buttonEdit = (id: string) => {
  modalId.value = id
  isOpen.value = true
}
const buttonDelete = (id: string) => {
  modalId.value = id
  isDeleteOpen.value = true
}
const triggerDelete = async () => {
  isDeleteOpen.value = false
  const { data, error } = await supabase.from("stories").delete().match({ id: modalId.value })
  if (!error) getUserStory()
}
const triggerFetch = async () => {
  isOpen.value = false
  getUserStory()
}

// follower
const followerCount = ref(0)
const isFollowing = ref(false)
const isFollowCheck = async () => {
  const { data, error } = await supabase.from("followers").select("*").match({
    user_id: userState.user?.id,
    following_id: userData.value?.id,
  })
  if (data?.length) {
    isFollowing.value = true
  }
}
watchOnce(userData, () => {
  isFollowCheck()
  // getFollowerCount()
})
const followUser = async () => {
  if (!userState.user?.id) {
    router.push({ name: "login" })
    return
  }
  const { data, error } = await supabase.from("followers").insert({
    user_id: userState.user?.id,
    following_id: userData.value?.id,
  })
  if (data && data.length) {
    isFollowing.value = true
  }
}
const unfollowUser = async () => {
  const { data, error } = await supabase.from("followers").delete().match({
    user_id: userState.user?.id,
    following_id: userData.value?.id,
  })
  if (data && data.length) {
    isFollowing.value = false
  }
}
const getFollowerCount = async () => {
  const { data, error, count } = await supabase
    .from("followers")
    .select("user_id")
    .eq("following_id", userData.value?.id)
  if (count != null) followerCount.value = count
}
</script>

<style>
.timeline-track::before {
  background-color: white;
  background-image: url("https://d26uz55awpmifc.cloudfront.net/assets/icons/retro-highlight-clock-ccd4a6216bd3c81f258713544147abc14af225dea97d6b70c51e9cebb92c0402.svg");
  content: "";
  display: block;
  float: left;
  height: 1.5rem;
  left: -0.75rem;
  position: absolute;
  top: -0.125rem;
  width: 1.5rem;
}
.timeline-content {
  @apply relative sm:bottom-1;
}
.timeline-content:hover .helper {
  @apply flex;
}
</style>
