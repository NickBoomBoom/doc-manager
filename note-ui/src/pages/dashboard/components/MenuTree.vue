<template>
  <div class="h-full flex flex-col">
    <q-input
      ref="filterRef"
      dense
      v-model="filter"
      label="搜索"
      square
      standout="bg-primary text-white"
    >
      <template v-slot:append>
        <q-icon
          v-if="!!filter"
          name="clear"
          class="cursor-pointer"
          @click="resetFilter"
        />
      </template>
      <template #after>
        <q-btn-group>
          <q-btn
            dense
            color="primary"
            v-for="item in headerBtns"
            :key="item.title"
            @click.stop="item.handler()"
            :icon="item.icon"
          >
            <q-tooltip :offset="[0, 8]">
              {{ item.title }}
            </q-tooltip>
          </q-btn>
        </q-btn-group>
      </template>
    </q-input>

    <q-scroll-area class="flex-1">
      <q-tree
        ref="treeRef"
        :nodes="menus"
        node-key="id"
        :filter="filter"
        no-nodes-label=" "
      >
        <template #default-header="{ node }">
          <div class="flex justify-between items-center w-full">
            <div
              class="flex-1 pr-6"
              :class="{
                'text-blue': node.extra.menuId === selected,
              }"
            >
              {{ node.index }} {{ node.id }}
              <q-icon :name="node.icon" class="mr-1" />
              <template v-if="node.extra.isCategory">
                <span @click.stop>
                  {{ node.extra.data.name }}
                  <q-popup-edit
                    v-model.trim="node.extra.data.name"
                    v-slot="scope"
                    anchor="bottom end"
                    self="bottom left"
                    fit
                    :validate="validateCategoryName"
                    @hide="validateCategoryName"
                    @save="(nv, ov) => menuService.updateCategory(nv, ov, node)"
                  >
                    <q-input
                      v-model.trim="scope.value"
                      dense
                      hide-bottom-space
                      autofocus
                      :rules="[(v) => !!v || '不能为空']"
                      @keyup.enter="scope.set"
                      ><template v-slot:prepend>
                        <q-icon name="edit" size="xs" />
                      </template>
                    </q-input>
                  </q-popup-edit>
                </span>
              </template>
              <span
                v-if="node.extra.isNote"
                class="cursor-pointer"
                @click="handleSelectNote(node.extra)"
              >
                {{ node.extra.data.title }}
              </span>
            </div>

            <div>
              <template v-if="node.extra.isCategory">
                <q-btn-group>
                  <q-btn
                    v-for="item in categoryBtns"
                    :key="item.title"
                    round
                    size="xs"
                    @click.stop="item.handler(node)"
                    :icon="item.icon"
                  >
                    <q-tooltip :offset="[0, 8]">
                      {{ item.title }}
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </template>
              <template v-if="node.extra.isNote">
                <q-btn-group>
                  <q-btn
                    v-for="item in noteBtns"
                    :key="item.title"
                    round
                    size="xs"
                    @click.stop="item.handler(node)"
                    :icon="item.icon"
                  >
                    <q-tooltip :offset="[0, 8]">
                      {{ item.title }}
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </template>
            </div>
          </div>
        </template>
      </q-tree>
    </q-scroll-area>

    <q-inner-loading :showing="loading">
      <q-spinner-hourglass size="xl" color="primary" />
      <div class="mt-2 text-primary">时间换空间</div>
    </q-inner-loading>
  </div>
  <add-category-dialog />
</template>
<script setup lang="ts">
import { MenuList, MenuItem } from 'interfaces/menu.interface';
import AddCategoryDialog from './AddCategoryDialog.vue';
import { cloneDeep } from 'lodash-es';

import menuService, { OpenCategory, TreeNode } from '../menu.service';

const treeRef = ref();
const emits = defineEmits<{
  (e: 'selectNote', noteId: number): void;
}>();
const headerBtns = [
  {
    title: '添加分类',
    icon: 'create_new_folder',
    handler: handleAddCategory,
  },
  {
    title: '添加笔记',
    icon: 'post_add',
    handler: handleAddNote,
  },
];
const categoryBtns = [
  {
    title: '打包下载该分类下所有文章',
    icon: 'browser_updated',
    handler: handleDownloadByCategory,
  },

  {
    title: '添加分类',
    icon: 'create_new_folder',
    handler: handleAddCategory,
  },
  {
    title: '添加笔记',
    icon: 'post_add',
    handler: handleAddNote,
  },

  {
    title: '删除分类',
    icon: 'delete',
    handler: (e: TreeNode) => menuService.deleteCategory(e),
  },
];

const noteBtns = [
  {
    title: '下载笔记',
    icon: 'sim_card_download',
    handler: handleDownloadByCategory,
  },

  {
    title: '分享',
    icon: 'share',
    handler: handleDownloadByCategory,
  },

  {
    title: '删除笔记',
    icon: 'delete',
    handler: handleDownloadByCategory,
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
  emits('selectNote', item.menuId);
}

function handleDownloadByCategory(item: MenuItem) {
  console.log(item);
}

function validateCategoryName(val: any) {
  return !!val;
}

function handleAddCategory(node?: TreeNode) {
  menuService.notifyCreateCategory(node);
}

function handleAddNote(node?: TreeNode) {
  menuService.notifyCreateNote(node);
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
