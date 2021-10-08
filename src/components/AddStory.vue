<template>
  <Modal @close="emit('close')">
    <div class="flex flex-col">
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
          :upper-limit="dataLimit"
        />
      </header>
      <div class="mt-4 flex-grow h-full">
        <QuillEditor
          class="h-64 bg-gray-100"
          v-model:content="content"
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
        <div>
          <h3>Tags</h3>
          <Badge v-for="tag in tagging" :value="tag"></Badge>
        </div>
      </div>
      <footer><button @click="submit">Submit</button></footer>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { QuillEditor } from "@vueup/vue-quill"
import Datepicker from "vue3-datepicker"
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import { supabase } from "@/supabase"
import { userState } from "@/store"

const p = defineProps({
  id: String,
})
const emit = defineEmits(["close", "success"])

const date = ref(new Date())
const dataLimit = ref(new Date())
const content = ref("")
const tagging = ref(["Indiehackers"])

const submit = async () => {
  const { data, error } = await supabase.from("stories").insert({
    user_id: userState.user?.id,
    date: date.value,
    story: content.value,
    tagging: tagging.value,
  })
  if (!error) emit("success")
}
</script>

<style>
.v3dp__popout {
  @apply -ml-8 mt-2;
}
</style>
