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
      <div
        class="w-full h-min max-w-screen-sm bg-white p-4 rounded-lg shadow-md"
        style="max-height: calc(100vh - 210px)"
      >
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
defineEmits(["close"])
</script>
