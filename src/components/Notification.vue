<template>
  <OnClickOutside @trigger="isDropdownOpen = false">
    <div class="relative">
      <button @click="isDropdownOpen = !isDropdownOpen" class="btn-icon">
        <i-mdi:bell class="w-6 h-6"></i-mdi:bell>
        <span v-if="isNew" class="absolute top-2 right-2">
          <span class="flex h-3 w-3 relative">
            <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-300"></span>
          </span>
        </span>
      </button>
      <div v-if="isDropdownOpen" class="absolute top-full right-0 mt-2 w-80 rounded-md shadow-md py-4 !z-10 bg-white">
        <ul v-if="notification.length">
          <li v-for="item in notification" :key="item.id">
            <button
              @click="onClickNotifications(item.payload.username)"
              class="w-full py-2 px-4 flex items-center focus:outline-transparent"
              :class="[item.read ? '' : 'bg-opacity-50 bg-blue-200 ']"
            >
              <img class="w-8 h-8 object-cover rounded-full" :src="item.payload.avatar_url" alt="" />
              <div class="flex items-center text-sm ml-2 truncate">
                <h5 class="font-semibold text-blue-700">@{{ item.payload.username }}</h5>
                <p class="truncate ml-1">started following you.</p>
              </div>
            </button>
          </li>
        </ul>
        <p class="text-sm text-gray-400 text-center" v-else>No notification...</p>
      </div>
    </div>
  </OnClickOutside>
</template>

<script setup lang="ts">
import { userState } from "@/store"
import { supabase } from "@/supabase"
import { OnClickOutside } from "@vueuse/components"
import { ref, watch, computed } from "vue"
import { useRouter } from "vue-router"

const isNew = ref(false)
const hasNew = computed(() => (notification.value.findIndex((i) => i.read == false) == -1 ? false : true))
const isDropdownOpen = ref(false)

const notification = ref<any[]>([])
const getNotification = async () => {
  const { data, error } = await supabase.from("notifications").select("*").eq("target_id", userState.user?.id).limit(5)
  if (data && data.length) notification.value = data
}
getNotification()

watch(
  hasNew,
  (n) => {
    n ? (isNew.value = true) : ""
  },
  { immediate: true }
)
watch(isDropdownOpen, async (n) => {
  n ? (isNew.value = false) : ""
  const { data, error } = await supabase
    .from("notifications")
    .update({
      read: true,
    })
    .eq("target_id", userState.user?.id)
})

const subcription = supabase
  .from(`notifications:target_id=eq.${userState.user?.id}`)
  .on("INSERT", (payload) => {
    isNew.value = true
    console.log("new notification", payload)
    notification.value = [payload.new, ...notification.value.pop()]
  })
  .subscribe()

const router = useRouter()
const onClickNotifications = (username: string) => {
  isDropdownOpen.value = false
  router.push({ name: "u-username", params: { username } })
}
</script>
