<template>
  <Modal @close="emit('close')">
    <div class="flex flex-col bg-white p-4 flex flex-col rounded-lg shadow-md">
      <h5 class="text-xl font-semibold">Are you sure to delete?</h5>
      <footer class="flex items-center space-x-2">
        <button class="btn" @click="$emit('close')">Cancel</button>
        <button class="btn btn-warning" @click="$emit('success')">Yes, delete</button>
      </footer>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const emit = defineEmits(["close", "success"])
</script>
