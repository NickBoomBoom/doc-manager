<template>
  <q-inner-loading :showing="loading">
    <q-spinner-cube size="xl" color="primary" :thickness="20" />
    <div class="mt-2 text-primary">每天一记,勤劳又聪明...</div>
  </q-inner-loading>

  <div v-if="!loading" class="h-full flex flex-col">
    <div class="flex items-end p-2">
      <q-input
        input-class="text-xl font-bold"
        v-model="detail.title"
        class="flex-1"
        dense
        :debounce="500"
        placeholder="标题"
        @update:model-value="handleTitleChange"
      />

      <span
        :class="[saveLoading ? 'visible' : 'invisible']"
        class="ml-6 text-sm text-gray"
      >
        保存中
        <q-spinner-dots />
      </span>
    </div>
    <q-scroll-area class="flex-1">
      <block-json-editor
        ref="editorRef"
        v-model="detail.content"
        :config="editorConfig"
      />
    </q-scroll-area>
    <div class="px-2">
      <tag-select :docId="detail.id!" :doc-tag-id="detail.docTagId!" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BlockJsonEditor from 'block-json-editor';
import 'block-json-editor/style.css';
import TagSelect from './TagSelect.vue';
import { Doc } from 'interfaces/doc.interface';
import menuService from '../menu.service';
import _ from 'lodash-es';
function checkContent(
  v: Doc = {
    title: '',
    content: null,
    spaceId: null,
    tags: [],
  },
): Doc {
  return _.cloneDeep(v);
}
const props = defineProps<{
  docId: number;
}>();
const loading = ref(true);
const saveLoading = ref(false);
const detail = ref<Doc>(checkContent());
const editorRef = ref();
const editorConfig = {
  tools: {
    media: {
      config: {
        uploader: {
          async uploadByFile(file: any) {
            const fileData = new FormData();
            fileData.append('file', file);
            const { url } = await uploadApi.upload(fileData);
            return {
              success: 1,
              file: {
                url,
              },
            };
          },
          async uploadByUrl(url: string) {
            return {
              success: 1,
              file: {
                url,
              },
            };
          },
        },
      },
    },
    attaches: {
      config: {
        uploader: {
          /**
           * Upload file to the server and return an uploaded image data
           * @param {File} file - file selected from the device or pasted by drag-n-drop
           * @return {Promise.<{success, file: {url}}>}
           */
          async uploadByFile(file: any) {
            const fileData = new FormData();
            fileData.append('file', file);
            const res = await uploadApi.upload(fileData);
            return {
              success: 1,
              file: res,
            };
          },
        },
      },
    },
  },
};

let unwatch = () => {};

watch(
  () => props.docId,
  () => {
    getDetail();
  },
  {
    immediate: true,
  },
);

async function getDetail() {
  try {
    unwatch();
    loading.value = true;
    const res = await docApi.get(props.docId);
    detail.value = checkContent(res);
    unwatch = watch(
      () => detail.value.content,
      _.debounce((v, ov) => {
        handleSave();
      }),
    );
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function handleTitleChange() {
  if (!detail.value.title) {
    detail.value.title = '新文档';
  }
  menuService.updateDoc(detail.value);
  handleSave();
}

let timer: NodeJS.Timeout;

async function handleSave() {
  const now = Date.now();
  try {
    saveLoading.value = true;
    docApi.update(detail.value.id as number, detail.value);
  } catch (error) {
    console.error(error);
  } finally {
    clearTimeout(timer);
    const ms = 1000;
    const end = Date.now();
    let time = end - now;
    if (time > ms) {
      time = 0;
    } else {
      time = ms - time;
    }
    timer = setTimeout(() => {
      saveLoading.value = false;
    }, time);
  }
}
</script>
