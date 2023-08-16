<template>
  <div class="editor" :id="editorId"></div>
</template>
<script setup lang="ts">
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const editor = ref<Vditor | null>(null)
const editorId = 'editor' + ~~(Math.random() * 10000)
console.log(111, editorId)

onMounted(() => {
  editor.value = new Vditor(editorId, {
    icon:'material',
    mode:'wysiwyg',
    outline:{
      enable: true, 
      position: 'right'
    },
    counter:{
      enable: true, 
    },
    after: () => {
      console.log(editor.value)
      editor.value?.setValue(
        '啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡啦啦啦啦啦卡拉卡拉啦阿卡'
      )
    }
  })
})
</script>
<style lang="less" scoped>
.editor {
  height: 100% !important;
 
}
</style>
