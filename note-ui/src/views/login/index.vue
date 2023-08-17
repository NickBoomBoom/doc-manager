<template>
  <div class="flex flex-col justify-between items-center h-screen w-full">
    <header class="w-full">头部</header>
    <n-form class="w-60" ref="formRef" :model="model" :rules="rules">
      <n-form-item path="email" label="邮箱">
        <n-input v-model:value="model.email" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="password" label="密码">
        <n-input v-model:value="model.password" type="password" @keydown.enter.prevent />
      </n-form-item>
      <div class="flex items-center justify-between">
        <n-button quaternary text>去注册</n-button>
        <n-button round type="primary" @click="login"> 登录 </n-button>
      </div>
    </n-form>

    <footer class="w-full">尾部</footer>
  </div>
</template>
<script setup lang="ts">
import { FormRules } from 'naive-ui'

const model = ref({
  email: '',
  password: ''
})
const rules: FormRules = {
  email: [
    {
      required: true,
      message: '请输入邮箱'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码'
    }
  ]
}

async function login() {
  console.log(1111, model.value)
}
</script>
<style lang="scss" scoped></style>
