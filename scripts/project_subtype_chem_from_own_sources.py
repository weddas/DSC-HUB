#!/usr/bin/env python3
"""Honest offline projector: subtype chem / bank_note from own exact-name sources.

Fills chemistry_profile and observation(kind=bank_note) for strain_canonicals that
appear as entity_link.method='subtype_of' (from_id=subtype, to_id=base) and lack
those fields — ONLY from that subtype's own identity:

  * science_alias spellings that uniquely resolve to the subtype
  * chemistry_profile / observation already keyed to those same-identity norms
  * staging sqlite under --staging-dir (chemistry_profile table or raw_record)

NEVER copies the parent/base photoperiod chem or notes onto auto/F2/bx/OG subtypes.
Does not invent chemistry. SoftAP is out of scope.

Usage:
  python scripts/project_subtype_chem_from_own_sources.py \\
    --db C:\\DSC\\collation\\dsc_brain.sqlite3 \\
    --staging-dir C:\\DSC\\collation\\staging
  python scripts/project_subtype_chem_from_own_sources.py --db ... --dry-run
"""

from __future__ import annotations

import argparse
import json
import re
import sqlite3
import sys
import time
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from brain.dsc_brain.corpus import (  # noqa: E402
    add_chemistry,
    add_link,
    add_observation,
    connect,
    ensure_source,
    name_norm,
)

CHEM_FIELD_KEYS = (
    "thc",
    "cbd",
    "thc_range",
    "cbd_range",
    "thc_min",
    "thc_max",
    "cbd_min",
    "cbd_max",
    "thc_pct",
    "cbd_pct",
    "avg_thc",
    "avg_cbd",
    "top_terpenes",
    "terpenes",
    "terpene_values",
    "cannabinoids",
    "chemotype",
)
NOTE_KEYS = (
    "description",
    "info",
    "more_info",
    "about_info",
)
# SeedFinder / bank prose that is still the subtype's own text (not parent).
NOTE_FALLBACK_KEYS = (
    "basic_infos",
    "page_text_excerpt",
)
_NUM = re.compile(r"-?\d+(?:\.\d+)?")
_CAT_NOISE = re.compile(
    r"^\s*(normal|low|very\s+low|high|very\s+high|medium|moderate|unknown|n/?a)\s*$",
    re.I,
)
_HTML_TAG = re.compile(r"<[^>]+>")


def _as_float(val: Any) -> float | None:
    if val is None or isinstance(val, bool):
        return None
    if isinstance(val, (int, float)):
        f = float(val)
        return f if abs(f) <= 1000 else None
    if isinstance(val, str):
        s = _HTML_TAG.sub(" ", val).strip()
        if not s or _CAT_NOISE.match(s):
            return None
        m = _NUM.search(s.replace("%", " "))
        if not m:
            return None
        try:
            f = float(m.group(0))
        except ValueError:
            return None
        return f if abs(f) <= 1000 else None
    return None


def _as_range(val: Any) -> list[float] | None:
    if val is None or val == "" or val == [] or val == {}:
        return None
    if isinstance(val, (list, tuple)) and len(val) >= 2:
        a, b = _as_float(val[0]), _as_float(val[1])
        if a is None or b is None:
            return None
        return [min(a, b), max(a, b)]
    f = _as_float(val)
    if f is None:
        return None
    return [f, f]


def _terpene_list(val: Any) -> list[Any] | None:
    if val in (None, "", [], {}):
        return None
    if isinstance(val, dict):
        items = [k for k, v in val.items() if v not in (None, "", 0, 0.0)]
        return items or None
    if isinstance(val, (list, tuple)):
        cleaned = []
        for x in val:
            if x in (None, "", [], {}):
                continue
            s = str(x).strip()
            # reject nav junk like "Terpene Guide"
            if not s or s.lower() in {"terpene guide", "terpenes", "n/a"}:
                continue
            cleaned.append(x if not isinstance(x, str) else s)
        return cleaned or None
    if isinstance(val, str) and val.strip():
        s = val.strip()
        if s.lower() in {"terpene guide", "terpenes", "n/a"}:
            return None
        return [s]
    return None


def extract_chem_payload(payload: dict[str, Any] | None) -> dict[str, Any] | None:
    """Return a chemistry payload with real numeric/terpene signal, else None."""
    if not isinstance(payload, dict):
        return None
    out: dict[str, Any] = {}
    sources: list[dict[str, Any]] = [payload]
    chem = payload.get("chemistry")
    if isinstance(chem, dict):
        sources.append(chem)
    for nest in ("stats", "lab", "lab_results", "cannabinoid_profile"):
        n = payload.get(nest)
        if isinstance(n, dict):
            sources.append(n)

    for src in sources:
        for k in CHEM_FIELD_KEYS:
            if k == "chemistry":
                continue
            if k in out and out[k] not in (None, "", [], {}):
                continue
            v = src.get(k)
            if v in (None, "", [], {}):
                continue
            if k in {
                "thc",
                "cbd",
                "thc_range",
                "cbd_range",
                "thc_min",
                "thc_max",
                "cbd_min",
                "cbd_max",
                "thc_pct",
                "cbd_pct",
                "avg_thc",
                "avg_cbd",
            }:
                rng = _as_range(v)
                if rng is None:
                    continue
                if k in ("thc", "thc_range", "thc_pct", "avg_thc", "thc_min", "thc_max"):
                    out.setdefault("thc_range", rng)
                elif k in ("cbd", "cbd_range", "cbd_pct", "avg_cbd", "cbd_min", "cbd_max"):
                    out.setdefault("cbd_range", rng)
            elif k in ("top_terpenes", "terpenes", "terpene_values"):
                tops = _terpene_list(v)
                if tops:
                    out.setdefault("top_terpenes", tops)
            elif k == "cannabinoids" and isinstance(v, (dict, list)) and v:
                out.setdefault("cannabinoids", v)
            elif k == "chemotype" and str(v).strip():
                out.setdefault("chemotype", str(v).strip())

    useful = bool(out.get("thc_range") or out.get("cbd_range") or out.get("top_terpenes"))
    if out.get("cannabinoids") and not useful:
        # require at least one numeric cannabinoid if no ranges/terpenes
        blob = out["cannabinoids"]
        if isinstance(blob, dict):
            useful = any(_as_float(v) is not None for v in blob.values())
        elif isinstance(blob, list):
            useful = len(blob) > 0
    if not useful:
        return None
    return out


def extract_note_body(payload: dict[str, Any] | None) -> tuple[str | None, str | None]:
    """Return (field_key, body) for bank_note, else (None, None)."""
    if not isinstance(payload, dict):
        return None, None
    for k in NOTE_KEYS:
        v = payload.get(k)
        if isinstance(v, str) and len(v.strip()) >= 40:
            return k, v.strip()[:8000]
    for k in NOTE_FALLBACK_KEYS:
        v = payload.get(k)
        if not isinstance(v, str):
            continue
        body = " ".join(v.split())
        if len(body) < 80:
            continue
        # reject obvious nav soup
        low = body.lower()
        noise = sum(
            1
            for n in (
                "add to cart",
                "cookie",
                "javascript",
                "sign in",
                "newsletter",
                "privacy policy",
            )
            if n in low
        )
        if noise >= 3 and len(body) < 600:
            continue
        return k, body[:8000]
    return None, None


def honest_identity_names(
    subtype: str,
    parent: str,
    *,
    alias_to_targets: dict[str, set[str]],
    target_to_aliases: dict[str, set[str]],
) -> set[str]:
    """Exact-identity name_norms for subtype; never includes parent."""
    names = {subtype}
    for alias in target_to_aliases.get(subtype, set()):
        targets = alias_to_targets.get(alias) or set()
        if targets == {subtype}:
            names.add(alias)
    names.discard(parent)
    names.discard("")
    return {n for n in names if n}


def _open_ro(path: Path) -> sqlite3.Connection:
    con = sqlite3.connect(f"file:{path}?mode=ro", uri=True, timeout=30)
    con.row_factory = sqlite3.Row
    return con


def _table_names(con: sqlite3.Connection) -> set[str]:
    return {r[0] for r in con.execute("SELECT name FROM sqlite_master WHERE type='table'")}


def load_subtype_map(con: sqlite3.Connection) -> dict[str, str]:
    return {
        r[0]: r[1]
        for r in con.execute(
            "SELECT from_id, to_id FROM entity_link WHERE method='subtype_of'"
        )
    }


def load_alias_maps(
    con: sqlite3.Connection,
) -> tuple[dict[str, set[str]], dict[str, set[str]]]:
    alias_to_targets: dict[str, set[str]] = {}
    target_to_aliases: dict[str, set[str]] = {}
    for alias, target in con.execute(
        "SELECT alias_norm, name_norm FROM science_alias WHERE name_norm IS NOT NULL"
    ):
        alias_to_targets.setdefault(alias, set()).add(target)
        target_to_aliases.setdefault(target, set()).add(alias)
    return alias_to_targets, target_to_aliases


def index_master_chem(
    con: sqlite3.Connection, names: set[str]
) -> dict[str, list[dict[str, Any]]]:
    """Map name_norm -> list of chem row dicts for names of interest."""
    out: dict[str, list[dict[str, Any]]] = {}
    if not names:
        return out
    batch = list(names)
    for i in range(0, len(batch), 400):
        chunk = batch[i : i + 400]
        ph = ",".join("?" * len(chunk))
        for row in con.execute(
            f"SELECT id, name_norm, name, source_id, thc_min, thc_max, cbd_min, cbd_max, "
            f"top_terpenes_json, payload_json FROM chemistry_profile "
            f"WHERE name_norm IN ({ph})",
            chunk,
        ):
            payload: dict[str, Any] = {}
            try:
                payload = json.loads(row["payload_json"] or "{}")
            except json.JSONDecodeError:
                payload = {}
            if not isinstance(payload, dict):
                payload = {}
            # Prefer typed columns when payload lacks ranges
            if row["thc_min"] is not None and row["thc_max"] is not None:
                payload.setdefault("thc_range", [row["thc_min"], row["thc_max"]])
            if row["cbd_min"] is not None and row["cbd_max"] is not None:
                payload.setdefault("cbd_range", [row["cbd_min"], row["cbd_max"]])
            if row["top_terpenes_json"]:
                try:
                    tops = json.loads(row["top_terpenes_json"])
                    if tops:
                        payload.setdefault("top_terpenes", tops)
                except json.JSONDecodeError:
                    pass
            chem = extract_chem_payload(payload)
            if not chem:
                # typed columns alone
                typed: dict[str, Any] = {}
                if row["thc_min"] is not None and row["thc_max"] is not None:
                    typed["thc_range"] = [float(row["thc_min"]), float(row["thc_max"])]
                if row["cbd_min"] is not None and row["cbd_max"] is not None:
                    typed["cbd_range"] = [float(row["cbd_min"]), float(row["cbd_max"])]
                if row["top_terpenes_json"]:
                    try:
                        tops = json.loads(row["top_terpenes_json"])
                        tops_l = _terpene_list(tops)
                        if tops_l:
                            typed["top_terpenes"] = tops_l
                    except json.JSONDecodeError:
                        pass
                chem = extract_chem_payload(typed) if typed else None
            if not chem:
                continue
            nn = row["name_norm"]
            out.setdefault(nn, []).append(
                {
                    "name": row["name"] or nn,
                    "source_id": row["source_id"] or "subtype_own_chem",
                    "payload": chem,
                    "origin": f"master_chem:{row['id']}",
                }
            )
    return out


def index_master_notes(
    con: sqlite3.Connection, names: set[str]
) -> dict[str, list[dict[str, Any]]]:
    out: dict[str, list[dict[str, Any]]] = {}
    if not names:
        return out
    batch = list(names)
    for i in range(0, len(batch), 400):
        chunk = batch[i : i + 400]
        ph = ",".join("?" * len(chunk))
        for row in con.execute(
            f"SELECT id, name_norm, source_id, title, body_text FROM observation "
            f"WHERE kind='bank_note' AND name_norm IN ({ph})",
            chunk,
        ):
            body = (row["body_text"] or "").strip()
            if len(body) < 40:
                continue
            nn = row["name_norm"]
            out.setdefault(nn, []).append(
                {
                    "source_id": row["source_id"] or "subtype_own_note",
                    "title": row["title"],
                    "body": body,
                    "origin": f"master_obs:{row['id']}",
                }
            )
    return out


def scan_staging(
    staging_dir: Path,
    need_chem: set[str],
    need_note: set[str],
) -> tuple[dict[str, list[dict[str, Any]]], dict[str, list[dict[str, Any]]]]:
    """Exact name_norm hits from staging chem table / raw / observation."""
    chem_hits: dict[str, list[dict[str, Any]]] = {}
    note_hits: dict[str, list[dict[str, Any]]] = {}
    if not staging_dir.is_dir():
        return chem_hits, note_hits
    need = need_chem | need_note
    files = sorted(staging_dir.glob("*.sqlite3"))
    for idx, path in enumerate(files, 1):
        try:
            src = _open_ro(path)
        except sqlite3.Error:
            continue
        try:
            tables = _table_names(src)
            if "chemistry_profile" in tables and need_chem:
                for row in src.execute(
                    "SELECT name_norm, name, source_id, thc_min, thc_max, cbd_min, cbd_max, "
                    "top_terpenes_json, payload_json FROM chemistry_profile "
                    "WHERE name_norm IS NOT NULL AND name_norm != ''"
                ):
                    nn = row["name_norm"]
                    if nn not in need_chem:
                        continue
                    payload: dict[str, Any] = {}
                    try:
                        payload = json.loads(row["payload_json"] or "{}")
                    except json.JSONDecodeError:
                        payload = {}
                    if not isinstance(payload, dict):
                        payload = {}
                    if row["thc_min"] is not None and row["thc_max"] is not None:
                        payload.setdefault(
                            "thc_range", [row["thc_min"], row["thc_max"]]
                        )
                    if row["cbd_min"] is not None and row["cbd_max"] is not None:
                        payload.setdefault(
                            "cbd_range", [row["cbd_min"], row["cbd_max"]]
                        )
                    if row["top_terpenes_json"]:
                        try:
                            tops = json.loads(row["top_terpenes_json"])
                            if tops:
                                payload.setdefault("top_terpenes", tops)
                        except json.JSONDecodeError:
                            pass
                    chem = extract_chem_payload(payload)
                    if not chem:
                        continue
                    chem_hits.setdefault(nn, []).append(
                        {
                            "name": row["name"] or nn,
                            "source_id": row["source_id"] or path.stem,
                            "payload": {
                                **chem,
                                "projected_from": path.name,
                                "projected_via": "staging_chemistry_profile",
                            },
                            "origin": f"staging_chem:{path.name}",
                        }
                    )
            if "observation" in tables and need_note:
                for row in src.execute(
                    "SELECT name_norm, source_id, title, body_text FROM observation "
                    "WHERE kind='bank_note' AND name_norm IS NOT NULL"
                ):
                    nn = row["name_norm"]
                    if nn not in need_note:
                        continue
                    body = (row["body_text"] or "").strip()
                    if len(body) < 40:
                        continue
                    note_hits.setdefault(nn, []).append(
                        {
                            "source_id": row["source_id"] or path.stem,
                            "title": row["title"],
                            "body": body[:8000],
                            "origin": f"staging_obs:{path.name}",
                            "field": "observation.body_text",
                        }
                    )
            if "raw_record" in tables and need:
                batch = list(need)
                for i in range(0, len(batch), 300):
                    chunk = batch[i : i + 300]
                    ph = ",".join("?" * len(chunk))
                    try:
                        cur = src.execute(
                            f"SELECT name_norm, source_id, payload_json FROM raw_record "
                            f"WHERE name_norm IN ({ph})",
                            chunk,
                        )
                    except sqlite3.Error:
                        break
                    for row in cur:
                        nn = row["name_norm"]
                        try:
                            payload = json.loads(row["payload_json"] or "{}")
                        except json.JSONDecodeError:
                            continue
                        if not isinstance(payload, dict):
                            continue
                        sid = row["source_id"] or path.stem
                        if nn in need_chem:
                            chem = extract_chem_payload(payload)
                            if chem:
                                display = str(
                                    payload.get("name") or payload.get("display_name") or nn
                                )
                                chem_hits.setdefault(nn, []).append(
                                    {
                                        "name": display,
                                        "source_id": sid,
                                        "payload": {
                                            **chem,
                                            "projected_from": path.name,
                                            "projected_via": "staging_raw_record",
                                        },
                                        "origin": f"staging_raw_chem:{path.name}",
                                    }
                                )
                        if nn in need_note:
                            field, body = extract_note_body(payload)
                            if field and body:
                                note_hits.setdefault(nn, []).append(
                                    {
                                        "source_id": sid,
                                        "title": str(
                                            payload.get("name")
                                            or payload.get("title")
                                            or nn
                                        ),
                                        "body": body,
                                        "origin": f"staging_raw_note:{path.name}",
                                        "field": field,
                                    }
                                )
        finally:
            src.close()
        if idx % 50 == 0:
            print(
                f"  staging {idx}/{len(files)} "
                f"chem_names={len(chem_hits)} note_names={len(note_hits)}",
                flush=True,
            )
    return chem_hits, note_hits


def _pick_chem(
    subtype: str,
    identities: set[str],
    parent: str,
    master_chem: dict[str, list[dict[str, Any]]],
    staging_chem: dict[str, list[dict[str, Any]]],
) -> dict[str, Any] | None:
    # Prefer staging exact subtype, then master same-identity alts, then staging alts.
    # Never parent.
    order = [subtype] + sorted(n for n in identities if n != subtype)
    for nn in order:
        if nn == parent:
            continue
        for hit in staging_chem.get(nn) or []:
            return {**hit, "matched_norm": nn}
        for hit in master_chem.get(nn) or []:
            # Same name_norm already on master means not lacking; alts only
            if nn == subtype:
                continue
            return {**hit, "matched_norm": nn}
    return None


def _pick_note(
    subtype: str,
    identities: set[str],
    parent: str,
    master_notes: dict[str, list[dict[str, Any]]],
    staging_notes: dict[str, list[dict[str, Any]]],
) -> dict[str, Any] | None:
    order = [subtype] + sorted(n for n in identities if n != subtype)
    for nn in order:
        if nn == parent:
            continue
        for hit in staging_notes.get(nn) or []:
            return {**hit, "matched_norm": nn}
        for hit in master_notes.get(nn) or []:
            if nn == subtype:
                continue
            return {**hit, "matched_norm": nn}
    return None


def project_one_db(
    db_path: Path,
    *,
    staging_dir: Path | None,
    dry_run: bool,
    limit: int,
) -> dict[str, Any]:
    con = connect(db_path)
    subtype_parent = load_subtype_map(con)
    alias_to_targets, target_to_aliases = load_alias_maps(con)

    chem_nn = {
        r[0]
        for r in con.execute(
            "SELECT DISTINCT name_norm FROM chemistry_profile "
            "WHERE name_norm IS NOT NULL AND name_norm != ''"
        )
    }
    note_nn = {
        r[0]
        for r in con.execute(
            "SELECT DISTINCT name_norm FROM observation "
            "WHERE kind='bank_note' AND name_norm IS NOT NULL"
        )
    }
    grow_nn = {
        r[0]
        for r in con.execute(
            "SELECT DISTINCT name_norm FROM grow_trait WHERE name_norm IS NOT NULL"
        )
    }

    subtypes = sorted(subtype_parent.keys())
    lacking_chem = [s for s in subtypes if s not in chem_nn]
    lacking_note = [s for s in subtypes if s not in note_nn]

    # Identity universe for lookups (subtype + unique aliases), excluding parents
    identity_union: set[str] = set()
    identity_by_subtype: dict[str, set[str]] = {}
    parents = set(subtype_parent.values())
    for s in lacking_chem + lacking_note:
        parent = subtype_parent[s]
        idents = honest_identity_names(
            s,
            parent,
            alias_to_targets=alias_to_targets,
            target_to_aliases=target_to_aliases,
        )
        identity_by_subtype[s] = idents
        identity_union |= idents

    # Master chem/notes under identity alts (not parents)
    alt_names = {n for n in identity_union if n not in parents}
    master_chem = index_master_chem(con, alt_names)
    master_notes = index_master_notes(con, alt_names)

    staging_chem: dict[str, list[dict[str, Any]]] = {}
    staging_notes: dict[str, list[dict[str, Any]]] = {}
    if staging_dir is not None:
        # Include honest alias spellings so staging rows keyed under an alt norm match.
        need_chem_names: set[str] = set()
        need_note_names: set[str] = set()
        for s in lacking_chem:
            need_chem_names |= identity_by_subtype.get(s) or {s}
        for s in lacking_note:
            need_note_names |= identity_by_subtype.get(s) or {s}
        need_chem_names -= parents
        need_note_names -= parents
        print(f"  scanning staging {staging_dir} ...", flush=True)
        staging_chem, staging_notes = scan_staging(
            staging_dir, need_chem_names, need_note_names
        )

    stats: dict[str, Any] = {
        "db": str(db_path),
        "dry_run": dry_run,
        "subtypes_total": len(subtypes),
        "with_chem_before": sum(1 for s in subtypes if s in chem_nn),
        "lacking_chem": len(lacking_chem),
        "with_bank_note_before": sum(1 for s in subtypes if s in note_nn),
        "lacking_bank_note": len(lacking_note),
        "with_grow": sum(1 for s in subtypes if s in grow_nn),
        "filled_chem": 0,
        "filled_bank_note": 0,
        "skipped_chem_no_source": 0,
        "skipped_note_no_source": 0,
        "skipped_parent_guard": 0,
        "chem_via": {},
        "note_via": {},
        "samples_chem": [],
        "samples_note": [],
    }

    # --- chemistry ---
    for s in lacking_chem:
        if limit and stats["filled_chem"] >= limit:
            break
        parent = subtype_parent[s]
        idents = identity_by_subtype.get(s) or honest_identity_names(
            s,
            parent,
            alias_to_targets=alias_to_targets,
            target_to_aliases=target_to_aliases,
        )
        if parent in idents:
            idents = set(idents)
            idents.discard(parent)
            stats["skipped_parent_guard"] += 1

        hit = _pick_chem(s, idents, parent, master_chem, staging_chem)
        if not hit:
            stats["skipped_chem_no_source"] += 1
            continue
        matched = hit.get("matched_norm") or ""
        if matched == parent:
            stats["skipped_parent_guard"] += 1
            continue

        via = str(hit.get("origin") or "unknown").split(":")[0]
        stats["chem_via"][via] = stats["chem_via"].get(via, 0) + 1
        if len(stats["samples_chem"]) < 25:
            stats["samples_chem"].append(
                {
                    "subtype": s,
                    "parent": parent,
                    "matched_norm": matched,
                    "origin": hit.get("origin"),
                    "keys": sorted((hit.get("payload") or {}).keys()),
                }
            )

        if dry_run:
            stats["filled_chem"] += 1
            chem_nn.add(s)
            continue

        payload = dict(hit["payload"])
        payload["subtype_own_projection"] = 1
        payload["subtype_matched_norm"] = matched
        sid = str(hit.get("source_id") or "subtype_own_chem")
        ensure_source(
            con,
            sid,
            sid,
            redistributable=False,
            note="subtype own-source chem projector",
        )
        display = str(hit.get("name") or s)
        # Force name_norm to subtype identity (add_chemistry norms the display name —
        # pass subtype spelling when matched alt differs).
        write_name = display if name_norm(display) == s else s
        cid = add_chemistry(con, write_name, payload, source_id=sid)
        # If display normalized away from subtype, fix the row.
        con.execute(
            "UPDATE chemistry_profile SET name_norm=?, name=? WHERE id=?",
            (s, display if display else s, cid),
        )
        add_link(
            con,
            "chemistry_profile",
            cid,
            "strain_canonical",
            s,
            method="exact_name_norm",
            confidence=1.0,
            source=f"subtype_own_chem:{via}",
        )
        chem_nn.add(s)
        stats["filled_chem"] += 1
        if stats["filled_chem"] % 100 == 0:
            con.commit()
            print(f"  chem checkpoint filled={stats['filled_chem']}", flush=True)

    # --- bank_note ---
    for s in lacking_note:
        if limit and stats["filled_bank_note"] >= limit:
            break
        parent = subtype_parent[s]
        idents = identity_by_subtype.get(s) or honest_identity_names(
            s,
            parent,
            alias_to_targets=alias_to_targets,
            target_to_aliases=target_to_aliases,
        )
        idents = set(idents)
        idents.discard(parent)

        hit = _pick_note(s, idents, parent, master_notes, staging_notes)
        if not hit:
            stats["skipped_note_no_source"] += 1
            continue
        matched = hit.get("matched_norm") or ""
        if matched == parent:
            stats["skipped_parent_guard"] += 1
            continue

        via = str(hit.get("origin") or "unknown").split(":")[0]
        stats["note_via"][via] = stats["note_via"].get(via, 0) + 1
        if len(stats["samples_note"]) < 25:
            stats["samples_note"].append(
                {
                    "subtype": s,
                    "parent": parent,
                    "matched_norm": matched,
                    "origin": hit.get("origin"),
                    "field": hit.get("field"),
                    "body_len": len(hit.get("body") or ""),
                }
            )

        if dry_run:
            stats["filled_bank_note"] += 1
            note_nn.add(s)
            continue

        sid = str(hit.get("source_id") or "subtype_own_note")
        ensure_source(
            con,
            sid,
            sid,
            redistributable=False,
            note="subtype own-source bank_note projector",
        )
        add_observation(
            con,
            name_norm_key=s,
            source_id=sid,
            body_text=str(hit["body"]),
            kind="bank_note",
            title=hit.get("title"),
            payload={
                "projected_via": "subtype_own_sources",
                "matched_norm": matched,
                "field": hit.get("field"),
                "origin": hit.get("origin"),
            },
        )
        note_nn.add(s)
        stats["filled_bank_note"] += 1
        if stats["filled_bank_note"] % 200 == 0:
            con.commit()
            print(f"  note checkpoint filled={stats['filled_bank_note']}", flush=True)

    if not dry_run:
        con.commit()

    # after counts
    chem_after = {
        r[0]
        for r in con.execute(
            "SELECT DISTINCT name_norm FROM chemistry_profile "
            "WHERE name_norm IS NOT NULL AND name_norm != ''"
        )
    }
    note_after = {
        r[0]
        for r in con.execute(
            "SELECT DISTINCT name_norm FROM observation "
            "WHERE kind='bank_note' AND name_norm IS NOT NULL"
        )
    }
    stats["with_chem_after"] = sum(1 for s in subtypes if s in chem_after)
    stats["with_bank_note_after"] = sum(1 for s in subtypes if s in note_after)
    stats["lacking_chem_after"] = stats["subtypes_total"] - stats["with_chem_after"]
    stats["lacking_bank_note_after"] = (
        stats["subtypes_total"] - stats["with_bank_note_after"]
    )
    stats["built_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    con.close()
    return stats


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", type=Path, required=True)
    ap.add_argument(
        "--staging-dir",
        type=Path,
        default=Path(r"C:\DSC\collation\staging"),
        help="Local staging sqlite dir (exact name_norm sources)",
    )
    ap.add_argument("--no-staging", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0, help="Max fills per kind (0=all)")
    args = ap.parse_args(argv)

    if not args.db.exists():
        print(json.dumps({"error": "db_missing", "db": str(args.db)}, indent=2))
        return 2

    staging = None if args.no_staging else args.staging_dir
    print(f"project_subtype_chem_from_own_sources db={args.db}", flush=True)
    stats = project_one_db(
        args.db,
        staging_dir=staging,
        dry_run=args.dry_run,
        limit=args.limit,
    )
    print(json.dumps(stats, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
