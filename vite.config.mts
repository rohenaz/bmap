import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/bmap.ts',
      name: 'bmapjs',
      formats: ['es', 'cjs'],
      fileName: (format) => `bmap.${format}.js`
    },
    target: 'node16',
    rollupOptions: {
      external: [
        'http',
        'https',
        'url',
        'stream',
        'zlib'
      ]
    },
    outDir: 'dist',
    sourcemap: true
  },
  plugins: [dts({ outDir: 'dist/types', entryRoot: 'src/types' })]
});