<template>
  <div class="flex h-screen">
    <nav-side />
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavSide from 'layouts/components/NavSide.vue';
</script>
