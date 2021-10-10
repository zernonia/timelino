<template>
  <div class="w-screen-sm">
    <div v-if="userData">
      <div class="flex items-center justify-between">
        <img :src="userData.avatar_url" class="w-32 rounded-full" />
        <div v-if="isCurrentUser">
          <button @click="$router.push({ name: 'settings' })" class="btn btn-white">Settings</button>
        </div>
        <div v-else>
          <button v-if="!isFollowing" @click="followUser" class="btn btn-white">Follow</button>
          <button v-else @click="unfollowUser" class="btn btn-white">Following</button>
        </div>
      </div>
      <h1 class="mt-2 text-2xl text-gray-900 font-bold">{{ userData.full_name }}</h1>
      <h2 class="text-gray-400">@{{ userData.username }}</h2>
      <p class="mt-4">{{ userData.introduction }}</p>
      <ul>
        <li v-for="link in userData.links">
          {{ link }}
        </li>
      </ul>
    </div>

    <div class="h-1px w-full bg-gray-200 my-8"></div>

    <div class="mt-6">
      <div class="flex items-center">
        <h1 class="text-2xl font-bold text-gray-900">Story</h1>
        <button
          v-if="storyTagFilter"
          @click="storyFilter()"
          class="ml-4 text-gray-300 inline-flex p-1 focus:outline-transparent"
        >
          <i-mdi:filter-off></i-mdi:filter-off>
        </button>
      </div>
      <div class="relative mt-8">
        <div class="relative border-l border-gray-200 timeline-track mt-4" v-for="(value, key) in groupUserStory">
          <div class="absolute top-0 -left-6 transform -translate-x-full text-sm text-gray-400">
            {{ dayjs(key).format("MMM DD, YYYY") }}
          </div>
          <div v-for="item in value" :key="item.id" class="ml-10 mt-4 timeline-content">
            <div v-if="item.tags[0] != null" class="flex items-center space-x-2">
              <Badge v-for="tag in item.tags" :value="tag.name" :color="tag.color" @click="storyFilter(tag)"></Badge>
            </div>
            <div class="mt-2">
              <div class="ql-editor px-0" v-html="item.story"></div>
              <img v-if="item.image" class="w-full rounded-xl" :src="item.image" alt="" />
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
import { useRoute } from "vue-router"
import dayjs from "dayjs"
import { watchOnce, useEventBus } from "@vueuse/core"

userState
const route = useRoute()
const isCurrentUser = computed(() => userState.profiles?.username == route.params.username)
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
  const { data, error } = await supabase.from("followers").select("*").eq("following_id", userData.value?.id)
  if (data?.length) {
    isFollowing.value = true
  }
}
watchOnce(userData, () => {
  isFollowCheck()
  getFollowerCount()
})
const followUser = async () => {
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
  @apply relative bottom-1 border-b-1;
}
.timeline-content:hover .helper {
  @apply flex;
}
</style>
