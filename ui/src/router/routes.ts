import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    redirect: {
      name: 'Doc',
    },
    children: [
      {
        path: 'doc',
        name: 'Doc',
        meta: {
          keepAlive: true,
        },
        component: () => import('pages/doc/index.vue'),
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
  {
    path: '/test',
    name: 'Test',
    component: () => import('pages/test/index.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
