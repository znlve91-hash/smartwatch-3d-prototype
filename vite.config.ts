import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

const hasIndexHtml = fs.existsSync(resolve(__dirname, 'index.html'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: hasIndexHtml
    ? {
        outDir: 'dist',
        sourcemap: true,
      }
    : {
        lib: {
          entry: resolve(__dirname, 'src/data/products.ts'),
          name: 'SmartwatchProto',
          fileName: 'smartwatch-prototype',
          formats: ['es'],
        },
        outDir: 'dist',
        sourcemap: true,
      },
});
