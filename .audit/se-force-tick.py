import time
from dsc_brain.compose_store import get_helper, set_helper
from dsc_brain.schedule_shift import _connect, cancel_shift_plan, create_shift_plan, tick_shift_plans

pairs = (
    ("4x8", "time.dsc_hub_lights_on_time"),
    ("2x4", "time.dsc_hub_clone_lights_on_time"),
)
restored = []
for sid, entity in pairs:
    before = get_helper(entity, "20:00:00") or "20:00:00"
    from_on = str(before)[:5] if len(str(before)) >= 5 else "20:00"
    if len(from_on) == 5:
        from_on = from_on + ":00"
    plan = create_shift_plan(
        sid,
        from_on=from_on,
        to_on="22:00:00",
        want_hours=12,
        policy="flower_strict",
        confirm=True,
    )
    with _connect(None) as conn:
        conn.execute("UPDATE schedule_shift_plan SET next_step_at=0 WHERE id=?", (plan["id"],))
        conn.commit()
    applied = []

    def set_on(space_id, lights_on):
        applied.append(f"{space_id}:{lights_on}")
        ent = (
            "time.dsc_hub_lights_on_time"
            if space_id in ("4x8", "main")
            else "time.dsc_hub_clone_lights_on_time"
        )
        set_helper(ent, lights_on)

    tick_shift_plans(now=time.time(), set_lights_on=set_on)
    cancel_shift_plan(int(plan["id"]))
    set_helper(entity, before)
    restored.append(
        {
            "space": sid,
            "before": before,
            "applied": applied,
            "restored": get_helper(entity, ""),
        }
    )
print(restored)
