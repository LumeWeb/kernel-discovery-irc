import esbuild from "esbuild";

esbuild.buildSync({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  format: "iife",
  bundle: true,
  define: {
    global: "self",
  },
});
