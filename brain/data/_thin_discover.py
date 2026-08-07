"""Discovery-only fetch for thin-field sources (no master)."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_common import DATA, fetch_text, name_norm, write_dump  # noqa: E402
from brain.dsc_brain.paths import STAGING_DIR  # noqa: E402
from brain.dsc_brain.staging import write_dump_to_staging  # noqa: E402

results: list[dict] = []


def try_url(uid: str, url: str, **extra):
    try:
        text = fetch_text(url, timeout=90)
        row = {"id": uid, "url": url, "bytes": len(text), "ok": True, **extra}
        results.append(row)
        print(f"OK {uid} bytes={len(text)}")
        return text
    except Exception as exc:  # noqa: BLE001
        results.append({"id": uid, "url": url, "ok": False, "error": str(exc)[:200], **extra})
        print(f"FAIL {uid}: {exc}")
        return None


# OpenTHC refresh
text = try_url(
    "openthc_vdb",
    "https://vdb.openthc.org/download/strains.json",
    redistributable=True,
    fields="identity/type; grow/chem thin",
)
if text:
    try:
        data = json.loads(text)
        rows = data if isinstance(data, list) else data.get("data") or data.get("strains") or []
        items = []
        for r in rows:
            if not isinstance(r, dict):
                continue
            name = str(r.get("name") or "").strip()
            if not name:
                continue
            items.append({**r, "name": name, "name_norm": name_norm(name), "source": "openthc"})
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
            print(f"openthc wrote {len(items)}")
    except Exception as exc:  # noqa: BLE001
        results.append({"id": "openthc_parse", "error": str(exc)})

try_url(
    "kushy_strains_csv",
    "https://raw.githubusercontent.com/kushyapp/cannabis-dataset/master/Dataset/Strains/strains-kushy_api.2017-11-14.csv",
    redistributable=True,
    fields="effects,flavors,cannabinoids",
    license="MIT",
)
try_url(
    "wikileaf_all_data",
    "https://raw.githubusercontent.com/Loyal9-Elements/grow_data/master/Resources/csv/ALL_data.csv",
    redistributable=True,
    fields="THC/CBD/type/info text (grow often in free text)",
    license="MIT",
)
try_url(
    "maxvalue_results_csv",
    "https://raw.githubusercontent.com/MaxValue/Terpene-Profile-Parser-for-Cannabis-Strains/master/results.csv",
    redistributable=True,
    fields="terpene panels by lab/strain",
    license="open/research",
)
try_url(
    "mendeley_landing",
    "https://data.mendeley.com/datasets/6zwcgrttkp/1",
    redistributable=False,
    fields="effects + chemistry (~800 strains)",
    note="manual download / DOI gate",
)
try_url(
    "ma_ccc_catalog",
    "https://masscannabiscontrol.com/open-data/data-catalog",
    redistributable=True,
    fields="state lab THC/metals; terpenes usually absent; strain names variable",
)
try_url(
    "strain_data_project",
    "https://straindataproject.org/research",
    redistributable=False,
    fields="terpene research; no clear bulk CSV",
)
try_url(
    "cannlytics_data_science",
    "https://api.github.com/repos/cannlytics/cannabis-data-science/contents/",
    redistributable=True,
    fields="notebooks + occasional lab CSVs",
    license="MIT",
)

# Forum reachability for boards beyond the 3 already scraped
for fid, url in [
    ("forum_autoflower", "https://www.autoflower.org/"),
    ("forum_rollitup", "https://www.rollitup.org/"),
    ("forum_opengrow", "https://www.opengrow.com/"),
    ("forum_sensi", "https://forum.sensiseeds.com/"),
    ("forum_growery", "https://www.growery.org/"),
    ("forum_thctalk", "https://www.thctalk.com/"),
    ("forum_ozstoners", "https://www.ozstoners.com/"),
]:
    try_url(fid, url, redistributable=False, fields="grow journals / flowering / height anecdotes")

# EU / AU bank catalogs still thin
for bid, url in [
    ("greenhouse_shop_sitemap", "https://shop.greenhouseseeds.nl/sitemap.xml"),
    ("greenhouse_shop_index", "https://shop.greenhouseseeds.nl/sitemap_index.xml"),
    ("neptune_home", "https://neptuneseedbank.com/"),
    ("true_north_home", "https://truenorthseedbank.com/"),
    ("pacific_seed_home", "https://pacificseedbank.com/"),
    ("quebec_seeds_home", "https://quebeccannabisseeds.com/"),
]:
    try_url(bid, url, redistributable=False, fields="flowering/height/yield/lineage on PDPs")

# Wayback SeedFinder probe (known blocked live)
try_url(
    "wayback_seedfinder_cdx",
    "https://web.archive.org/cdx/search/cdx?url=seedfinder.eu/*&output=json&limit=5",
    redistributable=False,
    fields="lineage graph archive; ToS/legal review before bulk",
)

out = DATA / "dsc_thin_field_discovery_2026-08-08.json"
write_dump(
    out,
    "discovery",
    results,
    source="n087_thin_field_pass",
    note="Thin-field source discovery while master merges paused; no StrainDB traffic",
    redistributable=False,
)
print(f"wrote {out} n={len(results)}")
ok = sum(1 for r in results if r.get("ok"))
print(f"reachable {ok}/{len(results)}")
