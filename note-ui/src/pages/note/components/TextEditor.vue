<template>
  <q-inner-loading :showing="loading">
    <q-spinner-cube size="xl" color="primary" :thickness="20" />
    <div class="mt-2 text-primary">每天一记,勤劳又聪明...</div>
  </q-inner-loading>

  <q-scroll-area v-if="!loading" class="h-full px-3">
    <div>
      <div class="flex items-end py-2">
        <q-input
          input-class="text-2xl font-bold"
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
      <tag-select :noteId="detail.id!" :note-tag-id="detail.noteTagId!" />
    </div>

    <block-json-editor
      ref="editorRef"
      v-model="detail.content"
      :config="editorConfig"
    />
  </q-scroll-area>
</template>

<script setup lang="ts">
import BlockJsonEditor from 'block-json-editor';
import TagSelect from './TagSelect.vue';
import { Note } from 'interfaces/note.interface';
import menuService from '../menu.service';
import _ from 'lodash-es';
function checkContent(
  v: Note = {
    title: '',
    content: {},
    spaceId: null,
    tags: [],
  },
): Note {
  return _.cloneDeep(v);
}
const props = defineProps<{
  noteId: number;
}>();
const loading = ref(true);
const saveLoading = ref(false);
const detail = ref<Note>(checkContent());
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
            console.log(111, file);
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
  () => props.noteId,
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
    const res = await noteApi.get(props.noteId);
    detail.value = checkContent(res);
    unwatch = watch(
      () => detail.value.content,
      _.debounce((v, ov) => {
        console.log(v, ov);
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
  menuService.updateNote(detail.value);
  handleSave();
}

let timer: NodeJS.Timeout;

async function handleSave() {
  const now = Date.now();
  try {
    saveLoading.value = true;
    noteApi.update(detail.value.id as number, detail.value);
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
      time = 2000 - time;
    }
    timer = setTimeout(() => {
      saveLoading.value = false;
    }, time);
  }
}
</script>
