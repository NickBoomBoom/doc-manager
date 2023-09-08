<template>
  <q-dialog v-model="show" persistent>
    <q-card bordered>
      <q-card-section>
        <q-form class="min-w-50" @submit="save">
          <q-input
            v-model.trim="params.name"
            label="分类名称 *"
            autofocus
            :rules="[(v) => !!v || '请填写分类名称']"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat dense label="取消" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { CategoryUpdate } from 'interfaces/category.interface';
import { MenuItem } from 'interfaces/menu.interface';
import menuService, { TreeNode } from '../menu.service';

const show = ref(false);
const emits = defineEmits<{
  (e: 'success', item: MenuItem): void;
}>();

const params = ref<CategoryUpdate>({
  name: '',
  parentId: null,
});

const loading = ref(false);

menuService.createCategory$.subscribe((treeNode?: TreeNode) => {
  console.log(333, treeNode);
  open(treeNode);
});

async function save() {
  try {
    loading.value = true;
    const res = await categoryApi.add(params.value);
    menuService.insert(res);
    emits('success', res);
    close();
    reset();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function reset() {
  params.value = {
    name: '',
    parentId: null,
  };
}
function open(treeNode?: TreeNode) {
  params.value.parentId = treeNode?.extra?.targetId;
  show.value = true;
}
function close() {
  show.value = false;
}

defineExpose({
  open,
  close,
});
</script>
