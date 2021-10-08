<template>
  <teleport to="body">
    <div
      class="
        w-screen
        h-screen
        fixed
        top-0
        left-0
        flex
        items-center
        justify-center
        bg-white bg-opacity-50
        backdrop-filter backdrop-blur-sm
      "
      @click.self="$emit('close')"
    >
      <slot></slot>
    </div>
  </teleport>
</template>

<script setup lang="ts">
defineEmits(["close"])
</script>
