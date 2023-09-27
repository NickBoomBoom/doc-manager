<template>
  <q-splitter class="h-full" v-model="splitterModel" :limits="[0, 50]">
    <template #before>
      <div class="h-full overflow-hidden flex flex-col">
        <header>header</header>
        <main class="relative h-full flex-1">
          <menu-tree />
        </main>
        <footer class="flex flex-col p-2">
          <q-btn dense class="mb-2" @click="noticeCreateSpace">
            新建空间
          </q-btn>
          <q-btn dense @click="noticeCreateNote"> 新建笔记 </q-btn>
        </footer>
      </div>
    </template>

    <template v-slot:separator>
      <div class="flex flex-col -mt-20">
        <q-btn
          dense
          round
          :icon="toggleIcon"
          class="bg-white"
          @click="handleLeftSplitter"
        />
      </div>
    </template>

    <template #after>
      <div class="h-full">
        <Welcome v-if="isShowWelcome" />
        <content-split-view @content-null="handleContentNull" v-else />
      </div>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import MenuTree from './components/MenuTree.vue';
import menuService, { NoteSubject } from './menu.service';
import Welcome from './components/Welcome.vue';
import ContentSplitView from './components/ContentSplitView.vue';
import { merge } from 'rxjs';

const isShowWelcome = ref(true);

merge(menuService.openNote$).subscribe((res: NoteSubject) => {
  res && (isShowWelcome.value = false);
});

const LEFT_WITH_PERCENT = 20;

const splitterModel = ref(LEFT_WITH_PERCENT);

const toggleIcon = computed(() => {
  if (splitterModel.value) {
    return 'arrow_circle_left';
  }
  return 'arrow_circle_right';
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

function handleContentNull() {
  isShowWelcome.value = true;
}
</script>
