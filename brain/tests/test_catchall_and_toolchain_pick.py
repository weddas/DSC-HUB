"""The SPA catch-all must 404 real API paths and 3D assets; installed() follows the builder."""

from __future__ import annotations


def test_api_segments_cover_every_route():
    import re

    from dsc_brain import api

    src = open(api.__file__, encoding="utf-8").read()
    segs = set(re.findall(r'@app\.(?:get|post|put|patch|delete|websocket)\("/([A-Za-z0-9_-]+)', src))
    missing = {s for s in segs if not api.is_api_path(s + "/x")}
    assert not missing, f"API first segments not 404-guarded: {sorted(missing)}"
    assert api.is_api_path("zones") and api.is_api_path("journals/archive")


def test_glb_is_an_asset():
    from dsc_brain.api import _ASSET_EXTS

    assert ".glb" in _ASSET_EXTS and ".gltf" in _ASSET_EXTS


def test_installed_follows_the_build_backend():
    from dsc_brain.esphome_toolchain import _pick_installed

    src = {"dashboard": "2026.8.2", "host_helper": "2026.6.5", "venv": None}
    assert _pick_installed(src, "venv-host") == "2026.6.5"  # the venv the helper pip'd
    assert _pick_installed(src, "dashboard") == "2026.8.2"  # the dashboard IS the backend
    assert _pick_installed({"dashboard": None, "host_helper": None, "venv": None}, "none") is None
