import { defineConfig } from "vite";
import optimizer from "vite-plugin-optimizer";
import inject from "@rollup/plugin-inject";

export default defineConfig({
  build: {
    outDir: "lib",
    lib: {
      entry: "build/index.js",
      name: "main",
      formats: ["cjs"],
      fileName: "index",
    },
    minify: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
  resolve: {
    dedupe: ["@lumeweb/libportal", "@lumeweb/libweb", "@lumeweb/libkernel"],
    alias: {
      tls: "./build/net.js",
      net: "./build/net.js",
      chardet: "@lumeweb/chardet",
    },
  },
  plugins: [
    optimizer({
      "node-fetch":
        "const e = undefined; export default e;export {e as Response, e as FormData, e as Blob};",
    }),
    inject({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
});
