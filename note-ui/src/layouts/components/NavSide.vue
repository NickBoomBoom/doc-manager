<template>
  <div class="w-15 flex flex-col items-center bg-gray-50">
    <header>header</header>
    <main class="flex-1">
      <q-btn
        v-for="item in navList"
        :key="item.icon"
        :icon="item.icon"
        dense
        flat
        :to="{
          name: item.routerName,
        }"
      >
        <q-tooltip anchor="center right" self="center left">
          {{ item.tip }}
        </q-tooltip>
      </q-btn>
    </main>
    <footer class="pb-4">
      <q-btn dense icon="more_horiz">
        <q-menu anchor="bottom right" self="bottom left">
          <q-list dense>
            <q-item clickable @click="logout">
              <q-item-section> 退出登录 </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </footer>
  </div>
</template>
<script setup lang="ts">
const router = useRouter();
const userStore = useUserStore();
function logout() {
  userStore.logout();
  router.replace({
    name: 'Login',
  });
}

const navList = reactive([
  {
    icon: 'note_alt',
    tip: '笔记',
    routerName: 'Note',
  },
]);
</script>
<style lang="scss" scoped></style>
