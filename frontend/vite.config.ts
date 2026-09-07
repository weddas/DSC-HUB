import { execSync } from "node:child_process";
import { defineConfig, loadEnv } from "vite";
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
export default defineConfig(({ mode }) => {
  // DSC_BRAIN_ORIGIN — the brain the dev server proxies to (default: the Pi).
  // DSC_ZONES_ORIGIN — optional second brain for paths the Pi does not serve yet
  // (`/zones`, `/cameras` — e.g. a local brain on a feature branch). Set in the shell or
  // in frontend/.env.
  const env = { ...loadEnv(mode, __dirname, "DSC_"), ...process.env } as Record<string, string | undefined>;
  const brain = env.DSC_BRAIN_ORIGIN || "http://dsc-brain.local:8787";
  const zones = env.DSC_ZONES_ORIGIN;
  // DSC_CANNALIB_ORIGIN — optional CannaLib API (e.g. a local standalone_server with the
  // lights/equipment stores) for the catalog detail routes the Pi brain does not proxy yet.
  const cannalib = env.DSC_CANNALIB_ORIGIN;
  const proxyTo = (target: string) => ({
    target,
    changeOrigin: true,
    ws: true,
    bypass(req: { method?: string; url?: string; headers: Record<string, string | string[] | undefined> }) {
      const accept = String(req.headers.accept || "");
      // Route entry (hash routes never reach the server, but a hard reload does).
      if (req.method === "GET" && accept.includes("text/html")) return req.url;
      return undefined;
    },
  });
  return {
  plugins: [react()],
  define: {
    "import.meta.env.VITE_DSC_PI": JSON.stringify("1"),
    "import.meta.env.VITE_DSC_SPA_BUILD": JSON.stringify(spaBuildId()),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  root: path.resolve(__dirname),
  server: {
    // Dev against the live Pi: everything that is not a Vite asset (source, @vite/@fs,
    // pre-bundled deps, /public models, the HMR socket) goes to the brain so the SPA sees
    // real entities. `/zones` can be split off to a second brain while the Pi lags a branch.
    proxy: {
      ...(cannalib ? { "^/v1/catalogs/(lights|equipment)/": proxyTo(cannalib) } : {}),
      ...(zones ? { "^/zones": proxyTo(zones), "^/cameras": proxyTo(zones) } : {}),
      "^/(?!src/|@|node_modules/|models/|index\\.html|\\?|$)": proxyTo(brain),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "spa-dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        manualChunks(id) {
          // React and friends in a chunk of their own: they import no app code, so no app
          // chunk can end up owning React and creating a boot-order cycle (2026-09-07).
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) return "vendor-react";
          if (id.includes("/pages/TuneFleetPages")) return "tune-fleet";
          if (id.includes("/pages/CalibratePage")) return "calibrate";
          if (id.includes("/twin/") || id.includes("node_modules/three")) return "twin-three";
        },
      },
    },
    sourcemap: true,
    target: "es2020",
  },
  };
});
