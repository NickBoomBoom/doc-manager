import { defineConfig } from 'unocss';

export default defineConfig({
  // ...UnoCSS options
  shortcuts: {
    'absolute-middle':
      'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'absolute-full': 'absolute top-0 left-0 right-0 bottom-0 w-full h-full',
    center: 'flex items-center justify-center',
  },
});
