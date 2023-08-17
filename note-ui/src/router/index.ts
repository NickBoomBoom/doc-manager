import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@views/home/index.vue'
import LoginView from '@views/login/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to, from, next)
  next()
})

export default router
