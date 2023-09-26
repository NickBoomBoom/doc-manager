<template>
  <q-scroll-area ref="scrollViewRef" class="h-full px-5" @scroll="handleScroll">
    <q-input
      input-class="text-2xl font-bold"
      v-model="detail.title"
      :debounce="500"
      placeholder="标题"
      @update:model-value="handleTitleChange"
    />
    <editor
      v-model="detail.content"
      class="h-full"
      @init="handleInitEditor"
      @save="handleSave"
    />
  </q-scroll-area>

  <q-inner-loading :showing="loading">
    <q-spinner-cube size="xl" color="primary" :thickness="20" />
    <div class="mt-2 text-primary">每天一记,勤劳又聪明...</div>
  </q-inner-loading>
</template>

<script setup lang="ts">
import { Note } from 'interfaces/note.interface';
import menuService from '../menu.service';
const props = defineProps<{
  noteId?: number;
}>();
const loading = ref(false);
const detail = ref<Note>({
  title: '',
  content: '',
  spaceId: null,
});
const scrollTop = ref(0);
const scrollViewRef = ref();

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
    return;
  }
  try {
    loading.value = true;
    scrollTop.value = 0;
    const res = await noteApi.get(props.noteId);
    detail.value = res;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
function handleScroll(info: any) {
  scrollTop.value = info.verticalPosition;
}

function handleInitEditor() {
  scrollViewRef.value?.setScrollPosition('vertical', scrollTop.value);
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
