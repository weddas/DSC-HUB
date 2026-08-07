#!/usr/bin/env python3
"""Export DoltHub cannabis datasets via SQL API into schema-v2 dumps."""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, UA, name_norm, write_dump  # noqa: E402

# Known public cannabis repos / tables (discovered + blog docs).
TARGETS = [
    {
        "id": "dolthub_wa_testing",
        "owner": "Liquidata",
        "repo": "cannabis-testing-wa",
        "refs": ["master", "main"],
        "kind": "lab",
        "out": "dsc_lab_dolthub_wa.json",
        "license": "DoltHub public repo / research",
        "redistributable": False,
        "table_candidates": ["tests"],
        "name_cols": ("test_strain", "strain", "leafly_strain", "product_name", "name"),
        "aggregate_sql": (
            "SELECT test_strain, leafly_strain, "
            "MIN(thc_max) AS thc_min, MAX(thc_max) AS thc_max, "
            "MIN(cbd_max) AS cbd_min, MAX(cbd_max) AS cbd_max, "
            "COUNT(*) AS n_tests "
            "FROM tests "
            "WHERE test_strain IS NOT NULL AND test_strain != '' "
            "GROUP BY test_strain, leafly_strain"
        ),
    },
    {
        "id": "dolthub_marijuana_data",
        "owner": "liquidata-samples",
        "repo": "marijuana_data",
        "refs": ["master", "main"],
        "kind": "strains",
        "out": "dsc_strains_dolthub_leafly.json",
        "license": "DoltHub Leafly mirror / research",
        "redistributable": False,
        "table_candidates": ["leafly", "Leafly", "strains"],
        "name_cols": ("strain", "Strain", "name", "Name"),
    },
]


def api_sql(owner: str, repo: str, ref: str, sql: str) -> dict:
    q = urllib.parse.quote(sql)
    url = f"https://www.dolthub.com/api/v1alpha1/{owner}/{repo}/{ref}?q={q}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8", errors="replace"))


def try_sql(owner: str, repo: str, refs: list[str], sql: str) -> tuple[str, dict] | tuple[None, None]:
    errors = []
    for ref in refs:
        try:
            doc = api_sql(owner, repo, ref, sql)
            if doc.get("query_execution_status") == "Success":
                return ref, doc
            errors.append(f"{ref}: {doc.get('query_execution_message')}")
        except urllib.error.HTTPError as exc:
            errors.append(f"{ref}: HTTP {exc.code}")
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{ref}: {exc}")
    print(f"  fail {owner}/{repo}: {'; '.join(errors)}")
    return None, None


def rows_to_dicts(doc: dict) -> list[dict]:
    schema = doc.get("schema") or []
    cols = [c.get("columnName") or c.get("name") or f"c{i}" for i, c in enumerate(schema)]
    out = []
    for row in doc.get("rows") or []:
        if isinstance(row, dict):
            out.append(row)
        elif isinstance(row, list):
            out.append({cols[i] if i < len(cols) else f"c{i}": v for i, v in enumerate(row)})
    return out


def pick_name(row: dict, cols: tuple[str, ...]) -> str:
    for c in cols:
        if row.get(c):
            return str(row[c]).strip()
    return ""


def export_target(t: dict) -> Path | None:
    owner, repo = t["owner"], t["repo"]
    print(f"DoltHub {owner}/{repo} …")
    ref, doc = try_sql(owner, repo, t["refs"], "SHOW TABLES")
    if not doc:
        return None
    tables = []
    for r in rows_to_dicts(doc):
        for v in r.values():
            if v:
                tables.append(str(v))
    print(f"  ref={ref} tables={tables}")
    wanted = t.get("table_candidates") or tables
    table = None
    for cand in wanted:
        if cand in tables:
            table = cand
            break
    if not table and tables:
        table = tables[0]
    if not table:
        print("  no tables")
        return None

    # Cap large lab tables; aggregate-friendly pull
    limit = 50000 if t["kind"] == "lab" else 20000
    ref2, doc2 = None, None
    sqls = []
    if t.get("aggregate_sql"):
        sqls.append(t["aggregate_sql"])
    sqls.extend(
        [
            f"SELECT * FROM {table} LIMIT {limit}",
            f"SELECT * FROM `{table}` LIMIT {limit}",
            f'SELECT * FROM "{table}" LIMIT {limit}',
        ]
    )
    for sql in sqls:
        ref2, doc2 = try_sql(owner, repo, [ref], sql)
        if doc2:
            break
    if not doc2:
        return None
    raw = rows_to_dicts(doc2)
    items = []
    for r in raw:
        name = pick_name(r, t["name_cols"])
        if not name:
            slug = r.get("leafly_strain") or r.get("product")
            if slug:
                name = str(slug).replace("-", " ").replace("_", " ")
        if not name:
            continue
        row = dict(r)
        row["name"] = name
        row["name_norm"] = name_norm(name)
        row["source"] = t["id"]
        if t["kind"] == "lab":
            chem = {}
            thc_min = r.get("thc_min")
            thc_max = r.get("thc_max")
            cbd_min = r.get("cbd_min")
            cbd_max = r.get("cbd_max")
            for key, dest in (
                ("thc_max", "thc"),
                ("cbd_max", "cbd"),
                ("total_thc", "thc"),
                ("total_cbd", "cbd"),
            ):
                if r.get(key) not in (None, "") and f"{dest}_range" not in chem:
                    try:
                        v = float(r[key])
                        chem[f"{dest}_range"] = [v, v]
                    except (TypeError, ValueError):
                        pass
            try:
                if thc_min not in (None, "") or thc_max not in (None, ""):
                    a = float(thc_min if thc_min not in (None, "") else thc_max)
                    b = float(thc_max if thc_max not in (None, "") else thc_min)
                    chem["thc_range"] = [a, b]
                if cbd_min not in (None, "") or cbd_max not in (None, ""):
                    a = float(cbd_min if cbd_min not in (None, "") else cbd_max)
                    b = float(cbd_max if cbd_max not in (None, "") else cbd_min)
                    chem["cbd_range"] = [a, b]
            except (TypeError, ValueError):
                pass
            if r.get("n_tests") not in (None, ""):
                chem["n_tests"] = r.get("n_tests")
            if chem:
                row["chemistry"] = chem
                row.update(chem)
        items.append(row)

    out = DATA / t["out"]
    write_dump(
        out,
        t["kind"] if t["kind"] != "lab" else "lab",
        items,
        source=t["id"],
        source_url=f"https://www.dolthub.com/repositories/{owner}/{repo}",
        license=t["license"],
        redistributable=t["redistributable"],
        note=f"DoltHub SQL export table={table} ref={ref2} limit={limit}",
    )
    print(f"  wrote {out.name} count={len(items)}")
    return out


def main() -> int:
    written = []
    for t in TARGETS:
        try:
            p = export_target(t)
            if p:
                written.append(p.name)
        except Exception as exc:  # noqa: BLE001
            print(f"  aborted {t['id']}: {exc}")
    # discovery note
    write_dump(
        DATA / "dsc_dolthub_discovery.json",
        "discovery",
        [
            {"owner": "Liquidata", "repo": "cannabis-testing-wa", "status": "attempted"},
            {"owner": "liquidata-samples", "repo": "marijuana_data", "status": "attempted"},
        ],
        source="dolthub_discovery",
        note="Public cannabis Dolt repos; clone via `dolt clone` if API branch missing",
        redistributable=True,
    )
    print(json.dumps({"written": written}, indent=2))
    return 0 if written else 1


if __name__ == "__main__":
    raise SystemExit(main())
