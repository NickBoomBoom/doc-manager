<template>
  <div class="pt-20 px-4">
    {{ detail?.content }}
  </div>
</template>
<script setup lang="ts">
import menuService, { TreeNode } from '../menu.service';
const props = defineProps<{
  noteId: number | undefined;
}>();

menuService.createNote$.subscribe((node: TreeNode | undefined) => {
  console.log(555, node);
});
watch(
  () => props.noteId,
  (v) => {
    init();
  },
  {
    immediate: true,
  },
);

const detail = ref<any>();

async function init() {
  try {
    if (!props.noteId) {
      return;
    }
    detail.value = await noteApi.get(props.noteId);
  } catch (error) {
    console.error(error);
  } finally {
  }
}
</script>
