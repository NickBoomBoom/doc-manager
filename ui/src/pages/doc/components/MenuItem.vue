<template>
  <draggable
    v-model="items"
    :options="options"
    item-key="id"
    class="menu-item"
    handle=".handle"
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
          <div class="header-l ellipsis" @click="handleHeader(element, $event)">
            {{ index }}
            {{ element.label || '无标题文档' }}
          </div>

          <div class="header-r">
            <menu-tree-btns :node="element" />
          </div>
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
import MenuTreeBtns from './MenuTreeBtns.vue';
import menuService from '../menu.service';
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

function handleHeader(item: TreeNode, e: PointerEvent) {
  console.log(2222, item);
  const { extra } = item;
  if (extra.isDoc) {
    if (e.altKey) {
      menuService.openSecondDoc$.next(extra);
    } else {
      menuService.openDoc$.next(extra);
    }
  }
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
      q-icon {
        cursor: move;
      }
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
