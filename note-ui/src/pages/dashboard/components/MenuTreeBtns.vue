<template>
  <template v-if="node.extra.isCategory">
    <q-menu v-if="isContext" touch-position context-menu :offset="[0, 4]">
      <q-list dense>
        <q-item
          clickable
          v-close-popup
          v-for="item in categoryBtns"
          :key="item.title"
          @click="item.handler(node)"
          class="flex items-center"
        >
          <q-icon :name="item.icon" size="sm" class="mr-1" />
          {{ item.title }}
        </q-item>
      </q-list>
    </q-menu>
    <q-btn v-else flat dense @click.stop icon="more_horiz">
      <q-menu anchor="bottom right" self="top right" :offset="[0, 4]">
        <q-list dense>
          <q-item
            clickable
            v-close-popup
            v-for="item in categoryBtns"
            :key="item.title"
            @click="item.handler(node)"
            class="flex items-center"
          >
            <q-icon :name="item.icon" size="sm" class="mr-1" />
            {{ item.title }}
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </template>
  <template v-if="node.extra.isNote">
    <q-menu v-if="isContext" touch-position context-menu :offset="[0, 4]">
      <q-list dense>
        <q-item
          clickable
          v-close-popup
          v-for="item in noteBtns"
          :key="item.title"
          @click="item.handler(node)"
          class="flex items-center"
        >
          <q-icon :name="item.icon" size="sm" class="mr-1" />
          {{ item.title }}
        </q-item>
      </q-list>
    </q-menu>
    <q-btn v-else flat dense @click.stop icon="more_horiz">
      <q-menu anchor="bottom right" self="top right" :offset="[0, 4]">
        <q-list dense>
          <q-item
            clickable
            v-close-popup
            v-for="item in noteBtns"
            :key="item.title"
            @click="item.handler(node)"
            class="flex items-center"
          >
            <q-icon :name="item.icon" size="sm" class="mr-1" />
            {{ item.title }}
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </template>
</template>
<script setup lang="ts">
import menuService, { TreeNode } from '../menu.service';

const props = defineProps<{
  node: TreeNode;
  type: 'context' | 'btn';
}>();

const node = computed(() => props.node);

const isContext = computed(() => {
  return props.type === 'context';
});
const categoryBtns = [
  {
    title: '打包下载',
    icon: 'browser_updated',
    handler: handleDownloadByCategory,
  },

  {
    title: '添加分类',
    icon: 'create_new_folder',
    handler: (e: TreeNode) => menuService.createCategory(e),
  },
  {
    title: '修改分类',
    icon: 'title',
    handler: (e: TreeNode) => menuService.updateCategory(e),
  },
  {
    title: '添加笔记',
    icon: 'post_add',
    handler: (e: TreeNode) => menuService.notifyCreateNote(e),
  },
  {
    title: '删除分类',
    icon: 'delete',
    handler: (e: TreeNode) => menuService.deleteCategory(e),
  },
];

const noteBtns = [
  {
    title: '分享',
    icon: 'share',
    handler: handleDownloadByCategory,
  },
  {
    title: '下载笔记',
    icon: 'sim_card_download',
    handler: handleDownloadByCategory,
  },
  {
    title: '删除笔记',
    icon: 'delete',
    handler: handleDownloadByCategory,
  },
];

function handleDownloadByCategory(item: TreeNode) {
  console.log(item);
}
</script>
