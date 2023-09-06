<template>
  <div>
    <q-list bordered>
      <q-expansion-item
        v-for="item in props.menus"
        :key="item.menuId"
        :hide-expand-icon="item.isNote"
      >
        <template v-slot:header>
          <div class="flex-1 flex items-center">
            <q-icon v-if="item.isNote" name="description" />
            <q-icon v-if="item.isCategory" name="subject" />
            {{ getLabel(item) }}
          </div>
        </template>

        <template v-if="item.isCategory">
          <menu-scroll-view
            v-if="item.children?.length"
            :menus="item.children"
          />
          <div v-else>添加</div>
        </template>
      </q-expansion-item>
    </q-list>
  </div>
</template>
<script setup lang="ts">
import { MenuList, MenuItem } from 'interfaces/menu.interface';

const props = defineProps<{
  menus: MenuList;
}>();
function getLabel(item: MenuItem) {
  const { isNote, isCategory, data } = item;

  if (isNote) {
    return data.title;
  }

  if (isCategory) {
    return data.name;
  }
}
</script>
