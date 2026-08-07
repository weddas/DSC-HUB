#!/usr/bin/env python3
"""Import Lynch et al. Genomic and Chemical Diversity (Figshare xlsx) → dump.

University / CRC Crit. Rev. Plant Sci. supplemental tables: variety names,
colloquial classification, FLOCK genomic groups. Chemotype sheet is group
counts (not THC%), so unknown chem stays out of invented fields.
"""

from __future__ import annotations

import io
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from catalog_common import DATA, fetch_bytes, name_norm, write_dump  # noqa: E402

OUT = DATA / "dsc_strains_lynch_figshare.json"
URL = "https://ndownloader.figshare.com/files/7906759"
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def _shared_strings(zf: zipfile.ZipFile) -> list[str]:
    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    out: list[str] = []
    for si in root.findall("m:si", NS):
        texts = si.findall(".//m:t", NS)
        out.append("".join(t.text or "" for t in texts))
    return out


def _sheet_rows(zf: zipfile.ZipFile, sheet_path: str, strings: list[str]) -> list[list[str]]:
    root = ET.fromstring(zf.read(sheet_path))
    rows: list[list[str]] = []
    for row in root.findall("m:sheetData/m:row", NS):
        vals: list[str] = []
        # sparse cells: pad by column letter index roughly via order
        expect_i = 0
        for c in row.findall("m:c", NS):
            ref = c.attrib.get("r", "")
            # column letters only
            col = "".join(ch for ch in ref if ch.isalpha())
            idx = 0
            for ch in col:
                idx = idx * 26 + (ord(ch.upper()) - 64)
            idx -= 1
            while expect_i < idx:
                vals.append("")
                expect_i += 1
            t = c.attrib.get("t")
            v = c.find("m:v", NS)
            if v is None:
                vals.append("")
            elif t == "s":
                vals.append(strings[int(v.text)])
            else:
                vals.append(v.text or "")
            expect_i = idx + 1
        rows.append(vals)
    return rows


def _variety_clean(name: str) -> str:
    return (name or "").replace("_", " ").strip()


def main() -> int:
    errors: list[str] = []
    try:
        data = fetch_bytes(URL, timeout=120)
    except Exception as exc:  # noqa: BLE001
        print(f"Lynch figshare fetch failed: {exc}")
        return 1

    items_by: dict[str, dict] = {}
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        strings = _shared_strings(zf)
        # sheet1 WGS_GBS_sample_info
        rows = _sheet_rows(zf, "xl/worksheets/sheet1.xml", strings)
        if rows:
            hdr = rows[0]
            for row in rows[1:]:
                d = {hdr[i]: (row[i] if i < len(row) else "") for i in range(len(hdr))}
                name = _variety_clean(d.get("Variety_Name") or "")
                if not name:
                    continue
                key = name_norm(name)
                rec = {
                    "name": name,
                    "name_norm": key,
                    "type": (d.get("Colloquial_classification") or "").strip().lower() or None,
                    "sample_id": d.get("Sample_ID"),
                    "flock_group": d.get("FLOCK_Group"),
                    "sex": d.get("Sex"),
                    "dna_provider": d.get("DNA Provider"),
                    "sequencing_method": d.get("Sequencing_method"),
                    "source": "lynch_figshare",
                }
                items_by.setdefault(key, rec)
        # sheet2 Sawler samples
        rows = _sheet_rows(zf, "xl/worksheets/sheet2.xml", strings)
        if rows:
            hdr = rows[0]
            for row in rows[1:]:
                d = {hdr[i]: (row[i] if i < len(row) else "") for i in range(len(hdr))}
                name = _variety_clean(d.get("Sample Name") or "")
                if not name:
                    continue
                key = name_norm(name)
                if key in items_by:
                    continue
                items_by[key] = {
                    "name": name,
                    "name_norm": key,
                    "type": (d.get("colloquial classification") or "").strip().lower() or None,
                    "sample_id": d.get("Sample ID"),
                    "source": "lynch_figshare_sawler",
                }
        # sheet5 chemotype flock groups (no THC numbers)
        rows = _sheet_rows(zf, "xl/worksheets/sheet5.xml", strings)
        if rows:
            hdr = rows[0]
            for row in rows[1:]:
                d = {hdr[i]: (row[i] if i < len(row) else "") for i in range(len(hdr))}
                name = _variety_clean(d.get("Variety_name") or "")
                if not name:
                    continue
                key = name_norm(name)
                if key in items_by:
                    items_by[key]["flock_group"] = d.get("FLOCK_group") or items_by[key].get(
                        "flock_group"
                    )
                    items_by[key]["flock_n"] = d.get("N")
                else:
                    items_by[key] = {
                        "name": name,
                        "name_norm": key,
                        "flock_group": d.get("FLOCK_group"),
                        "flock_n": d.get("N"),
                        "source": "lynch_figshare_chemotype",
                    }

    items = list(items_by.values())
    write_dump(
        OUT,
        "strains",
        items,
        source="lynch_figshare",
        source_url=URL,
        license="Figshare supplemental (Lynch et al. 2016); academic / check publisher terms",
        redistributable=False,
        note="Variety names + FLOCK genomic groups; no invented THC/CBD",
        errors=errors,
        citation="Lynch et al. 2016 Genomic and Chemical Diversity in Cannabis; Figshare 4805497",
    )
    print(f"wrote {OUT} count={len(items)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
