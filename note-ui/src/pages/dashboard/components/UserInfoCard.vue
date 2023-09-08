<template>
  <q-btn-dropdown square color="primary" align="between" class="h-20">
    <template #label>
      <div class="text-left">
        {{ name }}
        <br />
        {{ email }}
      </div>
    </template>

    <div class="pa-2 flex flex-col">
      <q-btn
        color="primary"
        label="复制账号信息"
        push
        size="sm"
        v-close-popup
        @click="copyAccount"
        class="mb-2"
      />
      <q-btn
        color="primary"
        label="退出登录"
        push
        size="sm"
        @click="logout"
        v-close-popup
      />
    </div>
  </q-btn-dropdown>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { copyToClipboard, useQuasar } from 'quasar';
const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();
const { name, email } = storeToRefs(userStore);
function logout() {
  userStore.logout();
  router.replace({
    name: 'Login',
  });
}

async function copyAccount() {
  try {
    await copyToClipboard(`${name.value}:${email.value}`);
    $q.notify({
      type: 'positive',
      message: '复制成功',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '复制失败',
    });
  }
}
</script>
