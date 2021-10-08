<template>
  <Modal @close="isOpen = true">
    <div
      class="w-full h-min max-w-screen-sm bg-white p-4 flex flex-col rounded-lg shadow-md"
      style="max-height: calc(100vh - 210px)"
    >
      <header class="flex justify-center">
        <Datepicker
          class="
            text-center
            bg-gray-100
            py-2
            rounded-md
            cursor-pointer
            font-bold
            focus:outline-transparent focus:ring-transparent
          "
          v-model="date"
          :input-format="'LLL dd, yyyy'"
          :upper-limit="dateLimit"
        />
      </header>
      <div class="flex-grow h-full">
        <QuillEditor
          ref="editor"
          v-model:content="content"
          :placeholder="'Tell the world your story...'"
          :content-type="'html'"
          theme="snow"
          :toolbar="[
            { header: 1 },
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote',
            'code-block',
            { list: 'ordered' },
            { list: 'bullet' },
            'link',
          ]"
        />
        <div class="flex items-center my-2 space-x-2">
          <button class="btn btn-pale inline-flex items-center text-sm" v-for="tag in tagging" :value="tag">
            <i-mdi:minus class="mr-2"></i-mdi:minus>
            {{ tag }}
          </button>
          <div class="relative">
            <button @click="isDropdownOpen = !isDropdownOpen" class="btn btn-pale inline-flex items-center text-sm">
              <i-mdi:plus class="mr-2"></i-mdi:plus> Add Tag
            </button>
            <ul class="bg-white absolute bottom-full mb-2 left-0">
              <input type="text" v-model="newTag" />
            </ul>
          </div>
        </div>
      </div>
      <footer class="flex justify-end"><button class="btn" @click="submit">Submit</button></footer>
    </div>
    <ModalDiscard v-if="isOpen" @close="isOpen = false" @success="triggerDiscard"></ModalDiscard>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { QuillEditor } from "@vueup/vue-quill"
import Datepicker from "vue3-datepicker"
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import { supabase } from "@/supabase"
import { userState } from "@/store"
import { Story } from "@/interface"

const p = defineProps({
  id: String,
})
const emit = defineEmits(["close", "success"])
const editor = ref()

const date = ref(new Date())
const dateLimit = ref(new Date())
const content = ref("")
const tagging = ref(["Article"])

const fetchData = async () => {
  if (!p.id) return
  const { data, error } = await supabase.from<Story>("stories").select("*").eq("id", p.id).single()
  if (!error && data) {
    date.value = new Date(data.date)
    content.value = data.story
    tagging.value = data.tagging
  }
  editor.value.setHTML(content.value)
}
fetchData()

const submit = async () => {
  if (p.id) {
    const { data, error } = await supabase
      .from("stories")
      .update({
        date: date.value,
        story: content.value,
        tagging: tagging.value,
      })
      .match({ id: p.id })
    if (!error) emit("success")
  } else {
    const { data, error } = await supabase.from("stories").insert({
      user_id: userState.user?.id,
      date: date.value,
      story: content.value,
      tagging: tagging.value,
    })
    if (!error) emit("success")
  }
}

// tagging
const isDropdownOpen = ref(false)
const newTag = ref("")

// discard changes modal
const isOpen = ref(false)
const triggerDiscard = () => {
  emit("close")
}
</script>

<style>
.v3dp__popout {
  @apply -ml-8 mt-2;
}
.ql-formats {
  @apply w-full !inline-flex justify-center;
}
.ql-toolbar.ql-snow {
  font-family: unset;
  @apply border-none;
}
.ql-container.ql-snow {
  font-family: unset;
  @apply text-base leading-10 h-64 bg-gray-100 border-none rounded-xl;
}
.ql-active {
  @apply bg-blue-200 bg-opacity-50 text-blue-700;
}
.ql-snow.ql-toolbar button {
  @apply rounded mx-1 p-2 w-8 h-8;
}
.ql-snow.ql-toolbar button:hover {
  @apply bg-gray-100;
}
.ql-fill {
  @apply !fill-gray-400;
}
.ql-active .ql-fill {
  @apply !fill-blue-700;
}
.ql-stroke {
  @apply !stroke-gray-400;
}
.ql-active .ql-stroke {
  @apply !stroke-blue-700;
}
</style>
