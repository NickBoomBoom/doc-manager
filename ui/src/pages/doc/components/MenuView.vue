<template>
  <menu-item
    v-if="menus.length"
    :modelValue="menus"
    @update:modelValue="handleChange"
  ></menu-item>
</template>
<script setup lang="ts">
import { TreeNode } from 'interfaces/menu.interface';
import { cloneDeep, isEqual } from 'lodash-es';
import menuService from 'pages/doc/menu.service';
const loading = ref(false);
const activeMenuId = ref();

provide('activeMenuId', activeMenuId);
provide('changeActiveMenuId', changeActiveMenuId);

function changeActiveMenuId(id: number) {
  activeMenuId.value = id;
}
const menus = ref<TreeNode[]>([]);
onMounted(() => {
  init();
});

function handleChange(v) {
  const isSame = isEqual(v, menuService.menus$.value);
  console.warn('menu-view change', v, isSame);
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
</script>
