<template>
  <q-btn
    dense
    icon="menu"
    class="absolute top-1 left-3 z-12"
    @click="handleLeft"
  />
  <q-btn dense icon="more_horiz" class="absolute top-1 right-3 z-12">
    <q-menu :offset="[0, 4]">
      <q-list dense>
        <q-item clickable v-close-popup @click="logout"> 退出登录 </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script setup lang="ts">
const emits = defineEmits(['left']);
const router = useRouter();
const userStore = useUserStore();
function logout() {
  userStore.logout();
  router.replace({
    name: 'Login',
  });
}

function handleLeft() {
  emits('left');
}
</script>
