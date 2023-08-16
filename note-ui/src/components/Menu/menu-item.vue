<template>
  <div class="menu-item px-2" v-for="item in props.data" :key="item.id">
    <template v-if="item.type === 1">
      <n-collapse>
        <n-collapse-item>
          <template #header>
            <div class="flex items-center mr-1">
              <n-ellipsis line-clamp="1" :tooltip="{ placement: 'right' }">
                {{ item.name }}
              </n-ellipsis>
            </div>
          </template>
          <menu-item :data="item.children" />
          <template #header-extra>
            <n-tooltip v-for="item in categoryButtons" :key="item.tip" trigger="hover">
              {{ item.tip }}
              <template #trigger>
                <n-button text @click.stop>
                  <template #icon>
                    <n-icon>
                      <component :is="item.icon" />
                    </n-icon>
                  </template>
                </n-button>
              </template>
            </n-tooltip>
          </template>
        </n-collapse-item>
      </n-collapse>
    </template>
    <template v-else>
      <div class="flex justify-between items-center">
        <n-ellipsis line-clamp="1" class="mr-1" :tooltip="{ placement: 'right' }">
          {{ item.name }}
        </n-ellipsis>

        <div class="flex flex-nowrap">
          <n-tooltip v-for="item in noteButtons" :key="item.tip" trigger="hover">
            {{ item.tip }}
            <template #trigger>
              <n-button text>
                <template #icon>
                  <n-icon>
                    <component :is="item.icon" />
                  </n-icon>
                </template>
              </n-button>
            </template>
          </n-tooltip>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import {
  EditFilled,
  DeleteFilled,
  BookmarkAddFilled,
  PostAddFilled,
  LockFilled,
  LockOpenFilled,
  ShareFilled,
  DownloadFilled,
  FileUploadFilled
} from '@vicons/material'
const props = defineProps<{ data: any[] }>()

const categoryButtons = [
  {
    tip: '编辑分类',
    icon: EditFilled
  },
  {
    tip: '删除分类',
    icon: DeleteFilled
  },
  {
    tip: '添加分类',
    icon: BookmarkAddFilled
  },
  {
    tip: '添加文章',
    icon: PostAddFilled
  },
  {
    tip: '下载文章',
    icon: DownloadFilled
  },
  {
    tip: '上传文章',
    icon: FileUploadFilled
  }
]

const noteButtons = [
  {
    tip: '编辑',
    icon: EditFilled
  },
  {
    tip: '删除',
    icon: DeleteFilled
  },
  {
    tip: '分享',
    icon: ShareFilled
  },
  {
    tip: '下载',
    icon: DownloadFilled
  }
]

console.log(1111, props.data)
</script>
<style lang="less">
.menu-item {
  .n-collapse-item__content-inner {
    padding-top: 0 !important;
    padding-left: 20px;
  }
  .n-collapse .n-collapse-item .n-collapse-item {
    margin-left: -1px !important;
  }
}
</style>
