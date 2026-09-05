import { Suspense, lazy } from "react";
import type { CfmReading } from "../../lib/cfmProvenance";
import { StatusChip } from "../ui";

const AirflowParticleScene = lazy(() =>
  import("./AirflowParticleScene").then((m) => ({ default: m.AirflowParticleScene })),
);

export type AirflowReadings = {
  intakeMain: CfmReading;
  intakeClone: CfmReading;
  outCfm: CfmReading;
  recircCfm: CfmReading;
};

/** Lazy Three.js lung-room viz — scaffold for 7.4 D2. */
export function AirflowParticleViz({
  readings,
  manualOverride,
}: {
  readings: AirflowReadings;
  manualOverride: boolean;
}) {
  return (
    <div className="dsc-airflow-viz">
      <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
        <StatusChip icon="climate" label="Lung room airflow" tone="ok" />
        {!manualOverride ? (
          <StatusChip icon="settings" label="Fan trim locked — enable manual override" tone="muted" />
        ) : null}
      </div>
      <Suspense
        fallback={
          <div className="dsc-empty" style={{ minHeight: 280 }}>
            Loading airflow viz…
          </div>
        }
      >
        <AirflowParticleScene readings={readings} manualOverride={manualOverride} />
      </Suspense>
    </div>
  );
}
