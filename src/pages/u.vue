<template>
  <div class="my-8 sm:my-16 w-full flex justify-center">
    <router-view :key="$route.params.username"></router-view>
  </div>
</template>
