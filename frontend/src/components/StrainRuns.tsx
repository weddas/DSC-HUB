import { useNavigate } from "react-router-dom";
import { useEntityBus } from "../hooks/useEntityBus";
import { useZones } from "../hooks/useZones";
import { useHistory } from "../hooks/useHistory";
import { fmtFractionOfHours, inBandFraction } from "../lib/derived/climate";
import { paths } from "../lib/paths";
import { daysSinceSproutIso, rosterSlots, type RosterSlot } from "../lib/probeModel";
import type { CatalogItem } from "../lib/catalog";
import { StatusTag } from "./ui";

function matchesStrain(slot: RosterSlot, item: CatalogItem): boolean {
  const name = String(item.name || "").trim().toLowerCase();
  if (!name) return false;
  const hay = `${slot.strain ?? ""} ${slot.nickname ?? ""}`.toLowerCase();
  return hay.includes(name);
}

function tentOf(slot: RosterSlot): "main" | "clone" | null {
  const t = String(slot.tent ?? "").toLowerCase();
  if (t === "main" || t === "4x8" || t === "4×8") return "main";
  if (t === "clone" || t === "2x4" || t === "2×4") return "clone";
  return null;
}

function RunRow({ slot, item }: { slot: RosterSlot; item: CatalogItem }) {
  const { state } = useEntityBus();
  const zones = useZones();
  const navigate = useNavigate();
  // The probe's live tent beats the roster's remembered one when the plant is on a probe.
  const potN = String(slot.pot ?? "").replace(/^pot/, "");
  const probeTent = potN ? String(state(`input_select.dsc_probe${potN}_tent`, "")).toLowerCase() : "";
  const tent =
    probeTent === "main" || probeTent === "4x8"
      ? "main"
      : probeTent === "clone" || probeTent === "2x4"
        ? "clone"
        : tentOf(slot);
  const zone = tent === "main" ? zones.main : tent === "clone" ? zones.clone : null;
  const { points } = useHistory(zone?.vpd.entityId ?? "", 24, 96);
  const inBand = zone ? inBandFraction(points, zone.vpd.band) : null;
  const days = daysSinceSproutIso(slot.sprout);
  const pot = String(slot.pot ?? "").replace(/^pot/, "");
  const stage = pot ? state(`sensor.dsc_probe${pot}_expected_stage`, "") : "";
  const status = String(slot.status ?? "active").toLowerCase();
  const live = status === "active" && !!zone;
  return (
    <div className={`dsc-runs-row${live ? "" : " is-past"}`}>
      <span className="dsc-runs-plant">
        <strong>{slot.nickname || slot.strain || item.name}</strong>
        {slot.blend ? <span className="dsc-runs-sub">{slot.blend}</span> : null}
      </span>
      <span>{zone ? zone.label : "—"}</span>
      <span>{slot.sprout && slot.sprout !== "—" ? String(slot.sprout).slice(0, 10) : "—"}</span>
      <span>{days != null ? `d ${days}` : "—"}</span>
      <span>{stage && stage !== "—" && stage !== "unknown" ? stage : live ? "—" : status}</span>
      <span className={inBand != null ? (inBand >= 0.8 ? "is-ok" : inBand >= 0.5 ? "is-warn" : "is-bad") : ""}>
        {inBand != null ? fmtFractionOfHours(inBand, 24) : "—"}
      </span>
      <span title="Appears once a harvest weight is logged in the journal">—</span>
      <span>
        {tent ? (
          <button type="button" className="dsc-alert-cta" onClick={() => navigate(paths.logs(`scope=space&id=${tent === "main" ? "4x8" : "2x4"}`))}>
            LOG →
          </button>
        ) : null}
      </span>
    </div>
  );
}

/**
 * "Runs in DSC-HUB" (frame 1i): how this cultivar has performed *here* — every roster
 * plant matching the strain, its zone, sprout date, day count, stage, and the zone's VPD
 * in-band time over the last 24 h. g/W stays a dash until a harvest is logged.
 */
export function StrainRuns({ item }: { item: CatalogItem }) {
  const { entity } = useEntityBus();
  const slots = rosterSlots(entity).filter((s) => matchesStrain(s, item));
  const active = slots.filter((s) => String(s.status ?? "active").toLowerCase() === "active").length;
  return (
    <div className="dsc-runs">
      <div className="dsc-runs-head">
        <span className="dsc-legend">Runs in DSC-HUB · how it performed here</span>
        <StatusTag label={slots.length ? `${active} LIVE · ${slots.length} ON ROSTER` : "NO RUNS YET"} tone={active ? "ok" : "muted"} />
      </div>
      {slots.length ? (
        <div className="dsc-runs-grid">
          <span className="dsc-legend">Plant</span>
          <span className="dsc-legend">Zone</span>
          <span className="dsc-legend">Sprouted</span>
          <span className="dsc-legend">Days</span>
          <span className="dsc-legend">Stage</span>
          <span className="dsc-legend">VPD in band · 24 h</span>
          <span className="dsc-legend">g / W</span>
          <span />
          {slots.map((s) => (
            <RunRow key={s.slot} slot={s} item={item} />
          ))}
        </div>
      ) : (
        <p className="dsc-panel-foot">
          This cultivar has not been on the roster. Use in Compose to start a run; it shows up here with its zone and days.
        </p>
      )}
      <p className="dsc-panel-foot">
        VPD in band is the zone's last 24 h, not the whole run — the recorder holds days, not cycles. Yield and g/W appear once a
        harvest is logged in the journal.
      </p>
    </div>
  );
}
