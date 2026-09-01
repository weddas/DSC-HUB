import { Icon, StatusChip } from "../ui";
import type { InventoryRow, SeatSnapshot } from "../../lib/fleetModel";
import { extraField, fmtLastSeen, seatIcon } from "./settingsHelpers";

export function DeviceDetailCard({
  row,
  seat,
}: {
  row: InventoryRow & Record<string, unknown>;
  seat: SeatSnapshot | null;
}) {
  const seatId = String(row.seat_id ?? "—");
  const role = String(
    row.role ??
      (row.extra && typeof row.extra === "object"
        ? (row.extra as Record<string, unknown>).role
        : "—"),
  );
  const online = seat?.online ?? false;
  const inService = Boolean(row.in_service);
  const uptime = seat?.values?.uptime;
  const rssi = seat?.values?.wifi_rssi ?? seat?.values?.rssi;
  const calFn = extraField(row, "function");
  const calPlace = extraField(row, "placement");
  return (
    <div className="dsc-card">
      <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name={seatIcon(seatId)} size={16} color="var(--dsc-teal)" />
        {seatId}
        <StatusChip label={online ? "ONLINE" : "OFFLINE"} tone={online ? "ok" : "bad"} />
      </h3>
      <dl className="dsc-detail-list">
        <dt>Role</dt>
        <dd>{role}</dd>
        <dt>IP / host</dt>
        <dd>{String(row.host ?? seat?.values?.host ?? "—")}</dd>
        <dt>MAC</dt>
        <dd>{String(row.mac ?? "—")}</dd>
        <dt>Firmware</dt>
        <dd>{String(seat?.firmware ?? seat?.values?.firmware_version ?? "—")}</dd>
        <dt>Uptime</dt>
        <dd>{typeof uptime === "number" ? `${Math.round(uptime / 60)} min` : "—"}</dd>
        <dt>RSSI</dt>
        <dd>{rssi != null ? `${rssi} dBm` : "—"}</dd>
        <dt>Online</dt>
        <dd>{online ? "yes" : "no"}</dd>
        <dt>In service</dt>
        <dd>{inService ? "yes" : "no"}</dd>
        <dt>Function</dt>
        <dd>{calFn || "—"}</dd>
        <dt>Placement</dt>
        <dd>{calPlace || "—"}</dd>
        <dt>Last seen</dt>
        <dd>{fmtLastSeen(seat?.last_seen ?? null)}</dd>
      </dl>
    </div>
  );
}
