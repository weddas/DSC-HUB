import { useCallback, useEffect, useState } from "react";
import { Button, Card, PageHeader, StatusChip } from "../components/ui";
import { DecisionLayer } from "../components/DecisionLayer";
import { TargetNumber } from "../components/TentTargets";
import { SoilTestWizard } from "../components/SoilTestWizard";
import { save_calibration } from "../lib/fleetApi";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";

const CAL_TARGETS = [
  { id: "out", label: "OUT exhaust", prefix: "dsc_cal_cfm_out", select: "OUT" },
  { id: "recirc", label: "RECIRC", prefix: "dsc_cal_cfm_recirc", select: "RECIRC" },
  { id: "intake_main", label: "Intake 4×8", prefix: "dsc_cal_cfm_intake_main", select: "Intake Main" },
  { id: "intake_clone", label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", select: "Intake 2×4" },
] as const;

const STEP_PCTS = [25, 50, 75, 100] as const;

const LIGHT_STEPS = [
  { key: "25", pct: 25, label: "25% dim" },
  { key: "50", pct: 50, label: "50% dim" },
  { key: "75", pct: 75, label: "75% dim" },
  { key: "100", pct: 100, label: "100% dim" },
] as const;

type WizardPhase = "pick" | "session" | "done";
type CalTab = "fan" | "light" | "tank" | "soil";

function FanCalibrateWizard() {
  const { state, num } = useEntityBus();
  const { callService } = useFleetActions();
  const [phase, setPhase] = useState<WizardPhase>("pick");
  const [targetIdx, setTargetIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [msReading, setMsReading] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmStart, setConfirmStart] = useState(false);

  const target = CAL_TARGETS[targetIdx];
  const stepPct = STEP_PCTS[stepIdx];
  const calActive = state("input_boolean.dsc_cal_active") === "on";
  const curveStatus = state("sensor.dsc_cfm_curves_status", "—");

  const resetWizard = useCallback(() => {
    setPhase("pick");
    setTargetIdx(0);
    setStepIdx(0);
    setMsReading("");
    setStatus("");
  }, []);

  useEffect(() => {
    if (phase === "session" && !calActive && stepIdx === 0 && !saving) {
      /* session ended externally */
    }
  }, [calActive, phase, stepIdx, saving]);

  const startSession = async () => {
    setSaving(true);
    setStatus("Starting cal session…");
    try {
      await callService("input_select", "select_option", {
        entity_id: "input_select.dsc_cal_target",
        option: target.select,
      });
      await callService("script", "turn_on", { entity_id: "script.dsc_cal_start" });
      setPhase("session");
      setStepIdx(0);
      setMsReading("");
      setStatus(`Hold fan at ${STEP_PCTS[0]}% — enter anemometer m/s.`);
    } catch (exc) {
      setStatus(exc instanceof Error ? exc.message : "Start failed");
    } finally {
      setSaving(false);
    }
  };

  const savePoint = async () => {
    const ms = Number(msReading);
    if (!Number.isFinite(ms) || ms <= 0) {
      setStatus("Enter a valid m/s reading, or skip this step.");
      return;
    }
    setSaving(true);
    setStatus(`Saving @${stepPct}%…`);
    try {
      await callService("input_number", "set_value", {
        entity_id: "input_number.dsc_cal_step_pct",
        value: stepPct,
      });
      await callService("input_number", "set_value", {
        entity_id: "input_number.dsc_cal_reading_ms",
        value: ms,
      });
      await callService("script", "turn_on", { entity_id: "script.dsc_cal_save_point" });
      await callService("input_number", "set_value", {
        entity_id: `input_number.${target.prefix}_${stepPct}`,
        value: ms,
      });
      await save_calibration(target.prefix, "fan_cfm", [
        { step_key: String(stepPct), measured_value: ms, unit: "m/s" },
      ]);
      const next = stepIdx + 1;
      if (next >= STEP_PCTS.length) {
        await callService("script", "turn_on", { entity_id: "script.dsc_cal_finish" });
        setPhase("done");
        setStatus(`Curve points saved for ${target.label}. Status: ${curveStatus}`);
      } else {
        setStepIdx(next);
        setMsReading("");
        setStatus(`Point @${stepPct}% saved. Hold fan at ${STEP_PCTS[next]}% and measure.`);
        await callService("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" });
      }
    } catch (exc) {
      setStatus(exc instanceof Error ? exc.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const skipPoint = async () => {
    setSaving(true);
    try {
      await callService("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" });
      const next = stepIdx + 1;
      if (next >= STEP_PCTS.length) {
        await callService("script", "turn_on", { entity_id: "script.dsc_cal_finish" });
        setPhase("done");
        setStatus("Session finished (skipped remaining).");
      } else {
        setStepIdx(next);
        setMsReading("");
        setStatus(`Skipped @${stepPct}%. Next: ${STEP_PCTS[next]}%.`);
      }
    } finally {
      setSaving(false);
    }
  };

  const abortSession = async () => {
    setSaving(true);
    try {
      await callService("script", "turn_on", { entity_id: "script.dsc_cal_abort" });
      resetWizard();
      setStatus("Session aborted — fans restored.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="dsc-status-strip">
        <StatusChip label={`Curves ${curveStatus}`} tone={curveStatus === "all_curves" ? "ok" : "warn"} />
        <StatusChip label={calActive ? "SESSION ON" : "Session idle"} tone={calActive ? "ok" : "muted"} />
        {phase === "session" ? (
          <StatusChip label={`Step ${stepIdx + 1}/${STEP_PCTS.length} · ${stepPct}%`} tone="ok" pulse />
        ) : null}
      </div>

      {phase === "pick" ? (
        <Card className="dsc-glass" title="1 · Select duct" icon="fan">
          <p className="dsc-muted">
            Hold the anemometer at the centre of the duct at each fan step. At least two measured points per duct are
            needed before real curves replace the rated estimate.
          </p>
          <div className="dsc-chip-row" style={{ margin: "12px 0" }}>
            {CAL_TARGETS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                className={`dsc-chip${targetIdx === i ? " dsc-chip--ok" : ""}`}
                onClick={() => setTargetIdx(i)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="dsc-row-actions">
            <Button variant="primary" disabled={saving} onClick={() => setConfirmStart(true)}>
              Start {target.label} session
            </Button>
          </div>
          <DecisionLayer
            open={confirmStart}
            onDismiss={() => setConfirmStart(false)}
            onConfirm={() => {
              setConfirmStart(false);
              void startSession();
            }}
            title={`Start ${target.label} calibration`}
            confirmLabel="Start session"
            help={null}
          >
            <p>
              The hub will hold the {target.label} fan at stepped duties while you measure. Fans run until you finish or
              abort.
            </p>
          </DecisionLayer>
        </Card>
      ) : null}

      {phase === "session" ? (
        <Card className="dsc-glass" title={`2 · Sample ${target.label} @ ${stepPct}%`} icon="gauge">
          <p className="dsc-honesty">
            Set the fan to {stepPct}%. Hold the anemometer at the duct centreline and enter the measured m/s — CFM is
            calculated for you.
          </p>
          <label>
            Anemometer m/s @ {stepPct}%
            <input
              type="number"
              step="0.01"
              min="0"
              value={msReading}
              onChange={(e) => setMsReading(e.target.value)}
              placeholder={
                num("input_number.dsc_cal_reading_ms", 0) > 0
                  ? String(num("input_number.dsc_cal_reading_ms"))
                  : "e.g. 3.2"
              }
            />
          </label>
          <p className="dsc-kpi-sub">
            Saved to the {target.label} curve at {stepPct}%.
          </p>
          <div className="dsc-stage-track">
            {STEP_PCTS.map((pct, i) => (
              <span key={pct} className={`dsc-stage-pill${i === stepIdx ? " is-on" : i > stepIdx ? "" : " is-next"}`}>
                {pct}%
              </span>
            ))}
          </div>
          <div className="dsc-row-actions">
            <Button variant="primary" disabled={saving} onClick={() => void savePoint()}>
              Save @ {stepPct}%
            </Button>
            <Button variant="secondary" disabled={saving} onClick={() => void skipPoint()}>
              Skip step
            </Button>
            <Button variant="danger" disabled={saving} onClick={() => void abortSession()}>
              Abort
            </Button>
          </div>
        </Card>
      ) : null}

      {phase === "done" ? (
        <Card className="dsc-glass" title="3 · Done" icon="ok">
          <p className="dsc-honesty">{status || "Session complete."}</p>
          <p className="dsc-muted">Curve status: {curveStatus}. The Climate page uses this curve for its airflow numbers.</p>
          <div className="dsc-row-actions">
            <Button variant="primary" onClick={resetWizard}>
              Calibrate another duct
            </Button>
          </div>
        </Card>
      ) : null}

      {status && phase !== "done" ? <p className="dsc-honesty">{status}</p> : null}
    </>
  );
}

function LightParWizard() {
  const { callService } = useFleetActions();
  const [stepIdx, setStepIdx] = useState(0);
  const [luxReading, setLuxReading] = useState("");
  const [parReading, setParReading] = useState("");
  const [heightCm, setHeightCm] = useState("45");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [done, setDone] = useState(false);
  const [confirmLightStart, setConfirmLightStart] = useState(false);

  const step = LIGHT_STEPS[stepIdx];

  const setLightLevel = async (pct: number) => {
    await callService("light", "turn_on", {
      entity_id: "light.dsc_hub_sf1000_dimmer",
      brightness_pct: pct,
    });
  };

  const saveStep = async () => {
    const lux = Number(luxReading);
    const par = Number(parReading);
    if (!Number.isFinite(lux) || lux <= 0) {
      setStatus("Enter the LUX reading at sensor height.");
      return;
    }
    setSaving(true);
    try {
      await setLightLevel(step.pct);
      await save_calibration("sf1000", "light_par", [
        { step_key: `${step.key}_lux`, measured_value: lux, unit: "lux" },
        ...(Number.isFinite(par) && par > 0
          ? [{ step_key: `${step.key}_par`, measured_value: par, unit: "µmol/m²/s" }]
          : []),
        { step_key: `${step.key}_height_cm`, measured_value: Number(heightCm) || 0, unit: "cm" },
      ]);
      const next = stepIdx + 1;
      if (next >= LIGHT_STEPS.length) {
        setDone(true);
        setStatus("Light response curve saved to brain — used for effective-off threshold.");
        await callService("light", "turn_off", { entity_id: "light.dsc_hub_sf1000_dimmer" });
      } else {
        setStepIdx(next);
        setLuxReading("");
        setParReading("");
        setStatus(`Saved ${step.label}. Set fixture to ${LIGHT_STEPS[next].label} and measure.`);
        await setLightLevel(LIGHT_STEPS[next].pct);
      }
    } catch (exc) {
      setStatus(exc instanceof Error ? exc.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const startWizard = async () => {
    setSaving(true);
    try {
      setDone(false);
      setStepIdx(0);
      setLuxReading("");
      setParReading("");
      await setLightLevel(LIGHT_STEPS[0].pct);
      setStatus(`Fixture at ${LIGHT_STEPS[0].label}. Measure LUX/PAR at canopy height.`);
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <Card className="dsc-glass" title="Light curve saved" icon="ok">
        <p className="dsc-honesty">{status}</p>
        <Button variant="secondary" onClick={() => setConfirmLightStart(true)}>
          Re-run light wizard
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Card className="dsc-glass" title="SF1000 brightness response" icon="lighting">
        <p className="dsc-muted">
          At fixed canopy height, ramp SF1000 25→100%. Enter meter readings at each step. PAR optional if meter supports
          it.
        </p>
        <label>
          Sensor height (cm)
          <input type="number" min="1" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
        </label>
        <div className="dsc-stage-track" style={{ margin: "12px 0" }}>
          {LIGHT_STEPS.map((s, i) => (
            <span key={s.key} className={`dsc-stage-pill${i === stepIdx ? " is-on" : i > stepIdx ? "" : " is-next"}`}>
              {s.label}
            </span>
          ))}
        </div>
        <label>
          LUX @ {step.label}
          <input type="number" min="0" value={luxReading} onChange={(e) => setLuxReading(e.target.value)} />
        </label>
        <label>
          PAR µmol/m²/s (optional)
          <input type="number" min="0" value={parReading} onChange={(e) => setParReading(e.target.value)} />
        </label>
        <div className="dsc-row-actions">
          {stepIdx === 0 && !status ? (
            <Button variant="primary" disabled={saving} onClick={() => setConfirmLightStart(true)}>
              Start light wizard
            </Button>
          ) : (
            <Button variant="primary" disabled={saving} onClick={() => void saveStep()}>
              Save {step.label}
            </Button>
          )}
        </div>
      </Card>
      <DecisionLayer
        open={confirmLightStart}
        onDismiss={() => setConfirmLightStart(false)}
        onConfirm={() => {
          setConfirmLightStart(false);
          void startWizard();
        }}
        title="Start light calibration"
        confirmLabel="Start session"
        help={null}
      >
        <p>
          SF1000 will ramp through brightness steps while you measure LUX/PAR at canopy height. The fixture stays on
          until you finish or abort.
        </p>
      </DecisionLayer>
      {status ? <p className="dsc-honesty">{status}</p> : null}
    </>
  );
}

function TankBiasPanel() {
  const { state } = useEntityBus();
  const ecNorm = state("sensor.dsc_tank_ec_normalized", "—");
  const phCal = state("sensor.dsc_tank_ph_calibrated", "—");

  return (
    <Card className="dsc-glass" title="Tank EC / pH bias (N-023)" icon="learning">
      <p className="dsc-honesty">
        Raw Water Tester readings pass through a unit multiplier and additive bias before stage-band checks.
        Adjust bias after a probe rinse and a known reference sample — not to chase a drifting probe.
      </p>
      <div className="dsc-grid">
        <div className="dsc-col-6">
          <TargetNumber entityId="input_number.dsc_tank_ec_multiplier" label="EC unit multiplier (1 or 1000)" step={999} />
          <TargetNumber entityId="input_number.dsc_tank_ec_bias" label="EC bias µS/cm" step={1} />
        </div>
        <div className="dsc-col-6">
          <TargetNumber entityId="input_number.dsc_tank_ph_bias" label="pH bias" step={0.01} />
        </div>
      </div>
      <div className="dsc-chip-row">
        <StatusChip label={`Normalized EC ${ecNorm} µS/cm`} tone={ecNorm === "—" ? "muted" : "ok"} />
        <StatusChip label={`Calibrated pH ${phCal}`} tone={phCal === "—" ? "muted" : "ok"} />
      </div>
    </Card>
  );
}

function SoilCalHonestyPanel() {
  const { callService } = useFleetActions();
  const [showWizard, setShowWizard] = useState(false);
  const [peerStatus, setPeerStatus] = useState("");
  const [pushStatus, setPushStatus] = useState("");
  const [confirmPush, setConfirmPush] = useState(false);
  const [busy, setBusy] = useState(false);

  const capturePeer = async () => {
    setBusy(true);
    setPeerStatus("Running peer median capture…");
    try {
      await callService("script", "turn_on", { entity_id: "script.dsc_pots_capture_peer_baseline" });
      setPeerStatus("Capture script triggered — check Root / Strains for updated offsets.");
    } catch (exc) {
      setPeerStatus(exc instanceof Error ? exc.message : "Capture failed");
    } finally {
      setBusy(false);
    }
  };

  const pushToEsp = async () => {
    setBusy(true);
    setPushStatus("Pushing peer offsets to ESP…");
    try {
      await callService("script", "turn_on", { entity_id: "script.dsc_pots_push_peer_offsets_to_esp" });
      setPushStatus("Push script triggered — verify dual-stack clears on pots.");
    } catch (exc) {
      setPushStatus(exc instanceof Error ? exc.message : "Push failed");
    } finally {
      setBusy(false);
      setConfirmPush(false);
    }
  };

  return (
    <>
      <Card className="dsc-glass" title="Soil test wizard" icon="root">
        <p className="dsc-muted">
          Confirmed mobile-probe snapshots for roster plants — separate from peer median calibration below.
        </p>
        <div className="dsc-row-actions">
          <Button variant="primary" onClick={() => setShowWizard((v) => !v)}>
            {showWizard ? "Hide wizard" : "Open soil test wizard"}
          </Button>
        </div>
        {showWizard ? <SoilTestWizard compact /> : null}
      </Card>

      <Card className="dsc-glass" title="Soil cal — peer median vs lab buffer (N-016)" icon="learning">
      <p className="dsc-honesty">
        <strong>Peer median</strong> aligns in-service pots to the fleet median. Fast for relative drift and mat vote
        coherence — but it is <em>not</em> lab truth. Use Mark Peer Median on Root Zone when probes agree directionally
        but one pot is an outlier.
      </p>
      <p className="dsc-honesty">
        <strong>Lab buffer (lab wet)</strong> stamps a single channel with a known buffer solution on the pot ESP.
        After lab wet, treat that channel as buffer-calibrated until Reset. Peer median does not substitute for a wet
        cal pass — see <code>docs/LAB-WET-CAL.md</code> for the operator procedure.
      </p>
      <p className="dsc-honesty">
        Fan CFM and light PAR sessions on this page own <code>input_number.dsc_cal_*</code> and{" "}
        <code>script.dsc_cal_*</code>. Tune → Learning shares those entities with a different commit model (blur vs
        guided save-point).
      </p>
      <div className="dsc-row-actions">
        <Button variant="secondary" disabled={busy} onClick={() => void capturePeer()}>
          Capture peer median
        </Button>
        <Button variant="danger" disabled={busy} onClick={() => setConfirmPush(true)}>
          Push offsets to ESP
        </Button>
      </div>
      {peerStatus ? <p className="dsc-honesty">{peerStatus}</p> : null}
      {pushStatus ? <p className="dsc-honesty">{pushStatus}</p> : null}
      <DecisionLayer
        open={confirmPush}
        onDismiss={() => setConfirmPush(false)}
        onConfirm={() => void pushToEsp()}
        title="Push peer offsets to ESP"
        confirmLabel="Push to ESP"
        help={null}
      >
        <p>
          Merges HA peer offsets into each pot&apos;s ESP Cal Offset and clears HA offsets. Refuses if scale ≠ 1 unless
          forced in HA.
        </p>
      </DecisionLayer>
    </Card>
    </>
  );
}

/** Fleet → Calibrate — fan CFM + light PAR steppers. */
export function CalibratePage() {
  const [tab, setTab] = useState<CalTab>("fan");

  return (
    <div className="dsc-page">
      <PageHeader
        icon="learning"
        title="Calibrate"
        subtitle="Measure fan airflow and light output so the hub runs on real curves."
      />

      <div className="dsc-chip-row" style={{ marginBottom: 12 }}>
        <button
          type="button"
          className={`dsc-chip${tab === "fan" ? " dsc-chip--ok" : ""}`}
          onClick={() => setTab("fan")}
        >
          Fan CFM
        </button>
        <button
          type="button"
          className={`dsc-chip${tab === "light" ? " dsc-chip--ok" : ""}`}
          onClick={() => setTab("light")}
        >
          Light PAR/LUX
        </button>
        <button
          type="button"
          className={`dsc-chip${tab === "tank" ? " dsc-chip--ok" : ""}`}
          onClick={() => setTab("tank")}
        >
          Tank bias
        </button>
        <button
          type="button"
          className={`dsc-chip${tab === "soil" ? " dsc-chip--ok" : ""}`}
          onClick={() => setTab("soil")}
        >
          Soil cal
        </button>
      </div>

      {tab === "fan" ? <FanCalibrateWizard /> : null}
      {tab === "light" ? <LightParWizard /> : null}
      {tab === "tank" ? <TankBiasPanel /> : null}
      {tab === "soil" ? <SoilCalHonestyPanel /> : null}
    </div>
  );
}
