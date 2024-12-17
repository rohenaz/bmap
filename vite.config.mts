import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/bmap.ts',
      name: 'Bmap',
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
    emptyOutDir: true,
  },
  publicDir: false,
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      outDir: 'dist',
      insertTypesEntry: true,
      cleanVueFileName: true, // Optional: cleans up file names in declarations
      rollupTypes: true, // Roll up all the type definitions into a single file
    }),
  ],
});