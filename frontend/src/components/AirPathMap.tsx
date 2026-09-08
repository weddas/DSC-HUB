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

/**
 * Parallel ribbons along an arbitrary route.
 *
 * The old map drew every link as one straight `x1,y1 -> x2,y2` line, which is why the recirc
 * return was drawn *through* the 4×8 box and crossed the 4×8 intake on its way back to the Room.
 * Routes are now explicit polylines, and ribbons offset along a caller-supplied normal so a
 * right-angled return keeps its bundle intact around the corners.
 */
function RibbonPath({
  d,
  reading,
  color,
  normal = [0, 1],
  onClick,
  title,
}: {
  d: string;
  reading: CfmReading;
  color: string;
  /** Unit-ish direction the parallel copies spread along. */
  normal?: [number, number];
  onClick?: () => void;
  title?: string;
}) {
  const n = ribbons(reading.value);
  const [nx, ny] = normal;
  const start = -Math.floor((n - 1) / 2);
  const width = 1.4 + Math.min(2.2, reading.value / 120);
  return (
    <g
      role={onClick ? "button" : undefined}
      style={{ cursor: onClick ? "pointer" : undefined }}
      onClick={onClick}
    >
      {title ? <title>{title}</title> : null}
      {n === 0 ? (
        <path d={d} fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="2 6" opacity={0.35} />
      ) : (
        Array.from({ length: n }, (_, i) => {
          const o = (start + i) * 3.2;
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={width}
              strokeDasharray={dashFor(reading)}
              opacity={0.85}
              transform={`translate(${nx * o} ${ny * o})`}
            />
          );
        })
      )}
    </g>
  );
}

function Arrow({ x, y, angle, color }: { x: number; y: number; angle: number; color: string }) {
  return (
    <polygon
      points="0,-4.5 9,0 0,4.5"
      fill={color}
      opacity={0.9}
      transform={`translate(${x} ${y}) rotate(${angle})`}
    />
  );
}

/** Label with its own plate so a value never has to compete with the ribbon under it. */
function LinkLabel({
  x,
  y,
  text,
  sub,
  color,
  anchor = "middle",
}: {
  x: number;
  y: number;
  text: string;
  sub?: string;
  color: string;
  anchor?: "middle" | "start";
}) {
  const width = Math.max(text.length, sub?.length ?? 0) * 5.6 + 14;
  const left = anchor === "middle" ? x - width / 2 : x - 6;
  const height = sub ? 30 : 18;
  return (
    <g>
      <rect
        x={left}
        y={y - 12}
        width={width}
        height={height}
        rx="5"
        fill="var(--dsc-bg-1, #0d1420)"
        stroke={color}
        strokeWidth="0.8"
        opacity={0.92}
      />
      <text x={x} y={y} textAnchor={anchor} fill={color} fontSize="10">
        {text}
      </text>
      {sub ? (
        <text x={x} y={y + 12} textAnchor={anchor} fill="var(--dsc-gray-5)" fontSize="9">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

/**
 * Spatial air path. Cascade is the pipe between the tent boxes, never a join on dump/recirc.
 * Tent cockpits pass `focus` so the SVG is that tent + room + the cascade port stub.
 * Cascade CFM must come from `sensor.dsc_cfm_cascade_2x4_allocated` — never alias intake 2×4.
 *
 * Layout is a fixed lane diagram: Room on the left, the two tents stacked in the middle column
 * with the cascade as the vertical pipe between them, Outdoors on the right, and the recirc
 * return routed *under* the whole diagram so nothing crosses a node box.
 */
export function AirPathMap({
  intakeClone,
  intakeMain,
  cascade,
  outCfm,
  recircCfm,
  compact,
  focus,
}: {
  intakeClone: CfmReading;
  intakeMain: CfmReading;
  cascade: CfmReading;
  outCfm: CfmReading;
  recircCfm: CfmReading;
  compact?: boolean;
  focus?: "main" | "clone";
}) {
  const inspector = useInspector();
  const sigmaIn =
    (Number.isFinite(intakeClone.value) ? intakeClone.value : 0) +
    (Number.isFinite(intakeMain.value) ? intakeMain.value : 0);
  const sigmaOut =
    (Number.isFinite(outCfm.value) ? outCfm.value : 0) +
    (Number.isFinite(recircCfm.value) ? recircCfm.value : 0);
  const showClone = focus !== "main";
  const showMain = focus !== "clone";
  const showExhaust = focus !== "clone";
  const trustReadings =
    focus === "clone"
      ? [intakeClone, cascade]
      : focus === "main"
        ? [intakeMain, cascade, outCfm, recircCfm]
        : [intakeClone, intakeMain, cascade, outCfm, recircCfm];

  const openCascade = () =>
    inspector.open({
      entityId: cascade.entityId,
      label: "Cascade 2×4 → 4×8",
      unit: "cfm",
    });

  return (
    <div className={`dsc-air-path${compact ? " is-compact" : ""}`}>
      <CfmTrustLine readings={trustReadings} />
      <svg viewBox="0 0 720 300" className="dsc-air-svg" aria-label="Air path room to tents">
        <rect x="20" y="96" width="130" height="104" rx="12" fill="none" stroke="var(--dsc-teal)" strokeWidth="1.8" />
        <text x="85" y="142" textAnchor="middle" fill="currentColor" fontSize="13">
          Room
        </text>
        <text x="85" y="162" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
          umbrella lung
        </text>

        {showClone ? (
          <>
            <rect x="250" y="26" width="150" height="84" rx="10" fill="none" stroke="var(--dsc-teal)" strokeWidth="1.8" />
            <text x="325" y="62" textAnchor="middle" fill="currentColor" fontSize="13">
              2×4 tent
            </text>
            <text x="325" y="82" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
              in {fmt(intakeClone.value)} cfm
            </text>
            <RibbonPath
              d="M 150 126 L 250 72"
              reading={intakeClone}
              color="var(--dsc-teal)"
              normal={[0.47, 0.88]}
              title={`Intake 2×4 ${fmt(intakeClone.value)} cfm`}
              onClick={() =>
                inspector.open({
                  entityId: intakeClone.entityId,
                  label: "2×4 intake CFM",
                  unit: "cfm",
                })
              }
            />
            <Arrow x={250} y={72} angle={-28} color="var(--dsc-teal)" />
            <LinkLabel x={198} y={78} text={`intake 2×4 ${fmt(intakeClone.value)}`} color="var(--dsc-teal)" />
          </>
        ) : null}

        {showMain ? (
          <>
            <rect x="250" y="156" width="150" height="84" rx="10" fill="none" stroke="var(--dsc-blue)" strokeWidth="1.8" />
            <text x="325" y="192" textAnchor="middle" fill="currentColor" fontSize="13">
              4×8 tent
            </text>
            <text x="325" y="212" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
              in {fmt(intakeMain.value)} cfm
            </text>
            <RibbonPath
              d="M 150 172 L 250 196"
              reading={intakeMain}
              color="var(--dsc-blue)"
              normal={[-0.23, 0.97]}
              title={`Intake 4×8 ${fmt(intakeMain.value)} cfm`}
              onClick={() =>
                inspector.open({
                  entityId: intakeMain.entityId,
                  label: "4×8 intake CFM",
                  unit: "cfm",
                })
              }
            />
            <Arrow x={250} y={196} angle={13} color="var(--dsc-blue)" />
            <LinkLabel x={212} y={160} text={`intake 4×8 ${fmt(intakeMain.value)}`} color="var(--dsc-blue)" />
          </>
        ) : null}

        {/* Cascade: the pipe between the boxes. Label sits beside the pipe, never adrift. */}
        {!focus ? (
          <>
            <RibbonPath
              d="M 325 110 L 325 156"
              reading={cascade}
              color="var(--dsc-amber)"
              normal={[1, 0]}
              title={`Cascade 2×4 → 4×8 ${fmt(cascade.value)} cfm`}
              onClick={openCascade}
            />
            <Arrow x={325} y={156} angle={90} color="var(--dsc-amber)" />
            <LinkLabel
              x={348}
              y={128}
              text={`cascade ${fmt(cascade.value)}`}
              sub="same air · not added to Σ"
              color="var(--dsc-amber)"
              anchor="start"
            />
          </>
        ) : null}

        {focus === "clone" ? (
          <>
            <RibbonPath
              d="M 400 68 L 470 68"
              reading={cascade}
              color="var(--dsc-amber)"
              normal={[0, 1]}
              title={`Cascade 2×4 → 4×8 ${fmt(cascade.value)} cfm`}
              onClick={openCascade}
            />
            <Arrow x={470} y={68} angle={0} color="var(--dsc-amber)" />
            <rect x="482" y="46" width="96" height="44" rx="8" fill="none" stroke="var(--dsc-amber)" strokeWidth="1.4" strokeDasharray="5 4" />
            <text x="530" y="64" textAnchor="middle" fill="var(--dsc-amber)" fontSize="10">
              to 4×8
            </text>
            <text x="530" y="80" textAnchor="middle" fill="var(--dsc-amber)" fontSize="9">
              cascade {fmt(cascade.value)}
            </text>
          </>
        ) : null}

        {focus === "main" ? (
          <>
            <RibbonPath
              d="M 325 118 L 325 156"
              reading={cascade}
              color="var(--dsc-amber)"
              normal={[1, 0]}
              title={`Cascade 2×4 → 4×8 ${fmt(cascade.value)} cfm`}
              onClick={openCascade}
            />
            <Arrow x={325} y={156} angle={90} color="var(--dsc-amber)" />
            <rect x="277" y="86" width="96" height="32" rx="8" fill="none" stroke="var(--dsc-amber)" strokeWidth="1.4" strokeDasharray="5 4" />
            <text x="325" y="106" textAnchor="middle" fill="var(--dsc-amber)" fontSize="10">
              from 2×4
            </text>
            <LinkLabel x={392} y={106} text={`cascade ${fmt(cascade.value)}`} color="var(--dsc-amber)" anchor="start" />
          </>
        ) : null}

        {showExhaust ? (
          <>
            <rect x="520" y="156" width="150" height="84" rx="10" fill="none" stroke="#ff8a65" strokeWidth="1.6" />
            <text x="595" y="192" textAnchor="middle" fill="currentColor" fontSize="12">
              Outdoors
            </text>
            <text x="595" y="212" textAnchor="middle" fill="var(--dsc-gray-5)" fontSize="10">
              dump {fmt(outCfm.value)} cfm
            </text>
            <RibbonPath
              d="M 400 182 L 520 182"
              reading={outCfm}
              color="#ff8a65"
              normal={[0, 1]}
              title={`Dump OUT ${fmt(outCfm.value)} cfm`}
              onClick={() =>
                inspector.open({ entityId: outCfm.entityId, label: "Dump OUT CFM", unit: "cfm" })
              }
            />
            <Arrow x={520} y={182} angle={0} color="#ff8a65" />
            <LinkLabel x={460} y={166} text={`dump ${fmt(outCfm.value)}`} color="#ff8a65" />

            {/* Return leg routed under the diagram — the old straight line cut through the 4×8. */}
            <RibbonPath
              d="M 325 240 L 325 268 Q 325 276 317 276 L 93 276 Q 85 276 85 268 L 85 200"
              reading={recircCfm}
              color="#b388ff"
              normal={[0, 1]}
              title={`Recirc to room ${fmt(recircCfm.value)} cfm`}
              onClick={() =>
                inspector.open({ entityId: recircCfm.entityId, label: "Recirc CFM", unit: "cfm" })
              }
            />
            <Arrow x={85} y={200} angle={-90} color="#b388ff" />
            <LinkLabel x={205} y={280} text={`recirc to room ${fmt(recircCfm.value)}`} color="#b388ff" />
          </>
        ) : null}
      </svg>
      {!focus ? (
        <StatusChip
          label={`Intake Σ ${fmt(sigmaIn)} cfm · exhaust Σ ${fmt(sigmaOut)} cfm`}
          tone="muted"
        />
      ) : null}
    </div>
  );
}
