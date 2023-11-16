import MenuItem from 'components/MenuItem/index.vue';
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  app.component('MenuItem', MenuItem);
});
