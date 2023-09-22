<template>
  <q-splitter class="h-full" v-model="splitterModel" :limits="[0, 50]">
    <template #before>
      <div class="h-full overflow-hidden flex flex-col">
        <header>header</header>
        <div class="relative h-full flex-1">
          <menu-tree />
        </div>
        <footer class="flex flex-col p-2">
          <q-btn dense class="mb-2" @click="noticeCreateSpace">
            新建空间
          </q-btn>
          <q-btn dense @click="noticeCreateNote"> 新建笔记 </q-btn>
        </footer>
      </div>
    </template>
    <template #after>
      <div class="h-full">
        <q-btn
          dense
          :icon="toggleIcon"
          class="absolute top-1 left-3 z-12"
          @click="handleLeftSplitter"
        />
        <Welcome v-if="isShowWelcome" />
        <content-split-view />
      </div>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import MenuTree from './components/MenuTree.vue';
import menuService from './menu.service';
import Welcome from './components/Welcome.vue';
import ContentSplitView from './components/ContentSplitView.vue';

const isShowWelcome = ref(true);
menuService.openNote$.subscribe((e) => {
  console.log(32344, e);
  isShowWelcome.value = false;
});

const LEFT_WITH_PERCENT = 20;

const splitterModel = ref(LEFT_WITH_PERCENT);

const toggleIcon = computed(() => {
  if (splitterModel.value) {
    return 'menu_open';
  }
  return 'menu';
});

function handleLeftSplitter() {
  splitterModel.value = splitterModel.value === 0 ? LEFT_WITH_PERCENT : 0;
}

function noticeCreateSpace() {
  menuService.createSpace();
}

function noticeCreateNote() {
  menuService.notifyCreateNote();
}
</script>
