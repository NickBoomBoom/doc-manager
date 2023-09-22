import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    redirect: {
      name: 'Note',
    },
    children: [
      {
        path: 'note',
        name: 'Note',
        component: () => import('pages/note/index.vue'),
      },
      {
        path: 'tag',
        name: 'Tag',
        component: () => import('pages/tag/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/login/index.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
