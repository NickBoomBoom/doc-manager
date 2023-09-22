<template>
  <div v-if="isShow" class="pt-10 px-4 h-full">
    <q-splitter
      class="h-full"
      :modelValue="splitterModel"
      after-class="!overflow-unset"
      :separator-class="{
        invisible: !afterDetail,
      }"
    >
      <template #before>
        <q-scroll-area
          ref="beforeScrollRef"
          class="h-full"
          @scroll="handleBeforeScroll"
        >
          <editor
            v-model="beforeDetail.content"
            class="h-full"
            @init="initBeforeScroll"
          />
        </q-scroll-area>

        <q-inner-loading :showing="beforeLoading">
          <q-spinner-hourglass size="xl" color="primary" />
          <div class="mt-2 text-primary">搬砖中...</div>
        </q-inner-loading>
      </template>
      <template #after>
        <div v-if="afterDetail" class="h-full relative">
          <q-btn
            dense
            class="absolute -top-8 right-0 z-10"
            @click="closeAfter"
            icon="close"
          ></q-btn>
          <q-scroll-area
            ref="afterScrollRef"
            class="h-full"
            @scroll="handleAfterScroll"
          >
            <editor v-model="afterDetail.content" @init="initAfterScroll" />
          </q-scroll-area>

          <q-inner-loading :showing="afterLoading">
            <q-spinner-hourglass size="xl" color="primary" />
            <div class="mt-2 text-primary">搬砖中...</div>
          </q-inner-loading>
        </div>
      </template>
    </q-splitter>
  </div>
</template>
<script setup lang="ts">
import menuService from '../menu.service';
import { MenuItem } from 'interfaces/menu.interface';
const isShow = ref(false);
const splitterModel = ref(100);
menuService.createNote$.subscribe((node: any | undefined) => {
  console.log(555, node);
});

menuService.openNote$.subscribe((res: MenuItem) => {
  getDetail(res, 'before');
});

menuService.openSecondNote$.subscribe((res: MenuItem) => {
  if (res.targetId === beforeDetail.value?.id) {
    return;
  }
  if (!beforeDetail.value) {
    getDetail(res, 'before');
  } else {
    getDetail(res, 'after');
  }
});

const beforeLoading = ref(false);
const beforeScrollRef = ref();
const beforeDetail = ref<any>();
const beforeDetailScrollTop = ref(0);

const afterLoading = ref(false);
const afterScrollRef = ref();
const afterDetail = ref<any>();
const afterDetailScrollTop = ref(0);

async function getDetail(item: MenuItem, type: 'before' | 'after') {
  try {
    const isBefore = type === 'before';
    const isAfter = type === 'after';
    beforeLoading.value = isBefore;
    afterLoading.value = isAfter;
    const res = await noteApi.get(item.targetId);
    if (isBefore) {
      beforeDetail.value = res;
    }
    if (isAfter) {
      afterDetail.value = res;
      if (splitterModel.value === 100) {
        splitterModel.value = 50;
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    isShow.value = true;
    beforeLoading.value = false;
    afterLoading.value = false;
  }
}

function handleBeforeScroll(info) {
  beforeDetailScrollTop.value = info.verticalPosition;
}

function handleAfterScroll(info) {
  afterDetailScrollTop.value = info.verticalPosition;
}

function initBeforeScroll() {
  beforeScrollRef.value?.setScrollPosition(
    'vertical',
    beforeDetailScrollTop.value,
  );
}
function initAfterScroll() {
  afterScrollRef.value?.setScrollPosition(
    'vertical',
    afterDetailScrollTop.value,
  );
}

function closeAfter() {
  afterDetail.value = null;
  splitterModel.value = 100;
}
</script>
