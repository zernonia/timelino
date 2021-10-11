<template>
  <section class="w-full">
    <div class="p-8 flex flex-col items-center">
      <img class="mt-8 md:mt-16 w-28 md:w-32" :src="Logo" alt="" />
      <h1 class="mt-4 md:mt-8 text-blue-700 font-bold text-4xl md:text-5xl text-center">Timelino</h1>
      <div class="mt-2 text-gray-400 md:text-lg flex items-center flex-nowrap">
        <p>—</p>
        <p class="px-2 text-center">Twitter without toxic and negativity</p>
        <p>—</p>
      </div>
      <button @click="$router.push({ name: 'login' })" class="btn my-4">Join now</button>
      <img
        class="max-w-screen-md w-full mt-8 md:mt-18 rounded-2xl border-4 border-blue-700 shadow-2xl shadow-blue-700"
        :src="Intro"
        alt="timelino intro"
      />
    </div>
  </section>
  <section class="my-20 md:my-40 p-8 flex flex-col items-center">
    <div class="">
      <h1 class="text-blue-700 font-bold text-3xl md:text-4xl text-center">Features</h1>
    </div>
    <div class="">
      <div class="flex flex-col md:flex-row mt-8">
        <div class="w-full lg:w-96 h-full bg-blue-700 p-8 rounded-2xl mb-4 md:mb-0 md:mr-4">
          <h3 class="text-white font-bold text-2xl md:text-3xl">Create Story</h3>
          <ul class="mt-4 text-white">
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 flex-shrink-0 mt-0.5"></i-mdi:check>
              Showcase your work
            </li>
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 flex-shrink-0 mt-0.5"></i-mdi:check>
              No comment system
            </li>
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 flex-shrink-0 mt-0.5"></i-mdi:check>
              Easy category collection
            </li>
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 flex-shrink-0 mt-0.5"></i-mdi:check>
              Editable timeline
            </li>
          </ul>
          <button @click="$router.push({ name: 'login' })" class="btn btn-white mt-4">Join us</button>
        </div>
        <div class="w-full lg:w-96 h-full bg-opacity-50 bg-blue-200 p-8 rounded-2xl">
          <h3 class="text-blue-700 font-bold text-2xl md:text-3xl">Follow</h3>
          <ul class="mt-4 text-blue-900">
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 flex-shrink-0 mt-0.5"></i-mdi:check>
              Follow your creator
            </li>
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 flex-shrink-0 mt-0.5"></i-mdi:check>
              Filter interested category
            </li>
            <li class="flex items-start py-1">
              <i-mdi:check class="mr-2 flex-shrink-0 mt-0.5"></i-mdi:check>
              Ads-free
            </li>
            <li class="flex items-start py-1 opacity-50">
              <i-mdi:check class="mr-2 flex-shrink-0 mt-0.5"></i-mdi:check>
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
import Intro from "@/assets/intro.png"
</script>
