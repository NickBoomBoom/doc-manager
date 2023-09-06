// main.ts
import { boot } from 'quasar/wrappers';
import 'virtual:uno.css';
import MenuScrollView from 'src/components/MenuScrollView.vue';

export default boot(({ app }) => {
  app.component('menu-scroll-view', MenuScrollView);
});
