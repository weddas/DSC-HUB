import type { CfmReading } from "../lib/cfmProvenance";
import { CfmTrustLine } from "./CfmBadge";
import { StatusChip } from "./ui";
import { useInspector } from "./InspectorHost";

function dashFor(reading: CfmReading): string | undefined {
  return reading.kind === "allocated" || reading.kind === "mass-balance" ? undefined : "6 5";
}

function fmt(n: number): string {
  return Number.isFinite(n) ? String(Math.round(n)) : "—";
}

function ribbons(cfm: number): number {
  if (!Number.isFinite(cfm) || cfm <= 0) return 0;
  if (cfm < 40) return 1;
  if (cfm < 80) return 2;
  if (cfm < 140) return 3;
  if (cfm < 220) return 4;
  return 5;
}

function PathRibbons({
  x1,
  y1,
  x2,
  y2,
  reading,
  color,
  onClick,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  reading: CfmReading;
  color: string;
  onClick?: () => void;
}) {
  const n = ribbons(reading.value);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * 3.2;
  const ny = (dx / len) * 3.2;
  const start = -Math.floor((n - 1) / 2);
  return (
    <g
      role={onClick ? "button" : undefined}
      style={{ cursor: onClick ? "pointer" : undefined }}
      onClick={onClick}
    >
      {n === 0 ? (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth="1.2"
          strokeDasharray="2 6"
          opacity={0.35}
        />
      ) : (
        Array.from({ length: n }, (_, i) => {
          const o = start + i;
          return (
            <line
              key={i}
              x1={x1 + nx * o}
              y1={y1 + ny * o}
              x2={x2 + nx * o}
              y2={y2 + ny * o}
              stroke={color}
              strokeWidth={1.4 + Math.min(2.2, reading.value / 120)}
              strokeDasharray={dashFor(reading)}
              opacity={0.85}
            />
          );
        })
      )}
    </g>
  );
}

/**
 * Spatial air path. Cascade is the pipe between the tent boxes, never a join on dump/recirc.
 * Tent cockpits pass `focus` so the SVG is that tent + room + the cascade port stub.
 */
export function AirPathMap({
  intakeClone,
  intakeMain,
  outCfm,
  recircCfm,
  compact,
  focus,
}: {
  intakeClone: CfmReading;
  intakeMain: CfmReading;
  outCfm: CfmReading;
  recircCfm: CfmReading;
  compact?: boolean;
  focus?: "main" | "clone";
}) {
  const inspector = useInspector();
  const cascade: CfmReading = {
    value: Number.isFinite(intakeClone.value) ? intakeClone.value : 0,
    kind: intakeClone.kind,
    entityId: intakeClone.entityId,
    nameplate: intakeClone.nameplate,
  };
  const sigmaIn =
    (Number.isFinite(intakeClone.value) ? intakeClone.value : 0) +
    (Number.isFinite(intakeMain.value) ? intakeMain.value : 0);
  const showClone = focus !== "main";
  const showMain = focus !== "clone";
  const showExhaust = focus !== "clone";
  const trustReadings =
    focus === "clone"
      ? [intakeClone]
      : focus === "main"
        ? [intakeMain, outCfm, recircCfm]
        : [intakeClone, intakeMain, outCfm, recircCfm];

  const openCascade = () =>
    inspector.open({
      entityId: cascade.entityId,
      label: "Cascade 2×4 → 4×8",
      unit: "cfm",
    });

  return (
    <div className={`dsc-air-path${compact ? " is-compact" : ""}`}>
      <CfmTrustLine readings={trustReadings} />
      <svg viewBox="0 0 720 260" className="dsc-air-svg" aria-label="Air path room to tents">
        <rect x="16" y="78" width="120" height="110" rx="12" fill="none" stroke="var(--dsc-teal)" strokeWidth="1.8" />
        <text x="76" y="122" textAnchor="middle" fill="currentColor" fontSize="13">
          Room
        </text>
        <text x="76" y="142" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
          umbrella lung
        </text>

        {showClone ? (
          <>
            <rect x="220" y="28" width="150" height="88" rx="10" fill="none" stroke="var(--dsc-teal)" strokeWidth="1.8" />
            <text x="295" y="64" textAnchor="middle" fill="currentColor" fontSize="13">
              2×4 tent
            </text>
            <text x="295" y="84" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
              in {fmt(intakeClone.value)} cfm
            </text>
            <PathRibbons
              x1={136}
              y1={110}
              x2={220}
              y2={72}
              reading={intakeClone}
              color="var(--dsc-teal)"
              onClick={() =>
                inspector.open({
                  entityId: intakeClone.entityId,
                  label: "2×4 intake CFM",
                  unit: "cfm",
                })
              }
            />
          </>
        ) : null}

        {showMain ? (
          <>
            <rect x="220" y="150" width="150" height="88" rx="10" fill="none" stroke="var(--dsc-blue)" strokeWidth="1.8" />
            <text x="295" y="186" textAnchor="middle" fill="currentColor" fontSize="13">
              4×8 tent
            </text>
            <text x="295" y="206" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
              in {fmt(intakeMain.value)} cfm
            </text>
            <PathRibbons
              x1={136}
              y1={140}
              x2={220}
              y2={194}
              reading={intakeMain}
              color="var(--dsc-blue)"
              onClick={() =>
                inspector.open({
                  entityId: intakeMain.entityId,
                  label: "4×8 intake CFM",
                  unit: "cfm",
                })
              }
            />
          </>
        ) : null}

        {showExhaust ? (
          <>
            <rect x="560" y="150" width="140" height="88" rx="10" fill="none" stroke="#ff8a65" strokeWidth="1.6" />
            <text x="630" y="186" textAnchor="middle" fill="currentColor" fontSize="12">
              Outdoors
            </text>
            <text x="630" y="206" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
              dump {fmt(outCfm.value)}
            </text>
          </>
        ) : null}

        {!focus ? (
          <>
            <PathRibbons
              x1={295}
              y1={116}
              x2={295}
              y2={150}
              reading={cascade}
              color="var(--dsc-amber)"
              onClick={openCascade}
            />
            <text x="370" y="140" fill="var(--dsc-amber)" fontSize="10">
              cascade {fmt(cascade.value)}
            </text>
            <text x="370" y="152" fill="var(--dsc-gray-5)" fontSize="9">
              same air · not added to Σ
            </text>
          </>
        ) : null}

        {focus === "clone" ? (
          <>
            <PathRibbons
              x1={370}
              y1={72}
              x2={430}
              y2={72}
              reading={cascade}
              color="var(--dsc-amber)"
              onClick={openCascade}
            />
            <rect x="430" y="54" width="88" height="36" rx="8" fill="none" stroke="var(--dsc-amber)" strokeWidth="1.4" strokeDasharray="5 4" />
            <text x="474" y="76" textAnchor="middle" fill="var(--dsc-amber)" fontSize="10">
              to 4×8
            </text>
            <text x="474" y="102" textAnchor="middle" fill="var(--dsc-amber)" fontSize="9">
              cascade {fmt(cascade.value)}
            </text>
          </>
        ) : null}

        {focus === "main" ? (
          <>
            <PathRibbons
              x1={295}
              y1={132}
              x2={295}
              y2={150}
              reading={cascade}
              color="var(--dsc-amber)"
              onClick={openCascade}
            />
            <rect x="251" y="104" width="88" height="28" rx="8" fill="none" stroke="var(--dsc-amber)" strokeWidth="1.4" strokeDasharray="5 4" />
            <text x="295" y="122" textAnchor="middle" fill="var(--dsc-amber)" fontSize="10">
              from 2×4
            </text>
            <text x="390" y="122" fill="var(--dsc-amber)" fontSize="9">
              cascade {fmt(cascade.value)}
            </text>
          </>
        ) : null}

        {showExhaust ? (
          <>
            <PathRibbons
              x1={370}
              y1={194}
              x2={560}
              y2={194}
              reading={outCfm}
              color="#ff8a65"
              onClick={() =>
                inspector.open({ entityId: outCfm.entityId, label: "Dump OUT CFM", unit: "cfm" })
              }
            />
            <PathRibbons
              x1={370}
              y1={220}
              x2={136}
              y2={168}
              reading={recircCfm}
              color="#b388ff"
              onClick={() =>
                inspector.open({ entityId: recircCfm.entityId, label: "Recirc CFM", unit: "cfm" })
              }
            />
            <text x="80" y="200" fill="#b388ff" fontSize="10">
              recirc {fmt(recircCfm.value)}
            </text>
          </>
        ) : null}
      </svg>
      {!focus ? (
        <StatusChip
          label={`Mass-balance exhaust = Σ intake ${fmt(sigmaIn)} × dump/recirc split`}
          tone="muted"
        />
      ) : null}
    </div>
  );
}
