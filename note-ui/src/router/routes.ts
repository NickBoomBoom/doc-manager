import { RouteRecordRaw } from 'vue-router';
import Dashboard from 'pages/dashboard/index.vue';
import MainLayout from 'layouts/MainLayout.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    redirect: {
      name: 'Dashboard',
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
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
