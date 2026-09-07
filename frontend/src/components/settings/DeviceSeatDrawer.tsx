import { useEffect, useState } from "react";
import { StatusChip } from "../ui";
import type { InventoryRow, SeatSnapshot } from "../../lib/fleetModel";
import { extraField, fmtLastSeen } from "./settingsHelpers";
import { DrawerField, SettingsDrawer } from "./SettingsDrawer";

export type SeatMetaDraft = { functionName: string; placement: string; capabilityMax: string };

/**
 * One seat as a drawer (plan-settings S5): the detail list that used to be a card per
 * seat, plus the assignment fields (function, placement, capability cap) with Save.
 */
export function DeviceSeatDrawer({
  open,
  onClose,
  row,
  seat,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  row: (InventoryRow & Record<string, unknown>) | null;
  seat: SeatSnapshot | null;
  onSave: (seatId: string, row: Record<string, unknown>, draft: SeatMetaDraft) => Promise<void>;
}) {
  const initial: SeatMetaDraft = {
    functionName: row ? extraField(row, "function") : "",
    placement: row ? extraField(row, "placement") : "",
    capabilityMax: row ? String(extraField(row, "capability_max_pct") || "") : "",
  };
  const [draft, setDraft] = useState<SeatMetaDraft>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setDraft(initial);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row, open]);
  if (!row) return null;
  const seatId = String(row.seat_id ?? "—");
  const online = seat?.online ?? false;
  const uptime = seat?.values?.uptime;
  const rssi = seat?.values?.wifi_rssi ?? seat?.values?.rssi;
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  return (
    <SettingsDrawer
      open={open}
      onClose={onClose}
      title={seatId}
      dirty={dirty}
      saving={saving}
      error={error}
      onSave={async () => {
        setSaving(true);
        setError(null);
        try {
          await onSave(seatId, row, draft);
          onClose();
        } catch (e) {
          setError(e instanceof Error ? e.message : String(e));
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
        <StatusChip label={online ? "ONLINE" : "OFFLINE"} tone={online ? "ok" : "bad"} />
        <StatusChip label={row.in_service ? "IN SERVICE" : "OUT OF SERVICE"} tone={row.in_service ? "ok" : "muted"} />
        <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
          role {String(row.role ?? "—")}
        </span>
      </div>
      <dl className="dsc-detail-list">
        <dt>IP / host</dt>
        <dd>{String(row.host ?? seat?.values?.host ?? "—")}</dd>
        <dt>MAC</dt>
        <dd>{String(row.mac ?? "—")}</dd>
        <dt>Firmware</dt>
        <dd>{String(seat?.firmware ?? seat?.values?.firmware_version ?? "—")}</dd>
        <dt>Uptime</dt>
        <dd>{typeof uptime === "number" ? `${Math.round(uptime / 60)} min` : "—"}</dd>
        <dt>RSSI</dt>
        <dd>{rssi != null ? `${String(rssi)} dBm` : "—"}</dd>
        <dt>Last seen</dt>
        <dd>{fmtLastSeen(seat?.last_seen ?? null)}</dd>
      </dl>
      <h4 style={{ margin: "14px 0 6px" }}>Assignment</h4>
      <p className="dsc-muted" style={{ marginTop: 0 }}>
        Function and placement tell the brain what this seat measures or drives. The capability cap limits max fan or light output when the hardware differs from nameplate.
      </p>
      <DrawerField label="Function">
        <input type="text" value={draft.functionName} placeholder="e.g. intake_temp" onChange={(e) => setDraft({ ...draft, functionName: e.target.value })} />
      </DrawerField>
      <DrawerField label="Placement">
        <input type="text" value={draft.placement} placeholder="e.g. 4x8 intake duct" onChange={(e) => setDraft({ ...draft, placement: e.target.value })} />
      </DrawerField>
      <DrawerField label="Capability cap (%)" hint="Blank means nameplate (100 %).">
        <input type="number" min={1} max={100} value={draft.capabilityMax} placeholder="100" onChange={(e) => setDraft({ ...draft, capabilityMax: e.target.value })} />
      </DrawerField>
    </SettingsDrawer>
  );
}
