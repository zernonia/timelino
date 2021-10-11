<template>
  <OnClickOutside @trigger="isDropdownOpen = false">
    <div class="relative" v-if="userState.profiles">
      <button @click="isDropdownOpen = !isDropdownOpen" class="btn-icon w-10 h-10 rounded-full overflow-hidden !p-0">
        <img class="cursor-pointer object-cover" :src="userState.profiles.avatar_url" />
      </button>
      <ul
        v-if="isDropdownOpen"
        class="dropdown absolute top-full right-0 mt-2 w-max rounded-md shadow-md py-2 !z-10 bg-white"
      >
        <li>
          <button @click="onClickPage()" class="w-full py-2 px-6 flex items-center focus:outline-transparent">
            <i-mdi:account class="text-blue-700"></i-mdi:account>
            <p class="mx-2">My page</p>
          </button>
        </li>
        <li>
          <button @click="onClickSetting()" class="w-full py-2 px-6 flex items-center focus:outline-transparent">
            <i-mdi:cog class="text-blue-700"></i-mdi:cog>
            <p class="mx-2">Settings</p>
          </button>
        </li>
        <li>
          <button @click="onClickLogout()" class="w-full py-2 px-6 flex items-center focus:outline-transparent">
            <i-mdi:logout-variant class="text-blue-700"></i-mdi:logout-variant>
            <p class="mx-2">Log out</p>
          </button>
        </li>
      </ul>
    </div>
  </OnClickOutside>
</template>

<script setup lang="ts">
import { userState } from "@/store"
import { supabase } from "@/supabase"
import { OnClickOutside } from "@vueuse/components"
import { ref } from "vue"
import { useRouter } from "vue-router"

const isDropdownOpen = ref(false)

const router = useRouter()
const onClickPage = () => {
  isDropdownOpen.value = false
  router.push({ name: "u-username", params: { username: userState.profiles?.username } })
}
const onClickSetting = () => {
  isDropdownOpen.value = false
  router.push({ name: "settings" })
}
const onClickLogout = async () => {
  isDropdownOpen.value = false
  const { error } = await supabase.auth.signOut()
  userState.user = null
  userState.profiles = null
  if (!error) router.push({ name: "login" })
}
</script>

<style>
.dropdown button {
  @apply bg-white transition hover:bg-blue-100 hover:text-blue-700 bg-opacity-50 text-sm;
}
</style>
