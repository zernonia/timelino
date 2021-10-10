<template>
  <Modal @close="isOpen = true">
    <div
      class="w-full h-min max-w-screen-sm bg-white p-4 flex flex-col rounded-lg shadow-md"
      style="max-height: calc(100vh - 210px)"
    >
      <header class="flex justify-center">
        <Datepicker
          :style="calendarStyle"
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
        <div class="flex items-center my-2 flex-wrap">
          <OnClickOutside @trigger="isDropdownOpen = false">
            <div class="relative mb-2 mr-2">
              <button @click="isDropdownOpen = !isDropdownOpen" class="btn btn-pale inline-flex items-center text-sm">
                <i-mdi:plus class="mr-2"></i-mdi:plus> Add Tag
              </button>
              <div
                v-if="isDropdownOpen"
                class="bg-white absolute bottom-full mb-2 left-0 p-4 max-w-608px rounded-md shadow-md"
              >
                <ul class="flex">
                  <li v-for="tag in taggingList" :key="tag.name" class="w-max mb-2 mr-2">
                    <Badge :value="tag.name" :color="tag.color" @click="addTag(tag)"></Badge>
                  </li>
                </ul>
                <div class="flex space-x-2">
                  <input placeholder="Add new tag.." class="px-2 py-1 w-40" type="text" v-model="newTag.name" />
                  <VSwatches
                    class="flex"
                    :row-length="'3'"
                    :popover-y="'top'"
                    :swatch-style="swatchesStyle"
                    :wrapper-style="wrapperStyle"
                    :swatches="swatches"
                    v-model="newTag.color"
                  ></VSwatches>
                  <button @click="addTagging" class="btn">Add</button>
                </div>
              </div>
            </div>
          </OnClickOutside>
          <Badge
            v-if="tagging[0]"
            v-for="(tag, index) in tagging"
            :key="tag.name"
            :value="tag.name"
            :color="tag.color"
            @click="removeTag(index)"
            class="mb-2 mr-2"
          >
            <i-mdi:minus class="mr-2"></i-mdi:minus>
          </Badge>
        </div>
      </div>
      <footer class="flex justify-end"><button class="btn" @click="submit">Submit</button></footer>
    </div>
    <ModalDiscard v-if="isOpen" @close="isOpen = false" @success="triggerDiscard"></ModalDiscard>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { QuillEditor } from "@vueup/vue-quill"
import Datepicker from "vue3-datepicker"
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import { supabase } from "@/supabase"
import { userState } from "@/store"
import { Story, Tag } from "@/interface"
import VSwatches from "vue3-swatches"
import { useRoute } from "vue-router"
import { OnClickOutside } from "@vueuse/components"
import dayjs from "dayjs"

const p = defineProps({
  id: String,
})
const emit = defineEmits(["close", "success"])
const editor = ref()

const date = ref(new Date())
const dateLimit = ref(new Date())
const content = ref("")
const tagging = ref<Tag[]>([])
const route = useRoute()

const formatDate = computed(() => dayjs(date.value).format("YYYY-MM-DD"))

const fetchData = async () => {
  if (!p.id) return
  const { data, error } = await supabase
    .rpc("get_stories", {
      user_name: route.params.username,
    })
    .select("*")
    .eq("id", p.id)
    .single()
  if (!error && data) {
    date.value = new Date(data.date)
    content.value = data.story
    tagging.value = data.tags
  }
  editor.value.setHTML(content.value)
}
fetchData()

const submit = async () => {
  console.log(date.value)
  const { data, error } = await supabase.from("stories").upsert({
    id: p.id ? p.id : undefined,
    user_id: userState.user?.id,
    date: formatDate.value,
    story: content.value,
    tagging: tagging.value.map((i) => i.id),
  })
  if (!error) emit("success")
}

// calendar
const calendarStyle = ref({
  "--vdp-hover-bg-color": "#1d4ed8",
  "--vdp-selected-color": "#1d4ed8",
  "--vdp-selected-bg-color": "#dfedfe",
})

// tagging
const isDropdownOpen = ref(false)
const taggingList = ref<any[]>([])
const newTag = ref({
  name: "",
  color: "#1D4ED8",
})
const swatches = ref(["#1D4ED8", "#22C55E", "#FCD34D", "#FB923C", "#F472B6", "#F87171"])
const swatchesStyle = ref({
  marginRight: "0.5rem",
  marginBottom: "0.5rem",
})
const wrapperStyle = ref({
  paddingTop: "1rem",
  paddingLeft: "1rem",
})
const addTagging = async () => {
  const { data, error } = await supabase.from("tags").upsert({ user_id: userState.user?.id, ...newTag.value })
  console.log(data, error)
  if (data && data.length) {
    tagging.value.push(data[0])
    taggingList.value.push(data[0])
  }
}
const fetchTagging = async () => {
  const { data, error } = await supabase.from("tags").select("*").eq("user_id", userState.user?.id)
  console.log(data, error)
  if (data) {
    taggingList.value = data
  }
}
fetchTagging()

const addTag = (tag: Tag) => {
  if (tagging.value[0]) {
    if (tagging.value.findIndex((i) => i.name == tag.name) != -1) return
    tagging.value.push(tag)
  } else {
    tagging.value[0] = tag
  }
}
const removeTag = (i: number) => {
  tagging.value.splice(i, 1)
}

// discard changes modal
const isOpen = ref(false)
const triggerDiscard = () => {
  emit("close")
}
</script>

<style>
.v3dp__popout {
  @apply -ml-2 mt-2;
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
.vue-swatches__container:not(.vue-swatches--inline) {
  @apply shadow-md rounded-md;
}
.ql-editor h1 {
  @apply !text-2xl font-bold !leading-10;
}
.ql-editor p {
  @apply py-2 leading-6;
}
.ql-editor blockquote {
  @apply !my-2 !pl-4 !border-gray-200 !border-l-4;
}
.ql-editor pre.ql-syntax {
  @apply !bg-gray-200 !text-gray-900 my-4 p-2 rounded-md;
}
.ql-editor ol,
.ql-editor ul {
  @apply py-2;
}
.ql-editor li {
  @apply py-0.5;
}
.ql-snow .ql-tooltip {
  @apply rounded-md shadow-md border-none;
}
.ql-snow .ql-tooltip input {
  @apply !text-base !px-2  !h-8;
}
</style>
