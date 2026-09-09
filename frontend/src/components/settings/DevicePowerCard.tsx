import { useEffect, useState } from "react";
import { SettingsCard } from "./SettingRow";
import { SettingRow } from "./SettingRow";
import { StatusChip } from "../ui";
import { fetchDevicePower, setDevicePower, type DevicePower } from "../../lib/devicePowerApi";

/** Per-device wattage — what each appliance, lamp and fan draws.
 *
 * The energy estimates are watts × hours × tariff, and until now only lamps carried a
 * figure, so the heater and dehumidifier were simply missing from the number.
 *
 * A device matched to a catalogue product shows the product's nameplate READ-ONLY, with a
 * note saying so. That is deliberate: the nameplate is a fact about the hardware, and
 * letting it be typed over would leave the estimate disagreeing with the thing it
 * describes, with nothing on screen to say which was meant.
 */
function PowerRow({ device, onSaved }: { device: DevicePower; onSaved: () => void }) {
  const [draft, setDraft] = useState<string>(device.watts != null ? String(device.watts) : "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    setDraft(device.watts != null ? String(device.watts) : "");
  }, [device.watts]);

  const commit = async () => {
    const trimmed = draft.trim();
    const next = trimmed === "" ? null : Number(trimmed);
    if (next != null && !Number.isFinite(next)) {
      setErr("Enter a number of watts, or clear the box to leave it unset.");
      return;
    }
    if (next === device.operator_watts) return;
    setBusy(true);
    setErr(null);
    try {
      await setDevicePower(device.device_id, next);
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
      setDraft(device.watts != null ? String(device.watts) : "");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingRow
      id={`power-${device.device_id.replace(/[.:]/g, "-")}`}
      label={device.label}
      description={device.note}
      scope={device.locked ? "brain" : "brain"}
      isDefault={device.source === "unset"}
      state={busy ? "pending" : err ? "failed" : null}
      stateText={err ?? undefined}
      control={
        device.locked ? (
          <>
            {/* Read-only on purpose. Rendered as a value plus a chip rather than a disabled
                input, so it does not look like a control that is merely broken. */}
            <span className="dsc-setting-value">{device.watts?.toFixed(0)} W</span>
            <StatusChip
              label="FROM DATABASE"
              tone="muted"
              title={`Set by the product database — matched to ${device.catalog_id}. Unmatch the product to set it by hand.`}
            />
          </>
        ) : (
          <>
            <input
              type="number"
              min={0}
              max={5000}
              step={5}
              inputMode="decimal"
              value={draft}
              aria-label={`${device.label} watts`}
              placeholder="—"
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => void commit()}
              onKeyDown={(e) => {
                if (e.key === "Enter") void commit();
              }}
              className="dsc-power-input"
            />
            <span className="dsc-setting-value">W</span>
          </>
        )
      }
    />
  );
}

const GROUPS: { kind: DevicePower["kind"]; title: string; intro: string }[] = [
  {
    kind: "appliance",
    title: "Appliance power",
    intro: "What each appliance draws. Used by the energy estimates; a device left unset is excluded from them rather than counted as zero.",
  },
  { kind: "light", title: "Lamp power", intro: "Fixture draw per tent. This is the figure the Light desk's energy card already uses." },
  { kind: "fan", title: "Fan power", intro: "Each fan's draw. Fans run close to continuously, so these dominate a day's total." },
];

export function DevicePowerCard() {
  const [devices, setDevices] = useState<DevicePower[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetchDevicePower()
      .then((r) => {
        setDevices(r.devices);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "could not load device power"));
  };
  useEffect(load, []);

  return (
    <>
      {GROUPS.map((g) => {
        const rows = (devices ?? []).filter((d) => d.kind === g.kind);
        return (
          <SettingsCard
            key={g.kind}
            id={`power-${g.kind}`}
            title={g.title}
            icon={g.kind === "fan" ? "inline-fan" : g.kind === "light" ? "lighting" : "system"}
            intro={g.intro}
            loadState={devices ? "ready" : error ? "error" : "loading"}
            loadError={error ?? undefined}
          >
            {rows.map((d) => (
              <PowerRow key={d.device_id} device={d} onSaved={load} />
            ))}
            {devices && !rows.length ? (
              <p className="dsc-muted" style={{ margin: 0 }}>
                Nothing of this kind is registered yet.
              </p>
            ) : null}
          </SettingsCard>
        );
      })}
    </>
  );
}
