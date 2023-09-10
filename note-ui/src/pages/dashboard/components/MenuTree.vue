<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center">
      <q-input
        ref="filterRef"
        dense
        dark
        v-model="filter"
        label="搜索"
        class="bg-grey-3 flex-1 text-black"
        standout="bg-white text-black"
        label-color="black"
      >
        <template #append>
          <q-icon
            v-if="!!filter"
            name="clear"
            class="cursor-pointer"
            @click="resetFilter"
          />
        </template>
      </q-input>
      <q-btn class="mx-1" dense icon="add">
        <q-menu anchor="bottom right" self="top right" :offset="[0, 4]">
          <q-list dense>
            <q-item
              clickable
              v-close-popup
              v-for="item in headerBtns"
              :key="item.title"
              @click="item.handler()"
              class="flex items-center"
            >
              <q-icon :name="item.icon" size="sm" class="mr-1" />
              {{ item.title }}
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <q-scroll-area class="flex-1 px-2">
      <q-tree
        ref="treeRef"
        :nodes="menus"
        node-key="id"
        :filter="filter"
        no-nodes-label=" "
        dense
         no-connectors
      >
        <template #default-header="{ node }">
          <div class="flex justify-between items-center w-full">
            <div
              class="flex-1 pr-6 flex items-center"
              :class="{
                'text-blue': node.extra.menuId === selected,
                'cursor-pointer': node.extra.isNote,
              }"
              @click="node.extra.isNote && handleSelectNote(node.extra)"
            >
              <!-- <q-icon :name="node.icon" /> -->
              <template v-if="node.extra.isCategory">
                {{ node.extra.data.name }}
              </template>
              <span v-if="node.extra.isNote">
                {{ node.extra.data.title }}
              </span>

              <menu-tree-btns :node="node" type="context" />
            </div>

            <menu-tree-btns :node="node" type="btn" />
          </div>
        </template>
      </q-tree>
    </q-scroll-area>

    <q-inner-loading :showing="loading">
      <q-spinner-hourglass size="xl" color="primary" />
      <div class="mt-2 text-primary">时间换空间</div>
    </q-inner-loading>
  </div>
</template>
<script setup lang="ts">
import { MenuItem } from 'interfaces/menu.interface';
import { cloneDeep } from 'lodash-es';
import menuService, { OpenCategory, TreeNode } from '../menu.service';
import MenuTreeBtns from './MenuTreeBtns.vue';
const treeRef = ref();
const emits = defineEmits<{
  (e: 'selectNote', noteId: number): void;
}>();
const headerBtns = [
  {
    title: '添加分类',
    icon: 'create_new_folder',
    handler: () => menuService.createCategory(),
  },
  {
    title: '添加笔记',
    icon: 'post_add',
    handler: () => {
      selected.value = undefined;
      menuService.notifyCreateNote();
    },
  },
];
const loading = ref(false);
const selected = ref<number>();
const filter = ref('');
const filterRef = ref();
const menus = ref<TreeNode[]>([]);

function resetFilter() {
  filter.value = '';
  filterRef.value.focus();
}

function handleSelectNote(item: MenuItem) {
  selected.value = item.menuId;
  emits('selectNote', item.targetId);
}

onMounted(() => {
  init();
});
async function init() {
  menuService.menus$.subscribe((res) => {
    menus.value = cloneDeep(res);
  });

  menuService.openCategory$.subscribe((res: OpenCategory) => {
    setTimeout(() => {
      treeRef.value.setExpanded(res.node.id, true);
    });
  });
  loading.value = true;
  menuService
    .load()
    .subscribe()
    .add(() => {
      loading.value = false;
    });
}
</script>
