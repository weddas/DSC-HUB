### Task 5: Pi hotpatch + desk flood evidence

**Files:**
- Create (optional audit): `.audit/zb-flood-desk-bind.sh`, `.audit/zb-flood-evidence.sh`
- Hotpatch on Pi `192.168.86.48` (user `dsc`)

**Interfaces:**
- Consumes: Task 1â€“3 code on disk
- Produces: evidence that both desk ieee fire independent banners; Climate chips match; tank unchanged

- [ ] **Step 1: Deploy brain modules**

Copy `zigbee_policies.py` + `zigbee_mqtt.py` into the running brain container (same path used in prior hotpatches). Restart with:

```bash
timeout 25 docker restart <brain_container>
```

Never bare `docker kill`.

- [ ] **Step 2: Deploy SPA**

`docker cp` built SPA assets (or full spa-dist) into brain/nginx static path used previously; hard-reload operator browser.

- [ ] **Step 3: Bind desk sensors**

Via API/Settings (Show all if class is motion):

| ieee | role | zone | recipe |
|------|------|------|--------|
| one of `0xa4c1385a686af7df`, `0xa4c1380d734f2033` | `leak_floor_room` | `room` | `floor_flood_alert` |
| the other | `leak_floor_4x8` | `4x8` | `floor_flood_alert` |

Confirm tank ieee `0xa4c138b9e2b9b690` still `leak_tank` + `tank_full_appliance`.

- [ ] **Step 4: Smoke**

1. Wet room desk â†’ banner id `zb-policy-<room_ieee>`; dehum/humidifier `in_service` unchanged; Climate shows Wet + Problem for room role.
2. Dry room desk â†’ that banner clears; Clear chip.
3. Wet 4Ã—8 desk â†’ separate banner id; room banner stays clear if dry.
4. Optionally MQTT inject if physical wet awkward.
5. Confirm Overview critical strip shows flood text; tank path still OOS on wet if exercised.

- [ ] **Step 5: Write evidence**

Append to `.superpowers/sdd/` or `.audit/` short report with fleet JSON snippets (banners, policy_state, inventory seats). Update FOLLOWUPS flood row to **done (live)**.

- [ ] **Step 6: Commit** (only if user asked)

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Wet primary + Problem badge when Task bound | Task 3 |
| `floor_flood_alert` opposite-edge, banner+log, no OOS | Task 1 |
| Params `problem_when` + `banner` | Tasks 1â€“2 |
| Roles room / 4Ã—8 / 2Ã—4 + suggested_roles | Task 1 |
| Shared Settings task params | Task 2 |
| Desk sensors room + 4Ã—8 evidence | Task 5 |
| Multi-sensor / 2Ã—4 live deferred | Task 4 FOLLOWUPS |
| Tank regressions | Task 1 pytest full files |

No TBD placeholders; commit steps gated on user ask.
