<template>
  <q-splitter class="h-full" v-model="splitterModel" :limits="[0, 50]">
    <template #before>
      <div class="h-full overflow-hidden flex flex-col">
        <header>header</header>
        <main class="flex-1">
          <menu-view />
        </main>
        <footer class="flex flex-col p-2">
          <q-btn dense class="mb-2" @click="noticeCreateSpace">
            新建空间
          </q-btn>
          <q-btn dense @click="noticeCreateDoc"> 新建文档 </q-btn>
        </footer>
      </div>
    </template>

    <template v-slot:separator>
      <div class="flex flex-col -mt-20">
        <q-icon
          size="md"
          class="cursor-pointer"
          @click="handleLeftSplitter"
          :name="toggleIcon"
        >
        </q-icon>
      </div>
    </template>

    <template #after>
      <div class="h-full">
        <menu-tree />
        <!-- <Welcome v-if="isShowWelcome" />
        <content-split-view @content-null="handleContentNull" v-else /> -->
      </div>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import MenuTree from './components/MenuTree.vue';
import MenuView from 'components/MenuView/index.vue';
import menuService from './menu.service';
import { DocSubject } from 'interfaces/menu.interface';
import Welcome from './components/Welcome.vue';
import ContentSplitView from './components/ContentSplitView.vue';
import { merge } from 'rxjs';

const isShowWelcome = ref(true);

merge(menuService.openDoc$).subscribe((res: DocSubject) => {
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

function noticeCreateDoc() {
  menuService.notifyCreateDoc();
}

function handleContentNull() {
  isShowWelcome.value = true;
}
</script>

<style>
pre {
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
}
.string {
  color: green;
}
.number {
  color: darkorange;
}
.boolean {
  color: blue;
}
.null {
  color: magenta;
}
.key {
  color: red;
}
</style>
