<template>
  <q-layout view="lHr LpR lFr">
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="leftDrawerWidth"
    >
      <div class="h-full flex flex-col">
        <header></header>
        <div class="flex-1">
          <menu-tree />
        </div>
        <footer></footer>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="relative h-screen">
        <top-float-btns @left="toggleLeftDrawer" />
        <q-scroll-area class="relative h-full">
          <tab-view />
        </q-scroll-area>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import TabView from './components/TabView.vue';
import MenuTree from './components/MenuTree.vue';
import TopFloatBtns from './components/TopFloatBtns.vue';
const leftDrawerOpen = ref(false);
const leftDrawerWidth = ref();

handleResize();
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function handleResize() {
  let width = 450;
  const winWidth = window.innerWidth;
  if (winWidth < width) {
    width = winWidth * 0.9;
  }
  leftDrawerWidth.value = width;
}
</script>
