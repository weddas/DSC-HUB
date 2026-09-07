import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Panel } from "../components/Panel";
import { TwinPanel, type TwinPanelPerf } from "../components/TwinPanel";
import { ANCHOR_ICON, findModel, type TwinModel } from "../twin/manifest";
import type { IconName } from "../iconSvg";
import { Button, StatusTag } from "../components/ui";
import type { TwinBench } from "../twin/TwinViewport";

const SLUG = "grow-tent-120x60x210";

declare global {
  interface Window {
    __twinPerf?: TwinPanelPerf;
  }
}

function ms(v: number | null | undefined): string {
  return v == null ? "—" : `${v} ms`;
}

/**
 * Pass I spike (plan § Passes): load the first authored model on the real bundle and
 * measure chunk, GLB, first frame and frame rate before any UI is built on the twin.
 * Not a desk — reachable only at `#/twin-spike`. Numbers are read live; the phone
 * half of the spike is the operator's, on the hotpatched Pi.
 */
export function TwinSpikePage() {
  const [perf, setPerf] = useState<TwinPanelPerf | null>(null);
  const [bench, setBench] = useState<TwinBench | null>(null);
  const [model, setModel] = useState<TwinModel | null>(null);
  useEffect(() => {
    void findModel(SLUG).then(setModel).catch(() => setModel(null));
  }, []);
  const location = useLocation();
  const force3d = new URLSearchParams(location.search).get("force3d") === "1";
  const runBench = () => {
    const fn = window.__twinBench;
    if (!fn) return;
    setBench(fn(90));
  };
  useEffect(() => {
    window.__twinPerf = perf ?? undefined;
  }, [perf]);
  const fpsTone = perf?.fps == null ? "muted" : perf.fps >= 28 ? "ok" : perf.fps >= 20 ? "warn" : "bad";
  const loadTone = perf?.loadMs == null ? "muted" : perf.loadMs <= 800 ? "ok" : perf.loadMs <= 2000 ? "warn" : "bad";
  return (
    <div className="dsc-page dsc-page--twin-spike">
      <header className="dsc-ov-head">
        <div>
          <div className="dsc-eyebrow">Kit · 3D twin spike</div>
          <h1 className="dsc-headline">Does the tent model earn its place?</h1>
          <p className="dsc-subline">
            The first authored model, in the wire look, on this bundle. Nothing here is a data source — the spike measures
            what the twin costs before any desk builds on it.
          </p>
        </div>
        <div className="dsc-tagrow dsc-ov-tags">
          <StatusTag icon="twin-3d" label={perf?.fps != null ? `${perf.fps} FPS · CAP 30` : "FPS —"} tone={fpsTone} live={perf?.fps != null} />
          <StatusTag label={perf?.loadMs != null ? `MODEL ${perf.loadMs} MS` : "MODEL —"} tone={loadTone} />
          <StatusTag label={perf?.bytes != null ? `${Math.round(perf.bytes / 1024)} KB GLB` : "GLB —"} tone="muted" />
        </div>
      </header>

      <div className="dsc-twin-spike-grid">
        <Panel legendIcon="twin-3d" legend={`${SLUG.toUpperCase()} · 2×4 · WIRE`} tone="teal" className="dsc-twin-spike-panel">
          <TwinPanel slug={SLUG} height={420} onPerf={setPerf} force={force3d} />
          {model ? (
            <div className="dsc-tagrow" style={{ marginTop: 10 }} aria-label="Model anchors">
              {Object.entries(model.anchors).map(([node, role]) => (
                <StatusTag key={node} icon={ANCHOR_ICON[role] as IconName} label={`${node.replace(/_/g, " ").toUpperCase()} · ${role.replace(/_/g, " ").toUpperCase()}`} tone="muted" title="Anchor node in the GLB → role the app binds" />
              ))}
            </div>
          ) : null}
          <p className="dsc-panel-foot">
            Drag to orbit. Materials come from the manifest → tokens (trim → tent accent, acrylic α .14, foil → dim). Anchors
            (`vent_port_*`, `cable_port_*`, `floor_tray`, doors, windows) are where fans, ducts, cables and probes attach in
            Pass I.
          </p>
        </Panel>

        <Panel legendIcon="gauge-dial" legend="COST · THIS DEVICE" className="dsc-twin-spike-panel">
          <dl className="dsc-twin-perf">
            <div><dt>twin-three chunk</dt><dd>{ms(perf?.chunkMs)}</dd></div>
            <div><dt>GLB fetch + parse + restyle</dt><dd>{ms(perf?.loadMs)}</dd></div>
            <div><dt>first frame</dt><dd>{ms(perf?.firstFrameMs)}</dd></div>
            <div><dt>frame rate (2 s window)</dt><dd>{perf?.fps != null ? `${perf.fps} fps` : "—"}</dd></div>
            <div><dt>meshes · triangles</dt><dd>{perf ? `${perf.meshes} · ${perf.triangles}` : "—"}</dd></div>
            <div><dt>draw calls · drawn triangles</dt><dd>{perf ? `${perf.drawCalls} · ${perf.renderedTriangles}` : "—"}</dd></div>
            <div><dt>bench · 90 frames, GPU-synced</dt><dd>{bench ? `${bench.msPerFrame} ms/frame · ${bench.fpsUncapped} fps uncapped · ${bench.drawCalls} calls` : "—"}</dd></div>
          </dl>
          <div className="dsc-tagrow" style={{ marginTop: 10 }}>
            <Button onClick={runBench} disabled={!perf}>
              Run bench
            </Button>
            {!force3d ? (
              <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                On a phone add <code>?force3d=1</code> to the URL to render the live twin for the measurement.
              </span>
            ) : null}
          </div>
          <p className="dsc-panel-foot">
            Rules under test: lazy chunk, mount in view, pause when hidden, 30 fps cap, still on phones and reduced motion.
            The phone half of this spike runs on the operator&apos;s handset against the hotpatched Pi.
          </p>
        </Panel>
      </div>
    </div>
  );
}
