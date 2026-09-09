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

/** The twin's source directory, posix-normalised — see the `manualChunks` comment. */
const twinSrcDir = `${path.resolve(__dirname, "src/twin").replace(/\\/g, "/")}/`;

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
    // http-proxy emits "error" for a dropped upstream socket (the brain restarting, the
    // WS falling over); with no listener Node 24 turned that into an unhandled
    // ECONNABORTED and the dev server died with 0xC0000409 (twice on 2026-09-07).
    configure(proxy: { on(event: string, cb: (...a: any[]) => void): void }) {
      proxy.on("error", (err: NodeJS.ErrnoException, _req: unknown, res: unknown) => {
        const code = err?.code || err?.message;
        console.warn(`[proxy] ${target}: ${code}`);
        const r = res as { writableEnded?: boolean; headersSent?: boolean; writeHead?: (n: number) => void; end?: (s?: string) => void; destroy?: () => void } | undefined;
        if (r && typeof r.writeHead === "function" && !r.headersSent && !r.writableEnded) {
          try {
            r.writeHead(502);
            r.end?.("brain unreachable");
          } catch {
            /* socket already gone */
          }
        } else if (r && typeof r.destroy === "function") {
          r.destroy(); // raw upgrade socket
        }
      });
      proxy.on("proxyReqWs", (_proxyReq: unknown, _req: unknown, socket: { on(e: string, cb: (err: Error) => void): void }) => {
        socket.on("error", (err) => console.warn(`[proxy ws] ${target}: ${(err as NodeJS.ErrnoException).code || err.message}`));
      });
    },
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
          // The 3D twin. Three rules, in this order, and the order matters:
          //  1. `twin-shared` — the twin modules that import NO three.js (the manifest, the
          //     React context, the camera/style preset lists). The pages and the stage host
          //     import these at boot, so they must not sit in a chunk that owns three.js.
          //  2. `twin-three` — every other src/twin module: the scene itself, loaded only
          //     through the lazy import in components/TwinStagePanel.tsx.
          //  3. three.js and @react-three join it, so drei/fiber can never end up in a
          //     chunk that twin-three both imports and is imported by (a cycle would make
          //     the SPA boot in the wrong order — it broke the Pi once, 2026-09-07).
          // Matched against the resolved src/twin directory, not the substring "/twin/":
          // a checkout or worktree whose own path contains "twin" would otherwise sweep the
          // entire app into this chunk (and, being the entry, back into index).
          const p = id.replace(/\\/g, "/");
          // Ten-line shared helpers used by both the app and the scene: `@babel/runtime`
          // (drei) and Vite's own `__vitePreload`. Left unassigned they land in twin-three
          // and the entry then statically imports the whole renderer for a helper. They
          // import nothing themselves, so they are safe beside React.
          if (p.includes("node_modules/@babel/runtime") || p.includes("vite/preload-helper")) return "vendor-react";
          // `lib/twinState.ts` is the twin's view-model: pure, three-free, and read by the
          // page and the hook at boot. Left unassigned, rollup folds it into twin-three and
          // the entry then *statically* imports the whole renderer.
          if (p.endsWith("/src/lib/twinState.ts")) return "twin-shared";
          if (p.startsWith(twinSrcDir)) return /\/(manifest|context|presets)\.tsx?$/.test(p) ? "twin-shared" : "twin-three";
          if (p.includes("node_modules/three") || p.includes("node_modules/@react-three")) return "twin-three";
        },
      },
    },
    sourcemap: true,
    target: "es2020",
  },
  };
});
