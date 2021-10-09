<template>
  <div class="mt-16">
    <router-view :key="$route.params.username"></router-view>
  </div>
</template>
