#!/usr/bin/env python3
"""Download PPFD/spectrum maps, crop to graph region, register media_asset + gaps.

Uses curated photometrics pack URLs. Crop heuristic: trim outer chrome via
edge-energy scan (no invented PPFD cell grids).
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_common import DATA, UA, fetch_bytes  # noqa: E402
from brain.dsc_brain.corpus import add_gap, connect, ensure_source, init_corpus  # noqa: E402
from brain.dsc_brain.paths import DEFAULT_DB  # noqa: E402

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore

try:
    from PIL import Image
except ImportError:
    Image = None  # type: ignore

MEDIA_DIR = DATA / "media" / "ppfd"
PACK = DATA / "dsc_light_pack_photometrics.yaml"


def _slug(s: str) -> str:
    import re

    return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")[:80]


def crop_graph(img: "Image.Image") -> tuple["Image.Image", dict]:
    """Heuristic crop: find content bbox by luminance variance, pad slightly."""
    gray = img.convert("L")
    w, h = gray.size
    # downsample for speed
    small = gray.resize((min(200, w), min(200, h)))
    px = small.load()
    sw, sh = small.size

    def row_energy(y: int) -> float:
        vals = [px[x, y] for x in range(sw)]
        mean = sum(vals) / len(vals)
        return sum((v - mean) ** 2 for v in vals) / len(vals)

    def col_energy(x: int) -> float:
        vals = [px[x, y] for y in range(sh)]
        mean = sum(vals) / len(vals)
        return sum((v - mean) ** 2 for v in vals) / len(vals)

    thr_r = max(row_energy(y) for y in range(sh)) * 0.08
    thr_c = max(col_energy(x) for x in range(sw)) * 0.08
    top = 0
    while top < sh - 1 and row_energy(top) < thr_r:
        top += 1
    bot = sh - 1
    while bot > top and row_energy(bot) < thr_r:
        bot -= 1
    left = 0
    while left < sw - 1 and col_energy(left) < thr_c:
        left += 1
    right = sw - 1
    while right > left and col_energy(right) < thr_c:
        right -= 1

    # map back to full res + pad
    sx, sy = w / sw, h / sh
    pad = 0.02
    box = [
        max(0, int((left - (right - left) * pad) * sx)),
        max(0, int((top - (bot - top) * pad) * sy)),
        min(w, int((right + (right - left) * pad) * sx)),
        min(h, int((bot + (bot - top) * pad) * sy)),
    ]
    if box[2] - box[0] < w * 0.3 or box[3] - box[1] < h * 0.3:
        # fallback: mild inset rather than bad crop
        box = [int(w * 0.05), int(h * 0.05), int(w * 0.95), int(h * 0.95)]
    cropped = img.crop(tuple(box))
    return cropped, {"box": box, "orig_size": [w, h], "method": "edge_energy_v1"}


def process_url(
    conn,
    *,
    fixture_id: str,
    kind: str,
    url: str,
    force: bool = False,
) -> dict:
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:12]
    stem = f"{_slug(fixture_id)}_{kind}_{digest}"
    raw_path = MEDIA_DIR / f"{stem}_raw.bin"
    crop_path = MEDIA_DIR / f"{stem}_crop.png"
    meta_path = MEDIA_DIR / f"{stem}.json"

    result = {"url": url, "fixture_id": fixture_id, "kind": kind, "ok": False}
    try:
        if force or not raw_path.exists():
            data = fetch_bytes(url, timeout=90)
            raw_path.write_bytes(data)
        else:
            data = raw_path.read_bytes()
        if Image is None:
            add_gap(conn, "light_fixture", fixture_id, kind, "pillow_missing_raw_saved")
            result["raw"] = str(raw_path)
            result["note"] = "raw saved; install Pillow to crop"
            return result
        img = Image.open(io.BytesIO(data))
        img.load()
        cropped, crop_meta = crop_graph(img)
        cropped.save(crop_path, format="PNG")
        meta = {
            "source_url": url,
            "raw_path": str(raw_path.relative_to(ROOT)),
            "local_path": str(crop_path.relative_to(ROOT)),
            "crop": crop_meta,
            "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
        meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")
        aid = stem
        conn.execute(
            "INSERT INTO media_asset(id, entity_kind, entity_id, kind, source_url, local_path, crop_json, note) "
            "VALUES(?,?,?,?,?,?,?,?) "
            "ON CONFLICT(id) DO UPDATE SET local_path=excluded.local_path, crop_json=excluded.crop_json",
            (
                aid,
                "light_fixture",
                fixture_id,
                kind,
                url,
                str(crop_path.relative_to(ROOT)),
                json.dumps(crop_meta),
                "cropped graph heuristic; no invented PPFD cells",
            ),
        )
        result.update({"ok": True, "local_path": str(crop_path), "crop": crop_meta})
    except Exception as exc:  # noqa: BLE001
        add_gap(conn, "light_fixture", fixture_id, kind, f"download_or_crop_failed: {exc}")
        result["error"] = str(exc)
    return result


def fixtures_from_pack() -> list[dict]:
    if not PACK.exists() or not yaml:
        return []
    doc = yaml.safe_load(PACK.read_text(encoding="utf-8")) or {}
    return list(doc.get("fixtures") or [])


def fixtures_from_light_dumps() -> list[dict]:
    out = []
    for path in sorted(DATA.glob("dsc_lights_*.json")):
        if "checkpoint" in path.name:
            continue
        try:
            doc = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        for row in doc.get("items") or doc.get("products") or []:
            if not isinstance(row, dict):
                continue
            urls = []
            for m in row.get("ppfd_maps") or []:
                if isinstance(m, dict) and m.get("url"):
                    urls.append(m["url"])
                elif isinstance(m, str):
                    urls.append(m)
            for u in row.get("ppfd_map_urls") or []:
                urls.append(u)
            if not urls:
                continue
            out.append(
                {
                    "id": row.get("id") or _slug(row.get("name") or "light"),
                    "name": row.get("name"),
                    "ppfd_map_urls": urls[:3],
                    "spectrum_map_urls": [
                        (s.get("url") if isinstance(s, dict) else s)
                        for s in (row.get("spectrum_maps") or row.get("spectrum_map_urls") or [])[:2]
                    ],
                }
            )
    return out


def write_gap_doc(conn, path: Path) -> None:
    rows = conn.execute(
        "SELECT entity_kind, entity_id, field, reason, created_at FROM followup_gap "
        "WHERE field LIKE '%ppfd%' OR field LIKE '%spectrum%' ORDER BY id"
    ).fetchall()
    lines = [
        "# Catalog PPFD / media gaps",
        "",
        "Auto-generated by `scripts/ingest_ppfd_maps.py`. Missing or failed map downloads — never invent grids.",
        "",
        f"Generated: {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}",
        "",
        "| Entity | Field | Reason | At |",
        "|---|---|---|---|",
    ]
    for r in rows:
        lines.append(
            f"| `{r['entity_kind']}:{r['entity_id']}` | `{r['field']}` | {r['reason'][:120]} | {r['created_at']} |"
        )
    if len(rows) == 0:
        lines.append("| _(none)_ | | | |")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", type=Path, default=DEFAULT_DB)
    ap.add_argument("--limit", type=int, default=40)
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    init_corpus(args.db)
    conn = connect(args.db)
    ensure_source(
        conn,
        "ppfd_maps",
        "PPFD map archival",
        license="manufacturer pages; local research copies",
        redistributable=False,
    )

    fixtures = fixtures_from_pack() + fixtures_from_light_dumps()
    seen = set()
    results = []
    n = 0
    for fx in fixtures:
        fid = str(fx.get("id") or _slug(fx.get("name") or "fx"))
        if fid in seen:
            continue
        seen.add(fid)
        # upsert light shell
        conn.execute(
            "INSERT INTO light_fixture(id, name, brand, source_id, wattage_w, ppf_umol_s, efficacy_umol_j, payload_json) "
            "VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING",
            (
                fid,
                fx.get("name") or fid,
                fx.get("brand"),
                "ppfd_maps",
                fx.get("wattage_w"),
                fx.get("ppf_umol_s"),
                fx.get("efficacy_umol_j"),
                json.dumps(fx, ensure_ascii=False),
            ),
        )
        ppfd_urls = list(fx.get("ppfd_map_urls") or [])
        if not ppfd_urls:
            add_gap(conn, "light_fixture", fid, "ppfd_map", "no_url_in_pack_or_dump")
        for url in ppfd_urls[:2]:
            if n >= args.limit:
                break
            results.append(process_url(conn, fixture_id=fid, kind="ppfd_graph", url=url, force=args.force))
            n += 1
        for url in list(fx.get("spectrum_map_urls") or [])[:1]:
            if n >= args.limit:
                break
            results.append(process_url(conn, fixture_id=fid, kind="spectrum_graph", url=url, force=args.force))
            n += 1
        if n >= args.limit:
            break

    conn.commit()
    write_gap_doc(conn, ROOT / "docs" / "qa" / "CATALOG-GAPS.md")
    ok = sum(1 for r in results if r.get("ok"))
    print(json.dumps({"processed": len(results), "ok": ok, "media_dir": str(MEDIA_DIR)}, indent=2))
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
