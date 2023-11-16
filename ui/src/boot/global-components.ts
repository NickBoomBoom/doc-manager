import MenuItem from 'pages/doc/components/MenuItem.vue';
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  app.component('MenuItem', MenuItem);
});
