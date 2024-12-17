import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/bmap.ts', // Adjust the entry point as needed
      name: 'Bmap',
      fileName: (format) => `bmap.${format}.js`,
      formats: ['es', 'cjs'], // Specify the module formats you need
    },
    rollupOptions: {
      external: [
        '@bsv/sdk',
        '@msgpack/msgpack',
        'bpu-ts',
        'node-fetch',
        // Add other dependencies you want to exclude from the bundle
      ],
    },
    emptyOutDir: true, // Clears the output directory before building
  },
  publicDir: false,
  plugins: [
    dts({
      include: ['src/**/*.ts'], // Generate declaration files for your source files
      outDir: 'dist/types', // Output directory for declaration files
      cleanVueFileName: true, // Optional: cleans up file names in declarations
    }),
  ],
});