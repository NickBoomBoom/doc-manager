import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { Dialog } from 'quasar';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  const TO_HOME_ROUTES: string[] = ['Login']; // 已登录情况下,进入这些页面提示是否重新登录
  let isFirst = true;
  Router.afterEach((to, from) => {
    // 初始化动画配置
    if (isFirst) {
      GlobalLoadingService.hide();
    }
    isFirst = false;

    // 配置
  });

  Router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    if (userStore.isLogin) {
      // 已登录的情况下跳向login页面,直接询问他是不是要退出切换账号
      if (TO_HOME_ROUTES.includes(to.name as string)) {
        Dialog.create({
          title: '嗯~~',
          message: '你都登录了,还要再去登录,你是不是要重新登录呀?',
          cancel: '不是不是',
          ok: '是的是的',
        })
          .onOk(() => {
            userStore.logout();
          })
          .onCancel(() => {
            Router.replace({
              name: 'Dashboard',
            });
          });
        next(false);
      } else {
        next();
      }
    } else {
      if (['Login'].includes(to.name as string)) {
        return next();
      }
      Router.replace({
        name: 'Login',
      });
      next(false);
    }
  });
  return Router;
});
