import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/bmap.ts'),
      name: 'bmapjs',
      fileName: (format) => `bmap.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        '@bsv/sdk',
        '@msgpack/msgpack',
        'bpu-ts',
        'node-fetch',
      ],
    },
  },
  plugins: [dts()],
});