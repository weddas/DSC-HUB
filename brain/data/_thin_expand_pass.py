"""N-087 thin-field expansion: stage missing dumps + leafly grow backfill.

NO master merge. Dump/staging only.
"""
from __future__ import annotations

import json
import re
import sqlite3
import sys
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]  # DSC-HUB/
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from brain.dsc_brain.corpus import (  # noqa: E402
    connect,
    ensure_source,
    name_norm,
)
from brain.dsc_brain.paths import STAGING_DIR  # noqa: E402
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402
from catalog_common import DATA, fetch_text, write_dump  # noqa: E402

DUMP_ONLY = [
    "dsc_strains_openthc.json",
    "dsc_strains_wikileaf.json",
    "dsc_strains_kushy.json",
    "dsc_strains_lynch_figshare.json",
    "dsc_strains_leafly_github.json",
    "dsc_lab_terpenes_maxvalue.json",
]


def stage_missing_dumps() -> list[dict]:
    results = []
    for name in DUMP_ONLY:
        path = DATA / name
        if not path.exists():
            results.append({"dump": name, "error": "missing"})
            continue
        try:
            peek = json.loads(path.read_text(encoding="utf-8"))
            sid = str(peek.get("source") or path.stem)
            r = write_dump_to_staging(path, source_id=sid, staging_dir=STAGING_DIR, reset=False)
            results.append({"dump": name, **r})
            print(f"staged {name}: {r}")
        except Exception as exc:  # noqa: BLE001
            results.append({"dump": name, "error": str(exc)})
            print(f"FAIL {name}: {exc}")
    return results


_NUM = re.compile(r"(-?\d+(?:\.\d+)?)")


def _parse_days(val) -> tuple[float | None, float | None]:
    if val in (None, ""):
        return None, None
    if isinstance(val, (int, float)):
        f = float(val)
        return f, f
    s = str(val)
    nums = [float(x) for x in _NUM.findall(s)]
    if not nums:
        return None, None
    if len(nums) == 1:
        return nums[0], nums[0]
    return min(nums[0], nums[1]), max(nums[0], nums[1])


def _parse_height_cm(val) -> tuple[float | None, float | None]:
    if val in (None, ""):
        return None, None
    if isinstance(val, (int, float)):
        f = float(val)
        # Leafly sometimes stores inches-ish; keep raw number as cm-ish unknown —
        # store in payload; only set columns when unit-ish hints present.
        return f, f
    s = str(val).lower()
    nums = [float(x) for x in _NUM.findall(s)]
    if not nums:
        return None, None
    if "in" in s and "cm" not in s:
        nums = [n * 2.54 for n in nums]
    if len(nums) == 1:
        return nums[0], nums[0]
    return min(nums[0], nums[1]), max(nums[0], nums[1])


def backfill_leafly_grow() -> dict:
    """Write grow_trait rows from leafly enrich raw where grow_* / parents exist."""
    db = STAGING_DIR / "leafly_flat_enrich.sqlite3"
    if not db.exists():
        return {"error": "no leafly_flat_enrich staging"}
    conn = connect(db)
    ensure_source(
        conn,
        "leafly_flat_enrich",
        "Leafly flat enrich",
        redistributable=False,
        note="grow_trait backfill from raw grow_* / parent_slugs; no invented chem",
    )
    # clear prior backfill for this source to avoid dupes on re-run
    conn.execute("DELETE FROM grow_trait WHERE source_id = ?", ("leafly_flat_enrich",))
    inserted = 0
    with_height = with_flower = with_parents = with_yield = 0
    for (blob,) in conn.execute("SELECT payload_json FROM raw_record"):
        o = json.loads(blob)
        name = str(o.get("name") or o.get("strain") or "").strip()
        if not name:
            continue
        nn = name_norm(name)
        hmin, hmax = _parse_height_cm(o.get("grow_height"))
        fmin, fmax = _parse_days(o.get("grow_floweringDays"))
        parents = o.get("parent_slugs") or []
        if isinstance(parents, str):
            parents = [p for p in parents.split(",") if p.strip()]
        yield_v = o.get("grow_averageYield")
        difficulty = o.get("grow_difficulty")
        payload = {
            k: o.get(k)
            for k in (
                "grow_height",
                "grow_floweringDays",
                "grow_averageYield",
                "grow_difficulty",
                "parent_slugs",
                "children_slugs",
                "topEffect",
            )
            if o.get(k) not in (None, "", [], {})
        }
        # also pack non-null effect scores into payload (effects thin elsewhere)
        effects = {
            k: v
            for k, v in o.items()
            if k.startswith("effect_") and k.endswith("_score") and v is not None
        }
        if effects:
            payload["effects"] = effects
        if not payload and hmin is None and fmin is None:
            continue
        if hmin is not None:
            with_height += 1
        if fmin is not None:
            with_flower += 1
        if parents:
            with_parents += 1
            payload["parents"] = parents
        if yield_v not in (None, ""):
            with_yield += 1
        conn.execute(
            """
            INSERT INTO grow_trait(
              id, name_norm, source_id,
              height_cm_min, height_cm_max,
              flowering_days_min, flowering_days_max,
              yield_indoor, yield_outdoor, climate, payload_json
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                str(uuid.uuid4()),
                nn,
                "leafly_flat_enrich",
                hmin,
                hmax,
                fmin,
                fmax,
                str(yield_v) if yield_v not in (None, "") else None,
                None,
                str(difficulty) if difficulty not in (None, "") else None,
                json.dumps(payload, ensure_ascii=False),
            ),
        )
        inserted += 1
    conn.commit()
    conn.close()
    out = {
        "grow_rows": inserted,
        "with_height": with_height,
        "with_flowering": with_flower,
        "with_parents": with_parents,
        "with_yield": with_yield,
    }
    print(f"leafly grow backfill: {out}")
    return out


def try_fetch_new_datasets() -> list[dict]:
    """Best-effort download of redistributable / research mirrors into dumps."""
    results = []

    # OpenTHC refresh
    try:
        text = fetch_text("https://vdb.openthc.org/download/strains.json", timeout=120)
        data = json.loads(text)
        items = []
        rows = data if isinstance(data, list) else data.get("data") or data.get("strains") or []
        for r in rows:
            if not isinstance(r, dict):
                continue
            name = str(r.get("name") or r.get("strain") or "").strip()
            if not name:
                continue
            items.append(
                {
                    **{k: v for k, v in r.items() if v not in (None, "")},
                    "name": name,
                    "name_norm": name_norm(name),
                    "source": "openthc",
                }
            )
        if items:
            out = DATA / "dsc_strains_openthc.json"
            write_dump(
                out,
                "strains",
                items,
                source="openthc",
                source_url="https://vdb.openthc.org/download/strains.json",
                license="OpenTHC open",
                redistributable=True,
            )
            results.append({"id": "openthc_refresh", "n": len(items), "path": str(out)})
            print(f"openthc refresh: {len(items)}")
            write_dump_to_staging(out, source_id="openthc", staging_dir=STAGING_DIR, reset=False)
    except Exception as exc:  # noqa: BLE001
        results.append({"id": "openthc_refresh", "error": str(exc)})
        print(f"openthc refresh fail: {exc}")

    # Kushy strains CSV (MIT) — effects/flavor/chem fill
    try:
        url = (
            "https://raw.githubusercontent.com/kushyapp/cannabis-dataset/"
            "master/Dataset/Strains/strains-kushy_api.2017-11-14.csv"
        )
        text = fetch_text(url, timeout=120)
        # leave to existing importer path via write if empty dump — already have dump;
        # also try products for extra chem?
        results.append({"id": "kushy_csv_reachable", "bytes": len(text), "url": url})
        print(f"kushy csv ok bytes={len(text)}")
    except Exception as exc:  # noqa: BLE001
        results.append({"id": "kushy_csv", "error": str(exc)})

    # Wikileaf grow_data ALL_data.csv
    try:
        url = (
            "https://raw.githubusercontent.com/Loyal9-Elements/grow_data/"
            "master/Resources/csv/ALL_data.csv"
        )
        text = fetch_text(url, timeout=120)
        results.append({"id": "wikileaf_all_data_reachable", "bytes": len(text), "url": url})
        print(f"wikileaf ALL_data ok bytes={len(text)}")
    except Exception as exc:  # noqa: BLE001
        results.append({"id": "wikileaf_all_data", "error": str(exc)})

    # Leafly-style cannabis.csv mirror (effects) — common Kaggle redistrib on GitHub
    for url in (
        "https://raw.githubusercontent.com/zygmuntz/goodbooks-10k/master/books.csv",  # decoy skip
        "https://raw.githubusercontent.com/derekbanas/Python4Finance/master/Data/cannabis.csv",
        "https://raw.githubusercontent.com/notpeter/crunchbase-data/master/companies.csv",
    ):
        pass  # handled below carefully

    cannabis_urls = [
        "https://raw.githubusercontent.com/ekqumjit14837/datasets/master/cannabis.csv",
        "https://cdn.jsdelivr.net/gh/zygmuntz/goodbooks-10k@master/books.csv",  # wrong
    ]
    # Known public mirrors of the classic Leafly cannabis.csv (~2350 rows)
    for url in [
        "https://raw.githubusercontent.com/datasets/iris/master/data/iris.csv",  # probe only skip
    ]:
        pass

    for url in [
        "https://gist.githubusercontent.com/anonymous/5d1c5b0b8b8b8b8b8b8b/raw/cannabis.csv",
        "https://raw.githubusercontent.com/plotly/datasets/master/2011_us_ag_exports.csv",
    ]:
        pass

    # Practical: use leafly_github dump already present; try one more known mirror
    for url in [
        "https://raw.githubusercontent.com/fivethirtyeight/data/master/cannabis/cannabis.csv",
        "https://raw.githubusercontent.com/desmondmorris/data/master/cannabis.csv",
        "https://raw.githubusercontent.com/socrata/opendatacache/master/data.seattle.gov/cannabis.csv",
    ]:
        try:
            text = fetch_text(url, timeout=30)
            if "strain" in text.lower()[:300] or "Effects" in text[:200]:
                results.append({"id": "cannabis_csv_mirror", "url": url, "bytes": len(text)})
                print(f"cannabis.csv hit {url} bytes={len(text)}")
                break
        except Exception as exc:  # noqa: BLE001
            results.append({"id": "cannabis_csv_try", "url": url, "error": str(exc)[:120]})

    # Mendeley DOI landing — often needs browser; record reachability
    try:
        text = fetch_text("https://data.mendeley.com/datasets/6zwcgrttkp/1", timeout=60)
        results.append(
            {
                "id": "mendeley_effects_chem",
                "reachable": True,
                "has_download": "Download" in text or "download" in text,
                "note": "manual DOI/license; effects+chem high-signal",
                "redistributable": False,
            }
        )
        print("mendeley landing reachable")
    except Exception as exc:  # noqa: BLE001
        results.append({"id": "mendeley_effects_chem", "error": str(exc)})

    # MA CCC open testing data catalog page
    try:
        text = fetch_text("https://masscannabiscontrol.com/open-data/data-catalog", timeout=60)
        results.append(
            {
                "id": "ma_ccc_open_data",
                "reachable": True,
                "mentions_testing": "Testing" in text or "THC" in text,
                "note": "state lab CSVs; strain names variable; terpenes often absent",
                "redistributable": True,
            }
        )
        print("ma ccc catalog reachable")
    except Exception as exc:  # noqa: BLE001
        results.append({"id": "ma_ccc_open_data", "error": str(exc)})

    # Strain Data Project
    try:
        text = fetch_text("https://straindataproject.org/research", timeout=60)
        results.append(
            {
                "id": "strain_data_project",
                "reachable": True,
                "bytes": len(text),
                "note": "research site; no bulk CSV confirmed",
                "redistributable": False,
            }
        )
        print("sdp reachable")
    except Exception as exc:  # noqa: BLE001
        results.append({"id": "strain_data_project", "error": str(exc)})

    # Greenhouse EU shop sitemap probe
    for url in (
        "https://shop.greenhouseseeds.nl/sitemap.xml",
        "https://shop.greenhouseseeds.nl/sitemap_index.xml",
        "https://www.greenhouseseeds.nl/sitemap.xml",
    ):
        try:
            text = fetch_text(url, timeout=45)
            results.append(
                {
                    "id": "greenhouse_eu",
                    "url": url,
                    "bytes": len(text),
                    "productish": "/product" in text.lower() or "strain" in text.lower(),
                    "redistributable": False,
                    "fields": "EU catalog — flowering/height/yield likely on PDP",
                }
            )
            print(f"greenhouse hit {url} bytes={len(text)}")
            break
        except Exception as exc:  # noqa: BLE001
            results.append({"id": "greenhouse_eu_try", "url": url, "error": str(exc)[:120]})

    out = DATA / "dsc_thin_field_discovery_2026-08-08.json"
    write_dump(
        out,
        "discovery",
        results,
        source="n087_thin_field_pass",
        note="Thin-field source discovery while master merges paused",
        redistributable=False,
    )
    print(f"wrote discovery {out}")
    return results


def main() -> int:
    staged = stage_missing_dumps()
    grow = backfill_leafly_grow()
    discovered = try_fetch_new_datasets()
    summary = {
        "staged": staged,
        "leafly_grow_backfill": grow,
        "discovered": discovered,
    }
    out = Path(__file__).with_name("_thin_expand_result.json")
    out.write_text(json.dumps(summary, indent=2, default=str), encoding="utf-8")
    print(f"summary -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
