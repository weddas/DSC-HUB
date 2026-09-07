import { useEffect, useState } from "react";
import { Button } from "../ui";
import { SettingsCard, Stated } from "./SettingRow";
import { HubTunableRow } from "./HubTunableRow";
import { useHubTunables } from "../../hooks/useHubTunables";
import { useStageRail } from "../../hooks/useStageRail";
import { useSaveState } from "../../hooks/useGlobalModifiers";
import type { StageRailRow } from "../../lib/hubTunablesApi";

const FIELDS: { key: keyof StageRailRow & string; label: string; unit: string; step: number }[] = [
  { key: "temp", label: "Temp", unit: "°C", step: 0.5 },
  { key: "vpd_min", label: "VPD min", unit: "kPa", step: 0.1 },
  { key: "vpd_max", label: "VPD max", unit: "kPa", step: 0.1 },
  { key: "rh_min", label: "RH min", unit: "%", step: 1 },
  { key: "rh_max", label: "RH max", unit: "%", step: 1 },
  { key: "light_hours", label: "Light", unit: "h", step: 1 },
];

function Cell({
  row,
  field,
  step,
  onCommit,
}: {
  row: StageRailRow;
  field: keyof StageRailRow & string;
  step: number;
  onCommit: (value: number) => void;
}) {
  const live = Number(row[field]);
  const [draft, setDraft] = useState(String(live));
  useEffect(() => setDraft(String(live)), [live]);
  const def = row.default?.[field];
  const changed = def != null && Math.abs(live - def) > 1e-9;
  return (
    <td className={`is-numeric${changed ? " is-changed" : ""}`} title={def != null ? `default ${def}` : undefined}>
      <input
        type="number"
        step={step}
        value={draft}
        aria-label={`${row.stage} ${field}`}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const n = Number(draft);
          if (Number.isFinite(n) && n !== live) onCommit(n);
          else setDraft(String(live));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
      />
    </td>
  );
}

/**
 * Settings › Climate › Stage presets — the brain's editable copy of the hub's
 * `apply_stage` table. The hub defers its numeric writes to this table only when the
 * `Brain owns stage presets` switch is on and the brain is connected; otherwise the
 * baked table runs and this table only labels the desks. Light hours stay firmware-owned.
 */
export function StageRailCard() {
  const rail = useStageRail();
  const tunables = useHubTunables();
  const save = useSaveState();
  const [msg, setMsg] = useState<string>("");
  const hubOnline = tunables.data?.hub_online ?? false;
  const switchPresent = tunables.byId["switch.dsc_hub_brain_stage_targets"]?.present ?? false;
  const brainOwns = rail.data?.brain_owns ?? false;
  const changed = rail.data?.rows.filter((r) => r.changed).length ?? 0;

  return (
    <SettingsCard
      id="presets"
      title="Stage presets"
      icon="growth-stage-timeline"
      intro="What a stage change asks of the 4×8: the same table the hub firmware bakes in, editable here. Light hours are labels — the hub's own photoperiod rail still decides them."
      loadState={rail.state === "error" ? "error" : rail.state}
      loadError={rail.error}
      actions={
        <>
          <Button variant="secondary" disabled={!changed || save.state === "pending"} onClick={() => void save.run(() => rail.reset())}>
            Reset all to firmware table
          </Button>
          {msg ? <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>{msg}</span> : null}
        </>
      }
    >
      <HubTunableRow
        entityId="switch.dsc_hub_brain_stage_targets"
        description={
          switchPresent || tunables.state !== "ready"
            ? "When on and the brain is connected, a stage change on the hub takes its five targets from this table. Off, or with no brain, the hub applies its baked table."
            : "This hub's firmware predates brain-owned presets. The table below still labels the desks; flash the v4 firmware with the switch to let the brain stamp targets."
        }
      />
      <div className="dsc-table-scroll" style={{ marginTop: 10 }}>
        <table className="dsc-table dsc-table--settings">
          <thead>
            <tr>
              <th>Stage</th>
              {FIELDS.map((f) => (
                <th key={f.key} className="is-numeric">
                  {f.label} <span className="dsc-muted">{f.unit}</span>
                </th>
              ))}
              <th className="is-tight" />
            </tr>
          </thead>
          <tbody>
            {(rail.data?.rows ?? []).map((row) => (
              <tr key={row.stage} className={row.changed ? "is-changed" : undefined}>
                <td>
                  {row.stage}
                  {row.changed ? <span className="dsc-muted"> · edited</span> : null}
                </td>
                {FIELDS.map((f) => (
                  <Cell
                    key={f.key}
                    row={row}
                    field={f.key}
                    step={f.step}
                    onCommit={(v) =>
                      void save.run(async () => {
                        await rail.patch(row.stage, { [f.key]: v });
                        setMsg("");
                      })
                    }
                  />
                ))}
                <td className="is-tight">
                  <div className="dsc-row-actions">
                    {row.changed ? (
                      <Button variant="secondary" onClick={() => void save.run(() => rail.reset(row.stage))}>
                        Reset
                      </Button>
                    ) : null}
                    <span
                      title={
                        !brainOwns
                          ? "Turn on Brain owns stage presets first"
                          : !hubOnline
                            ? "Hub offline"
                            : tunables.data?.blocked
                              ? "Manual takeover or a reconnect override is holding pushes"
                              : "Write these five targets to the hub now"
                      }
                    >
                      <Button
                        disabled={!brainOwns || !hubOnline || tunables.data?.blocked}
                        onClick={() =>
                          void save.run(async () => {
                            const written = await rail.apply(row.stage);
                            setMsg(`${row.stage}: ${Object.keys(written).length} targets pushed`);
                            await tunables.refresh();
                          })
                        }
                      >
                        Apply now
                      </Button>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {save.state === "failed" ? <p className="dsc-honesty">{save.text}</p> : null}
      <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", marginTop: 8 }}>
        <Stated>
          {brainOwns ? "brain owns presets — stage changes stamp this table" : "hub owns presets — this table labels the desks only"}
        </Stated>
      </p>
    </SettingsCard>
  );
}
