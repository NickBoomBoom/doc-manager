<template>
  <!-- <q-layout view="lHr LpR lFr">
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="leftDrawerWidth"
    >
      <div class="h-full flex flex-col">
        <header></header>
        <div class="flex-1">
          <menu-tree />
        </div>
        <footer></footer>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="relative h-screen">
        <top-float-btns @left="toggleLeftDrawer" />
        <q-scroll-area class="relative h-full pt-10">

          <editor />
        </q-scroll-area>
      </div>
    </q-page-container>
  </q-layout> -->

  <q-splitter class="h-full" v-model="splitterModel" :limits="[0, 50]">
    <template #before>
      <div class="h-full overflow-hidden flex flex-col">
        <header>header</header>
        <q-scroll-area class="relative h-full flex-1 bg-red">
          <div class="bg-yellow" style="height: 200vh">before</div>
        </q-scroll-area>
        <footer>footer</footer>
      </div>
    </template>
    <template #after>
      <div class="bg-green h-full">
        <q-btn
          dense
          :icon="toggleIcon"
          class="absolute top-1 left-3 z-12"
          @click="handleLeftSplitter"
        />
      </div>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import TabView from './components/TabView.vue';
import MenuTree from './components/MenuTree.vue';

const LEFT_WITH_PERCENT = 20;

const splitterModel = ref(LEFT_WITH_PERCENT);

const toggleIcon = computed(() => {
  if (splitterModel.value) {
    return 'menu_open';
  }
  return 'menu';
});

function handleLeftSplitter() {
  splitterModel.value = splitterModel.value === 0 ? LEFT_WITH_PERCENT : 0;
}
</script>
