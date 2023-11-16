<template>
  <menu-item v-if="menus.length" v-model="menus"></menu-item>
</template>
<script setup lang="ts">
import draggable from 'vuedraggable';
import { DocSubject, SpaceSubject, TreeNode } from 'interfaces/menu.interface';
import { cloneDeep, isEqual } from 'lodash-es';
import menuService from 'pages/doc/menu.service';
import MenuTreeBtns from 'pages/doc/components/MenuTreeBtns.vue';
const loading = ref(false);

const options = ref({
  group: 'nested',
  animation: 150,
});
const menus = ref<TreeNode[]>([]);
onMounted(() => {
  init();
});
watch(
  menus,
  (v) => {
    console.error('menu-view change ');
    const isSame = isEqual(v, menuService.menus$.value);
    if (!isSame) {
      menuService.menus$.next(cloneDeep(v));
    }
  },
  {
    deep: true,
  },
);
async function init() {
  menuService.menus$.subscribe((res) => {
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
