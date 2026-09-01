import time
from dsc_brain.compose_store import get_helper, set_helper
from dsc_brain.schedule_shift import _connect, cancel_shift_plan, create_shift_plan, tick_shift_plans

entity = "time.dsc_hub_clone_lights_on_time"
before = get_helper(entity, "20:00:00") or "20:00:00"
from_on = str(before)[:5] if len(str(before)) >= 5 else "20:00"
if len(from_on) == 5:
    from_on = from_on + ":00"
plan = create_shift_plan(
    "2x4",
    from_on=from_on,
    to_on="21:00:00",
    want_hours=18,
    policy="veg_style",
    confirm=True,
)
with _connect(None) as conn:
    conn.execute("UPDATE schedule_shift_plan SET next_step_at=0 WHERE id=?", (plan["id"],))
    conn.commit()


def set_on(space_id, lights_on):
    set_helper(
        "time.dsc_hub_clone_lights_on_time" if space_id == "2x4" else "time.dsc_hub_lights_on_time",
        lights_on,
    )


tick_shift_plans(now=time.time(), set_lights_on=set_on)
cancel_shift_plan(int(plan["id"]))
set_helper(entity, before)
print({"veg_style": "ok", "restored": get_helper(entity, "")})
