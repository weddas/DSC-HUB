import { useEffect, useState } from "react";
import { Button } from "../ui";
import { HelpTip } from "../HelpTip";
import { SettingsTable, SettingsRow, ActionsCell } from "./SettingsTable";
import {
  get_zigbee_device_types,
  get_zigbee_recipes,
  get_zigbee_roles,
  put_zigbee_custom_recipes,
  put_zigbee_custom_roles,
  ZIGBEE_CUSTOM_ROLE_KINDS,
  type ZigbeeDeviceType,
  type ZigbeeRecipe,
  type ZigbeeRole,
} from "../../lib/fleetApi";

type CustomRole = { id: string; label: string; kind: string };
type CustomTask = { id: string; label: string };

const SLUG_RE = /^[a-z][a-z0-9_]{1,47}$/;

/**
 * Operator-definable Zigbee catalogs (rollout Phase 4). Custom roles are pure
 * routing labels — a climate/safety kind slots into Climate handling. Custom
 * tasks are datapoint-only: bindable and reported, but they wire no actuator or
 * banner behaviour (that stays code-defined).
 */
export function ZigbeeCatalogCard({ onSaved }: { onSaved?: () => void }) {
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [tasks, setTasks] = useState<CustomTask[]>([]);
  const [roleDraft, setRoleDraft] = useState<CustomRole>({ id: "", label: "", kind: "climate" });
  const [taskDraft, setTaskDraft] = useState<CustomTask>({ id: "", label: "" });
  const [rolesDirty, setRolesDirty] = useState(false);
  const [tasksDirty, setTasksDirty] = useState(false);
  const [msg, setMsg] = useState("");
  const [deviceTypes, setDeviceTypes] = useState<ZigbeeDeviceType[]>([]);

  useEffect(() => {
    void get_zigbee_device_types()
      .then((r) => setDeviceTypes(r.device_types ?? []))
      .catch(() => undefined);
  }, []);

  const load = () => {
    void get_zigbee_roles()
      .then((r) => {
        const custom = (r.custom ?? r.roles.filter((x) => x.custom)) as ZigbeeRole[];
        setRoles(custom.map((x) => ({ id: x.id, label: x.label, kind: String(x.kind ?? "other") })));
        setRolesDirty(false);
      })
      .catch(() => undefined);
    void get_zigbee_recipes()
      .then((r) => {
        const custom = (r.custom ?? r.recipes.filter((x) => x.custom)) as ZigbeeRecipe[];
        setTasks(custom.map((x) => ({ id: x.id, label: x.label })));
        setTasksDirty(false);
      })
      .catch(() => undefined);
  };

  useEffect(load, []);

  const addRole = () => {
    if (!SLUG_RE.test(roleDraft.id) || !roleDraft.label.trim()) return;
    if (roles.some((r) => r.id === roleDraft.id)) return;
    setRoles((prev) => [...prev, { ...roleDraft, label: roleDraft.label.trim() }]);
    setRoleDraft({ id: "", label: "", kind: "climate" });
    setRolesDirty(true);
  };

  const addTask = () => {
    if (!SLUG_RE.test(taskDraft.id) || !taskDraft.label.trim()) return;
    if (tasks.some((t) => t.id === taskDraft.id)) return;
    setTasks((prev) => [...prev, { ...taskDraft, label: taskDraft.label.trim() }]);
    setTaskDraft({ id: "", label: "" });
    setTasksDirty(true);
  };

  const saveRoles = async () => {
    try {
      await put_zigbee_custom_roles(roles.map((r) => ({ ...r, consume: r.kind === "climate" })));
      setMsg(`Saved ${roles.length} custom role${roles.length === 1 ? "" : "s"}.`);
      setRolesDirty(false);
      onSaved?.();
      load();
    } catch (e) {
      setMsg(String((e as Error).message || e));
    }
  };

  const saveTasks = async () => {
    try {
      await put_zigbee_custom_recipes(tasks);
      setMsg(`Saved ${tasks.length} custom task${tasks.length === 1 ? "" : "s"}.`);
      setTasksDirty(false);
      onSaved?.();
      load();
    } catch (e) {
      setMsg(String((e as Error).message || e));
    }
  };

  return (
    <section className="dsc-card">
      <h3 className="dsc-card-title">
        Zigbee catalogs
        <HelpTip title="Operator-defined roles & tasks">
          <p>
            <b>Roles</b> are routing labels. A <b>climate</b> or <b>safety</b> role flows into
            Climate → Zigbee by role like the built-ins; other kinds just tag the device.
          </p>
          <p>
            <b>Tasks</b> you add here are <b>datapoint only</b> — the device reports, but no
            appliance is put OOS and no banner is raised. Actuator/banner tasks stay code-defined.
          </p>
        </HelpTip>
      </h3>
      <p className="dsc-muted">
        Extend the Role and Task lists in the Zigbee binding table below. Built-ins can&apos;t be
        edited or removed.
      </p>

      {deviceTypes.length ? (
        <details className="dsc-inventory-group">
          <summary>Supported device types ({deviceTypes.length})</summary>
          <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", marginTop: 4 }}>
            What a joined device can do in a rule — its datapoints are trigger sources;{" "}
            <b>actuates</b> means an automation can turn it on/off.
          </p>
          <div className="dsc-table-scroll">
            <table className="dsc-table dsc-table--settings">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Class</th>
                  <th>Datapoints</th>
                  <th>Actuates</th>
                </tr>
              </thead>
              <tbody>
                {deviceTypes.map((t) => (
                  <tr key={t.id}>
                    <td>{t.label}</td>
                    <td>{t.capability_class}</td>
                    <td className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                      {t.datapoints.map((d) => `${d.key}${d.unit ? ` (${d.unit})` : ""}`).join(", ")}
                    </td>
                    <td className={t.can_actuate ? "is-ok" : "is-muted"}>
                      {t.can_actuate ? "yes" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}

      <SettingsTable
        columns={[
          { key: "id", label: "Role ID" },
          { key: "label", label: "Label" },
          { key: "kind", label: "Kind" },
          { key: "act", label: "", tight: true },
        ]}
        caption="Custom roles"
      >
        {roles.map((r, i) => (
          <SettingsRow key={r.id}>
            <td>
              <code>{r.id}</code>
            </td>
            <td>{r.label}</td>
            <td>{r.kind}</td>
            <ActionsCell>
              <Button
                variant="secondary"
                onClick={() => {
                  setRoles((prev) => prev.filter((_, j) => j !== i));
                  setRolesDirty(true);
                }}
              >
                Remove
              </Button>
            </ActionsCell>
          </SettingsRow>
        ))}
        <SettingsRow>
          <td>
            <input
              type="text"
              value={roleDraft.id}
              placeholder="sub_canopy_left"
              onChange={(e) =>
                setRoleDraft((d) => ({ ...d, id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") }))
              }
            />
          </td>
          <td>
            <input
              type="text"
              value={roleDraft.label}
              placeholder="Sub-canopy left"
              onChange={(e) => setRoleDraft((d) => ({ ...d, label: e.target.value }))}
            />
          </td>
          <td>
            <select
              value={roleDraft.kind}
              onChange={(e) => setRoleDraft((d) => ({ ...d, kind: e.target.value }))}
            >
              {ZIGBEE_CUSTOM_ROLE_KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </td>
          <ActionsCell>
            <Button onClick={addRole} disabled={!SLUG_RE.test(roleDraft.id) || !roleDraft.label.trim()}>
              Add
            </Button>
          </ActionsCell>
        </SettingsRow>
      </SettingsTable>
      <Button primary disabled={!rolesDirty} onClick={saveRoles}>
        Save roles
      </Button>

      <SettingsTable
        columns={[
          { key: "id", label: "Task ID" },
          { key: "label", label: "Label" },
          { key: "act", label: "", tight: true },
        ]}
        caption="Custom tasks (datapoint only)"
      >
        {tasks.map((t, i) => (
          <SettingsRow key={t.id}>
            <td>
              <code>{t.id}</code>
            </td>
            <td>{t.label}</td>
            <ActionsCell>
              <Button
                variant="secondary"
                onClick={() => {
                  setTasks((prev) => prev.filter((_, j) => j !== i));
                  setTasksDirty(true);
                }}
              >
                Remove
              </Button>
            </ActionsCell>
          </SettingsRow>
        ))}
        <SettingsRow>
          <td>
            <input
              type="text"
              value={taskDraft.id}
              placeholder="co2_watch"
              onChange={(e) =>
                setTaskDraft((d) => ({ ...d, id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") }))
              }
            />
          </td>
          <td>
            <input
              type="text"
              value={taskDraft.label}
              placeholder="CO₂ watch"
              onChange={(e) => setTaskDraft((d) => ({ ...d, label: e.target.value }))}
            />
          </td>
          <ActionsCell>
            <Button onClick={addTask} disabled={!SLUG_RE.test(taskDraft.id) || !taskDraft.label.trim()}>
              Add
            </Button>
          </ActionsCell>
        </SettingsRow>
      </SettingsTable>
      <Button primary disabled={!tasksDirty} onClick={saveTasks}>
        Save tasks
      </Button>

      {msg ? <p className="dsc-honesty">{msg}</p> : null}
    </section>
  );
}
