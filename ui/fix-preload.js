const fs = require('fs');

const filePath =
  './node_modules/.pnpm/vite@2.9.16_sass@1.69.5/node_modules/vite/dist/node/chunks/dep-6e2fe41e.js';

let content = fs.readFileSync(filePath, 'utf-8');
const str = '\0vite/preload-helper';
if (!content.includes(str)) {
  content = content.replace('vite/preload-helper', '\0vite/preload-helper');
  fs.writeFileSync(filePath, content);
}
