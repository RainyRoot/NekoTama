import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src/renderer/pet',
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist/renderer/pet'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/renderer/pet/index.html'),
    },
  },
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'src/core'),
    },
  },
});
