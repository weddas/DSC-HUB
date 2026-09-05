import { useEffect, useRef, useState } from "react";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import { useFleetEntity } from "../hooks/useFleetEntity";
import { useHeldReading } from "../hooks/useHeldReading";
import { OverflowMenu } from "./chrome";
import { draftTone, tentStageRailLabel, tentWantRail } from "../lib/tentWant";
import { EntitySelect, StatusChip } from "./ui";
import { useInspector } from "./InspectorHost";

export type TentKind = "main" | "clone";

export const TENT_ENTITIES = {
  main: {
    temp: "number.dsc_hub_target_temp",
    rhMin: "number.dsc_hub_rh_target_min",
    rhMax: "number.dsc_hub_rh_target_max",
    vpdMin: "number.dsc_hub_vpd_target_min",
    vpdMax: "number.dsc_hub_vpd_target_max",
    gotTemp: "sensor.dsc_hub_tent_temperature",
    gotRh: "sensor.dsc_hub_tent_humidity",
    gotVpd: "sensor.dsc_hub_vpd_kpa",
  },
  clone: {
    temp: "number.dsc_hub_clone_target_temp",
    rhMin: "number.dsc_hub_clone_rh_min",
    rhMax: "number.dsc_hub_clone_rh_max",
    vpdMin: "number.dsc_hub_clone_vpd_min",
    vpdMax: "number.dsc_hub_clone_vpd_max",
    gotTemp: "sensor.dsc_hub_clone_temperature",
    gotRh: "sensor.dsc_hub_clone_humidity",
    gotVpd: "sensor.dsc_hub_clone_vpd_kpa",
  },
} as const;

export function TargetNumber({
  entityId,
  label,
  step: stepProp,
  tone,
  hint,
  onLive,
  disabled,
}: {
  entityId: string;
  label: string;
  step?: number;
  tone?: "ok" | "warn" | "critical" | "muted" | "stale";
  hint?: string;
  onLive?: (value: number) => void;
  disabled?: boolean;
}) {
  const { state, available, attributes } = useFleetEntity(entityId);
  const { callService: fleetCallService } = useFleetActions();
  const ok = available && !disabled;
  const live = Number(state);
  const min = Number(attributes?.min ?? 0);
  const max = Number(attributes?.max ?? 100);
  const step = stepProp ?? Number(attributes?.step ?? 0.1);
  const [draft, setDraft] = useState(String(Number.isFinite(live) ? live : ""));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current && Number.isFinite(live)) setDraft(String(live));
  }, [live]);

  const commit = () => {
    if (!ok) return;
    const v = Number(draft);
    if (!Number.isFinite(v)) {
      setDraft(String(Number.isFinite(live) ? live : ""));
      return;
    }
    const clamped = Math.min(max, Math.max(min, v));
    const domain = entityId.split(".")[0];
    const svc = domain === "input_number" ? "input_number" : "number";
    void fleetCallService(svc, "set_value", { entity_id: entityId, value: clamped });
    setDraft(String(clamped));
  };

  const toneClass =
    tone === "critical"
      ? "is-bad"
      : tone === "warn"
        ? "is-warn"
        : tone === "muted"
          ? "is-muted"
          : "";

  return (
    <label className={`dsc-target-num${!ok ? " is-disabled" : ""} ${toneClass}`.trim()}>
      <span className="dsc-target-num-label">{label}</span>
      <input
        type="number"
        value={draft}
        disabled={!ok}
        min={min}
        max={max}
        step={step}
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(e) => {
          setDraft(e.target.value);
          const v = Number(e.target.value);
          if (Number.isFinite(v)) onLive?.(v);
        }}
        onBlur={() => {
          focused.current = false;
          commit();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
      />
      {hint ? <span className="dsc-target-hint">{hint}</span> : null}
    </label>
  );
}

function TentColumn({
  tent,
  title,
  hero,
  dimmed,
}: {
  tent: TentKind;
  title: string;
  hero?: boolean;
  dimmed?: boolean;
}) {
  const { num, state, entity } = useEntityBus();
  const inspector = useInspector();
  const e = TENT_ENTITIES[tent];
  const rail = tentWantRail(tent, { state, entity });
  const cloneMode = state("select.dsc_hub_clone_mode", "");
  // Follow 4x8 AND Follow Plants are both Pi/brain-owned (is_external_targets_mode in climate_mode.py) —
  // only Custom/Off leave the sliders to the operator.
  const climateFollowsPlants = tent === "clone" && cloneMode === "Follow Plants";
  const climateFollowsMain = tent === "clone" && (cloneMode === "Follow 4x8" || climateFollowsPlants);
  const tHeld = useHeldReading(e.gotTemp);
  const rhHeld = useHeldReading(e.gotRh);
  const vpdHeld = useHeldReading(e.gotVpd);
  // Keep held Got values when stale — dash would lie as "no data".
  const gotT = tHeld.value;
  const gotRh = rhHeld.value;
  const gotVpd = vpdHeld.value;
  const anyHeld = tHeld.stale || rhHeld.stale || vpdHeld.stale;
  const wantT = num(e.temp);
  const wantRhMin = num(e.rhMin);
  const wantRhMax = num(e.rhMax);
  const wantVMin = num(e.vpdMin);
  const wantVMax = num(e.vpdMax);
  const [draftT, setDraftT] = useState(wantT);
  const [draftRhMin, setDraftRhMin] = useState(wantRhMin);
  const [draftRhMax, setDraftRhMax] = useState(wantRhMax);
  const [draftVMin, setDraftVMin] = useState(wantVMin);
  const [draftVMax, setDraftVMax] = useState(wantVMax);

  // Re-sync tone/hint badges when Want changes externally (Follow Plants auto-write,
  // another client, strategy change) — onLive only updates these while the operator types.
  useEffect(() => setDraftT(wantT), [wantT]);
  useEffect(() => setDraftRhMin(wantRhMin), [wantRhMin]);
  useEffect(() => setDraftRhMax(wantRhMax), [wantRhMax]);
  useEffect(() => setDraftVMin(wantVMin), [wantVMin]);
  useEffect(() => setDraftVMax(wantVMax), [wantVMax]);

  const tScore = draftTone(draftT, rail.temp, false, rail);
  const rhMinScore = draftTone(draftRhMin, rail.rh, draftRhMin > draftRhMax, rail);
  const rhMaxScore = draftTone(draftRhMax, rail.rh, draftRhMin > draftRhMax, rail);
  const vMinScore = draftTone(draftVMin, rail.vpd, draftVMin > draftVMax, rail);
  const vMaxScore = draftTone(draftVMax, rail.vpd, draftVMin > draftVMax, rail);

  const openMoreInfo = (entityId: string, label: string, unit?: string) => {
    inspector.open({ entityId, label, unit });
  };

  return (
    <div className={`dsc-tent-targets${hero ? " is-hero" : ""}${dimmed ? " is-dim" : ""}`}>
      <div className="dsc-tent-targets-head">
        <strong>{title}</strong>
        <StatusChip icon="roster" label={tentStageRailLabel(rail, tent)} tone={rail.mixed ? "warn" : "muted"} />
        {rail.mixed ? <StatusChip label="mixed stages" tone="warn" /> : null}
        {rail.emptyLabel ? <StatusChip label={rail.emptyLabel} tone="muted" /> : null}
        {anyHeld ? <StatusChip label="HELD" tone="warn" /> : null}
        <OverflowMenu
          label={`${title} more`}
          items={[
            { id: "temp", label: "Inspector · temp", onSelect: () => openMoreInfo(e.temp, `${title} Want T`, "°C") },
            { id: "rh", label: "Inspector · RH", onSelect: () => openMoreInfo(e.rhMin, `${title} RH min`, "%") },
            { id: "vpd", label: "Inspector · VPD", onSelect: () => openMoreInfo(e.vpdMin, `${title} VPD min`, "kPa") },
          ]}
        />
      </div>
      <button
        type="button"
        className={`dsc-got-want dsc-got-want-hit${anyHeld ? " is-held" : ""}`}
        onClick={() => openMoreInfo(e.gotTemp, `${title} Got T`, "°C")}
      >
        <span>
          Got {Number.isFinite(gotT) ? `${gotT.toFixed(1)}°C` : "—"} /{" "}
          {Number.isFinite(gotRh) ? `${gotRh.toFixed(0)}%` : "—"}
          {Number.isFinite(gotVpd) ? ` / ${gotVpd.toFixed(2)} kPa` : ""}
          {anyHeld ? " · held" : ""}
        </span>
        <span className="dsc-muted">
          Want {Number.isFinite(wantT) ? wantT.toFixed(1) : "—"}°C · RH{" "}
          {Number.isFinite(wantRhMin) ? wantRhMin.toFixed(0) : "—"}–
          {Number.isFinite(wantRhMax) ? wantRhMax.toFixed(0) : "—"}%
        </span>
      </button>
      {rail.needs.length ? (
        <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
          {rail.needs.map((n) => (
            <StatusChip key={n} label={`Need ${n}`} tone="warn" />
          ))}
        </div>
      ) : null}
      {climateFollowsMain ? (
        <div className="dsc-tent-follow-banner" style={{ marginBottom: 10 }}>
          <StatusChip
            label={climateFollowsPlants ? "Climate follows plants" : "Climate follows 4×8"}
            tone="ok"
            icon="tent"
          />
          <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 13 }}>
            {climateFollowsPlants
              ? "Clone climate mode is Follow Plants — the Pi writes these targets on a ~12h cycle, so Want sliders lock here. Manual edits would be silently overwritten. Change mode below to edit by hand."
              : "Clone climate mode is Follow 4×8 — Want targets lock here. Edit 4×8 climate or change mode below."}
          </p>
        </div>
      ) : null}
      {tent === "clone" ? (
        <div style={{ marginBottom: 10 }}>
          <EntitySelect entityId="select.dsc_hub_clone_mode" label="Climate mode" icon="climate" />
          <p className="dsc-muted" style={{ fontSize: 12, margin: "6px 0 0" }}>
            Follow 4×8 mirrors main stage targets. Follow Plants intersects Want for 2×4 plants (Pi,
            ~12h). Custom leaves sliders alone. Off parks the 2×4. Photoperiod follow is on Light —
            separate from climate mode.
          </p>
        </div>
      ) : null}
      <div className="dsc-target-grid">
        <TargetNumber entityId={e.temp} label="Temp °C" step={0.5} tone={tScore.tone} hint={tScore.label} onLive={setDraftT} disabled={climateFollowsMain} />
        <TargetNumber entityId={e.rhMin} label="RH min %" step={1} tone={rhMinScore.tone} hint={rhMinScore.label} onLive={setDraftRhMin} disabled={climateFollowsMain} />
        <TargetNumber entityId={e.rhMax} label="RH max %" step={1} tone={rhMaxScore.tone} hint={rhMaxScore.label} onLive={setDraftRhMax} disabled={climateFollowsMain} />
        <TargetNumber entityId={e.vpdMin} label="VPD min" step={0.01} tone={vMinScore.tone} hint={vMinScore.label} onLive={setDraftVMin} disabled={climateFollowsMain} />
        <TargetNumber entityId={e.vpdMax} label="VPD max" step={0.01} tone={vMaxScore.tone} hint={vMaxScore.label} onLive={setDraftVMax} disabled={climateFollowsMain} />
      </div>
    </div>
  );
}

export function TentTargetPanel({
  compact,
  emphasize,
  only,
  hero,
}: {
  compact?: boolean;
  emphasize?: TentKind;
  /** Single-tent cockpits: show only that tent's Want editors. */
  only?: TentKind;
  hero?: boolean;
}) {
  const order: TentKind[] = only
    ? [only]
    : emphasize === "clone"
      ? ["clone", "main"]
      : ["main", "clone"];
  if (hero && !only) {
    const heroOrder: TentKind[] = emphasize === "clone" ? ["clone", "main"] : ["main", "clone"];
    return (
      <div className="dsc-target-heroes">
        {heroOrder.map((t) => (
          <TentColumn
            key={t}
            tent={t}
            title={t === "main" ? "4×8 climate" : "2×4 climate"}
            hero
            dimmed={emphasize != null && emphasize !== t}
          />
        ))}
      </div>
    );
  }
  return (
    <div className={`dsc-target-panel${compact ? " is-compact" : ""}`}>
      {order.map((t) => (
        <TentColumn
          key={t}
          tent={t}
          title={t === "main" ? "4×8 climate" : "2×4 climate"}
          hero={hero}
          dimmed={emphasize != null && emphasize !== t}
        />
      ))}
    </div>
  );
}
