import { useCallback, useEffect, useMemo, useState } from "react";
import { getPreference } from "../lib/preferences";
import { useLocation } from "react-router-dom";
import { Panel } from "../components/Panel";
import { Button, StatusTag } from "../components/ui";
import { TwinStagePanel, type TwinGate } from "../components/TwinStagePanel";
import { useInspector } from "../components/InspectorHost";
import { useTwinState } from "../hooks/useTwinState";
import { useZoneFocus } from "../hooks/useZoneFocus";
import { DEFAULT_LAYERS, type TwinLayers, type TwinPick } from "../twin/context";
import { CAMERA_PRESETS, type CameraPreset } from "../twin/CameraRig";
import type { FrameReport } from "../twin/FrameLoop";
import { FAN_DEFS, type TwinApplianceId, type TwinOverrides } from "../lib/twinState";

const LAYER_DEFS: ReadonlyArray<{ id: keyof TwinLayers; label: string; hint: string }> = [
  { id: "air", label: "Air", hint: "Duct routes and streaks — count by duty, speed by learned CFM" },
  { id: "heat", label: "Heat", hint: "Zone volume tinted against its want band; shimmer over heaters and the mat" },
  { id: "humidity", label: "Humidity", hint: "Haze density by RH, tone by band; mist while a humidifier runs; red near dew point" },
  { id: "light", label: "Light", hint: "Lamp cones by brightness, footprint at the canopy plane" },
  { id: "plants", label: "Plants", hint: "Every roster plant in place — pot to vessel, canopy to stage" },
  { id: "devices", label: "Devices", hint: "Fans, appliances, sensors and the hub at their anchors" },
  { id: "labels", label: "Labels", hint: "Zone readouts, plant tags, hover names" },
];

const WHATIF_APPLIANCES: ReadonlyArray<{ id: TwinApplianceId; label: string }> = [
  { id: "heater", label: "Heater" },
  { id: "humidifier", label: "Humidifier" },
  { id: "dehumidifier", label: "Dehumidifier" },
  { id: "ac", label: "Cool" },
  { id: "heatmat", label: "Heat mat" },
  { id: "clone_humidifier", label: "Clone humidifier" },
];

/**
 * Kit · 3D twin — the room, live. A view of Zone state (plan § 3D twin rules): every
 * moving or coloured part is bound to an entity, the same tooltip/inspector as the cards,
 * and a what-if panel that previews device settings in the scene without ever writing them.
 */
export function TwinPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const force = params.get("force3d") === "1" || getPreference("force3d");
  const { focus } = useZoneFocus();
  const [layers, setLayers] = useState<TwinLayers>(DEFAULT_LAYERS);
  const [preset, setPreset] = useState<CameraPreset>(focus === "clone" ? "clone" : focus === "main" ? "main" : "room");
  // The zone strip is the desk's zone context: flipping it re-aims the camera (a preset click still wins after).
  useEffect(() => {
    setPreset(focus === "clone" ? "clone" : focus === "main" ? "main" : "room");
  }, [focus]);
  const [cinematic, setCinematic] = useState(false);
  const [overrides, setOverrides] = useState<TwinOverrides | null>(null);
  const [perf, setPerf] = useState<FrameReport | null>(null);
  const [gate, setGate] = useState<TwinGate | null>(null);
  const state = useTwinState(overrides);
  const inspector = useInspector();

  const onPick = useCallback((p: TwinPick) => inspector.open({ entityId: p.entityId, label: p.label, unit: p.unit, kind: p.kind }), [inspector]);
  const onPerf = useCallback((p: FrameReport) => setPerf(p), []);
  const toggle = (id: keyof TwinLayers) => setLayers((l) => ({ ...l, [id]: !l[id] }));

  const setFan = (id: (typeof FAN_DEFS)[number]["id"], pct: number) => setOverrides((o) => ({ ...o, fans: { ...o?.fans, [id]: pct } }));
  const setLamp = (zoneId: "main" | "clone", pct: number) => setOverrides((o) => ({ ...o, lamps: { ...o?.lamps, [zoneId]: pct } }));
  const setApp = (id: TwinApplianceId, on: boolean) => setOverrides((o) => ({ ...o, appliances: { ...o?.appliances, [id]: on } }));
  const overrideCount = useMemo(() => {
    if (!overrides) return 0;
    return Object.keys(overrides.fans ?? {}).length + Object.keys(overrides.lamps ?? {}).length + Object.keys(overrides.appliances ?? {}).length;
  }, [overrides]);

  const fpsTone = perf?.fps == null ? "muted" : perf.fps >= 28 ? "ok" : perf.fps >= 20 ? "warn" : "bad";
  const placed = state.plants.filter((p) => p.zone !== "unassigned").length;

  return (
    <div className="dsc-page dsc-page--twin">
      <header className="dsc-ov-head">
        <div>
          <div className="dsc-eyebrow">Kit · 3D twin</div>
          <h1 className="dsc-headline">The room, live</h1>
          <p className="dsc-subline">
            Every moving or coloured part is bound to a live entity; grey parts are unbound. Hover for the entity, click for the inspector. The twin shows where a
            number is — the number itself is on the cards.
          </p>
        </div>
        <div className="dsc-tagrow dsc-ov-tags">
          <StatusTag icon="controller-hub" label={state.hubOnline ? "HUB ONLINE" : "HUB OFFLINE"} tone={state.hubOnline ? "ok" : "bad"} live={state.hubOnline} />
          <StatusTag icon="cannabis-leaf" label={`${state.plants.length} ON ROSTER · ${placed} PLACED`} tone="muted" />
          {state.simulated ? <StatusTag icon="alert-triangle" label={`SIMULATED · ${overrideCount} OVERRIDE${overrideCount === 1 ? "" : "S"} · NOT WRITTEN`} tone="warn" live /> : null}
          <StatusTag icon="twin-3d" label={perf?.fps != null ? `${Math.round(perf.fps)} FPS · CAP 30` : gate && !gate.ok ? `STILL · ${gate.why.toUpperCase()}` : "FPS —"} tone={gate && !gate.ok ? "muted" : fpsTone} live={perf?.fps != null} />
        </div>
      </header>

      <div className="dsc-twin-toolbar">
        <div className="dsc-twin-toolgroup" role="group" aria-label="Layers">
          <span className="dsc-legend">LAYERS</span>
          {LAYER_DEFS.map((l) => (
            <button key={l.id} type="button" className={`dsc-seg${layers[l.id] ? " is-active" : ""}`} onClick={() => toggle(l.id)} title={l.hint} aria-pressed={layers[l.id]}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="dsc-twin-toolgroup" role="group" aria-label="Camera">
          <span className="dsc-legend">CAMERA</span>
          {CAMERA_PRESETS.map((c) => (
            <button key={c.id} type="button" className={`dsc-seg${preset === c.id ? " is-active" : ""}`} onClick={() => setPreset(c.id)} aria-pressed={preset === c.id}>
              {c.label}
            </button>
          ))}
          <button type="button" className={`dsc-seg dsc-seg--ok${cinematic ? " is-active" : ""}`} onClick={() => setCinematic((c) => !c)} aria-pressed={cinematic} title="Slow auto-orbit; any drag stops it">
            Cinematic
          </button>
        </div>
      </div>

      <div className="dsc-twin-page-grid">
        <Panel legendIcon="twin-3d" legend={`ROOM · 4×8 · 2×4 · ${state.simulated ? "SIMULATED" : "LIVE"}`} tone={state.simulated ? "warn" : "teal"} live={state.simulated} className="dsc-twin-stage-panel">
          <TwinStagePanel state={state} layers={layers} preset={preset} cinematic={cinematic} height="min(68vh, 760px)" force={force} onPerf={onPerf} onPick={onPick} onGate={setGate} />
          <div className="dsc-twin-legend" aria-label="Colour key">
            <span><i style={{ background: "var(--dsc-blue)" }} /> intake 4×8</span>
            <span><i style={{ background: "var(--dsc-neon)" }} /> intake 2×4</span>
            <span><i style={{ background: "var(--dsc-teal)" }} /> cascade 2×4 → 4×8</span>
            <span><i style={{ background: "var(--dsc-purple)" }} /> exhaust → room</span>
            <span><i style={{ background: "var(--dsc-amber)" }} /> exhaust → outside · too warm</span>
            <span><i style={{ background: "var(--dsc-lamp)" }} /> lamp on</span>
            <span><i style={{ background: "var(--dsc-bad)" }} /> critical · dew-point risk</span>
            <span><i className="is-dashed" /> out of service / unbound</span>
          </div>
        </Panel>

        <div className="dsc-twin-side">
          <Panel legendIcon="settings" legend="WHAT IF · PREVIEW ONLY" tone={overrideCount ? "warn" : "muted"} className="dsc-twin-whatif">
            <p className="dsc-twin-whatif-note">
              Move a setting to see the scene respond — more air, a brighter cone, shimmer over a heater. Nothing here is written to a device and no new
              temperature or humidity is invented; the readouts stay live.
            </p>
            <div className="dsc-twin-whatif-grid">
              {FAN_DEFS.map((d) => {
                const f = state.fans.find((x) => x.id === d.id);
                const v = overrides?.fans?.[d.id] ?? (f && Number.isFinite(f.pct) ? f.pct : 0);
                return (
                  <label key={d.id} className={`dsc-twin-slider${overrides?.fans?.[d.id] != null ? " is-over" : ""}`}>
                    <span>
                      {d.label} <b>{Math.round(v)} %</b>
                      {f?.live ? "" : <em> · not reporting</em>}
                    </span>
                    <input type="range" min={0} max={100} step={5} value={Math.round(v)} onChange={(e) => setFan(d.id, Number(e.target.value))} aria-label={`${d.label} duty (preview)`} />
                  </label>
                );
              })}
              {(["clone", "main"] as const).map((z) => {
                const l = state.lamps.find((x) => x.zone === z);
                const live = l ? (l.on ? l.brightnessPct ?? 100 : 0) : 0;
                const v = overrides?.lamps?.[z] ?? live;
                return (
                  <label key={z} className={`dsc-twin-slider${overrides?.lamps?.[z] != null ? " is-over" : ""}`}>
                    <span>
                      {z === "clone" ? "2×4 SF1000" : "4×8 Twin SF1000"} <b>{Math.round(v)} %</b>
                      {l?.available || l?.simulated ? "" : <em> · not bound</em>}
                    </span>
                    <input type="range" min={0} max={100} step={5} value={Math.round(v)} onChange={(e) => setLamp(z, Number(e.target.value))} aria-label={`${z} lamp brightness (preview)`} />
                  </label>
                );
              })}
            </div>
            <div className="dsc-tagrow" style={{ marginTop: 8 }}>
              {WHATIF_APPLIANCES.map((a) => {
                const app = state.appliances.find((x) => x.id === a.id);
                const on = app?.state === "on";
                const over = overrides?.appliances?.[a.id] != null;
                return (
                  <StatusTag
                    key={a.id}
                    label={`${a.label.toUpperCase()} ${on ? "ON" : app?.state === "oos" ? "OUT" : app?.state === "offline" ? "OFFLINE" : "OFF"}`}
                    tone={over ? "warn" : on ? "ok" : "muted"}
                    dashed={app?.state === "oos" || app?.state === "offline"}
                    pressed={on}
                    onClick={() => setApp(a.id, !on)}
                    title={over ? "Preview override — click to flip again, Reset to clear" : "Click to preview this appliance flipped"}
                  />
                );
              })}
            </div>
            <div className="dsc-tagrow" style={{ marginTop: 10 }}>
              <Button onClick={() => setOverrides(null)} disabled={!overrideCount} icon="refresh">
                Reset to live
              </Button>
              <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                {overrideCount ? `${overrideCount} preview override${overrideCount === 1 ? "" : "s"} active` : "Showing live state"}
              </span>
            </div>
          </Panel>

          <Panel legendIcon="cannabis-leaf" legend={`ROSTER IN PLACE · ${state.plants.length}`} tone="muted" className="dsc-twin-roster">
            {state.plants.length ? (
              <ul className="dsc-twin-roster-list">
                {state.plants.map((p) => (
                  <li key={p.slot} className={`is-${p.probeOos ? "muted" : p.moistureTone}`}>
                    <b>{p.name}</b>
                    <span>
                      {p.stage} · {p.day != null ? `day ${p.day}` : "no sprout date"} · {p.zone === "main" ? "4×8" : p.zone === "clone" ? "2×4" : "unassigned"}
                      {p.pot != null ? ` · pot ${p.pot}` : " · no pot"} · {p.vessel.label}
                    </span>
                    <small>
                      drawn as {p.variant} · Ø {Math.round(p.potDiameterM * 100)} cm{Number.isFinite(p.moisture) ? ` · ${Math.round(p.moisture)} % moisture` : p.probeOos ? " · probe out" : ""}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dsc-muted" style={{ margin: 0 }}>
                No plants on the roster. Commit one from Compose and it appears on its pot here.
              </p>
            )}
          </Panel>

          <Panel legendIcon="gauge-dial" legend="COST · THIS DEVICE" tone="muted">
            <dl className="dsc-twin-perf">
              <div>
                <dt>frame rate (2 s window)</dt>
                <dd>{perf?.fps != null ? `${perf.fps.toFixed(1)} fps` : "—"}</dd>
              </div>
              <div>
                <dt>draw calls · triangles</dt>
                <dd>{perf ? `${perf.drawCalls} · ${perf.triangles}` : "—"}</dd>
              </div>
            </dl>
            {gate && !gate.ok ? (
              <p className="dsc-panel-foot">
                Still because: {gate.why}. Add <code>?force3d=1</code> to render anyway.
              </p>
            ) : null}
          </Panel>
        </div>
      </div>
    </div>
  );
}
