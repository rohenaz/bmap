import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/bmap.ts",
      name: "bmapjs",
      formats: ["es", "cjs"],
      fileName: (format) => `bmap.${format}.js`,
    },
    target: "node16",
    rollupOptions: {
      external: ["@bsv/sdk", "@msgpack/msgpack", "bpu-ts", "node-fetch"],
    },
    outDir: "dist",
    sourcemap: true,
  },
  publicDir: false,
  plugins: [
    dts({
      include: ["src/**/*.ts", "src/**/*.d.ts"],
      outDir: "dist/types",
      insertTypesEntry: true,
      cleanVueFileName: true,
      rollupTypes: true,
      copyDtsFiles: true,
      afterBuild: () => {
        console.log("Type declarations built successfully");
      },
      afterDiagnostic: (diagnostic) => {
        console.log(diagnostic);
      },
    }),
  ],
});
