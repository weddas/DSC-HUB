import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: path.resolve(__dirname, "../www"),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/panel-element.tsx"),
      name: "DscHubPanel",
      formats: ["es"],
      fileName: () => "dsc-hub-panel.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: "dsc-hub-panel.[ext]",
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    target: "es2020",
  },
});
