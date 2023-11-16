<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center">
      <q-input
        ref="filterRef"
        dark
        dense
        v-model="filter"
        label="搜索"
        class="bg-grey-3 flex-1 m-1"
        standout="bg-white text-black hover:bg-white "
        label-color="black"
        input-class=" text-black"
      >
        <template #append>
          <q-icon
            v-if="!!filter"
            name="clear"
            class="cursor-pointer text-black"
            @click="resetFilter"
          />
        </template>
      </q-input>
    </div>

    <q-scroll-area class="flex-1" content-style="left:0;right:0">
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
          <div class="flex items-center w-full">
            <div
              class="flex-1 flex items-center overflow-hidden"
              :class="{
                'text-blue': node.extra.menuId === selected,
                'cursor-pointer': node.extra.isDoc,
              }"
              @click="handleSelectDoc(node.extra, $event)"
            >
              <!-- <q-icon v-if="node.extra.isDoc" :name="node.icon" /> -->
              <span
                :class="{
                  'text-gray': !node.children?.length && node.extra.isSpace,
                }"
                class="text-truncate"
              >
                {{ node.label || '无标题文档' }}
                <q-tooltip anchor="center right" self="center left">
                  {{ node.label || '无标题文档' }}
                </q-tooltip>
              </span>
            </div>

            <div class="ml-4">
              <menu-tree-btns :node="node" />
            </div>
          </div>
        </template>
      </q-tree>
    </q-scroll-area>

    <q-inner-loading :showing="loading">
      <q-spinner-cube size="xl" color="primary" :thickness="10" />
      <div class="mt-2 text-primary">时间换空间</div>
    </q-inner-loading>
  </div>
</template>
<script setup lang="ts">
import {
  MenuItem,
  DocSubject,
  SpaceSubject,
  TreeNode,
} from 'interfaces/menu.interface';
import { cloneDeep } from 'lodash-es';
import menuService from '../menu.service';
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

function handleSelectDoc(item: MenuItem, e: PointerEvent) {
  if (item.isDoc) {
    if (e.altKey) {
      menuService.openSecondDoc$.next(item);
    } else {
      menuService.openDoc$.next(item);
    }
  }
}

onMounted(() => {
  init();
});
async function init() {
  menuService.menus$.subscribe((res) => {
    console.warn(res);
    menus.value = [];
    setTimeout(() => {
      menus.value = cloneDeep(res);
    }, 400);
  });

  // menuService.openDoc$.subscribe((res: DocSubject) => {
  //   res && (selected.value = res.menuId);
  // });

  // menuService.openSpace$.subscribe((res: SpaceSubject) => {
  //   if (res) {
  //     setTimeout(() => {
  //       treeRef.value.setExpanded(res.node.id, true);
  //     });
  //   }
  // });

  loading.value = true;
  menuService
    .load()
    .subscribe()
    .add(() => {
      loading.value = false;
    });
}
</script>
