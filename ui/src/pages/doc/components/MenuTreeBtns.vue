<template>
  <q-icon
    name="open_with"
    class="handle text-gray-300 hover:text-black cursor-move mr-1"
  />
  <template v-if="node.extra.isSpace">
    <q-btn
      flat
      dense
      @click.stop
      icon="more_horiz"
      class="text-gray-300 hover:text-black"
    >
      <q-menu anchor="bottom right" self="top right" auto-close>
        <q-btn-group>
          <q-btn
            v-close-popup
            dense
            v-for="item in spaceBtns"
            :key="item.title"
            @click="item.handler(node)"
            :icon="item.icon"
          >
            <q-tooltip>
              {{ item.title }}
            </q-tooltip>
          </q-btn>
        </q-btn-group>
      </q-menu>
    </q-btn>
  </template>
  <template v-if="node.extra.isDoc">
    <q-btn
      flat
      dense
      @click.stop
      icon="more_horiz"
      class="text-gray-300 hover:text-black"
    >
      <q-menu anchor="bottom right" self="top right" auto-close>
        <q-btn-group>
          <q-btn
            v-close-popup
            dense
            v-for="item in docBtns"
            :key="item.title"
            @click="item.handler(node)"
            :icon="item.icon"
          >
            <q-tooltip>
              {{ item.title }}
            </q-tooltip>
          </q-btn>
        </q-btn-group>
      </q-menu>
    </q-btn>
  </template>
</template>
<script setup lang="ts">
import { TreeNode } from 'interfaces/menu.interface';
import menuService from '../menu.service';

const props = defineProps<{
  node: TreeNode;
}>();
const BASE_SPACE_BTNS = [
  // {
  //   title: '打包下载',
  //   icon: 'browser_updated',
  //   handler: handleDownloadBySpace,
  // },

  {
    title: '新增空间',
    icon: 'create_new_folder',
    handler: (e: TreeNode) => menuService.createSpace(e),
  },
  {
    title: '编辑空间',
    icon: 'mode_edit',
    handler: (e: TreeNode) => menuService.updateSpace(e),
  },
  {
    title: '添加文档',
    icon: 'post_add',
    handler: (e: TreeNode) => menuService.createDoc(e),
  },
];
const DELETE_SPACE_BTN = {
  title: '删除空间',
  icon: 'delete',
  handler: (e: TreeNode) => menuService.deleteSpace(e),
};
const node = computed(() => props.node);
const spaceBtns = computed(() => {
  return [
    ...BASE_SPACE_BTNS,
    ...(props.node.children?.length ? [] : [DELETE_SPACE_BTN]),
  ];
});

const docBtns = [
  // {
  //   title: '分享',
  //   icon: 'share',
  //   handler: handleDownloadBySpace,
  // },
  // {
  //   title: '下载',
  //   icon: 'sim_card_download',
  //   handler: handleDownloadBySpace,
  // },
  {
    title: '删除',
    icon: 'delete',
    handler: (e: TreeNode) => menuService.deleteDoc(e),
  },
];

function handleDownloadBySpace(item: TreeNode) {
  console.log(item);
}
</script>
