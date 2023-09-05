<template>
  <div class="flex justify-center items-center h-screen">
    <q-form @submit="onSubmit" class="q-gutter-md w-md -mt-120">
      <q-input
        v-model="params.email"
        label="邮箱 *"
        autofocus
        hint="输入邮箱(未注册邮箱会在输入密码后自动注册)"
        :rules="rules.email"
      />

      <q-input
        v-if="isPassword"
        type="password"
        v-model="params.password"
        label="密码 *"
        :rules="rules.password"
      />
    </q-form>
  </div>
</template>
<script setup lang="ts">
import { userApi } from 'api';
const params = ref({
  email: '',
  password: '',
});

const isExist = ref(false);

const rules = {
  email: [
    (v) => {
      if (!!v) {
        return true;
      }
      hidePassword();
      return '请输入邮箱';
    },
    (v, r) => {
      if (r.email(v)) {
        showPassword();
        return true;
      }
      hidePassword();
      return '请输入正确邮箱格式';
    },
    checkEmail,
  ],
  password: [(v) => !v || '请输入密码'],
};
function onSubmit() {}

async function checkEmail(v) {
  console.log(344, v);
  const bol = await userApi.checkEmail(v);
  isExist.value = bol;
  if (bol) {
    return true;
  } else {
    return '当前email未注册,请输入密码直接注册登录';
  }
}

const isPassword = ref(false);
function showPassword() {
  isPassword.value = true;
}
function hidePassword() {
  isPassword.value = false;
}
</script>
<style lang="scss" scoped></style>
