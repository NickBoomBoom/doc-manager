<template>
  <div class="h-full">
    <q-splitter
      class="h-full"
      :modelValue="splitterModel"
      after-class="!overflow-unset"
      :limits="[40, 60]"
      :separator-class="{
        invisible: !afterDocId,
      }"
    >
      <template #before>
        <TextEditor :doc-id="beforeDocId" />
      </template>

      <template v-slot:separator>
        <q-btn dense round icon="drag_indicator" class="bg-white"></q-btn>
      </template>

      <template #after>
        <div v-if="afterDocId" class="h-full relative">
          <q-btn
            dense
            class="absolute top-2 right-1 z-12 bg-white"
            @click="closeSecondView"
            icon="close"
          ></q-btn>
          <TextEditor :doc-id="afterDocId" />
        </div>
      </template>
    </q-splitter>
  </div>
</template>
<script setup lang="ts">
import menuService, { DocSubject, SecondDocSubject } from '../menu.service';
import { MenuItem } from 'interfaces/menu.interface';
import TextEditor from './TextEditor.vue';
const emits = defineEmits<{
  (event: 'contentNull'): void;
}>();
const splitterModel = ref(100);
const beforeDocId = ref();
const afterDocId = ref();

menuService.deleteDoc$.subscribe((res: MenuItem) => {
  const { targetId } = res;
  if (beforeDocId.value === targetId) {
    beforeDocId.value = undefined;
    if (!afterDocId.value) {
      emits('contentNull');
    }
  }
  if (afterDocId.value === targetId) {
    closeSecondView();
  }
});

menuService.openDoc$.subscribe((res: DocSubject) => {
  res && getDetail(res, 'before');
});

menuService.openSecondDoc$.subscribe((res: SecondDocSubject) => {
  if (!res) {
    return;
  }
  if (res.targetId === beforeDocId.value) {
    return;
  }
  if (!beforeDocId.value) {
    getDetail(res, 'before');
  } else {
    getDetail(res, 'after');
  }
});

async function getDetail(item: MenuItem, type: 'before' | 'after') {
  const isBefore = type === 'before';
  const isAfter = type === 'after';
  if (isBefore) {
    beforeDocId.value = item.targetId;
  } else if (isAfter) {
    afterDocId.value = item.targetId;
    if (splitterModel.value === 100) {
      splitterModel.value = 50;
    }
  }
}

function closeSecondView() {
  afterDocId.value = undefined;
  splitterModel.value = 100;
}
</script>
