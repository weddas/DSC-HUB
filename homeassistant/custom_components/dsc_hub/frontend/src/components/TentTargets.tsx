import { useEffect, useState } from "react";
import { useHass } from "../hooks/useHass";
import { OverflowMenu } from "./chrome";

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
}: {
  entityId: string;
  label: string;
  step?: number;
}) {
  const { num, available, callService, entity } = useHass();
  const ok = available(entityId);
  const ent = entity(entityId);
  const live = num(entityId, NaN);
  const min = Number(ent?.attributes?.min ?? 0);
  const max = Number(ent?.attributes?.max ?? 100);
  const step = stepProp ?? Number(ent?.attributes?.step ?? 0.1);
  const [draft, setDraft] = useState(String(Number.isFinite(live) ? live : ""));

  useEffect(() => {
    if (Number.isFinite(live)) setDraft(String(live));
  }, [live]);

  const commit = () => {
    if (!ok) return;
    const v = Number(draft);
    if (!Number.isFinite(v)) {
      setDraft(String(Number.isFinite(live) ? live : ""));
      return;
    }
    const clamped = Math.min(max, Math.max(min, v));
    void callService("number", "set_value", { entity_id: entityId, value: clamped });
    setDraft(String(clamped));
  };

  return (
    <label className={`dsc-target-num${!ok ? " is-disabled" : ""}`}>
      <span className="dsc-target-num-label">{label}</span>
      <input
        type="number"
        value={draft}
        disabled={!ok}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
      />
    </label>
  );
}

function TentColumn({ tent, title }: { tent: TentKind; title: string }) {
  const { num, available } = useHass();
  const e = TENT_ENTITIES[tent];
  const gotT = num(e.gotTemp);
  const gotRh = num(e.gotRh);
  const gotVpd = available(e.gotVpd) ? num(e.gotVpd) : NaN;
  const wantT = num(e.temp);
  const wantRhMin = num(e.rhMin);
  const wantRhMax = num(e.rhMax);

  const openMoreInfo = (entityId: string) => {
    const ev = new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true,
    });
    document.querySelector("home-assistant")?.dispatchEvent(ev);
  };

  return (
    <div className="dsc-tent-targets">
      <div className="dsc-tent-targets-head">
        <strong>{title}</strong>
        <OverflowMenu
          label={`${title} more`}
          items={[
            {
              id: "temp",
              label: "More info · temp target",
              onSelect: () => openMoreInfo(e.temp),
            },
            {
              id: "rh",
              label: "More info · RH band",
              onSelect: () => openMoreInfo(e.rhMin),
            },
            {
              id: "vpd",
              label: "More info · VPD band",
              onSelect: () => openMoreInfo(e.vpdMin),
            },
          ]}
        />
      </div>
      <div className="dsc-got-want">
        <span>
          Got {Number.isFinite(gotT) ? gotT.toFixed(1) : "—"}°C /{" "}
          {Number.isFinite(gotRh) ? gotRh.toFixed(0) : "—"}%
          {Number.isFinite(gotVpd) ? ` / ${gotVpd.toFixed(2)} kPa` : ""}
        </span>
        <span className="dsc-muted">
          Want {Number.isFinite(wantT) ? wantT.toFixed(1) : "—"}°C · RH{" "}
          {Number.isFinite(wantRhMin) ? wantRhMin.toFixed(0) : "—"}–
          {Number.isFinite(wantRhMax) ? wantRhMax.toFixed(0) : "—"}%
        </span>
      </div>
      <div className="dsc-target-grid">
        <TargetNumber entityId={e.temp} label="Temp °C" step={0.5} />
        <TargetNumber entityId={e.rhMin} label="RH min %" step={1} />
        <TargetNumber entityId={e.rhMax} label="RH max %" step={1} />
        <TargetNumber entityId={e.vpdMin} label="VPD min" step={0.01} />
        <TargetNumber entityId={e.vpdMax} label="VPD max" step={0.01} />
      </div>
    </div>
  );
}

export function TentTargetPanel({
  compact,
  emphasize,
}: {
  compact?: boolean;
  emphasize?: TentKind;
}) {
  const order: TentKind[] =
    emphasize === "clone" ? ["clone", "main"] : ["main", "clone"];
  return (
    <div className={`dsc-target-panel${compact ? " is-compact" : ""}`}>
      {order.map((t) => (
        <TentColumn key={t} tent={t} title={t === "main" ? "Main 4×8" : "Clone 2×4"} />
      ))}
    </div>
  );
}
