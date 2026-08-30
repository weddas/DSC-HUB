"""SoftCal + climate-mode AI — advice only, guardrailed actions.

Never invent actuators. Allowed actions map to Brain plan entities only
(decision_tick demand_* or explicit no-op). Ollama narrative is optional.
"""

from __future__ import annotations

import json
from typing import Any

import httpx

from .decision_loop import decision_tick
from .settings import get_setting

# Actions the SPA/Brain may surface — anything else from a model is dropped.
ALLOWED_ACTION_TYPES = frozenset(
    {
        "demand_on",
        "demand_off",
        "advise_only",
        "soft_cal_recheck",
        "open_root_steering",
        "no_op",
        "noop",
    }
)


def _filter_actions(raw: list[Any]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        kind = str(item.get("type") or item.get("action") or "")
        if kind == "noop":
            kind = "no_op"
        if kind not in ALLOWED_ACTION_TYPES:
            continue
        out.append(
            {
                "type": "no_op" if kind == "noop" else kind,
                "metric": item.get("metric"),
                "detail": str(item.get("detail") or item.get("reason") or "")[:240],
            }
        )
    return out


async def _ollama_narrative(prompt: str) -> str | None:
    base = get_setting("ollama_base_url", "").rstrip("/")
    model = get_setting("ollama_model", "") or "llama3.2"
    if not base:
        return None
    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(
                f"{base}/api/generate",
                json={"model": model, "prompt": prompt, "stream": False},
            )
            resp.raise_for_status()
            data = resp.json()
            text = str(data.get("response") or "").strip()
            return text[:2000] if text else None
    except Exception:  # noqa: BLE001
        return None


async def soft_cal_climate_advice(
    *,
    seat: str = "pot1",
    strain_id: str | None = None,
    stage: str = "veg",
    got: dict[str, float | None] | None = None,
    soft_cal: dict[str, Any] | None = None,
    manual_takeover: bool = False,
) -> dict[str, Any]:
    """Return advisories + filtered actions from decision_tick (+ optional Ollama prose)."""
    tick = decision_tick(
        seat=seat,
        strain_id=strain_id,
        stage=stage,
        got=got,
        manual_takeover=manual_takeover,
        emit=False,
    )
    actions = _filter_actions(list(tick.get("commands") or []))
    for adv in tick.get("advisories") or []:
        actions.append({"type": "advise_only", "metric": None, "detail": str(adv)[:240]})
    if soft_cal:
        actions.append(
            {
                "type": "soft_cal_recheck",
                "metric": None,
                "detail": "Confirm SoftCal session against kit probe before acting",
            }
        )

    prompt = (
        "You are DSC-HUB grow advisor. Summarize Want vs Got in 3 short bullets. "
        "Do not invent hardware or relays. SoftCal context: "
        f"{json.dumps(soft_cal or {})[:500]}. Decision: {json.dumps({k: tick.get(k) for k in ('need', 'advisories')})[:800]}"
    )
    narrative = await _ollama_narrative(prompt)
    if narrative is None:
        narrative = "; ".join(str(a) for a in (tick.get("advisories") or [])[:5]) or (
            "No Ollama URL configured — showing decision_tick advisories only"
        )

    return {
        "ok": True,
        "seat": seat,
        "need": tick.get("need"),
        "want": tick.get("want"),
        "advisories": tick.get("advisories") or [],
        "actions": actions,
        "narrative": narrative,
        "ollama": bool(get_setting("ollama_base_url", "").strip()),
        "guardrail": "actions filtered to ALLOWED_ACTION_TYPES; emit=false",
    }
