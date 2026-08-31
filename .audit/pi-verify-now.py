#!/usr/bin/env python3
"""Quick Pi operator-polish verification (HTTP)."""
import json
import re
import urllib.error
import urllib.request

BASE = "http://192.168.86.48:8787"


def get_json(path: str, timeout: float = 20):
    with urllib.request.urlopen(BASE + path, timeout=timeout) as resp:
        return resp.status, json.load(resp)


def main() -> None:
    out: dict[str, object] = {}
    out["health"] = urllib.request.urlopen(BASE + "/health", timeout=10).status

    _, fc = get_json("/fleet/computed")
    out["fleet_computed_status"] = "ok" if isinstance(fc, dict) and fc else "empty"

    html = urllib.request.urlopen(BASE + "/", timeout=10).read().decode()
    idx = re.search(r"assets/index-([^\"]+)\.js", html)
    cal = re.search(r"assets/calibrate-([^\"]+)\.js", html)
    out["index_bundle"] = idx.group(1) if idx else None
    out["calibrate_bundle"] = cal.group(1) if cal else None

    if cal:
        body = urllib.request.urlopen(
            BASE + "/assets/calibrate-" + cal.group(1) + ".js", timeout=20
        ).read().decode(errors="ignore")
        out["softcal_ok"] = "SoftCal OK" in body
        out["live_hold_fans"] = "holds live fans" in body
        out["live_hold_sf1000"] = "holds the live SF1000" in body
        out["outcome_strip"] = "What:" in body

    def page_ids(off: int) -> list[str]:
        _, data = get_json(f"/v1/catalogs/strains?q=&limit=5&offset={off}")
        rows = data if isinstance(data, list) else data.get("items") or []
        return [str(r.get("id") or r.get("name") or "?") for r in rows]

    p0, p1 = page_ids(0), page_ids(5)
    out["offset_ok"] = bool(p0 and p1 and p0[0] != p1[0])

    for n in (3, 4):
        req = urllib.request.Request(
            BASE + f"/roster/detach/{n}",
            method="POST",
            data=b"{}",
            headers={"Content-Type": "application/json"},
        )
        try:
            urllib.request.urlopen(req, timeout=10)
            out[f"detach_{n}"] = "unexpected_200"
        except urllib.error.HTTPError as exc:
            out[f"detach_{n}"] = exc.code

    _, fleet = get_json("/fleet")
    slots = []
    for row in fleet.get("inventory") or []:
        sid = row.get("seat_id") or ""
        if not sid.startswith("pot"):
            continue
        ex = row.get("extra") or {}
        aid = str(ex.get("assigned_plant_id") or "")
        slots.append(
            {
                "seat": sid,
                "assigned": aid[:40] if aid else None,
                "in_service": ex.get("in_service"),
            }
        )
    out["pots"] = slots
    bad = [s["assigned"] for s in slots if (s["assigned"] or "").startswith("slot:")]
    out["slot_residual"] = bad or "none"

    out["ppfd_manifest"] = urllib.request.urlopen(
        BASE + "/dsc-catalog/ppfd/manifest.json", timeout=10
    ).status

    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
