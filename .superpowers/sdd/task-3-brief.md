### Task 3: Climate safety honesty (Wet/Dry + Problem/Clear)

**Files:**
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/pages/ClimatePage.tsx`

**Interfaces:**
- Consumes: `fleet.system.zigbee_by_role`, `fleet.system.zigbee_device_bindings`, `fleet.system.zigbee_device_policies`, `fleet.system.zigbee_policy_state`
- Produces: Climate safety rows with wet chip + optional problem chip

- [ ] **Step 1: Split climate vs safety rows**

Import `isZigbeeSafetyLeakRole` from `../lib/fleetApi`.

```typescript
const bindings = (fleet.system.zigbee_device_bindings ?? {}) as Record<
  string,
  { role?: string; zone?: string; recipe_id?: string }
>;
const policies = (fleet.system.zigbee_device_policies ?? {}) as Record<
  string,
  { recipe_id?: string }
>;
const policyState = (fleet.system.zigbee_policy_state ?? {}) as Record<
  string,
  { problem?: boolean; active?: boolean }
>;

function ieeeForRole(roleId: string): string | null {
  for (const [ieee, row] of Object.entries(bindings)) {
    if (String(row?.role ?? "") === roleId) return ieee;
  }
  return null;
}

const zigbeeClimateRows = useMemo(() => {
  if (!zigbeeByRole) return [];
  return Object.entries(zigbeeByRole)
    .filter(([role]) => !isZigbeeSafetyLeakRole(role))
    .map(([role, row]) => ({
      role,
      zone: String(row.zone ?? "â€”"),
      temp: row.temperature,
      rh: row.humidity,
      name: String(row.friendly_name ?? role),
    }));
}, [zigbeeByRole]);

const zigbeeSafetyRows = useMemo(() => {
  if (!zigbeeByRole) return [];
  return Object.entries(zigbeeByRole)
    .filter(([role]) => isZigbeeSafetyLeakRole(role))
    .map(([role, row]) => {
      const ieee = ieeeForRole(role);
      const recipe =
        (ieee && policies[ieee]?.recipe_id) ||
        (ieee && bindings[ieee] && (bindings[ieee] as { recipe_id?: string }).recipe_id) ||
        "none";
      // Prefer zigbee_device_policies from fleet (brain mirrors policies onto fleet)
      const recipeId = ieee ? String(policies[ieee]?.recipe_id ?? "none") : "none";
      const st = ieee ? policyState[ieee] : undefined;
      const wet = typeof row.wet === "boolean" ? row.wet : typeof row.active === "boolean" ? row.active : null;
      const showProblem = Boolean(ieee && recipeId !== "none" && st && typeof st.problem === "boolean");
      return {
        role,
        zone: String(row.zone ?? "â€”"),
        name: String(row.friendly_name ?? role),
        wet,
        showProblem,
        problem: showProblem ? Boolean(st?.problem) : null,
      };
    });
}, [zigbeeByRole, bindings, policies, policyState]);
```

Fix any dead `recipe` variable â€” use only `recipeId` from `policies`.

Gate card visibility on climate **or** safety rows (not climate-only).

- [ ] **Step 2: Render safety subsection**

Below the climate table (or second table):

```tsx
{zigbeeSafetyRows.length ? (
  <>
    <p className="dsc-muted" style={{ fontSize: 12, marginTop: 12, marginBottom: 8 }}>
      Safety â€” Wet/Dry is the raw sensor. Problem/Clear appears only when a Task is bound.
    </p>
    <div className="dsc-chip-row">
      {zigbeeSafetyRows.map((row) => (
        <React.Fragment key={row.role}>
          <StatusChip
            label={`${row.role} Â· ${row.zone} Â· ${row.name}`}
            tone="muted"
          />
          <StatusChip
            label={row.wet === true ? "Wet" : row.wet === false ? "Dry" : "Wet/Dry â€”"}
            tone={row.wet === true ? "warn" : "ok"}
          />
          {row.showProblem ? (
            <StatusChip
              label={row.problem ? "Problem" : "Clear"}
              tone={row.problem ? "critical" : "ok"}
            />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  </>
) : null}
```

Use existing `StatusChip` tone names already used on Climate (adjust `critical` â†’ `warn` if tone enum lacks critical).

Ensure climate table maps `zigbeeClimateRows` (not all roles).

- [ ] **Step 3: Rebuild SPA**

```bash
cd homeassistant/custom_components/dsc_hub/frontend && npm run build:spa
```

Expected: exit 0

- [ ] **Step 4: Commit** (only if user asked)

```bash
git add homeassistant/custom_components/dsc_hub/frontend/src/pages/ClimatePage.tsx
git commit -m "feat(spa): Climate Zigbee safety Wet/Dry and Problem chips"
```

---

