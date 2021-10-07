<template>
  <div>
    <div id="toolbar"></div>
    <div id="editor"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import * as Quill from "quill"

const p = defineProps({
  modelValue: Object,
})
const emit = defineEmits(["update:modelValue"])

const editor = ref()
var options = {
  modules: {
    toolbar: "#toolbar",
  },
  placeholder: "Tell us your amazing story 🌈",
  theme: "snow",
}

onMounted(() => {
  const container = document.getElementById("editor") as Element
  //@ts-ignore
  editor.value = new Quill(container, options)
  if (p.modelValue) {
    editor.value.setContents(p.modelValue)
  }
  editor.value.on("text-change", (d: any, old: string) => {
    console.log(d, old, p.modelValue)
    const contents = editor.value.getContents()
    emit("update:modelValue", contents)
  })
})
</script>
