<template>
  <div class="w-full max-w-screen-sm">
    <div>
      <img :src="userState.user?.user_metadata.avatar_url" class="w-32 rounded-full" />
      <h1>{{ userState.user?.user_metadata.full_name }}</h1>
      <h1>@{{ userState.profiles?.username }}</h1>
      <p>{{ userState.profiles?.introduction }}</p>
      <ul>
        <li v-for="link in userState.profiles?.links">
          {{ link }}
        </li>
      </ul>
      <h1>{{ userState.profiles }}</h1>
    </div>

    <div class="mt-6">
      <h1>Timeline</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userState } from "@/store"
</script>
