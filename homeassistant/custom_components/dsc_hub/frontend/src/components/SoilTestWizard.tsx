import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, StatusChip } from "./ui";
import { DecisionLayer } from "./DecisionLayer";
import {
  cancelSoilTest,
  confirmSoilTest,
  getProbeStations,
  pollSoilTest,
  startSoilTest,
  type ProbeStation,
  type SoilTestPoll,
} from "../lib/fleetApi";
import { rosterSlots, KIT_PROBE_NUMBERS } from "../lib/seatModel";
import { useEntityBus } from "../hooks/useEntityBus";

const TIMING_OPTIONS = [
  { id: "before_water", label: "Before water" },
  { id: "after_water", label: "After water" },
  { id: "during_water", label: "During water" },
  { id: "outside_water", label: "Outside water window" },
  { id: "adhoc", label: "Ad hoc" },
] as const;

const POT_IDS = KIT_PROBE_NUMBERS.map((n) => `pot${n}` as const);

type WizardStep =
  | "station"
  | "target"
  | "timing"
  | "move"
  | "capture"
  | "confirm"
  | "done";

function fmtReading(v: number | null | undefined, digits = 1): string {
  return v != null && Number.isFinite(v) ? v.toFixed(digits) : "—";
}

function ReadingsTable({ readings }: { readings?: Record<string, number | null> }) {
  if (!readings) return null;
  const rows: [string, string][] = [
    ["Moisture", `${fmtReading(readings.moisture_pct)} %`],
    ["Soil °C", `${fmtReading(readings.soil_temp_c)} °C`],
    ["EC", fmtReading(readings.ec_us, 0)],
    ["pH", fmtReading(readings.ph, 2)],
    ["N / P / K", `${fmtReading(readings.nitrogen, 0)} / ${fmtReading(readings.phosphorus, 0)} / ${fmtReading(readings.potassium, 0)}`],
  ];
  return (
    <dl className="dsc-detail-list">
      {rows.map(([k, v]) => (
        <span key={k} style={{ display: "contents" }}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </span>
      ))}
    </dl>
  );
}

export type SoilTestWizardProps = {
  /** When set, pre-select this probe station seat id. */
  initialStationId?: string;
  /** Called when wizard completes or is dismissed from done step. */
  onClose?: () => void;
  compact?: boolean;
};

export function SoilTestWizard({ initialStationId, onClose, compact }: SoilTestWizardProps) {
  const { entity } = useEntityBus();
  const [step, setStep] = useState<WizardStep>("station");
  const [stations, setStations] = useState<ProbeStation[]>([]);
  const [stationId, setStationId] = useState(initialStationId ?? "");
  const [mode, setMode] = useState<"roster" | "adhoc">("roster");
  const [targetPotId, setTargetPotId] = useState("pot1");
  const [rosterSeatId, setRosterSeatId] = useState<string>("");
  const [plantLabel, setPlantLabel] = useState("");
  const [timingNote, setTimingNote] = useState<string>("adhoc");
  const [notes, setNotes] = useState("");
  const [testId, setTestId] = useState<string | null>(null);
  const [poll, setPoll] = useState<SoilTestPoll | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [returnHomePotId, setReturnHomePotId] = useState<string | null>(null);
  const [confirmAbort, setConfirmAbort] = useState(false);

  const roster = useMemo(() => rosterSlots(entity), [entity]);

  const refreshStations = useCallback(async () => {
    try {
      const list = await getProbeStations();
      setStations(list);
      if (!stationId && list.length) {
        const pick = initialStationId
          ? list.find((s) => s.seat_id === initialStationId) ?? list[0]
          : list[0];
        setStationId(pick.seat_id);
      }
    } catch {
      setStatus("Could not load probe stations.");
    }
  }, [initialStationId, stationId]);

  useEffect(() => {
    void refreshStations();
  }, [refreshStations]);

  const selectedStation = stations.find((s) => s.seat_id === stationId);

  const rosterOptions = useMemo(
    () =>
      roster.filter((slot) => {
        const pot = String(slot.pot ?? "");
        return pot && pot !== "none" && POT_IDS.includes(pot as (typeof POT_IDS)[number]);
      }),
    [roster],
  );

  useEffect(() => {
    if (mode !== "roster" || !rosterOptions.length) return;
    const match = rosterOptions.find((s) => String(s.pot) === targetPotId) ?? rosterOptions[0];
    setRosterSeatId(String(match.slot));
    setPlantLabel(String(match.nickname || match.strain || ""));
    setTargetPotId(String(match.pot));
  }, [mode, rosterOptions, targetPotId]);

  const beginCapture = async () => {
    if (!stationId || !targetPotId) return;
    setBusy(true);
    setStatus("Starting capture session…");
    try {
      const res = await startSoilTest({
        probe_seat_id: stationId,
        target_pot_id: targetPotId,
        roster_seat_id: mode === "roster" && rosterSeatId ? rosterSeatId : null,
        plant_label: plantLabel,
        mode,
        timing_note: timingNote,
        notes,
        tent: selectedStation?.tent ?? null,
      });
      setTestId(res.id);
      setStep("capture");
      setStatus("Hold probe steady in the target pot.");
    } catch (exc) {
      setStatus(exc instanceof Error ? exc.message : "Start failed");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (step !== "capture" || !testId) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const next = await pollSoilTest(testId);
        if (cancelled) return;
        setPoll(next);
        if (next.status === "stable" || next.stable) {
          setStep("confirm");
          setStatus("Readings stable — confirm to save snapshot.");
        }
      } catch {
        if (!cancelled) setStatus("Poll failed — check probe is on target pot.");
      }
    };
    void tick();
    const id = window.setInterval(() => void tick(), 3000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [step, testId]);

  const handleConfirm = async () => {
    if (!testId) return;
    setBusy(true);
    setStatus("Confirming snapshot…");
    try {
      const res = await confirmSoilTest(testId);
      setReturnHomePotId(res.return_home_pot_id ?? selectedStation?.idle_home_pot_id ?? null);
      setPoll({ id: testId, status: "confirmed", test: res.test });
      setStep("done");
      setStatus(res.message ?? "Snapshot saved.");
      await refreshStations();
    } catch (exc) {
      setStatus(exc instanceof Error ? exc.message : "Confirm failed — wait for stability.");
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    if (!testId) {
      setStep("station");
      onClose?.();
      return;
    }
    setBusy(true);
    try {
      await cancelSoilTest(testId);
      setTestId(null);
      setPoll(null);
      setStep("station");
      setStatus("Session cancelled — probe returned to idle mode.");
      await refreshStations();
    } catch (exc) {
      setStatus(exc instanceof Error ? exc.message : "Cancel failed");
    } finally {
      setBusy(false);
      setConfirmAbort(false);
    }
  };

  const stepLabel = (s: WizardStep, label: string) => (
    <span className={`dsc-stage-pill${step === s ? " is-on" : ""}`}>{label}</span>
  );

  return (
    <div className={compact ? "" : "dsc-soil-wizard"}>
      {!compact ? (
        <Card className="dsc-glass" title="Soil test wizard" icon="root">
          <p className="dsc-muted">
            Mobile probe stations capture a confirmed soil snapshot at a target pot. Return the probe to its idle home
            pot when finished.
          </p>
        </Card>
      ) : null}

      <div className="dsc-stage-track" style={{ margin: "12px 0", flexWrap: "wrap" }}>
        {stepLabel("station", "Station")}
        {stepLabel("target", "Plant")}
        {stepLabel("timing", "Timing")}
        {stepLabel("move", "Move")}
        {stepLabel("capture", "Capture")}
        {stepLabel("confirm", "Confirm")}
        {stepLabel("done", "Home")}
      </div>

      {step === "station" ? (
        <Card className="dsc-glass" title="1 · Probe station" icon="root">
          {stations.length ? (
            <div className="dsc-chip-row" style={{ marginBottom: 12 }}>
              {stations.map((s) => (
                <button
                  key={s.seat_id}
                  type="button"
                  className={`dsc-chip${stationId === s.seat_id ? " dsc-chip--ok" : ""}`}
                  onClick={() => setStationId(s.seat_id)}
                >
                  {s.seat_id} · {s.tent}
                </button>
              ))}
            </div>
          ) : (
            <p className="dsc-honesty">No probe stations configured — set role in Settings → Probe stations.</p>
          )}
          {selectedStation ? (
            <div className="dsc-chip-row">
              <StatusChip
                label={selectedStation.reading_mode === "idle" ? "IDLE" : selectedStation.reading_mode.toUpperCase()}
                tone={selectedStation.reading_mode === "idle" ? "ok" : "warn"}
              />
              <StatusChip label={selectedStation.online ? "ONLINE" : "OFFLINE"} tone={selectedStation.online ? "ok" : "bad"} />
              <StatusChip label={`Home ${selectedStation.idle_home_pot_id || "—"}`} tone="muted" />
            </div>
          ) : null}
          {selectedStation?.thereabouts ? (
            <div style={{ marginTop: 10 }}>
              <p className="dsc-muted" style={{ fontSize: 12 }}>
                Thereabouts @ idle home:
              </p>
              <ReadingsTable readings={selectedStation.thereabouts as Record<string, number | null>} />
            </div>
          ) : null}
          <div className="dsc-row-actions" style={{ marginTop: 12 }}>
            <Button variant="primary" disabled={!stationId} onClick={() => setStep("target")}>
              Next
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "target" ? (
        <Card className="dsc-glass" title="2 · Target plant" icon="roster">
          <div className="dsc-chip-row" style={{ marginBottom: 12 }}>
            <button
              type="button"
              className={`dsc-chip${mode === "roster" ? " dsc-chip--ok" : ""}`}
              onClick={() => setMode("roster")}
            >
              Roster plant
            </button>
            <button
              type="button"
              className={`dsc-chip${mode === "adhoc" ? " dsc-chip--ok" : ""}`}
              onClick={() => setMode("adhoc")}
            >
              Ad hoc pot
            </button>
          </div>
          {mode === "roster" ? (
            rosterOptions.length ? (
              <label>
                Roster slot
                <select
                  value={rosterSeatId}
                  onChange={(e) => {
                    const slot = rosterOptions.find((r) => String(r.slot) === e.target.value);
                    if (slot) {
                      setRosterSeatId(String(slot.slot));
                      setTargetPotId(String(slot.pot));
                      setPlantLabel(String(slot.nickname || slot.strain || ""));
                    }
                  }}
                >
                  {rosterOptions.map((slot) => (
                    <option key={String(slot.slot)} value={String(slot.slot)}>
                      #{slot.slot} {String(slot.nickname || slot.strain || "plant")} → {String(slot.pot)}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="dsc-honesty">No roster plants on pots — use ad hoc or commit from Compose.</p>
            )
          ) : (
            <>
              <label>
                Target pot
                <select value={targetPotId} onChange={(e) => setTargetPotId(e.target.value)}>
                  {POT_IDS.map((p) => (
                    <option key={p} value={p}>
                      {p.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Label (optional)
                <input type="text" value={plantLabel} onChange={(e) => setPlantLabel(e.target.value)} placeholder="e.g. Blue Dream #2" />
              </label>
            </>
          )}
          <div className="dsc-row-actions" style={{ marginTop: 12 }}>
            <Button variant="secondary" onClick={() => setStep("station")}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep("timing")}>
              Next
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "timing" ? (
        <Card className="dsc-glass" title="3 · Timing" icon="root">
          <div className="dsc-chip-row" style={{ flexWrap: "wrap", marginBottom: 12 }}>
            {TIMING_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`dsc-chip${timingNote === opt.id ? " dsc-chip--ok" : ""}`}
                onClick={() => setTimingNote(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <label>
            Notes
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional operator note" />
          </label>
          <div className="dsc-row-actions" style={{ marginTop: 12 }}>
            <Button variant="secondary" onClick={() => setStep("target")}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep("move")}>
              Next
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "move" ? (
        <Card className="dsc-glass" title="4 · Move probe" icon="root">
          <p className="dsc-honesty">
            Move the probe from <strong>{selectedStation?.idle_home_pot_id || stationId}</strong> to{" "}
            <strong>{targetPotId.toUpperCase()}</strong>
            {plantLabel ? ` (${plantLabel})` : ""}. Seat it at the same depth you use for routine checks.
          </p>
          <div className="dsc-row-actions" style={{ marginTop: 12 }}>
            <Button variant="secondary" onClick={() => setStep("timing")}>
              Back
            </Button>
            <Button variant="primary" disabled={busy} onClick={() => void beginCapture()}>
              Probe seated — start capture
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "capture" || step === "confirm" ? (
        <Card className="dsc-glass" title="5 · Capture" icon="gauge">
          <div className="dsc-chip-row">
            <StatusChip
              label={poll?.stable ? "STABLE" : "CAPTURING"}
              tone={poll?.stable ? "ok" : "warn"}
              pulse={!poll?.stable}
            />
            {poll?.elapsed_s != null ? <StatusChip label={`${poll.elapsed_s}s`} tone="muted" /> : null}
            {poll?.variance != null ? (
              <StatusChip label={`σ ${poll.variance.toFixed(2)}`} tone={poll.variance <= 2.5 ? "ok" : "warn"} />
            ) : null}
          </div>
          <ReadingsTable readings={poll?.current} />
          {poll?.average ? (
            <>
              <p className="dsc-muted" style={{ marginTop: 8, fontSize: 12 }}>
                Rolling average:
              </p>
              <ReadingsTable readings={poll.average} />
            </>
          ) : null}
          <div className="dsc-row-actions" style={{ marginTop: 12 }}>
            <Button variant="danger" onClick={() => setConfirmAbort(true)}>
              Cancel
            </Button>
            {step === "confirm" ? (
              <Button variant="primary" disabled={busy} onClick={() => void handleConfirm()}>
                Confirm snapshot
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                Waiting for stability…
              </Button>
            )}
          </div>
        </Card>
      ) : null}

      {step === "done" ? (
        <Card className="dsc-glass" title="6 · Return home" icon="ok">
          <p className="dsc-honesty">{status}</p>
          {poll?.test ? <ReadingsTable readings={poll.test.readings} /> : null}
          <p className="dsc-muted">
            Return the probe to <strong>{returnHomePotId ?? selectedStation?.idle_home_pot_id ?? "idle home"}</strong>{" "}
            for safety before the next reading.
          </p>
          <div className="dsc-row-actions" style={{ marginTop: 12 }}>
            <Button
              variant="primary"
              onClick={() => {
                setStep("station");
                setTestId(null);
                setPoll(null);
                onClose?.();
              }}
            >
              Done
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setStep("station");
                setTestId(null);
                setPoll(null);
              }}
            >
              Run another test
            </Button>
          </div>
        </Card>
      ) : null}

      {status && step !== "done" ? <p className="dsc-honesty">{status}</p> : null}

      <DecisionLayer
        open={confirmAbort}
        onDismiss={() => setConfirmAbort(false)}
        onConfirm={() => void handleCancel()}
        title="Cancel soil test"
        confirmLabel="Cancel session"
        help={null}
      >
        <p>Aborts capture and sets the probe station back to idle mode.</p>
      </DecisionLayer>
    </div>
  );
}
