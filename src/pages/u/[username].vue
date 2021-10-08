<template>
  <div class="w-screen-sm">
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
    </div>

    <div class="mt-6">
      <h1>Timeline</h1>
      <div class="relative mt-8">
        <div class="relative border-l border-gray-300 timeline-track mt-4" v-for="(value, key) in groupUserStory">
          <div class="absolute top-0 -left-6 transform -translate-x-full text-sm font-semibold text-gray-400">
            {{ dayjs(key).format("MMM DD, YYYY") }}
          </div>
          <div v-for="item in value" :key="item.id" class="ml-10 mt-4 timeline-content">
            <div v-for="tag in item.tagging">
              <h5 class="bg-blue-200 bg-opacity-50 text-blue-700 font-semibold w-max px-3 py-1.5 rounded text-sm">
                {{ tag }}
              </h5>
            </div>
            <div class="mt-2">
              <div v-html="item.story"></div>
            </div>
            <div class="helper hidden items-center absolute top-0 right-0">
              <button @click="buttonEdit(item.id)" class="p-2 inline-flex text-gray-400">
                <i-mdi:square-edit-outline></i-mdi:square-edit-outline>
              </button>
              <button @click="buttonDelete(item.id)" class="p-2 inline-flex text-gray-400">
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
import { Profile, Story } from "@/interface"
import { userState } from "@/store"
import { supabase } from "@/supabase"
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import dayjs from "dayjs"

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

const userStory = ref<Story[] | null>(null)
const getUserStory = async () => {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("profiles.username", route.params.username)
    .order("date", { ascending: false })
  console.log({ data, error })
  if (!error) userStory.value = data
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
  @apply relative bottom-1;
}
.timeline-content:hover .helper {
  @apply flex;
}
</style>
