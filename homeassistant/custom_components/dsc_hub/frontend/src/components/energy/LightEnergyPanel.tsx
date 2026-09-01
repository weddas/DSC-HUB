import { useCallback, useEffect, useState } from "react";
import { Button, Card, StatusChip } from "../ui";
import {
  getEnergyEstimate,
  getEnergySuggestions,
  getPendingFlips,
  postShiftPlan,
  resolveFlip,
  type EnergyEstimate,
  type EnergySuggestion,
  type PendingFlip,
} from "../../lib/fleetApi";

type Policy = "pause" | "flower_strict" | "veg_style";

const POLICY_COPY: Record<Policy, string> = {
  pause: "A — Pause: plan recorded, no automatic steps until you change policy.",
  flower_strict:
    "B — Flower-strict: ≤15 min/day slide; never shortens dark below want hours. Risk: slow move, flower stress if rushed.",
  veg_style: "C — Veg-style: ≤30 min/day slide. Faster window move; higher disruption if flowering.",
};

function fmtMoney(n: number | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return `$${n.toFixed(2)}`;
}

export function LightEnergyPanel({
  spaceId,
  lightsOn,
  wantHours,
}: {
  spaceId: "4x8" | "2x4";
  lightsOn: string;
  wantHours: number;
}) {
  const [estimate, setEstimate] = useState<EnergyEstimate | null>(null);
  const [suggestions, setSuggestions] = useState<EnergySuggestion[]>([]);
  const [flips, setFlips] = useState<PendingFlip[]>([]);
  const [pendingTarget, setPendingTarget] = useState<EnergySuggestion | null>(null);
  const [policy, setPolicy] = useState<Policy>("veg_style");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [est, sugg, pending] = await Promise.all([
        getEnergyEstimate(spaceId, lightsOn, wantHours),
        getEnergySuggestions(spaceId, lightsOn, wantHours),
        getPendingFlips(),
      ]);
      setEstimate(est);
      setSuggestions(sugg);
      setFlips(pending.filter((f) => f.space_id === spaceId));
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Energy load failed");
    }
  }, [spaceId, lightsOn, wantHours]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const confirmPlan = async () => {
    if (!pendingTarget) return;
    setBusy(true);
    setMsg(null);
    try {
      await postShiftPlan({
        space_id: spaceId,
        from_on: lightsOn.includes(":") ? lightsOn : `${lightsOn}:00`,
        to_on: pendingTarget.lights_on,
        want_hours: wantHours,
        policy,
        confirm: true,
      });
      setPendingTarget(null);
      setMsg("Slide plan started — steps only after this confirm; never silent.");
      await reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Plan failed");
    } finally {
      setBusy(false);
    }
  };

  const label = spaceId === "4x8" ? "4×8" : "2×4";
  const planning = suggestions.find((s) => s.learning?.planning_signal);

  return (
    <Card className="dsc-glass" title={`${label} energy (estimate)`}>
      <p className="dsc-muted" style={{ margin: "0 0 8px", fontSize: 12 }}>
        {estimate?.honesty || "Estimate from local watts × hours × tariff — not a utility bill."} Learning never
        auto-applies a schedule.
      </p>
      {estimate?.ok ? (
        <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
          <StatusChip label={`Est. ${fmtMoney(estimate.total_cost)}/day`} tone="ok" />
          <StatusChip label={`${estimate.total_kwh?.toFixed(2) ?? "—"} kWh`} tone="muted" />
        </div>
      ) : (
        <StatusChip label={estimate?.honesty || "No schedule for estimate"} tone="warn" />
      )}
      {planning ? (
        <div className="dsc-banner dsc-banner--warn" style={{ marginBottom: 8 }}>
          <strong>Learning planning signal</strong>
          <p className="dsc-muted" style={{ margin: "6px 0 0", fontSize: 13 }}>
            {planning.learning?.reason || "Sticky cost proxy — review alternatives when ready."} Not applied.
          </p>
        </div>
      ) : null}
      <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
        {suggestions
          .filter((s) => s.id !== "current")
          .map((s) => (
            <div key={s.id} className="dsc-chip-row" style={{ justifyContent: "space-between" }}>
              <span style={{ fontSize: 13 }}>
                {s.label} · on {s.lights_on.slice(0, 5)} · Δ {fmtMoney(s.delta_vs_current)}
                {s.learning?.planning_signal ? " · planning" : ""}
              </span>
              <Button
                onClick={() => {
                  setPendingTarget(s);
                  setMsg(null);
                }}
              >
                Start gradual…
              </Button>
            </div>
          ))}
      </div>
      {pendingTarget ? (
        <div className="dsc-banner" style={{ marginBottom: 8 }}>
          <strong>Confirm slide to {pendingTarget.label}</strong>
          <p className="dsc-muted" style={{ fontSize: 13, margin: "6px 0" }}>
            Pick flower policy. Nothing changes until Confirm.
          </p>
          {(Object.keys(POLICY_COPY) as Policy[]).map((p) => (
            <label key={p} style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              <input type="radio" name={`policy-${spaceId}`} checked={policy === p} onChange={() => setPolicy(p)} />{" "}
              {POLICY_COPY[p]}
            </label>
          ))}
          <div className="dsc-chip-row" style={{ marginTop: 8 }}>
            <Button teal disabled={busy} onClick={() => void confirmPlan()}>
              Confirm plan
            </Button>
            <Button disabled={busy} onClick={() => setPendingTarget(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
      {flips.length ? (
        <div style={{ marginTop: 8 }}>
          <strong style={{ fontSize: 13 }}>Pending photoperiod flips</strong>
          {flips.map((f) => (
            <div key={f.id} className="dsc-chip-row" style={{ marginTop: 6 }}>
              <StatusChip
                label={`${f.from_hours ?? "?"}h → ${f.to_hours ?? "?"}h`}
                tone="warn"
              />
              <Button
                disabled={busy}
                onClick={() =>
                  void resolveFlip(f.id, true).then(() => reload()).catch((e) => setErr(String(e)))
                }
              >
                Approve (banner only)
              </Button>
              <Button
                disabled={busy}
                onClick={() =>
                  void resolveFlip(f.id, false).then(() => reload()).catch((e) => setErr(String(e)))
                }
              >
                Deny
              </Button>
            </div>
          ))}
          <p className="dsc-muted" style={{ fontSize: 12 }}>
            Approve marks the request — it does not silently change lights-on.
          </p>
        </div>
      ) : null}
      {msg ? <StatusChip label={msg} tone="ok" /> : null}
      {err ? <StatusChip label={err} tone="bad" /> : null}
    </Card>
  );
}
