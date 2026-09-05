"""Kit version update — full pull only when Ethernet is up (8.0.0)."""

from __future__ import annotations

from typing import Any

from . import __version__
from .network_apply import eth_carrier_up
from .paths import SURFACE_VERSION


def update_status(*, eth_up: bool | None = None) -> dict[str, Any]:
    if eth_up is None:
        eth_up = eth_carrier_up()
    return {
        "eth_up": bool(eth_up),
        "can_full_pull": bool(eth_up),
        "current": {
            "image": "8.0.0",
            "brain": __version__,
            "surface": SURFACE_VERSION,
            "digests": {},
        },
        "note": (
            "Full Update pulls require Ethernet. "
            "Offline kits keep running the baked card version."
            if not eth_up
            else "Ethernet up — full Update pull allowed."
        ),
    }


def start_full_update(*, eth_up: bool | None = None) -> dict[str, Any]:
    if eth_up is None:
        eth_up = eth_carrier_up()
    if not eth_up:
        raise ValueError("full update requires ethernet link")
    # Orchestrator stub — compose pull / bundle load lands with image bake (Task 7).
    return {
        "status": "accepted",
        "action": "full_pull",
        "detail": "Update accepted — apply compose/image bundle on host (orchestrator stub).",
        **update_status(eth_up=True),
    }
