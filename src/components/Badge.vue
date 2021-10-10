<template>
  <button class="badge" :class="computedColor" @click="emit('click')">
    <slot></slot>
    {{ value }}
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue"

const prop = defineProps({
  value: String,
  color: String,
})

const emit = defineEmits(["click"])

//  focus:ring-blue-400
const computedColor = computed(() => {
  // "#1D4ED8", "#22C55E", "#FCD34D", "#FB923C", "#F472B6", "#F87171"
  switch (prop.color) {
    case "#1D4ED8":
      return "text-blue-700 bg-blue-200  bg-opacity-50"
    case "#22C55E":
      return "text-green-700 bg-green-200  bg-opacity-50"
    case "#FCD34D":
      return "text-yellow-700 bg-yellow-200  bg-opacity-50"
    case "#FB923C":
      return "text-orange-700 bg-orange-200  bg-opacity-50"
    case "#F472B6":
      return "text-pink-700 bg-pink-200  bg-opacity-50"
    case "#F87171":
      return "text-red-700 bg-red-200  bg-opacity-50"
    default:
      return ""
  }
})
</script>

<style>
.badge {
  @apply px-4 py-2 rounded-lg font-semibold ring ring-transparent transition focus:outline-transparent inline-flex items-center text-sm;
}
</style>
