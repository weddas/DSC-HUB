import { useEffect, useState } from "react";
import { Button, Card, StatusChip } from "../ui";
import {
  getEnergyLearning,
  getEnergyTariff,
  getSpaces,
  patchEnergyLearning,
  putEnergyTariffBand,
  putSpaceDevice,
  type EnergyLearningSettings,
  type SpaceDevice,
} from "../../lib/fleetApi";

/** Settings → Brain: local tariff, device watts, Learning — never auto-apply schedules. */
export function SpaceEnergySettingsCard() {
  const [devices, setDevices] = useState<SpaceDevice[]>([]);
  const [tariff, setTariff] = useState<
    Array<{ band_id: string; label: string; rate_per_kwh: number }>
  >([]);
  const [learning, setLearning] = useState<EnergyLearningSettings | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const reload = async () => {
    try {
      const [spaces, bands, learn] = await Promise.all([
        getSpaces(),
        getEnergyTariff(),
        getEnergyLearning(),
      ]);
      setDevices(spaces.flatMap((s) => s.devices || []));
      setTariff(bands.map((b) => ({ band_id: b.band_id, label: b.label, rate_per_kwh: b.rate_per_kwh })));
      setLearning(learn);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  return (
    <Card className="dsc-glass" title="Space energy">
      <p className="dsc-muted" style={{ margin: "0 0 10px", fontSize: 13 }}>
        Local watts × tariff estimates and Learning duty proxies. Suggestions never auto-apply photoperiod.
      </p>
      <h4 style={{ margin: "0 0 6px", fontSize: 14 }}>Devices</h4>
      {devices.map((d) => (
        <label key={`${d.space_id}-${d.device_id}`} className="dsc-seat-editors" style={{ display: "block", marginBottom: 8 }}>
          {d.space_id} · {d.label || d.device_id} (W)
          <input
            type="number"
            value={d.watts}
            onChange={(e) => {
              const watts = Number(e.target.value);
              setDevices((prev) =>
                prev.map((x) =>
                  x.space_id === d.space_id && x.device_id === d.device_id ? { ...x, watts } : x,
                ),
              );
            }}
          />
          <Button
            style={{ marginTop: 4 }}
            onClick={() =>
              void putSpaceDevice(d.space_id, d.device_id, { watts: d.watts, label: d.label, enabled: d.enabled })
                .then(() => setStatus(`Updated ${d.device_id}`))
                .catch((e) => setErr(String(e)))
            }
          >
            Update
          </Button>
        </label>
      ))}
      <h4 style={{ margin: "12px 0 6px", fontSize: 14 }}>Tariff ($/kWh)</h4>
      {tariff.map((b) => (
        <label key={b.band_id} className="dsc-seat-editors" style={{ display: "block", marginBottom: 8 }}>
          {b.label || b.band_id}
          <input
            type="number"
            step="0.01"
            value={b.rate_per_kwh}
            onChange={(e) => {
              const rate_per_kwh = Number(e.target.value);
              setTariff((prev) =>
                prev.map((x) => (x.band_id === b.band_id ? { ...x, rate_per_kwh } : x)),
              );
            }}
          />
          <Button
            style={{ marginTop: 4 }}
            onClick={() =>
              void putEnergyTariffBand({ band_id: b.band_id, rate_per_kwh: b.rate_per_kwh, label: b.label })
                .then(() => setStatus(`Tariff ${b.band_id} updated`))
                .catch((e) => setErr(String(e)))
            }
          >
            Update
          </Button>
        </label>
      ))}
      {learning ? (
        <>
          <h4 style={{ margin: "12px 0 6px", fontSize: 14 }}>Learning</h4>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            <input
              type="checkbox"
              checked={learning.enabled}
              onChange={(e) => setLearning({ ...learning, enabled: e.target.checked })}
            />{" "}
            Enabled (re-rank / planning signal only)
          </label>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
            <input
              type="checkbox"
              checked={learning.prefer_growth_outliers}
              onChange={(e) => setLearning({ ...learning, prefer_growth_outliers: e.target.checked })}
            />{" "}
            Prefer growth over $ for 1–2 day outliers
          </label>
          <Button
            teal
            onClick={() =>
              void patchEnergyLearning(learning)
                .then((next) => {
                  setLearning(next);
                  setStatus("Learning settings saved");
                })
                .catch((e) => setErr(String(e)))
            }
          >
            Update Learning
          </Button>
        </>
      ) : null}
      <div className="dsc-chip-row" style={{ marginTop: 10 }}>
        {status ? <StatusChip label={status} tone="ok" /> : null}
        {err ? <StatusChip label={err} tone="bad" /> : null}
      </div>
    </Card>
  );
}
