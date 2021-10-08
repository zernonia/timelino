<template>
  <Modal @close="emit('close')">
    <div class="flex flex-col bg-white p-4 flex flex-col rounded-lg shadow-md">
      <h5 class="text-xl font-semibold">Discard the changes?</h5>
      <footer class="mt-4 flex items-center space-x-2">
        <button class="btn btn-pale" @click="$emit('close')">Cancel</button>
        <button class="btn" @click="$emit('success')">Yes, discard</button>
      </footer>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const emit = defineEmits(["close", "success"])
</script>
