import { useCallback, useEffect, useState } from "react";
import { Button, Card, StatusChip } from "../ui";
import { DecisionLayer } from "../DecisionLayer";
import {
  deleteSpaceDevice,
  deviceControllable,
  deviceInstance,
  getDeviceTiers,
  getSpaces,
  putSpaceDevice,
  type DeviceTier,
  type DeviceTierInfo,
  type SpaceDevice,
} from "../../lib/fleetApi";

/**
 * What is in each tent, and what the brain can actually do with it.
 *
 * plan-spatial-layout S3. A space can hold any number of fans or lights, and the thing that
 * keeps the list honest is the tier: the hub has a fixed number of channels, so a device is
 * either driven (level + read-back), switched (on/off through a plug), or simply known.
 * All three cost power and move air; only the first two have a control, and a device that
 * has not said which gets no control at all rather than one that silently does nothing.
 */

const TIER_TONE: Record<string, "ok" | "warn" | "muted"> = {
  driven: "ok",
  switched: "warn",
  known: "muted",
};

type Draft = {
  device_id: string;
  label: string;
  kind: string;
  role: string;
  tier: DeviceTier;
  binding: string;
  watts: string;
};

const EMPTY: Draft = {
  device_id: "",
  label: "",
  kind: "fan",
  role: "",
  tier: "known",
  binding: "",
  watts: "",
};

function DeviceRow({
  device,
  tiers,
  onChanged,
}: {
  device: SpaceDevice;
  tiers: DeviceTierInfo[];
  onChanged: () => void;
}) {
  const inst = deviceInstance(device);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const tier = inst.tier || "";
  const note = tiers.find((t) => t.id === tier)?.note ?? "Tier not set — no control is offered.";

  // The binding lives in an editable field on the row, because otherwise the driven and
  // switched chips can never succeed: promoting a device needs something to promote it to,
  // and an error that says "needs a binding" with nowhere to type one is a dead end.
  const [bindingDraft, setBindingDraft] = useState(inst.binding ?? "");
  const [seenId, setSeenId] = useState(device.device_id);
  if (seenId !== device.device_id) {
    setSeenId(device.device_id);
    setBindingDraft(inst.binding ?? "");
  }

  const setTier = async (next: DeviceTier) => {
    setBusy(true);
    setErr("");
    try {
      // A known device cannot carry a binding, so moving to it clears one.
      await putSpaceDevice(device.space_id, device.device_id, {
        tier: next,
        binding: next === "known" ? "" : bindingDraft.trim(),
      });
      onChanged();
    } catch (exc) {
      setErr(exc instanceof Error ? exc.message : "Could not change tier");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setErr("");
    try {
      await deleteSpaceDevice(device.space_id, device.device_id);
      setConfirm(false);
      onChanged();
    } catch (exc) {
      setErr(exc instanceof Error ? exc.message : "Could not remove device");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: "10px 0", borderTop: "1px solid var(--dsc-hairline)" }}>
      <div className="dsc-chip-row" style={{ alignItems: "center", gap: 8 }}>
        <strong>{device.label || device.device_id}</strong>
        <StatusChip label={tier ? tier : "tier not set"} tone={TIER_TONE[tier] ?? "muted"} />
        {inst.kind ? <span className="dsc-cal-point">{inst.kind}</span> : null}
        {inst.role ? <span className="dsc-cal-point">{inst.role}</span> : null}
        <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
          {device.watts} W
        </span>
      </div>

      <p className="dsc-kpi-sub" style={{ margin: "4px 0 0" }}>
        {note}
        {inst.binding ? ` · ${inst.binding}` : ""}
      </p>
      {!deviceControllable(device) ? (
        <p className="dsc-kpi-sub" style={{ margin: "2px 0 0" }}>
          Counts toward power and airflow. No control is shown for it anywhere.
        </p>
      ) : null}

      <label style={{ display: "block", marginTop: 8 }}>
        Binding — the entity or plug the brain talks to
        <input
          value={bindingDraft}
          onChange={(e) => setBindingDraft(e.target.value)}
          placeholder="fan.dsc_hub_… or tuya:… (leave empty for a known device)"
        />
      </label>

      <div className="dsc-chip-row" style={{ gap: 6, marginTop: 8, flexWrap: "wrap" }}>
        {tiers.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`dsc-chip${tier === t.id ? " dsc-chip--ok" : ""}`}
            // Only `busy` disables: the chip both sets the tier AND saves the binding
            // beside it, so "already this tier" is not a no-op — it is how a binding is
            // corrected without changing tier.
            disabled={busy}
            title={t.note}
            onClick={() => void setTier(t.id)}
          >
            {t.id}
          </button>
        ))}
        <Button variant="secondary" disabled={busy} onClick={() => setConfirm(true)}>
          Remove
        </Button>
      </div>

      {err ? (
        <p className="dsc-honesty" style={{ marginTop: 6 }}>
          {err}
        </p>
      ) : null}

      <DecisionLayer
        open={confirm}
        busy={busy}
        onDismiss={() => setConfirm(false)}
        onConfirm={() => void remove()}
        title={`Remove ${device.label || device.device_id}`}
        confirmLabel={busy ? "Removing…" : "Remove device"}
        help={null}
      >
        <p>
          The brain forgets this device: its {device.watts} W stops counting toward running
          cost, and it stops contributing to this space's airflow.
        </p>
        <p>
          {/* Name the device's own tier rather than assuming "driven": deviceControllable
              is true for switched too, and telling someone their smart-plug fan is driven
              is a small lie in a confirm dialog, which is the worst place for one. */}
          The hardware is untouched
          {deviceControllable(device)
            ? ` — it keeps running on whatever it was last told (${tier}).`
            : "."}
        </p>
      </DecisionLayer>
    </div>
  );
}

export function SpaceDevicesCard() {
  const [spaces, setSpaces] = useState<Array<{ space_id: string; devices: SpaceDevice[] }>>([]);
  const [tiers, setTiers] = useState<DeviceTierInfo[]>([]);
  const [kinds, setKinds] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    try {
      const [rows, vocab] = await Promise.all([getSpaces(), getDeviceTiers()]);
      setSpaces(rows.map((s) => ({ space_id: s.space_id, devices: s.devices || [] })));
      setTiers(vocab.tiers);
      setKinds(vocab.kinds);
      setErr("");
    } catch (exc) {
      setErr(exc instanceof Error ? exc.message : "Could not read devices");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const startAdd = (spaceId: string) => {
    setAddingTo(spaceId);
    setDraft(EMPTY);
    setErr("");
  };

  const submit = async () => {
    if (!addingTo) return;
    const id = draft.device_id.trim();
    if (!id) {
      setErr("Give the device an id — a short name unique within the tent.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await putSpaceDevice(addingTo, id, {
        label: draft.label.trim() || id,
        watts: Number(draft.watts) || 0,
        kind: draft.kind,
        role: draft.role.trim(),
        tier: draft.tier,
        binding: draft.tier === "known" ? "" : draft.binding.trim(),
      });
      setAddingTo(null);
      await reload();
    } catch (exc) {
      setErr(exc instanceof Error ? exc.message : "Could not add device");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="dsc-glass" title="Devices in each space" icon="fan">
      <p className="dsc-muted" style={{ margin: "0 0 8px", fontSize: "var(--dsc-fs-md)" }}>
        A tent can hold as many fans or lights as you own. What the brain can do with each one
        is its <strong>tier</strong> — everything here counts toward power and airflow, but only
        a driven or switched device gets a control.
      </p>

      {err && !addingTo ? <p className="dsc-honesty">{err}</p> : null}

      {spaces.map((s) => (
        <div key={s.space_id} style={{ marginBottom: 14 }}>
          <div className="dsc-chip-row" style={{ alignItems: "center", gap: 8 }}>
            <h4 style={{ margin: 0, fontSize: "var(--dsc-fs-lg)" }}>{s.space_id}</h4>
            <span className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
              {s.devices.length} device{s.devices.length === 1 ? "" : "s"}
            </span>
            <Button variant="secondary" onClick={() => startAdd(s.space_id)}>
              Add a device
            </Button>
          </div>
          {s.devices.length === 0 ? (
            <p className="dsc-kpi-sub" style={{ margin: "6px 0 0" }}>
              Nothing recorded here yet.
            </p>
          ) : (
            s.devices.map((d) => (
              <DeviceRow
                key={`${d.space_id}-${d.device_id}`}
                device={d}
                tiers={tiers}
                onChanged={() => void reload()}
              />
            ))
          )}
        </div>
      ))}

      <DecisionLayer
        open={addingTo != null}
        busy={busy}
        onDismiss={() => setAddingTo(null)}
        onConfirm={() => void submit()}
        title={`Add a device to ${addingTo ?? ""}`}
        confirmLabel={busy ? "Adding…" : "Add device"}
        help={null}
      >
        <label>
          Id
          <input
            value={draft.device_id}
            onChange={(e) => setDraft({ ...draft, device_id: e.target.value })}
            placeholder="corner_fan"
          />
        </label>
        <label>
          Label
          <input
            value={draft.label}
            onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            placeholder="Corner oscillating fan"
          />
        </label>
        <label>
          Kind
          <select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value })}>
            {kinds.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <label>
          Role (optional — several devices may share one)
          <input
            value={draft.role}
            onChange={(e) => setDraft({ ...draft, role: e.target.value })}
            placeholder="circulation"
          />
        </label>
        <label>
          Watts
          <input
            type="number"
            min="0"
            value={draft.watts}
            onChange={(e) => setDraft({ ...draft, watts: e.target.value })}
            placeholder="35"
          />
        </label>
        <label>
          What can the brain do with it?
          <select
            value={draft.tier}
            onChange={(e) => setDraft({ ...draft, tier: e.target.value as DeviceTier })}
          >
            {tiers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} — {t.note}
              </option>
            ))}
          </select>
        </label>
        {draft.tier !== "known" ? (
          <label>
            Binding — the entity or plug it talks to
            <input
              value={draft.binding}
              onChange={(e) => setDraft({ ...draft, binding: e.target.value })}
              placeholder="fan.dsc_hub_… or tuya:…"
            />
          </label>
        ) : (
          <p className="dsc-kpi-sub">
            A known device has no binding. It still counts toward power and airflow — it just
            has nothing to press.
          </p>
        )}
        {err ? <p className="dsc-honesty">{err}</p> : null}
      </DecisionLayer>
    </Card>
  );
}
