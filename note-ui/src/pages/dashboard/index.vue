<template>
  <q-layout view="hHh LpR fFf">
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div class="h-full flex flex-col">
        <user-info-card />
        <q-scroll-area class="flex-1">
          <menu-scroll-view :menus="menus" />
        </q-scroll-area>
      </div>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <q-btn @click="toggleLeftDrawer"> 收起 </q-btn>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { MenuList } from 'interfaces/menu.interface';
import UserInfoCard from './components/UserInfoCard.vue';
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

onMounted(() => {
  init();
});
const menus = ref<MenuList>([]);
async function init() {
  const res = await menuApi.get();
  menus.value = res;
}
</script>
