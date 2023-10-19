<template>
  <div class="flex h-screen">
    <nav-side />
    <div class="flex-1">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component
            v-if="$route.meta.keepAlive"
            :is="Component"
            :key="uniqKey"
          />
        </keep-alive>
        <component
          v-if="!$route.meta.keepAlive"
          :is="Component"
          :key="uniqKey"
        />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavSide from 'layouts/components/NavSide.vue';
const route = useRoute();
const uniqKey = computed(() => {
  return route.fullPath;
});
</script>
