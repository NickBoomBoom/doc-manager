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
        :data-menu-id="element.id"
        :data-space-id="element.extra.isSpace ? element.extra.targetId : null"
        :class="{
          doc: element.extra.isDoc,
          space: element.extra.isSpace,
        }"
      >
        <div
          class="header"
          :class="{
            selected: activeMenuId === element.id,
          }"
        >
          <div
            class="header-l ellipsis"
            @click="handleHeader(element, index, $event)"
          >
            <!-- {{ element.id }}-{{ element.extra.targetId }} -->
            <span>
              <q-icon
                :name="element.extra.isSpace ? 'chevron_right' : ''"
                class="space-arrow text-xl -mt-.5"
                :class="{
                  active: showChildrenIndex.includes(index),
                }"
              />
            </span>
            {{ element.label || '无标题文档' }}

            <q-tooltip anchor="center right" self="center left">
              {{ element.label || '无标题文档' }}
            </q-tooltip>
          </div>

          <div class="header-r">
            <menu-tree-btns :node="element" />
          </div>
        </div>

        <div v-show="showChildrenIndex.includes(index)">
          <div class="pl-5 children" v-if="element.extra.isSpace">
            <menu-item
              v-model="element.children"
              :class="{
                empty: !element.children.length,
              }"
            ></menu-item>
          </div>
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
const activeMenuId = inject('activeMenuId');
const changeActiveMenuId = inject<(id: number) => void>('changeActiveMenuId');
const items = ref(props.modelValue);
const showChildrenIndex = ref<number[]>([]);

menuService.menus$.subscribe(() => {
  setTimeout(() => {
    items.value = props.modelValue;
  });
});
watch(
  items,
  (v) => {
    emits('update:modelValue', v);
  },
  {
    deep: true,
  },
);

async function handleEnd(e: any) {
  const { item } = e;
  const menuId = +item.getAttribute('data-menu-id');
  console.log('menuId =>', menuId);
  menuService.move(menuId);
}

function handleHeader(item: TreeNode, index: number, e: PointerEvent) {
  const { extra } = item;
  changeActiveMenuId(item.id);

  if (extra.isDoc) {
    if (e.altKey) {
      menuService.openSecondDoc$.next(extra);
    } else {
      menuService.openDoc$.next(extra);
    }
  } else {
    handleExpand(index);
  }
}

function handleExpand(i: number) {
  const index = showChildrenIndex.value.findIndex((t) => t === i);
  if (index >= 0) {
    showChildrenIndex.value.splice(index, 1);
  } else {
    showChildrenIndex.value.push(i);
  }
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: 100%;
  padding-bottom: 5px;
  .wrap {
    // border: 1px solid #e5e5e5;
    border-radius: 4px;
    background: white;
  }
  .doc {
  }
  .space {
  }
  .header {
    padding: 0 4px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    cursor: pointer;
    height: 33px;
    line-height: 33px;
    &.selected {
      background-color: #ecf0f1;
      .header-l {
        border-bottom: none;
      }
    }
    &-l {
      flex: 1;
      border-bottom: 1px solid #f0efef;
      width: 0;
      .space-arrow {
        transition: all 0.3s;
        &.active {
          transform: rotate(90deg);
        }
      }
    }

    &-r {
      margin-left: 1em;
      q-icon {
        cursor: move;
      }
    }
  }
  .children {
    .empty {
      position: relative;
      &::after {
        content: '空空如也';
        display: block;
        color: grey;
        // text-align: center;
        padding: 3px 0 3px 0.5rem;
      }
    }
  }
}
</style>
