<template>
  <draggable
    v-model="items"
    :options="options"
    item-key="id"
    class="menu-item"
    :class="menuItemClass"
    handle=".handle"
    :group="{ name: 'g1' }"
    @start="handleStart"
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
            selected: activeMenuItem?.id === element.id,
          }"
        >
          <div
            class="header-l ellipsis"
            @click="handleHeader(element, index, $event)"
          >
            <!-- {{ index }}-{{ element.id }}-{{ element.extra.targetId }} -->
            <span>
              <q-icon
                :name="element.extra.isSpace ? 'chevron_right' : ''"
                class="space-arrow text-xl -mt-.5"
                :class="{
                  opened: checkSpaceOpened(element),
                }"
              />
            </span>
            {{ element.label || '无标题文档' }}

            <!-- <q-tooltip anchor="center right" self="center left">
              {{ element.label || '无标题文档' }}
            </q-tooltip> -->
          </div>

          <div class="header-r">
            <menu-tree-btns :node="element" />
          </div>
        </div>

        <div v-show="checkSpaceOpened(element)">
          <div class="pl-5 children" v-if="element.extra.isSpace">
            <menu-item
              v-model="element.children"
              :class="{
                empty: !element.children.length,
              }"
              :isSpace="element.extra.isSpace"
            ></menu-item>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <template v-if="props.isSpace"> </template>
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
  isSpace: boolean;
}>();
const emits = defineEmits<{
  (event: 'update:modelValue', data: any): void;
}>();
const options = ref({
  group: 'nested',
  animation: 150,
});

const activeMenuItem = inject<TreeNode>('activeMenuItem');
const changeActiveMenuItem = inject<(item: TreeNode) => void>(
  'changeActiveMenuItem',
)!;

const isDragging = inject<Ref<boolean>>('isDragging')!;
const changeDragging = inject<(bol: boolean) => void>('changeDragging')!;

const openedSpaceItems = inject<Ref<TreeNode[]>>('openedSpaceItems')!;
const changeOpenedSpaceItems = inject<(t: TreeNode) => void>(
  'changeOpenedSpaceItems',
)!;

const items = ref(props.modelValue);

const menuItemClass = computed(() => {
  return {
    dragging: isDragging.value,
  };
});
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

function handleStart() {
  changeDragging(true);
}

async function handleEnd(e: any) {
  const { item } = e;
  const menuId = +item.getAttribute('data-menu-id');
  menuService.move(menuId);
  changeDragging(false);
}

function handleHeader(item: TreeNode, index: number, e: PointerEvent) {
  const { extra } = item;
  changeActiveMenuItem(item);

  if (extra.isDoc) {
    if (e.altKey) {
      menuService.openSecondDoc$.next(extra);
    } else {
      menuService.openDoc$.next(extra);
    }
  } else {
    changeOpenedSpaceItems(item);
  }
}

function checkSpaceOpened(item: TreeNode) {
  return openedSpaceItems.value.some((t) => t.id === item.id);
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: 100%;
  transition: all 0.1s;
  &.dragging {
    min-height: 50px;
    padding-bottom: 40px;
    border: 1px dashed;
    // border-left: none;
    // border-right: none;
    margin: 1px 0;
  }
  .wrap {
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
        border: none;
      }
    }
    &-l {
      flex: 1;
      border-bottom: 1px solid #f0efef;
      width: 0;
      .space-arrow {
        transition: all 0.2s;
        &.opened {
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
      min-height: 50px;
      &::before {
        content: '空空如也';
        display: block;
        color: grey;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
      }
    }
  }
}
</style>
