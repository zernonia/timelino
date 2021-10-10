<template>
  <section class="w-screen h-screen">
    <div class="p-8 flex flex-col items-center">
      <img class="mt-8 md:mt-16 w-32 md:w-40" :src="Logo" alt="" />
      <h1 class="mt-4 md:mt-8 text-blue-700 font-bold text-4xl md:text-5xl text-center">Timelino</h1>
      <h2 class="mt-2 text-gray-400 md:text-lg">— Twitter without toxic and negativity —</h2>
      <div class="flex flex-col md:flex-row mt-8">
        <div class="w-full lg:w-96 h-full bg-blue-700 p-8 rounded-2xl mb-4 md:mb-0 md:mr-4">
          <h3 class="text-white font-bold text-2xl md:text-3xl">For Creator</h3>
          <ul class="mt-4 text-white">
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 mt-0.5"></i-mdi:check>
              Showcase your work
            </li>
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 mt-0.5"></i-mdi:check>
              No comment system
            </li>
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 mt-0.5"></i-mdi:check>
              Easy category collection
            </li>
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 mt-0.5"></i-mdi:check>
              Editable timeline
            </li>
          </ul>
          <button @click="$router.push({ name: 'login' })" class="btn btn-white mt-4">Join us</button>
        </div>
        <div class="w-full lg:w-96 h-full bg-opacity-50 bg-blue-200 p-8 rounded-2xl">
          <h3 class="text-blue-700 font-bold text-2xl md:text-3xl">For Follower</h3>
          <ul class="mt-4 text-blue-900">
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 mt-0.5"></i-mdi:check>
              Follow your creator
            </li>
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 mt-0.5"></i-mdi:check>
              Filter interested category
            </li>
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 mt-0.5"></i-mdi:check>
              Ads-free
            </li>
            <li class="flex items-start py-1 opacity-50">
              <i-mdi:check class="mr-2 mt-0.5"></i-mdi:check>
              Get notified with new content (soon)
            </li>
          </ul>
          <button @click="$router.push({ name: 'login' })" class="btn btn-white mt-4">Sign me up!</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Logo from "@/assets/logo.png"
</script>
