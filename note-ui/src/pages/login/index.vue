<template>
  <div class="flex justify-center items-center h-screen">
    <q-form @submit="onSubmit" class="w-md -mt-120">
      <q-input
        v-model="params.email"
        ref="emailInputRef"
        label="邮箱 *"
        :hint="emailHint"
        autofocus
        :rules="rules.email"
      />

      <q-input
        v-if="isShowPassword"
        type="password"
        v-model="params.password"
        label="密码 *"
        hint="请输入6位以上密码"
        :rules="rules.password"
      />

      <div v-if="isShowSubmit" class="flex justify-center">
        <q-btn type="submit">
          {{ submitBtnText }}
        </q-btn>
      </div>
    </q-form>
  </div>
</template>
<script setup lang="ts">
import { userApi } from 'api';

const emailInputRef = ref();
const emailHint = ref('');

const params = ref({
  email: '',
  password: '',
});

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
    async function checkEmail(v) {
      try {
        const bol = await userApi.checkEmail(v);
        isRegisteredEmail.value = bol;
        emailHint.value = !bol ? '当前email未注册,请输入密码直接注册登录' : '';
        return true;
      } catch (error) {
        console.error(error);
        emailInputRef.value.validate();
        return '检测失败,重试中...';
      }
    },
  ],
  password: [
    (v) => !!v || '请输入密码',
    (v) => v.length >= 6 || '请输入6位以上密码',
  ],
};
const isRegisteredEmail = ref(false);

const isShowSubmit = computed(() => {
  return isShowPassword.value && !!params.value.password;
});

const submitBtnText = computed(() => {
  if (isRegisteredEmail.value) {
    return '登录';
  }
  return '注册登录';
});

function onSubmit() {
  console.log(3333, params.value);
}

const isShowPassword = ref(false);
function showPassword() {
  isShowPassword.value = true;
}
function hidePassword() {
  isShowPassword.value = false;
}
</script>
