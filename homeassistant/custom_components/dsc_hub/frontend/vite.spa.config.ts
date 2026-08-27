import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

/** Standalone Pi SPA — served by brain on :8787 */
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_DSC_PI": JSON.stringify("1"),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "spa-dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        manualChunks(id) {
          if (id.includes("/pages/TuneFleetPages")) return "tune-fleet";
          if (id.includes("/pages/CalibratePage")) return "calibrate";
          if (id.includes("/twin/") || id.includes("node_modules/three")) return "twin-three";
        },
      },
    },
    sourcemap: true,
    target: "es2020",
  },
});
