import { useHass } from "../hooks/useHass";
import { StatusChip } from "./ui";

export function TankCutaway() {
  const { available, num, state } = useHass();
  const inService = state("input_boolean.dsc_tank_in_service") === "on";
  const levelOk = available("input_number.dsc_tank_level_pct") || available("sensor.dsc_tank_level_pct");
  const level = available("sensor.dsc_tank_level_pct")
    ? num("sensor.dsc_tank_level_pct")
    : num("input_number.dsc_tank_level_pct");
  const hasLevel = levelOk && Number.isFinite(level);
  const ecOk = available("sensor.dsc_tank_ec_normalized");
  const phOk = available("sensor.dsc_tank_ph_calibrated");
  const tOk = available("sensor.water_tester_temperature");
  const pump = state("input_boolean.dsc_tank_pump_active") === "on";
  const waterH = hasLevel ? Math.max(4, Math.min(100, level)) : 0;

  return (
    <div className="dsc-tank-cutaway">
      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
        <StatusChip label={inService ? "In service" : "OOS"} tone={inService ? "ok" : "warn"} />
        {!hasLevel ? <StatusChip label="Level unknown — empty, not guessed" tone="warn" /> : null}
        {pump ? <StatusChip label="Pump ON" tone="ok" pulse /> : <StatusChip label="Pump off" tone="muted" />}
      </div>
      <svg viewBox="0 0 180 220" className="dsc-tank-svg" aria-label="Tank cutaway">
        <rect x="24" y="18" width="132" height="184" rx="12" fill="none" stroke="var(--dsc-teal)" strokeWidth="2"
          strokeDasharray={hasLevel ? undefined : "7 5"} />
        {hasLevel ? (
          <rect x="28" y={26 + (176 * (1 - waterH / 100))} width="124" height={(176 * waterH) / 100}
            fill="rgba(38,198,218,0.22)" />
        ) : null}
        {ecOk ? (
          <rect x="32" y="36" width="116" height="10" fill="rgba(255,183,77,0.55)" />
        ) : null}
        <rect x="24" y="18" width="132" height="12" fill="none" stroke={phOk ? "var(--dsc-purple)" : "var(--dsc-gray-5)"} strokeWidth="3" />
        {pump
          ? [0, 1, 2].map((i) => (
              <circle key={i} cx={90 + (i - 1) * 18} cy="188" r="4" fill="var(--dsc-teal)" opacity={0.5 + i * 0.15} />
            ))
          : null}
      </svg>
      <div className="dsc-kpi-sub">
        EC {ecOk ? `${Math.round(num("sensor.dsc_tank_ec_normalized"))} µS` : "—"} · pH{" "}
        {phOk ? num("sensor.dsc_tank_ph_calibrated").toFixed(2) : "—"} · T{" "}
        {tOk ? `${num("sensor.water_tester_temperature").toFixed(1)} °C` : "—"}
      </div>
    </div>
  );
}
