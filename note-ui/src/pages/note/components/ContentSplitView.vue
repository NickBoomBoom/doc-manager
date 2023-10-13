<template>
  <div class="h-full">
    <q-splitter
      class="h-full"
      :modelValue="splitterModel"
      after-class="!overflow-unset"
      :limits="[40, 60]"
      :separator-class="{
        invisible: !afterNoteId,
      }"
    >
      <template #before>
        <TextEditor :note-id="beforeNoteId" />
      </template>

      <template v-slot:separator>
        <q-btn dense round icon="drag_indicator" class="bg-white"></q-btn>
      </template>

      <template #after>
        <div v-if="afterNoteId" class="h-full relative">
          <q-btn
            dense
            class="absolute top-2 right-1 z-12 bg-white"
            @click="closeSecondView"
            icon="close"
          ></q-btn>
          <TextEditor :note-id="afterNoteId" />
        </div>
      </template>
    </q-splitter>
  </div>
</template>
<script setup lang="ts">
import menuService, { NoteSubject, SecondNoteSubject } from '../menu.service';
import { MenuItem } from 'interfaces/menu.interface';
import TextEditor from './TextEditor.vue';
const emits = defineEmits<{
  (event: 'contentNull'): void;
}>();
const splitterModel = ref(100);
const beforeNoteId = ref();
const afterNoteId = ref();

menuService.deleteNote$.subscribe((res: MenuItem) => {
  const { targetId } = res;
  if (beforeNoteId.value === targetId) {
    beforeNoteId.value = undefined;
    if (!afterNoteId.value) {
      emits('contentNull');
    }
  }
  if (afterNoteId.value === targetId) {
    closeSecondView();
  }
});

menuService.openNote$.subscribe((res: NoteSubject) => {
  res && getDetail(res, 'before');
});

menuService.openSecondNote$.subscribe((res: SecondNoteSubject) => {
  if (!res) {
    return;
  }
  if (res.targetId === beforeNoteId.value) {
    return;
  }
  if (!beforeNoteId.value) {
    getDetail(res, 'before');
  } else {
    getDetail(res, 'after');
  }
});

async function getDetail(item: MenuItem, type: 'before' | 'after') {
  const isBefore = type === 'before';
  const isAfter = type === 'after';
  if (isBefore) {
    beforeNoteId.value = item.targetId;
  } else if (isAfter) {
    afterNoteId.value = item.targetId;
    if (splitterModel.value === 100) {
      splitterModel.value = 50;
    }
  }
}

function closeSecondView() {
  afterNoteId.value = undefined;
  splitterModel.value = 100;
}
</script>
