#!/usr/bin/env python3
"""Build-a-Plant commit + detach round-trip on idle pot1 (Pi HTTP API)."""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from datetime import date, timedelta

BASE = "http://192.168.86.48:8787"
NICK = "OpPolishE2E31"
STRAIN = "Amnesia Haze Auto"


def post_service(domain: str, service: str, data: dict) -> dict:
    body = json.dumps({"domain": domain, "service": service, "data": data}).encode()
    req = urllib.request.Request(
        BASE + "/control/service",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def post_detach(pot_n: int) -> tuple[int, dict | str]:
    req = urllib.request.Request(
        BASE + f"/roster/detach/{pot_n}",
        data=b"{}",
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.load(resp)
    except urllib.error.HTTPError as exc:
        try:
            detail = json.load(exc)
        except Exception:
            detail = exc.read().decode(errors="replace")
        return exc.code, detail


def fleet_pot1_plant() -> str:
    fleet = json.load(urllib.request.urlopen(BASE + "/fleet", timeout=20))
    for row in fleet.get("inventory") or []:
        if row.get("seat_id") == "pot1":
            return str((row.get("extra") or {}).get("assigned_plant_id") or "")
    return ""


def main() -> None:
    sprout = (date.today() - timedelta(days=14)).isoformat()
    steps: list[tuple[str, object]] = []

    # Preconditions
    p1_before = fleet_pot1_plant()
    steps.append(("pot1_before", p1_before or "(idle)"))
    if p1_before:
        raise SystemExit(f"pot1 already assigned: {p1_before}")

    post_service("input_text", "set_value", {"entity_id": "input_text.dsc_build_strain", "value": STRAIN})
    post_service("input_text", "set_value", {"entity_id": "input_text.dsc_build_nickname", "value": NICK})
    post_service(
        "input_datetime",
        "set_datetime",
        {"entity_id": "input_datetime.dsc_build_sprout_date", "date": sprout},
    )
    post_service("input_select", "select_option", {"entity_id": "input_select.dsc_build_tent", "option": "2x4"})
    post_service("input_select", "select_option", {"entity_id": "input_select.dsc_build_assign_pot", "option": "1"})

    commit = post_service(
        "script",
        "turn_on",
        {"entity_id": "script.dsc_build_plant_commit_and_assign"},
    )
    steps.append(("commit", commit))

    p1_after = fleet_pot1_plant()
    steps.append(("pot1_after_commit", p1_after))
    if not p1_after.startswith("plant:"):
        raise SystemExit(f"commit did not assign plant UUID to pot1: {p1_after!r}")

    roster = json.load(urllib.request.urlopen(BASE + "/roster", timeout=20))
    steps.append(("roster_after_commit", roster))

    code, detach = post_detach(1)
    steps.append(("detach_status", code))
    steps.append(("detach_body", detach))

    p1_detached = fleet_pot1_plant()
    steps.append(("pot1_after_detach", p1_detached or "(idle)"))

    ok = code == 200 and not p1_detached
    steps.append(("round_trip_ok", ok))
    print(json.dumps(dict(steps), indent=2))
    if not ok:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
