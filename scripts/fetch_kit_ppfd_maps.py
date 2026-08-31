#!/usr/bin/env python3
"""Download kit fixture PPFD maps into local catalog (no hotlink at runtime).

Honesty:
- Stores manufacturer map images locally under www/dsc-catalog/ppfd/
- Does not invent PPFD grid cells
- Rewrites dsc_lights_search_index.json ppfd_url to /local/dsc-catalog/ppfd/… when matched
- Leaves unmatched lights with null local path (CDN URLs may remain in dump but SPA refuses them)

Usage:
  python scripts/fetch_kit_ppfd_maps.py
"""
from __future__ import annotations

import json
import re
import ssl
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "homeassistant" / "data" / "dsc_light_pack_photometrics.yaml"
OUT = ROOT / "homeassistant" / "www" / "dsc-catalog" / "ppfd"
INDEX = ROOT / "homeassistant" / "www" / "dsc-catalog" / "dsc_lights_search_index.json"
MANIFEST = OUT / "manifest.json"

# Kit / starter fixtures only (Wave 3 scope)
KIT_IDS = {
    "spider_farmer_sf1000",
    "spider_farmer_sf2000",
    "spider_farmer_se7000",
    "mars_hydro_ts1000",
}

NAME_HINTS = {
    "spider_farmer_sf1000": re.compile(r"sf[\s_-]?1000", re.I),
    "spider_farmer_sf2000": re.compile(r"sf[\s_-]?2000", re.I),
    "spider_farmer_se7000": re.compile(r"se[\s_-]?7000", re.I),
    "mars_hydro_ts1000": re.compile(r"ts[\s_-]?1000", re.I),
}


def _load_pack() -> list[dict]:
    try:
        import yaml  # type: ignore
    except ImportError:
        yaml = None
    text = PACK.read_text(encoding="utf-8")
    if yaml:
        data = yaml.safe_load(text)
        return list(data.get("fixtures") or [])
    # Minimal YAML scrape when PyYAML missing
    fixtures: list[dict] = []
    cur: dict | None = None
    for line in text.splitlines():
        if line.startswith("- id:"):
            if cur:
                fixtures.append(cur)
            cur = {"id": line.split(":", 1)[1].strip(), "ppfd_map_urls": []}
        elif cur and line.strip().startswith("- http") and "ppfd_map_urls" in (cur.get("_section") or "ppfd_map_urls"):
            # handled below via section tracking
            pass
        elif cur and line.strip() == "ppfd_map_urls:":
            cur["_section"] = "ppfd_map_urls"
        elif cur and line.strip().startswith("spectrum_map_urls:"):
            cur["_section"] = "spectrum"
        elif cur and cur.get("_section") == "ppfd_map_urls" and line.strip().startswith("- http"):
            cur["ppfd_map_urls"].append(line.strip()[2:].strip())
        elif cur and line.strip().startswith("name:"):
            cur["name"] = line.split(":", 1)[1].strip().strip("'\"")
    if cur:
        fixtures.append(cur)
    for f in fixtures:
        f.pop("_section", None)
    return fixtures


def _pick_url(urls: list) -> str | None:
    cleaned: list[str] = []
    for u in urls or []:
        if isinstance(u, dict):
            u = (u.get("url") or "").strip()
        u = str(u or "").strip()
        if u.startswith("http"):
            cleaned.append(u)
    if not cleaned:
        return None
    # Prefer non-thumb, PPFD-named
    def score(u: str) -> tuple:
        low = u.lower()
        thumb = 1 if re.search(r"-\d{2,4}x\d{2,4}\.", low) else 0
        ppfd = 0 if "ppfd" in low else 1
        return (thumb, ppfd, -len(u))

    cleaned.sort(key=score)
    return cleaned[0]


def _download(url: str, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    # IRIs with non-ascii path segments (Spider Farmer filenames)
    from urllib.parse import urlsplit, urlunsplit, quote

    parts = urlsplit(url)
    safe_path = quote(parts.path, safe="/%")
    safe_url = urlunsplit((parts.scheme, parts.netloc, safe_path, parts.query, parts.fragment))
    ctx = ssl.create_default_context()
    req = urllib.request.Request(
        safe_url,
        headers={
            "User-Agent": "DSC-HUB-ppfd-fetch/1.0 (local archive; operator kit maps)",
            "Accept": "image/*,*/*",
        },
    )
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=45) as resp:
            data = resp.read()
            ctype = (resp.headers.get("Content-Type") or "").lower()
    except Exception as exc:  # noqa: BLE001
        print("FAIL", safe_url.encode("ascii", "backslashreplace").decode("ascii"), repr(exc))
        return False
    if len(data) < 800:
        print("FAIL tiny", len(data))
        return False
    # Keep original extension when possible
    ext = ".jpg"
    low = safe_url.lower()
    if "png" in ctype or low.endswith(".png"):
        ext = ".png"
    elif "webp" in ctype or low.endswith(".webp"):
        ext = ".webp"
    elif low.endswith(".jpeg"):
        ext = ".jpeg"
    out = dest.with_suffix(ext)
    out.write_bytes(data)
    print("OK", out.name, len(data), "bytes")
    return True


def main() -> int:
    fixtures = [f for f in _load_pack() if f.get("id") in KIT_IDS]
    if not fixtures:
        print("No kit fixtures parsed from", PACK)
        return 1
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict] = {}
    for fix in fixtures:
        fid = str(fix["id"])
        url = _pick_url(fix.get("ppfd_map_urls") or [])
        if not url:
            print("SKIP no url", fid)
            continue
        stem = OUT / fid
        # remove prior variants
        for old in OUT.glob(f"{fid}.*"):
            if old.name != "manifest.json":
                old.unlink(missing_ok=True)
        ok = _download(url, stem)
        if not ok:
            continue
        written = next(OUT.glob(f"{fid}.*"), None)
        if not written:
            continue
        local = f"/dsc-catalog/ppfd/{written.name}"
        manifest[fid] = {
            "id": fid,
            "name": fix.get("name"),
            "source_url": url,
            "local_path": local,
            "ha_path": f"/local/dsc-catalog/ppfd/{written.name}",
            "file": written.name,
            "bytes": written.stat().st_size,
        }

    MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print("manifest", MANIFEST, "entries", len(manifest))

    if not INDEX.exists():
        print("No lights index to rewrite")
        return 0

    raw = json.loads(INDEX.read_text(encoding="utf-8"))
    items = raw if isinstance(raw, list) else raw.get("items") or raw.get("lights") or []
    changed = 0
    for item in items:
        if not isinstance(item, dict):
            continue
        name = str(item.get("name") or "")
        iid = str(item.get("id") or "")
        for fid, meta in manifest.items():
            hint = NAME_HINTS.get(fid)
            if not hint:
                continue
            if hint.search(name) or hint.search(iid):
                item["ppfd_url"] = meta["local_path"]
                item["has_ppfd"] = True
                item["ppfd_local"] = True
                changed += 1
                break
    if isinstance(raw, list):
        INDEX.write_text(json.dumps(raw, indent=2, ensure_ascii=False), encoding="utf-8")
    else:
        INDEX.write_text(json.dumps(raw, indent=2, ensure_ascii=False), encoding="utf-8")
    print("index rewrites", changed)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
