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
              @click="handleSelectNote(node.extra, $event)"
            >
              <!-- <q-icon :name="node.icon" /> -->
              <template v-if="node.extra.isSpace">
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
import menuService, { OpenSpace, TreeNode } from '../menu.service';
import MenuTreeBtns from './MenuTreeBtns.vue';
const treeRef = ref();

const loading = ref(false);
const selected = ref<number>();
const filter = ref('');
const filterRef = ref();
const menus = ref<TreeNode[]>([]);

function resetFilter() {
  filter.value = '';
  filterRef.value.focus();
}

function handleSelectNote(item: MenuItem, e: PointerEvent) {
  if (item.isNote) {
    selected.value = item.menuId;
    if (e.altKey) {
      menuService.openSecondNote$.next(item);
    } else {
      menuService.openNote$.next(item);
    }
  }
}

onMounted(() => {
  init();
});
async function init() {
  menuService.menus$.subscribe((res) => {
    menus.value = cloneDeep(res);
  });

  menuService.openSpace$.subscribe((res: OpenSpace) => {
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
