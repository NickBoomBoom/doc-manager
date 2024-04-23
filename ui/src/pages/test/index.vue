<template>
  <div class="py-10">
    <block-json-editor v-model="content" />
  </div>
</template>
<script setup lang="ts">
import BlockJsonEditor from 'block-json-editor';
import 'block-json-editor/style.css';
const content = ref();
</script>
