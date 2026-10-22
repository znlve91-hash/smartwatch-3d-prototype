import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

const hasIndexHtml = fs.existsSync(resolve(process.cwd(), 'index.html'));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: hasIndexHtml
      ? undefined
      : {
          input: resolve(process.cwd(), 'src/data/products.js'),
        },
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
