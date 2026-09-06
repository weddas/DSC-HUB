import { useEffect, useState } from "react";
import { Button } from "../ui";
import { HelpTip } from "../HelpTip";
import { StatusChip } from "../ui";
import { SettingsTable, SettingsRow, InlineEditCell, ActionsCell } from "./SettingsTable";
import {
  get_automations,
  get_zigbee_actuatable,
  put_automations,
  type AutomationRule,
} from "../../lib/fleetApi";

const SLUG_RE = /^[a-z][a-z0-9_]{1,47}$/;

const OP_LABELS: Record<string, string> = {
  gt: "> ",
  lt: "< ",
  gte: "≥ ",
  lte: "≤ ",
  eq: "is",
  ne: "is not",
  is: "is (on/off)",
  is_not: "is not (on/off)",
};

const ENTITY_SUGGESTIONS = [
  "sensor.dsc_hub_tent_temperature",
  "sensor.dsc_hub_tent_humidity",
  "sensor.dsc_hub_vpd_kpa",
  "sensor.dsc_hub_clone_temperature",
  "sensor.dsc_hub_clone_humidity",
  "sensor.dsc_hub_room_temperature",
  "sensor.dsc_hub_room_humidity",
  "binary_sensor.dsc_hub_link",
  "binary_sensor.dsc_hub_4x8_window_open",
];

function blankRule(n: number): AutomationRule {
  return {
    id: `rule_${n}`,
    name: `Rule ${n}`,
    enabled: false,
    trigger: { entity_id: "sensor.dsc_hub_tent_temperature", op: "gt", value: 32 },
    action: { type: "banner", params: { text: "", tone: "warn" } },
  };
}

/**
 * Operator automation rules (rollout Phase 4). Flat trigger → action list on the
 * shared settings-table primitive. v1 actions: raise a banner, or take a seat
 * out of service — no relay / setpoint writes. Rules are off until you arm them;
 * the engine fails closed on stale / offline inputs.
 */
export function AutomationRulesCard({ seats }: { seats: string[] }) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState("");
  const [nextN, setNextN] = useState(1);
  const [zbSwitches, setZbSwitches] = useState<string[]>([]);

  useEffect(() => {
    void get_zigbee_actuatable()
      .then((r) => setZbSwitches((r.devices ?? []).map((d) => d.friendly_name).filter(Boolean)))
      .catch(() => undefined);
  }, []);

  const load = () => {
    void get_automations()
      .then((r) => {
        setRules(r.rules ?? []);
        setDirty(false);
        setNextN((r.rules?.length ?? 0) + 1);
      })
      .catch(() => undefined);
  };
  useEffect(load, []);

  const patch = (i: number, fn: (r: AutomationRule) => AutomationRule) => {
    setRules((prev) => prev.map((r, j) => (j === i ? fn(r) : r)));
    setDirty(true);
  };

  const setTrigger = (i: number, k: "entity_id" | "op" | "value", v: string) =>
    patch(i, (r) => ({ ...r, trigger: { ...r.trigger, [k]: v } }));

  const setActionType = (i: number, type: string) =>
    patch(i, (r) => ({
      ...r,
      action:
        type === "zigbee_switch"
          ? { type, params: { friendly_name: zbSwitches[0] ?? "", on_when_firing: true } }
          : type === "oos_seat"
          ? { type, params: { seat_id: seats[0] ?? "", banner: "" } }
          : { type, params: { text: "", tone: "warn" } },
    }));

  const setActionParam = (i: number, k: string, v: string) =>
    patch(i, (r) => ({ ...r, action: { ...r.action, params: { ...r.action.params, [k]: v } } }));

  const addRule = () => {
    setRules((prev) => [...prev, blankRule(nextN)]);
    setNextN((n) => n + 1);
    setDirty(true);
  };

  const save = async () => {
    try {
      const cleaned = rules.map((r) => ({
        ...r,
        trigger: {
          ...r.trigger,
          value:
            r.trigger.op === "gt" || r.trigger.op === "lt" || r.trigger.op === "gte" || r.trigger.op === "lte"
              ? Number(r.trigger.value)
              : String(r.trigger.value),
        },
      }));
      const r = await put_automations(cleaned);
      setRules(r.rules ?? []);
      setDirty(false);
      setMsg(`Saved ${r.rules?.length ?? 0} rule${(r.rules?.length ?? 0) === 1 ? "" : "s"}.`);
    } catch (e) {
      setMsg(String((e as Error).message || e));
    }
  };

  const invalid = rules.some(
    (r) => !SLUG_RE.test(r.id) || !String(r.trigger.entity_id).includes(".") ||
      (r.action.type === "banner" && !String(r.action.params.text ?? "").trim()) ||
      (r.action.type === "oos_seat" && !String(r.action.params.seat_id ?? "").trim()) ||
      (r.action.type === "zigbee_switch" && !String(r.action.params.friendly_name ?? "").trim()),
  );

  return (
    <section className="dsc-card" hidden={false}>
      <h3 className="dsc-card-title">
        Automations
        <HelpTip title="Automation rules">
          <p>
            When a fleet reading crosses a threshold, raise a banner or take a seat out of service.
            Rules are <b>off</b> until you arm them, act once on the edge (not continuously), and{" "}
            <b>fail closed</b> — a stale or offline reading never fires one.
          </p>
          <p>
            v1 has no relay or setpoint actions — those stay with the climate loop. Use the Zigbee
            task binding for sensor-driven appliance control.
          </p>
        </HelpTip>
      </h3>

      <datalist id="dsc-automation-entities">
        {ENTITY_SUGGESTIONS.map((e) => (
          <option key={e} value={e} />
        ))}
      </datalist>

      <SettingsTable
        columns={[
          { key: "name", label: "Name" },
          { key: "when", label: "When" },
          { key: "then", label: "Then" },
          { key: "status", label: "Status", tight: true },
          { key: "act", label: "", tight: true },
        ]}
        caption={rules.length ? `${rules.length} rule${rules.length === 1 ? "" : "s"}` : "No rules yet"}
      >
        {rules.map((r, i) => (
          <SettingsRow key={r.id} tone={r.enabled ? undefined : "muted"}>
            <InlineEditCell
              value={r.name}
              ariaLabel={`Rename ${r.name}`}
              onCommit={(next) => patch(i, (x) => ({ ...x, name: next }))}
              secondary={<code>{r.id}</code>}
            />
            <td>
              <div className="dsc-cell-actions" style={{ alignItems: "center" }}>
                <input
                  list="dsc-automation-entities"
                  value={r.trigger.entity_id}
                  style={{ minWidth: 190 }}
                  onChange={(e) => setTrigger(i, "entity_id", e.target.value)}
                />
                <select value={r.trigger.op} onChange={(e) => setTrigger(i, "op", e.target.value)}>
                  {Object.entries(OP_LABELS).map(([k, lbl]) => (
                    <option key={k} value={k}>
                      {lbl}
                    </option>
                  ))}
                </select>
                <input
                  value={String(r.trigger.value)}
                  style={{ width: 72 }}
                  onChange={(e) => setTrigger(i, "value", e.target.value)}
                />
              </div>
            </td>
            <td>
              <div className="dsc-cell-actions" style={{ alignItems: "center" }}>
                <select value={r.action.type} onChange={(e) => setActionType(i, e.target.value)}>
                  <option value="banner">Raise banner</option>
                  <option value="oos_seat">Seat out of service</option>
                  <option value="zigbee_switch" disabled={zbSwitches.length === 0}>
                    Zigbee switch {zbSwitches.length === 0 ? "(none bound)" : ""}
                  </option>
                </select>
                {r.action.type === "banner" ? (
                  <>
                    <input
                      placeholder="Banner text"
                      value={String(r.action.params.text ?? "")}
                      style={{ minWidth: 180 }}
                      onChange={(e) => setActionParam(i, "text", e.target.value)}
                    />
                    <select
                      value={String(r.action.params.tone ?? "warn")}
                      onChange={(e) => setActionParam(i, "tone", e.target.value)}
                    >
                      <option value="info">info</option>
                      <option value="warn">warn</option>
                      <option value="critical">critical</option>
                    </select>
                  </>
                ) : r.action.type === "zigbee_switch" ? (
                  <>
                    <select
                      value={String(r.action.params.friendly_name ?? "")}
                      onChange={(e) => setActionParam(i, "friendly_name", e.target.value)}
                    >
                      <option value="">— device —</option>
                      {zbSwitches.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <select
                      value={r.action.params.on_when_firing === false ? "off" : "on"}
                      onChange={(e) =>
                        patch(i, (x) => ({
                          ...x,
                          action: {
                            ...x.action,
                            params: { ...x.action.params, on_when_firing: e.target.value === "on" },
                          },
                        }))
                      }
                    >
                      <option value="on">turn ON while firing</option>
                      <option value="off">turn OFF while firing</option>
                    </select>
                  </>
                ) : (
                  <select
                    value={String(r.action.params.seat_id ?? "")}
                    onChange={(e) => setActionParam(i, "seat_id", e.target.value)}
                  >
                    <option value="">— seat —</option>
                    {seats.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </td>
            <td className="is-tight">
              {r.firing ? (
                <StatusChip label="FIRING" tone="bad" />
              ) : r.enabled ? (
                <StatusChip label="ARMED" tone="ok" />
              ) : (
                <StatusChip label="OFF" tone="muted" />
              )}
            </td>
            <ActionsCell>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--dsc-fs-sm)" }}>
                <input
                  type="checkbox"
                  checked={r.enabled}
                  onChange={(e) => patch(i, (x) => ({ ...x, enabled: e.target.checked }))}
                />
                arm
              </label>
              <Button
                variant="secondary"
                onClick={() => {
                  setRules((prev) => prev.filter((_, j) => j !== i));
                  setDirty(true);
                }}
              >
                Remove
              </Button>
            </ActionsCell>
          </SettingsRow>
        ))}
      </SettingsTable>

      <div className="dsc-row-actions">
        <Button onClick={addRule}>Add rule</Button>
        <Button primary disabled={!dirty || invalid} onClick={save}>
          Save rules
        </Button>
      </div>
      {msg ? <p className="dsc-honesty">{msg}</p> : null}
    </section>
  );
}
