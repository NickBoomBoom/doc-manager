<template>
  <q-inner-loading :showing="loading">
    <q-spinner-cube size="xl" color="primary" :thickness="20" />
    <div class="mt-2 text-primary">每天一记,勤劳又聪明...</div>
  </q-inner-loading>

  <q-scroll-area v-if="!loading" class="h-full px-3">
    <q-input
      input-class="text-2xl font-bold"
      v-model="detail.title"
      :debounce="500"
      placeholder="标题"
      @update:model-value="handleTitleChange"
    />
    <block-json-editor
      ref="editorRef"
      v-model="detail.content"
      :config="editorConfig"
    />
  </q-scroll-area>
</template>

<script setup lang="ts">
import { Note } from 'interfaces/note.interface';
import menuService from '../menu.service';
import BlockJsonEditor from 'block-json-editor';
import _ from 'lodash-es';
const props = defineProps<{
  noteId?: number;
}>();
const loading = ref(true);
const detail = ref<Note>({
  title: '',
  content: {},
  spaceId: null,
});
const editorRef = ref();
const editorConfig = {
  media: {
    config: {},
  },
};
watch(
  () => detail.value.content,
  _.debounce(() => {
    handleSave();
  }),
);

watch(
  () => props.noteId,
  () => {
    getDetail();
  },
  {
    immediate: true,
  },
);

async function getDetail() {
  if (!props.noteId) {
    detail.value = {
      title: '',
      content: {},
      spaceId: null,
    };
    return;
  }
  try {
    loading.value = true;
    const res = await noteApi.get(props.noteId);
    detail.value = res;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function handleTitleChange() {
  if (!detail.value.title) {
    detail.value.title = '新笔记';
  }
  menuService.updateNote(detail.value);
  handleSave();
}

async function handleSave() {
  noteApi.update(detail.value.id as number, detail.value);
}
</script>
