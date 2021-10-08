<template>
  <Modal @close="emit('close')">
    <div class="flex flex-col">
      <p>Are you sure to delete?</p>
      <footer>
        <button @click="$emit('close')">Cancel</button>
        <button @click="$emit('success')">Yes, delete</button>
      </footer>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const emit = defineEmits(["close", "success"])
</script>
