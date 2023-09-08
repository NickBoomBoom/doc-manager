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
        <user-info-card />
        <div class="flex-1 flex flex-col">
          <header></header>
          <div class="flex-1">
            <menu-tree @selectNote="handleNoteSelect" />
          </div>
          <footer></footer>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="relative h-screen">
        <q-btn
          dense
          round
          icon="menu"
          color="white"
          text-color="black"
          class="absolute top-1 left-3 z-12"
          @click="toggleLeftDrawer"
        />
        <q-btn
          dense
          round
          color="white"
          text-color="black"
          icon="more_vert"
          class="absolute top-1 right-3 z-12"
        />
        <q-scroll-area class="relative h-full">
          <NoteEdit :noteId="currentNoteId" />
        </q-scroll-area>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import NoteEdit from './components/NoteEdit.vue';
import UserInfoCard from './components/UserInfoCard.vue';
import MenuTree from './components/MenuTree.vue';
const leftDrawerOpen = ref(false);
const leftDrawerWidth = ref(500);
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

function handleResize() {
  let width = 500;
  const winWidth = window.innerWidth;
  if (winWidth < width) {
    width = winWidth * 0.9;
  }
  leftDrawerWidth.value = width;
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const currentNoteId = ref<number>();
function handleNoteSelect(e: number) {
  currentNoteId.value = e;
}
</script>
