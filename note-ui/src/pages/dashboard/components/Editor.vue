<template>
  <div class="h-400">
    <ckeditor
      :editor="BalloonEditor"
      v-model="content"
      :config="config"
      @ready="onReady"
    ></ckeditor>

    <div>
      {{ content }}
    </div>
  </div>
</template>
<script setup lang="ts">
import CKEditor from '@ckeditor/ckeditor5-vue';

import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import '@ckeditor/ckeditor5-build-balloon/build/translations/zh-cn';
import { SlashCommand } from '@ckeditor/ckeditor5-slash-command';
import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig';

// class Editor extends BalloonEditor {
//   public static override builtinPlugins = [SlashCommand];

//   public static override defaultConfig = {
//     toolbar: {
//       items: [
//         'heading',
//         '|',
//         'bold',
//         'italic',
//         'link',
//         'bulletedList',
//         'numberedList',
//         '|',
//         'outdent',
//         'indent',
//         '|',
//         'imageUpload',
//         'blockQuote',
//         'insertTable',
//         'mediaEmbed',
//         'undo',
//         'redo',
//       ],
//     },
//     language: 'zh-cn',
//     image: {
//       toolbar: [
//         'imageTextAlternative',
//         'toggleImageCaption',
//         'imageStyle:inline',
//         'imageStyle:block',
//         'imageStyle:side',
//         'linkImage',
//       ],
//     },
//     table: {
//       contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
//     },
//   };
// }

const editor = BalloonEditor;

const ckeditor = CKEditor.component;
const content = ref('');
const config = ref<EditorConfig>({
  language: 'zh-cn',
  placeholder: 'Typing....',
  licenseKey:
    'L05XQXp2ZXZOWTROVndWa1JCanRzWEorb29SblZVK1E0VkxTdVFWa0ZPdWlsRVpxc2EvRmV0MHo0cGxxLU1qQXlNekV3TVRFPQ==',
});

function onReady(e) {
  console.log(3333, editor, e);
}
</script>
