"""Read-only staging thin-field audit for N-087 (no master write)."""
from __future__ import annotations

import json
import sqlite3
from collections import Counter
from pathlib import Path

BASE = Path(__file__).resolve().parents[1] / "data" / "staging"
OUT = Path(__file__).resolve().parent / "_thin_field_audit.json"

WEAK_HINTS = (
    "height",
    "flower",
    "days",
    "lineage",
    "parent",
    "effect",
    "terp",
    "thc",
    "cbd",
    "yield",
    "indoor",
    "outdoor",
)


def main() -> None:
    families = sorted(p for p in BASE.glob("*.sqlite3") if not p.name.endswith("-journal"))
    report: dict = {"families": [], "grow_key_global": Counter(), "notes": []}
    for p in families:
        entry: dict = {"file": p.name, "mb": round(p.stat().st_size / 1e6, 2)}
        try:
            c = sqlite3.connect(f"file:{p}?mode=ro", uri=True)
            tables = {
                r[0]
                for r in c.execute(
                    "SELECT name FROM sqlite_master WHERE type='table'"
                ).fetchall()
            }

            def cnt(t: str) -> int:
                return (
                    c.execute(f"SELECT COUNT(*) FROM [{t}]").fetchone()[0]
                    if t in tables
                    else 0
                )

            entry.update(
                {
                    "raw": cnt("raw_record"),
                    "canonical": cnt("strain_canonical"),
                    "variant": cnt("strain_variant"),
                    "chem": cnt("chemistry_profile"),
                    "grow": cnt("grow_trait"),
                    "links": cnt("entity_link"),
                    "alias": cnt("science_alias"),
                    "kv": cnt("attribute_kv"),
                }
            )
            grow_keys: list[str] = []
            if entry["grow"] and "grow_trait" in tables:
                cols = {
                    r[1]
                    for r in c.execute("PRAGMA table_info(grow_trait)").fetchall()
                }
                key_col = (
                    "trait_key"
                    if "trait_key" in cols
                    else ("key" if "key" in cols else None)
                )
                if key_col:
                    grow_keys = [
                        r[0]
                        for r in c.execute(
                            f"SELECT DISTINCT [{key_col}] FROM grow_trait"
                        ).fetchall()
                        if r[0]
                    ]
                    for k in grow_keys:
                        report["grow_key_global"][k] += 1
            entry["grow_keys"] = grow_keys

            # raw payload field presence sample
            sample_hits = Counter()
            if entry["raw"] and "raw_record" in tables:
                cols = {
                    r[1] for r in c.execute("PRAGMA table_info(raw_record)").fetchall()
                }
                blob_col = (
                    "payload_json"
                    if "payload_json" in cols
                    else ("raw_json" if "raw_json" in cols else None)
                )
                if blob_col:
                    n = 0
                    for (blob,) in c.execute(
                        f"SELECT [{blob_col}] FROM raw_record LIMIT 40"
                    ):
                        n += 1
                        try:
                            obj = json.loads(blob) if isinstance(blob, str) else blob
                        except Exception:
                            continue
                        if not isinstance(obj, dict):
                            continue
                        flat = " ".join(str(k).lower() for k in obj.keys())
                        # also one-level nested
                        for v in list(obj.values())[:30]:
                            if isinstance(v, dict):
                                flat += " " + " ".join(
                                    str(k).lower() for k in v.keys()
                                )
                        for hint in WEAK_HINTS:
                            if hint in flat:
                                sample_hits[hint] += 1
                    entry["raw_sample_n"] = n
                    entry["raw_field_hits"] = dict(sample_hits)
            c.close()
        except Exception as e:
            entry["error"] = str(e)
        report["families"].append(entry)

    # summarize thinness ratios
    thin = []
    for e in report["families"]:
        raw = e.get("raw") or 0
        if raw < 50:
            continue
        chem_r = (e.get("chem") or 0) / raw
        grow_r = (e.get("grow") or 0) / raw
        keys = set(e.get("grow_keys") or [])
        missing = []
        for want in (
            "height",
            "flowering_days",
            "flowering",
            "lineage",
            "parents",
            "effects",
        ):
            if not any(want in k.lower() for k in keys):
                missing.append(want)
        thin.append(
            {
                "file": e["file"],
                "raw": raw,
                "chem_ratio": round(chem_r, 3),
                "grow_ratio": round(grow_r, 3),
                "grow_keys": e.get("grow_keys"),
                "likely_missing_typed": missing,
                "raw_field_hits": e.get("raw_field_hits"),
            }
        )
    report["thin_summary"] = sorted(thin, key=lambda x: (x["grow_ratio"], x["chem_ratio"]))
    report["grow_key_global"] = dict(report["grow_key_global"])
    OUT.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"wrote {OUT}")
    print("=== thin (low grow/chem ratio) ===")
    for t in report["thin_summary"][:20]:
        print(
            f"{t['file']:40} raw={t['raw']:5} chem={t['chem_ratio']:.2f} "
            f"grow={t['grow_ratio']:.2f} miss={t['likely_missing_typed']}"
        )


if __name__ == "__main__":
    main()
