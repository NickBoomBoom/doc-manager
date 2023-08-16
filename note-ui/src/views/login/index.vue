<template>
  <n-form ref="formRef" :model="model" :rules="rules">
    <n-form-item path="email" label="邮箱">
      <n-input v-model:value="model.email" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="password" label="密码">
      <n-input v-model:value="model.password" type="password" @keydown.enter.prevent />
    </n-form-item>
    <n-button round type="primary" @click="login"> 登录 </n-button>

  </n-form>
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
