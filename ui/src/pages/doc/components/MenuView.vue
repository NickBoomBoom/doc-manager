<template>
  <div class="flex h-full flex-col">
    <q-scroll-area class="flex-1 pr-1" ref="scrollAreaRef">
      <menu-item
        v-if="menus.length"
        :modelValue="menus"
        :isSpace="true"
        class="!border-none"
        @update:modelValue="handleChange"
      ></menu-item>
    </q-scroll-area>
    <div class="flex flex-col p-2">
      <q-btn
        dense
        class="mb-2"
        label="新建空间"
        @click="!activeMenuItem && noticeCreateSpace()"
      >
        <template v-if="activeMenuItem">
          <q-menu touch-position auto-close>
            <q-list>
              <q-item dense clickable @click="noticeCreateSpace()">
                根目录创建
              </q-item>
              <q-item
                dense
                clickable
                @click="noticeCreateSpace(activeMenuItem)"
              >
                从【<b>{{ activeMenuItem.label }}</b
                >】创建
              </q-item>
            </q-list>
          </q-menu>
        </template>
      </q-btn>
      <q-btn
        dense
        label="新建文档"
        @click="!activeMenuItem && noticeCreateDoc()"
      >
        <template v-if="activeMenuItem">
          <q-menu touch-position auto-close>
            <q-list>
              <q-item dense clickable @click="noticeCreateDoc()">
                根目录创建
              </q-item>
              <q-item dense clickable @click="noticeCreateDoc(activeMenuItem)">
                从【<b>{{ activeMenuItem.label }}</b
                >】创建
              </q-item>
            </q-list>
          </q-menu>
        </template>
      </q-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
import { TreeNode } from 'interfaces/menu.interface';
import { cloneDeep, isEqual } from 'lodash-es';
import menuService from 'pages/doc/menu.service';
const menus = ref<TreeNode[]>([]);
const loading = ref(false);
const activeMenuItem = ref<TreeNode>();
const isDragging = ref(false);
const openedSpaceItems = ref<TreeNode[]>([]);
const scrollAreaRef = ref();

provide('activeMenuItem', activeMenuItem);
provide('changeActiveMenuItem', changeActiveMenuItem);
provide('isDragging', isDragging);
provide('changeDragging', changeDragging);

provide('openedSpaceItems', openedSpaceItems);
provide('changeOpenedSpaceItems', changeOpenedSpaceItems);

onMounted(() => {
  init();
});
function changeActiveMenuItem(item: TreeNode) {
  activeMenuItem.value = item;
}

function changeOpenedSpaceItems(item: TreeNode) {
  const index = openedSpaceItems.value.findIndex((t) => t.id === item.id);
  if (index >= 0) {
    openedSpaceItems.value.splice(index, 1);
  } else {
    openedSpaceItems.value.push(item);
  }
}

function changeDragging(bol: boolean) {
  isDragging.value = bol;
}

function handleChange(v) {
  const isSame = isEqual(v, menuService.menus$.value);
  if (!isSame) {
    menuService.updateMenus(cloneDeep(v));
  }
}

async function init() {
  menuService.menus$.subscribe((res: TreeNode[]) => {
    menus.value = cloneDeep(res);
  });

  loading.value = true;
  menuService
    .load()
    .subscribe()
    .add(() => {
      loading.value = false;
    });
}

function noticeCreateSpace(item?: TreeNode) {
  menuService.createSpace(item, scrollTo);
}

function noticeCreateDoc(item?: TreeNode) {
  menuService.createDoc(item, scrollTo);
}

function scrollTo(t: TreeNode) {
  setTimeout(() => {
    const el = document.querySelector(`[data-menu-id="${t.id}"]`);
    if (el) {
      changeActiveMenuItem(t);
      if (t.extra.isSpace) {
        changeOpenedSpaceItems(t);
      }
      setTimeout(() => {
        el.scrollIntoView();
      });
    }
  });
}
</script>
