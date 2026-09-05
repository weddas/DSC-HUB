import { useEffect, useState } from "react";
import { Button } from "../ui";
import { extraField } from "./settingsHelpers";

export function DeviceAssignmentRow({
  row,
  onSave,
}: {
  row: Record<string, unknown>;
  onSave: (
    seatId: string,
    row: Record<string, unknown>,
    functionName: string,
    placement: string,
    capabilityMax: string,
  ) => Promise<void>;
}) {
  const seatId = String(row.seat_id ?? "");
  const [fn, setFn] = useState(extraField(row, "function"));
  const [place, setPlace] = useState(extraField(row, "placement"));
  const [cap, setCap] = useState(String(extraField(row, "capability_max_pct") || ""));

  useEffect(() => {
    setFn(extraField(row, "function"));
    setPlace(extraField(row, "placement"));
    setCap(String(extraField(row, "capability_max_pct") || ""));
  }, [row]);

  return (
    <tr>
      <td>{seatId}</td>
      <td>
        <input type="text" value={fn} onChange={(e) => setFn(e.target.value)} placeholder="e.g. intake_temp" />
      </td>
      <td>
        <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. 4x8 intake duct" />
      </td>
      <td>
        <input type="number" min="1" max="100" value={cap} onChange={(e) => setCap(e.target.value)} placeholder="100" />
      </td>
      <td>
        <Button onClick={() => onSave(seatId, row, fn, place, cap)}>Save</Button>
      </td>
    </tr>
  );
}
