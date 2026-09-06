import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

/** Short git SHA of the SPA source at build time — surfaced in Settings so the
 *  operator can tell which bundle the Pi is actually serving. */
function spaBuildId(): string {
  let sha = "nogit";
  try {
    sha = execSync("git rev-parse --short HEAD", { cwd: __dirname, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    const dirty = execSync("git status --porcelain", { cwd: __dirname, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    if (dirty) sha += "+dirty";
  } catch {
    /* not a git checkout — timestamp alone still identifies the bundle */
  }
  return `${sha} · ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;
}

/** Standalone Pi SPA — served by brain on :8787 */
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_DSC_PI": JSON.stringify("1"),
    "import.meta.env.VITE_DSC_SPA_BUILD": JSON.stringify(spaBuildId()),
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
