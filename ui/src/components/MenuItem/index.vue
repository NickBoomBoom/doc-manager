<template>
  <draggable
    v-model="items"
    :options="options"
    item-key="id"
    class="menu-item"
    handle=".header-r"
    :group="{ name: 'g1' }"
    @end="handleEnd"
  >
    <template #item="{ element, index }">
      <div
        class="wrap"
        :class="{
          doc: element.extra.isDoc,
          space: element.extra.isSpace,
        }"
      >
        <div class="header">
          <div class="header-l ellipsis">
            {{ index }}
            {{ element.label || '无标题文档' }}
          </div>

          <div class="header-r">move</div>
        </div>
        <div class="pl-5 children" v-if="element.extra.isSpace">
          <menu-item
            v-model="element.children"
            :class="{
              empty: element.extra.isSpace && !element.children?.length,
            }"
          ></menu-item>
        </div>
      </div>
    </template>
  </draggable>
</template>
<script setup lang="ts">
import { TreeNode } from 'interfaces/menu.interface';
import draggable from 'vuedraggable';
const props = defineProps<{
  modelValue: TreeNode[];
}>();

const emits = defineEmits<{
  (event: 'update:modelValue', data: any): void;
}>();
const options = ref({
  group: 'nested',
  animation: 150,
});

const items = ref(props.modelValue);

watch(
  items,
  (v) => {
    emits('update:modelValue', v);
  },
  {
    deep: true,
  },
);

function handleEnd(...args) {
  console.log('end', args);
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: 100%;
  .wrap {
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    background: white;
  }
  .doc {
  }
  .space {
  }
  .header {
    padding: 4px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    cursor: pointer;

    &-l {
      flex: 1;
      width: 0;
    }

    &-r {
      margin-left: 2em;
      cursor: move;
    }
  }
  .children {
  }
  .empty {
    position: relative;
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 5px;
      background: red;
    }
  }
}
</style>
