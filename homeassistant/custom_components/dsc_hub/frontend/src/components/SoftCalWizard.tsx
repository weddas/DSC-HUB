import { useCallback, useState } from "react";
import { Button, Card, StatusChip } from "./ui";
import { DecisionLayer } from "./DecisionLayer";
import { HelpTip } from "./HelpTip";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleetActions } from "../hooks/useFleetActions";
import {
  SOFT_CAL_POTS,
  SAMPLE_COUNT,
  WATER_MOISTURE_TARGET,
  attachWaterOffsets,
  captureSoftCalAverages,
  readSoftCalChannels,
  roundOffset,
  softCalBlockedByDualStack,
  softCalEntityIds,
  type SoftCalCaptureResult,
  type SoftCalPhase,
  type SoftCalPot,
} from "../lib/softCalibrate";

function fmt(v: number | null | undefined, digits = 1): string {
  return v != null && Number.isFinite(v) ? v.toFixed(digits) : "—";
}

function CaptureTable({ rows }: { rows: SoftCalCaptureResult[] }) {
  return (
    <div className="dsc-soft-cal-table">
      {rows.map((row) => (
        <div key={row.pot} className="dsc-soft-cal-row">
          <strong>P{row.pot}</strong>
          <span>M {fmt(row.average.moisture)}%</span>
          <span>T {fmt(row.average.soilTemp)}°C</span>
          <span>EC {fmt(row.average.ec, 0)}</span>
          <span>pH {fmt(row.average.ph, 2)}</span>
          {row.cachedNotSigma ? (
            <StatusChip label="cached not σ" tone="warn" />
          ) : (
            <StatusChip label={`${row.uniqueModbusTimestamps} unique`} tone="ok" />
          )}
          {row.offsets ? (
            <span className="dsc-muted">
              Δ pH {fmt(row.offsets.ph, 2)} · M {fmt(row.offsets.moisture)} · EC {fmt(row.offsets.ec, 0)}
            </span>
          ) : null}
          {row.variancePh != null && !row.cachedNotSigma ? (
            <StatusChip label={`σ pH ${row.variancePh.toFixed(2)}`} tone={row.variancePh <= 0.15 ? "ok" : "warn"} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

/**
 * Soft calibrate: select probes → tap-water average + known pH → HA Got offsets,
 * then second capture after watering in pots (verify / optional pH refine).
 */
export function SoftCalWizard() {
  const { num, entity, state } = useEntityBus();
  const { callService } = useFleetActions();
  const [selected, setSelected] = useState<SoftCalPot[]>([1, 2]);
  const [phase, setPhase] = useState<SoftCalPhase>("water");
  const [knownPh, setKnownPh] = useState("7.0");
  const [knownEc, setKnownEc] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [status, setStatus] = useState("");
  const [waterRows, setWaterRows] = useState<SoftCalCaptureResult[] | null>(null);
  const [afterRows, setAfterRows] = useState<SoftCalCaptureResult[] | null>(null);
  const [pendingApply, setPendingApply] = useState<SoftCalCaptureResult[] | null>(null);

  const togglePot = (pot: SoftCalPot) => {
    setSelected((prev) => {
      if (prev.includes(pot)) {
        const next = prev.filter((p) => p !== pot);
        return next.length ? next : prev;
      }
      return [...prev, pot].sort((a, b) => a - b) as SoftCalPot[];
    });
  };

  const livePreview = selected.map((pot) => ({
    pot,
    channels: readSoftCalChannels(pot, num),
  }));

  const runCapture = useCallback(async () => {
    const ph = Number(knownPh);
    if (phase === "water" && (!Number.isFinite(ph) || ph < 3 || ph > 10)) {
      setStatus("Enter a real tap-water pH (3–10) before Soft Calibrate.");
      return;
    }
    const ecRaw = knownEc.trim() === "" ? null : Number(knownEc);
    if (ecRaw != null && !Number.isFinite(ecRaw)) {
      setStatus("Tap EC must be a number (µS/cm), or leave blank.");
      return;
    }

    setBusy(true);
    setStatus("");
    setProgress(`Sampling ${SAMPLE_COUNT}s (Soil * Raw)…`);
    try {
      let rows = await captureSoftCalAverages(selected, num, {
        onTick: (done, total) => setProgress(`Sampling ${done}/${total}…`),
        entityMeta: (id) => {
          const ent = entity(id);
          return { lastUpdated: (ent as { last_updated?: string } | undefined)?.last_updated ?? null };
        },
      });
      if (rows.some((r) => r.cachedNotSigma)) {
        setStatus(
          "Warning: fewer than 3 unique Modbus timestamps — showing “cached not σ”. Prefer cal_session burst firmware or wait for fresh polls.",
        );
      }
      if (phase === "water") {
        rows = attachWaterOffsets(rows, ph, ecRaw);
        setWaterRows(rows);
        setPendingApply(rows);
        setProgress("");
        if (!rows.some((r) => r.cachedNotSigma)) {
          setStatus("Tap-water Raw averages ready — confirm to write soft offsets (gate dual_cal_stack).");
        }
      } else {
        if (Number.isFinite(ph) && knownPh.trim() !== "") {
          rows = attachWaterOffsets(rows, ph, ecRaw);
        }
        setAfterRows(rows);
        setPendingApply(rows.some((r) => r.offsets) ? rows : null);
        setProgress("");
        setStatus(
          rows.some((r) => r.offsets)
            ? "After-water capture ready — confirm to refine soft offsets from entered pH."
            : "After-water capture saved (averages only — no offset write without known pH).",
        );
      }
    } catch (exc) {
      setStatus(exc instanceof Error ? exc.message : "Capture failed");
      setProgress("");
    } finally {
      setBusy(false);
    }
  }, [entity, knownEc, knownPh, num, phase, selected]);

  const applyOffsets = async () => {
    if (!pendingApply) return;
    const blocked = pendingApply.filter((row) => softCalBlockedByDualStack(row.pot, state));
    if (blocked.length) {
      setStatus(
        `Blocked: dual_cal_stack on pot ${blocked.map((b) => b.pot).join(", ")} — push SoftCal to ESP NVS and zero HA offsets first.`,
      );
      return;
    }
    setBusy(true);
    setStatus("Writing soft HA offsets…");
    try {
      for (const row of pendingApply) {
        if (!row.offsets) continue;
        const ids = softCalEntityIds(row.pot);
        await callService("input_number", "set_value", {
          entity_id: ids.offsetPh,
          value: roundOffset("ph", row.offsets.ph),
        });
        await callService("input_number", "set_value", {
          entity_id: ids.offsetMoisture,
          value: roundOffset("moisture", row.offsets.moisture),
        });
        if (Math.abs(row.offsets.ec) >= 1) {
          await callService("input_number", "set_value", {
            entity_id: ids.offsetEc,
            value: roundOffset("ec", row.offsets.ec),
          });
        }
      }
      setPendingApply(null);
      if (phase === "water") {
        setStatus(
          "Soft offsets written. Prefer one cal plane: push to ESP NVS and zero HA when ready. Then Soft Calibrate again after seating probes.",
        );
        setPhase("after_water");
      } else {
        setStatus("Soft offsets refined from after-water known pH.");
      }
    } catch (exc) {
      setStatus(exc instanceof Error ? exc.message : "Offset write failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="dsc-glass" title="Soft calibrate (tap water → after water)" icon="root">
      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
        <HelpTip title="Soft cal vs lab stamp">
          <p>
            Soft cal writes <b>Got offsets in HA</b> so the desk reads honest without flashing probes. It is not a lab
            ESP recalibration stamp.
          </p>
          <p>
            Example: tap reads pH 6.2 while meter says 7.0 → Soft Calibrate → Got shifts by +0.8. Capture 2 after watering
            only refines if you enter a known pH again.
          </p>
        </HelpTip>
      </div>
      <p className="dsc-honesty" style={{ marginTop: 0 }}>
        Put selected probes in a glass of tap water, enter the real pH, Soft Calibrate to average drift and write{" "}
        <strong>HA Got offsets</strong> (not lab ESP stamp). Then seat in watered pots and Soft Calibrate again for
        capture 2. Samples <strong>Soil * Raw</strong> (moisture, temp, EC, pH) — not N/P/K. Offsets apply to pH /
        moisture
        {knownEc.trim() ? " / EC" : ""} only. Gate: dual_cal_stack blocks commit.
      </p>

      <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
        <StatusChip
          label={phase === "water" ? "1 · Tap water" : "2 · After water"}
          tone={phase === "water" ? "warn" : "ok"}
        />
        {SOFT_CAL_POTS.map((pot) => (
          <button
            key={pot}
            type="button"
            className={`dsc-chip${selected.includes(pot) ? " dsc-chip--ok" : ""}`}
            onClick={() => togglePot(pot)}
          >
            Probe {pot}
          </button>
        ))}
      </div>

      <div className="dsc-target-grid" style={{ marginBottom: 12 }}>
        <label className="dsc-target-num">
          <span className="dsc-target-num-label">
            {phase === "water" ? "Real tap pH" : "Known pH (optional refine)"}
          </span>
          <input
            type="number"
            min={3}
            max={10}
            step={0.01}
            value={knownPh}
            onChange={(e) => setKnownPh(e.target.value)}
          />
        </label>
        <label className="dsc-target-num">
          <span className="dsc-target-num-label">Tap EC µS/cm (optional)</span>
          <input
            type="number"
            min={0}
            max={5000}
            step={10}
            value={knownEc}
            onChange={(e) => setKnownEc(e.target.value)}
            placeholder="leave blank"
          />
        </label>
      </div>

      <p className="dsc-muted" style={{ fontSize: 12, marginTop: 0 }}>
        Live (raw):{" "}
        {livePreview
          .map(
            (row) =>
              `P${row.pot} pH ${fmt(row.channels.ph, 2)} · M ${fmt(row.channels.moisture)}% · EC ${fmt(row.channels.ec, 0)}`,
          )
          .join(" · ")}
        {phase === "water" ? ` · moisture target ${WATER_MOISTURE_TARGET}% in water` : ""}
      </p>

      <div className="dsc-row-actions">
        <Button variant="primary" disabled={busy || selected.length === 0} onClick={() => void runCapture()}>
          Soft Calibrate
        </Button>
        {pendingApply?.some((r) => r.offsets) ? (
          <Button variant="primary" disabled={busy} onClick={() => void applyOffsets()}>
            Apply soft offsets
          </Button>
        ) : null}
        <Button
          variant="secondary"
          disabled={busy}
          onClick={() => {
            setPhase(phase === "water" ? "after_water" : "water");
            setPendingApply(null);
            setStatus("");
          }}
        >
          Switch to {phase === "water" ? "after-water" : "tap-water"} phase
        </Button>
      </div>

      {progress ? <p className="dsc-honesty">{progress}</p> : null}
      {status ? <p className="dsc-honesty">{status}</p> : null}

      {waterRows ? (
        <>
          <p className="dsc-muted" style={{ fontSize: 12, marginBottom: 4 }}>
            Capture 1 · tap water ({waterRows[0]?.sampleCount ?? 0} samples)
          </p>
          <CaptureTable rows={waterRows} />
        </>
      ) : null}
      {afterRows ? (
        <>
          <p className="dsc-muted" style={{ fontSize: 12, marginBottom: 4, marginTop: 12 }}>
            Capture 2 · after water ({afterRows[0]?.sampleCount ?? 0} samples)
          </p>
          <CaptureTable rows={afterRows} />
        </>
      ) : null}

      <DecisionLayer
        open={pendingApply != null && pendingApply.some((r) => r.offsets)}
        onDismiss={() => setPendingApply(null)}
        onConfirm={() => void applyOffsets()}
        title="Apply soft HA offsets"
        confirmLabel="Write offsets"
        help={null}
      >
        <p>
          Writes <code>input_number.dsc_potN_offset_*</code> so Got = raw + offset. Does not stamp ESP lab cal. Moisture
          soft target in water is {WATER_MOISTURE_TARGET}%.
        </p>
        {pendingApply ? <CaptureTable rows={pendingApply} /> : null}
      </DecisionLayer>
    </Card>
  );
}
