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
        '@bsv/sdk',
        '@msgpack/msgpack',
        'bpu-ts',
        'node-fetch',
      ]
    },
    outDir: 'dist',
    sourcemap: true
  },
  publicDir: false,
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      outDir: 'dist/types',
      insertTypesEntry: true,
      cleanVueFileName: true, // Optional: cleans up file names in declarations
      rollupTypes: true, // Roll up all the type definitions into a single file
      afterDiagnostic: (diagnostic) => {
        console.log(diagnostic);
      }
    }),
  ],
});
