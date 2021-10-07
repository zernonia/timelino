<template>
  <div ref="target"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import * as Quill from "quill"

const p = defineProps({
  modelValue: Object,
})
const target = ref()
const editor = ref()

watch(
  () => p.modelValue,
  (n) => {
    editor.value.setContents(p.modelValue)
  }
)
onMounted(() => {
  //@ts-ignore
  editor.value = new Quill(target.value)
})
</script>
