<template>
  <div>
    {{ value }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  value: String,
})
</script>
