#!/usr/bin/env python3
"""Probe DoltHub cannabis SQL APIs with small queries."""
from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
import sys

sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, UA, name_norm, write_dump  # noqa: E402


def api_sql(owner: str, repo: str, ref: str, sql: str) -> dict:
    q = urllib.parse.quote(sql)
    url = f"https://www.dolthub.com/api/v1alpha1/{owner}/{repo}/{ref}?q={q}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=180) as resp:
        return json.loads(resp.read().decode("utf-8", errors="replace"))


def try_refs(owner: str, repo: str, refs: list[str], sql: str):
    errors = []
    for ref in refs:
        try:
            doc = api_sql(owner, repo, ref, sql)
            status = doc.get("query_execution_status")
            if status == "Success":
                return ref, doc, None
            errors.append(f"{ref}: {doc.get('query_execution_message')}")
        except urllib.error.HTTPError as exc:
            errors.append(f"{ref}: HTTP {exc.code}")
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{ref}: {exc}")
    return None, None, "; ".join(errors)


def rows(doc: dict) -> list[dict]:
    schema = doc.get("schema") or []
    cols = [c.get("columnName") or c.get("name") or f"c{i}" for i, c in enumerate(schema)]
    out = []
    for row in doc.get("rows") or []:
        if isinstance(row, dict):
            out.append(row)
        elif isinstance(row, list):
            out.append({cols[i] if i < len(cols) else f"c{i}": v for i, v in enumerate(row)})
    return out


def export_wa_agg(limit: int = 8000) -> Path | None:
    sql = (
        "SELECT test_strain, leafly_strain, "
        "MIN(thc_max) AS thc_min, MAX(thc_max) AS thc_max, "
        "MIN(cbd_max) AS cbd_min, MAX(cbd_max) AS cbd_max, "
        "COUNT(*) AS n_tests "
        "FROM tests "
        "WHERE test_strain IS NOT NULL AND test_strain != '' "
        f"GROUP BY test_strain, leafly_strain LIMIT {limit}"
    )
    ref, doc, err = try_refs("Liquidata", "cannabis-testing-wa", ["master", "main"], sql)
    if not doc:
        print(f"WA agg fail: {err}")
        return None
    items = []
    for r in rows(doc):
        name = str(r.get("test_strain") or r.get("leafly_strain") or "").strip()
        if not name:
            continue
        chem = {}
        try:
            if r.get("thc_min") not in (None, "") or r.get("thc_max") not in (None, ""):
                a = float(r.get("thc_min") if r.get("thc_min") not in (None, "") else r.get("thc_max"))
                b = float(r.get("thc_max") if r.get("thc_max") not in (None, "") else r.get("thc_min"))
                chem["thc_range"] = [a, b]
            if r.get("cbd_min") not in (None, "") or r.get("cbd_max") not in (None, ""):
                a = float(r.get("cbd_min") if r.get("cbd_min") not in (None, "") else r.get("cbd_max"))
                b = float(r.get("cbd_max") if r.get("cbd_max") not in (None, "") else r.get("cbd_min"))
                chem["cbd_range"] = [a, b]
        except (TypeError, ValueError):
            pass
        if r.get("n_tests") not in (None, ""):
            chem["n_tests"] = r.get("n_tests")
        row = {
            "name": name,
            "name_norm": name_norm(name),
            "leafly_strain": r.get("leafly_strain"),
            "source": "dolthub_wa_testing",
            "chemistry": chem,
            **chem,
        }
        items.append(row)
    out = DATA / "dsc_lab_dolthub_wa.json"
    write_dump(
        out,
        "lab",
        items,
        source="dolthub_wa_testing",
        source_url="https://www.dolthub.com/repositories/Liquidata/cannabis-testing-wa",
        license="DoltHub public repo / research",
        redistributable=False,
        note=f"aggregated SQL export ref={ref} limit={limit}",
    )
    print(f"WA wrote {out.name} count={len(items)}")
    return out


def export_marijuana_data() -> list[Path]:
    written = []
    ref, doc, err = try_refs(
        "liquidata-samples", "marijuana_data", ["master", "main"], "SHOW TABLES"
    )
    if not doc:
        print(f"marijuana_data SHOW TABLES fail: {err}")
        # Try alternate owners seen historically
        for owner in ("Liquidata", "dolthub"):
            ref, doc, err = try_refs(owner, "marijuana_data", ["master", "main"], "SHOW TABLES")
            if doc:
                break
            print(f"  alt {owner}: {err}")
        if not doc:
            return written
    tables = []
    for r in rows(doc):
        for v in r.values():
            if v:
                tables.append(str(v))
    print(f"marijuana_data ref={ref} tables={tables}")
    for table, out_name, name_cols in (
        ("leafly", "dsc_strains_dolthub_leafly.json", ("strain", "Strain", "name")),
        ("ct_medical_brand_registry", "dsc_strains_dolthub_ct.json", ("brand_name", "name", "strain")),
        ("kushy_strains", "dsc_strains_dolthub_kushy.json", ("name", "strain", "Strain")),
    ):
        if table not in tables:
            # fuzzy
            match = next((t for t in tables if table.lower() in t.lower()), None)
            if not match:
                print(f"  skip missing table {table}")
                continue
            table = match
        sql = f"SELECT * FROM `{table}` LIMIT 15000"
        ref2, doc2, err2 = try_refs(
            "liquidata-samples", "marijuana_data", [ref or "master"], sql
        )
        if not doc2:
            # owner may differ
            for owner in ("liquidata-samples", "Liquidata"):
                ref2, doc2, err2 = try_refs(owner, "marijuana_data", ["master", "main"], sql)
                if doc2:
                    break
        if not doc2:
            print(f"  fail {table}: {err2}")
            continue
        items = []
        for r in rows(doc2):
            name = ""
            for c in name_cols:
                if r.get(c):
                    name = str(r[c]).strip()
                    break
            if not name:
                continue
            row = dict(r)
            row["name"] = name
            row["name_norm"] = name_norm(name)
            row["source"] = f"dolthub_{table}"
            items.append(row)
        out = DATA / out_name
        write_dump(
            out,
            "strains",
            items,
            source=f"dolthub_{table}",
            source_url="https://www.dolthub.com/repositories/liquidata-samples/marijuana_data",
            license="DoltHub public / research",
            redistributable=False,
            note=f"SQL export table={table} ref={ref2}",
        )
        print(f"  wrote {out.name} count={len(items)}")
        written.append(out)
    return written


def write_discovery(status: list[dict]) -> None:
    write_dump(
        DATA / "dsc_dolthub_discovery.json",
        "discovery",
        status,
        source="dolthub_discovery",
        note="From DoltHub blog 2020-04-20 + API probes; WA already mirrored in local Replication_Data",
        redistributable=True,
    )


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    status = []
    # WA count probe
    ref, doc, err = try_refs(
        "Liquidata", "cannabis-testing-wa", ["master", "main"], "SELECT COUNT(*) AS n FROM tests"
    )
    if doc:
        n = rows(doc)[0].get("n") if rows(doc) else None
        print(f"WA tests count={n} ref={ref}")
        status.append(
            {
                "owner": "Liquidata",
                "repo": "cannabis-testing-wa",
                "url": "https://www.dolthub.com/repositories/Liquidata/cannabis-testing-wa",
                "status": "ok",
                "rows": n,
            }
        )
        export_wa_agg()
    else:
        print(f"WA fail: {err}")
        status.append(
            {
                "owner": "Liquidata",
                "repo": "cannabis-testing-wa",
                "url": "https://www.dolthub.com/repositories/Liquidata/cannabis-testing-wa",
                "status": "failed",
                "error": err,
            }
        )

    written = export_marijuana_data()
    status.append(
        {
            "owner": "liquidata-samples",
            "repo": "marijuana_data",
            "url": "https://www.dolthub.com/repositories/liquidata-samples/marijuana_data",
            "status": "ok" if written else "failed_or_missing",
            "exports": [p.name for p in written],
            "tables_note": "leafly + ct_medical_brand_registry + kushy_* per 2020 blog",
        }
    )
    write_discovery(status)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
