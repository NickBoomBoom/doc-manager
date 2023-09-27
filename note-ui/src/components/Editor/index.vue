<template>
  <textarea :id="editorId"> </textarea>
</template>
<script setup lang="ts">
import { Editor } from 'src/tinymce';
import { debounce } from 'lodash-es';
const props = withDefaults(
  defineProps<{
    modelValue: string;
  }>(),
  {
    modelValue: '',
  },
);
const emits = defineEmits<{
  (event: 'update:modelValue', str: string): void;
  (event: 'init'): void;
  (event: 'save', content: string): void;
}>();
const content = ref(props.modelValue);
const isInitSuccess = ref(false);

onMounted(() => {
  init();
});

onActivated(() => {
  init();
});

onDeactivated(() => {
  editorInstance.remove();
  isInitSuccess.value = false;
});
watch(content, (v) => {
  emits('update:modelValue', v);
});

watch(
  () => props.modelValue,
  (v: string) => {
    if (v !== content.value) {
      content.value = v;
      if (isInitSuccess.value) {
        editorInstance.setContent(v);
      }
    }
  },
);

watch(isInitSuccess, (v: boolean) => {
  v && editorInstance.setContent(content.value);
});

const editorId = ref(`editor-${Date.now()}`);
let editorInstance: Editor;
// 插件及对应的toolbar配置
const PLUGIN_TOOLBAR_CONFIG: {
  [key: string]: {
    toolbar?: string;
    props?: object;
  };
} = {
  autoresize: {},
  // 有序 无序列表
  lists: {
    toolbar: 'numlist bullist',
  },
  // 任务列表
  checklist: {
    toolbar: 'checklist',
  },
  // 表格
  table: {
    props: {
      table_toolbar:
        'tablesort advtablerownumbering tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
    },
    toolbar:
      'table tableinsertdialog tablecellprops tableprops advtablerownumbering',
  },
  advtable: {
    toolbar: 'advtablerownumbering',
  },
  // link
  link: {
    props: {
      link_context_toolbar: true,
      link_default_target: '_blank', // 链接默认打开状态
    },
    toolbar: 'link',
  },
  // 自动识别url 只能识别www开头的
  autolink: {},
  casechange: {
    toolbar: 'casechange',
  },
  // 特殊字符 mceShowCharmap
  charmap: {
    toolbar: 'charmap',
  },
  // 源代码查看  mceCodeEditor
  advcode: {
    toolbar: 'code',
  },
  // 插入代码  搭配prism.js prism.css使用
  codesample: {
    toolbar: 'codesample',
  },
  // 文字阅读方向  mceDirectionLTR  mceDirectionRTL
  directionality: {
    toolbar: 'ltr rtl',
  },

  // emoji 表情  mceEmoticons
  emoticons: {
    toolbar: 'emoticons',
  },
  // 全屏插件  mceFullScreen
  fullscreen: {
    toolbar: 'fullscreen',
  },
  // 帮助文档  mceHelp
  help: {
    toolbar: 'help',
  },
  // 图片模块 mceImage
  image: {
    props: {
      // image_caption: true,
      file_picker_types: 'image',
      images_upload_url: 'http://127.0.0.1:4399/upload',
    },
    toolbar: 'image',
  },
  editimage: {
    props: {},
  },
  // 媒体文件
  media: {
    toolbar: 'media',
  },
  // 文档黏贴
  powerpaste: {
    props: {
      powerpaste_word_import: 'prompt', // 交予用户选择合并or清除格式
      powerpaste_html_import: 'prompt', // 交予用户选择合并or清除格式
      powerpaste_googledocs_import: 'prompt', // 交予用户选择合并or清除格式
    },
  },
  //  nonbreaking 不中断空间 html字符实体替换空格
  nonbreaking: {
    props: {
      nonbreaking_force_tab: true,
    },
    toolbar: 'nonbreaking',
  },
  // 快捷工具栏
  quickbars: {
    props: {
      // quickbars_insert_toolbar: 'styles fontsize emoticons image table',
      quickbars_insert_toolbar: false,
      quickbars_selection_toolbar:
        'styles bold italic underline strikethrough superscript subscript fontsize lineheight blockquote casechange quicklink removeformat indent outdent aligncenter alignjustify alignleft alignnone alignright | backcolor forecolor',
      contextmenu:
        'undo redo | inserttable | cell row column deletetable | help',
    },
  },
  // 保存回调 cancel  save
  save: {
    props: {
      save_oncancelcallback: (e) => {
        console.log('Save canceled', e);
      },
      save_onsavecallback: (e) => {
        console.log('Saved', e);
        emits('save', content.value);
      },
    },
    toolbar: 'cancel save',
  },
  autosave: {
    props: {
      autosave_prefix: 'autosave-{path}-{query}-{id}-',
      autosave_restore_when_empty: true, // 自动还原上次因为崩溃丢失的文稿
    },
    toolbar: 'restoredraft',
  },
  searchreplace: {
    toolbar: 'searchreplace',
  },
  wordcount: {},

  // formatpainter: {
  //   toolbar: 'formatpainter'
  // },

  pageembed: {
    toolbar: 'pageembed',
  },
  tableofcontents: {
    props: {
      tableofcontents_includeheader: false,
    },
    toolbar: 'tableofcontents',
  },
};

const { plugins, pluginsConfig } = initPluginToolbar();
function init() {
  // const selector: HTMLElement = document.querySelector(`#${editorId.value}`)!;

  window.tinymce.init({
    // 基础配置
    selector: `#${editorId.value}`,
    placeholder: '输入内容, / 可唤起功能',
    auto_focus: true,
    language: 'zh_CN', // 默认走中文
    automatic_uploads: true, // 图片自动上传
    resize: false,
    font_size_input_default_unit: 'px',
    min_height: 800,
    init_instance_callback: (e: Editor) => {
      isInitSuccess.value = true;
      setTimeout(() => {
        emits('init');
      }, 400);
    },
    // 菜单栏配置 (不显示)
    menubar: false,
    statusbar: false,
    // 工具栏配置
    toolbar: false,
    font_size_formats: '12px 14px 16px 18px 24px 36px 48px',
    toolbar_persist: true,
    // 皮肤,icon,样式替换
    content_css: ['custom'],
    skin: 'jam',
    icons: 'jam',
    plugins,
    ...pluginsConfig,
    setup: (editor: Editor) => {
      editorInstance = editor;
      // 注册table sort 按钮
      registerTableSortBtn(editor);
      // 注册斜杠指令
      registerSlashCommands(editor);
      // 初始化
      // editor.on('init', (e) => {
      //   emits('init');
      // });
      editor.on('focus', (e) => {
        console.log('focus');
      });
      editor.on('blur', (e) => {
        console.log('blur');
        emits('save', content.value);
      });
      editor.on(
        'input',
        debounce((e: any) => {
          content.value = editorInstance.getContent();
          emits('save', content.value);
        }, 500),
      );
      // 监听dialog 打开
      editor.on('OpenWindow', (e) => {
        setTimeout(() => {
          const dialog: HTMLElement = document.querySelector('.tox-dialog')!;
          const firstTextarea = dialog.querySelector('textarea');
          const firstInput = dialog.querySelector('input');
          const focusEl = firstTextarea || firstInput;
          if (focusEl) {
            focusEl.focus();
          }
        });
      });
    },
  });
}

function registerTableSortBtn(editor: Editor) {
  editor.ui.registry.addButton('tablesort', {
    icon: 'filter',
    tooltip: 'Sort',
    onAction: () => {
      editor.execCommand('mceAdvancedTableSort');
    },
  });
}
function registerSlashCommands(editor: Editor) {
  const insertActions: {
    text?: string;
    getText?: () => string;
    icon?: string;
    action?: () => void;
    type?: string;
  }[] = [
    {
      text: '标题 1(h1)',
      icon: 'h1',
      action: function () {
        editor.execCommand('mceInsertContent', false, '<h1>标题 1</h1>');
        editor.selection.select(editor.selection.getNode());
      },
    },
    {
      text: '标题 2(h2)',
      icon: 'h2',
      action: function () {
        editor.execCommand('mceInsertContent', false, '<h2>标题 2</h2>');
        editor.selection.select(editor.selection.getNode());
      },
    },
    {
      text: '标题 3(h3)',
      icon: 'h3',
      action: function () {
        editor.execCommand('mceInsertContent', false, '<h3>标题 3</h3>');
        editor.selection.select(editor.selection.getNode());
      },
    },
    {
      text: '水平分割线(hr)',
      icon: 'horizontal-rule',
      action: function () {
        editor.execCommand('mceInsertContent', false, '<hr/>');
      },
    },

    {
      type: 'separator',
    },
    {
      icon: 'bold',
      getText: () => {
        const bol = editor.queryCommandState('Bold');
        if (bol) {
          return '关闭粗体(close-bold)';
        }
        return '开启粗体(bold)';
      },
      action: function () {
        editor.execCommand('Bold');
      },
    },
    {
      icon: 'italic',
      getText: () => {
        const bol = editor.queryCommandState('Italic');
        if (bol) {
          return '关闭斜体(close-italic)';
        }
        return '开启斜体(italic)';
      },
      action: function () {
        editor.execCommand('Italic');
      },
    },

    {
      icon: 'strike-through',
      getText: () => {
        const bol = editor.queryCommandState('Strikethrough');
        if (bol) {
          return '关闭删除线(close-strikethrough)';
        }
        return '开启删除线(strikethrough)';
      },
      action: function () {
        editor.execCommand('Strikethrough');
      },
    },

    {
      icon: 'underline',
      getText: () => {
        const bol = editor.queryCommandState('Underline');
        if (bol) {
          return '关闭下划线(close-underline)';
        }
        return '开启下划线(underline)';
      },
      action: function () {
        editor.execCommand('Underline');
      },
    },

    {
      type: 'separator',
    },

    {
      text: '无序列表(unordered-list)',
      icon: 'unordered-list',
      action: function () {
        editor.execCommand('InsertUnorderedList', false);
      },
    },

    {
      text: '有序列表(ordered-list)',
      icon: 'ordered-list',
      action: function () {
        editor.execCommand('InsertOrderedList', false);
      },
    },
    {
      text: '任务列表(check-list)',
      icon: 'selected',
      action: function () {
        editor.execCommand('InsertUnorderedList', false, {
          'list-attributes': {
            class: 'tox-checklist',
          },
        });
      },
    },
    {
      type: 'separator',
    },

    {
      text: '占位符(nonbreaking)',
      icon: 'non-breaking',
      action: function () {
        editor.execCommand('mceNonBreaking');
      },
    },
    {
      text: '生成目录(nonbreaking)',
      icon: 'toc',
      action: function () {
        editor.execCommand('mceInsertToc');
      },
    },
    {
      text: '插入Iframe(iframe)',
      icon: 'non-breaking',
      action: function () {
        editor.execCommand('mcePageEmbed');
      },
    },
    {
      text: '插入图片(image)',
      icon: 'image',
      action: function () {
        editor.execCommand('mceImage');
      },
    },
    {
      text: '插入音视频(media)',
      icon: 'embed',
      action: function () {
        editor.execCommand('mceMedia');
      },
    },
    {
      text: '插入表格(table)',
      icon: 'table',
      action: function () {
        editor.execCommand('mceInsertTableDialog');
      },
    },

    {
      text: '特殊字符(chars)',
      icon: 'insert-character',
      action: function () {
        editor.execCommand('mceShowCharmap');
      },
    },

    {
      text: 'Emoji(emoji)',
      icon: 'emoji',
      action: function () {
        editor.execCommand('mceEmoticons');
      },
    },

    {
      text: '插入代码(insert-code)',
      icon: 'code-sample',
      action: function () {
        editor.execCommand('CodeSample');
      },
    },
    {
      type: 'separator',
    },

    {
      text: '搜索替换(search-replace)',
      icon: 'search',
      action: function () {
        editor.execCommand('SearchReplace');
      },
    },

    {
      text: '文字方向(ltr)',
      icon: 'ltr',
      action: function () {
        editor.execCommand('mceDirectionLTR');
      },
    },
    {
      text: '文字方向(rtl)',
      icon: 'rtl',
      action: function () {
        editor.execCommand('mceDirectionRTL');
      },
    },
    {
      text: '全屏(fullscreen)',
      icon: 'fullscreen',
      action: function () {
        editor.execCommand('mceFullScreen');
      },
    },
    {
      text: '源码(source-code)',
      icon: 'sourcecode',
      action: function () {
        editor.execCommand('mceCodeEditor');
      },
    },
    {
      text: '帮助',
      icon: 'help',
      action: function () {
        editor.execCommand('mceHelp');
      },
    },
  ];
  editor.ui.registry.addAutocompleter('slashcommands', {
    trigger: '/',
    minChars: 0,
    highlightOn: ['char_name'],
    columns: 1,
    fetch: function (pattern) {
      const matchedActions = insertActions.filter(function (action) {
        const text = action.getText?.() || action.text || '';
        return (
          action.type === 'separator' ||
          text.toLowerCase().indexOf(pattern.toLowerCase()) !== -1
        );
      });

      return new Promise((resolve) => {
        // Ui.InlineContent.AutocompleterContents
        const results: any[] = matchedActions.map(function (t) {
          const text = t.getText?.() || t.text || '';
          return {
            text,
            value: text,
            meta: t,
            icon: t.icon,
            type: t.type,
          };
        });
        resolve(results);
      });
    },
    onAction: function (autocompleteApi, rng, action, meta) {
      editor.selection.setRng(rng);
      // Some actions don't delete the "slash", so we delete all the slash
      // command content before performing the action
      editor.execCommand('Delete');
      meta.action();
      autocompleteApi.hide();
    },
  });
}

function initPluginToolbar(): {
  plugins: string[];
  pluginsConfig: object;
  toolbar: string;
} {
  let plugins = [];
  let pluginsConfig = {};
  let toolbar = '';
  for (const [key, value] of Object.entries(PLUGIN_TOOLBAR_CONFIG)) {
    plugins.push(key);
    const { props, toolbar: _toolbar } = value;
    pluginsConfig = {
      ...pluginsConfig,
      ...(props || {}),
    };
    value && (toolbar += ` ${_toolbar}`);
  }

  return {
    plugins,
    pluginsConfig,
    toolbar,
  };
}

function focus() {
  editorInstance.focus();
}
defineExpose({
  focus,
});
</script>
