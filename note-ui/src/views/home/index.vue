<template>
  <n-config-provider :theme="theme">
    <div class="h-screen flex flex-col">
      <header>
        <n-button @click="toggleTheme">{{ themeText }} </n-button>
        <n-button> 上传 </n-button>
        <n-button> 打包下载 </n-button>
      </header>
      <main class="flex-1 overflow-hidden">
        <splitpanes class="h-full">
          <pane size="20" min-size="20" max-size="30"> <Menu /> </pane>
          <pane class="h-full" min-size="40">
            <Editor />
          </pane>
        </splitpanes>
      </main>
    </div>
  </n-config-provider>
</template>
<script setup lang="ts">
import { darkTheme, lightTheme } from 'naive-ui'
import Editor from '@components/Editor/index.vue'
import Menu from '@components/Menu/index.vue'
const isDark = ref(false)
const theme = computed(() => {
  return isDark.value ? darkTheme : lightTheme
})
const themeText = computed(() => {
  return isDark.value ? '天黑了' : '天亮了'
})
function toggleTheme() {
  isDark.value = !isDark.value
}
</script>
