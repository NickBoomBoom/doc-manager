<template>
  <div>
    <div v-for="item in list" :key="item.id">
      {{ item.id }} - {{ item.name }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { Tag } from 'interfaces/tag.interface';

const list = ref<Tag[]>([]);
async function init() {
  try {
    list.value = await tagApi.all();
  } catch (error) {
    console.error(error);
  }
}
onMounted(init);
</script>
<style lang="scss" scoped></style>
