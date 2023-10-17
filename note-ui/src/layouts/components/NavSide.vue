<template>
  <div class="w-15 flex flex-col items-center bg-gray-1">
    <header class="flex flex-col items-center mb-2">
      <div class="text-2xl h-12 leading-12 bold">
        {{ nickname }}
      </div>
    </header>
    <main class="flex-1 flex flex-col">
      <q-btn
        v-for="item in navList"
        :key="item.icon"
        :icon="item.icon"
        dense
        flat
        :to="{
          name: item.routerName,
        }"
        class="mb-2"
        :class="{
          'text-primary': $route.name === item.routerName,
        }"
      >
        <q-tooltip anchor="center right" self="center left">
          {{ item.tip }}
        </q-tooltip>
      </q-btn>
    </main>
    <footer class="pb-4">
      <q-btn dense icon="more_horiz">
        <q-menu anchor="center right" self="center start" :offset="[10, 0]">
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
const { name } = storeToRefs(userStore);
function logout() {
  userStore.logout();
  router.replace({
    name: 'Login',
  });
}

const nickname = computed(() => {
  return name.value.substring(0, 1);
});

const navList = reactive([
  {
    icon: 'note_alt',
    tip: '文档',
    routerName: 'Note',
  },
  {
    icon: 'tag',
    tip: '标签',
    routerName: 'Tag',
  },
]);
</script>
