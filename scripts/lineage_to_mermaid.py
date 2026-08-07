#!/usr/bin/env python3
"""Parse cannabis genetics/lineage text into structured pedigree + Mermaid.

Reusable across SeedFinder / CannaConnection / strain-database scrapers.

Never invents parents. Unparseable input → lineage tree with empty parents,
mermaid=None, and parse_note explaining why.
"""

from __future__ import annotations

import argparse
import json
import re
from typing import Any

# Separators commonly used in seedbank pedigrees
_CROSS_SPLIT = re.compile(
    r"\s*(?:[x×X]|✕|✗|\*|×)\s*|\s+\bx\b\s+",
    re.UNICODE,
)
_MOTHER_FATHER = re.compile(
    r"(?is)^\s*(?P<mother>.+?)\s*(?:mother|♀|female)\s*[×xX]\s*"
    r"(?P<father>.+?)\s*(?:father|♂|male)?\s*$"
)
_LABELED_CROSS = re.compile(
    r"(?is)(?:mother|♀)\s*[:=]\s*(?P<mother>[^;|/]+?)\s*[;|/]\s*"
    r"(?:father|♂)\s*[:=]\s*(?P<father>.+)$"
)
_CROSS_OF = re.compile(
    r"(?is)\b(?:a\s+)?(?:cross|hybrid|crossing)\s+of\s+(.+)$"
)
_PAREN_STRIP = re.compile(r"\s*\([^)]*\)\s*")
_NOISE = re.compile(
    r"(?is)^\s*(?:unknown|n/?a|none|not\s+available|undisclosed|-)\s*$"
)


def _clean_name(raw: str) -> str | None:
    s = (raw or "").strip()
    s = s.strip(" .,;:|/\\\"'`")
    s = re.sub(r"\s+", " ", s)
    if not s or len(s) > 120:
        return None
    if _NOISE.match(s):
        return None
    # drop trailing role labels
    s = re.sub(r"(?i)\s*(?:\(?(?:mother|father|♀|♂)\)?)\s*$", "", s).strip()
    if not s or _NOISE.match(s):
        return None
    return s


def _node(name: str, *, parents: list[dict] | None = None, source: str | None = None) -> dict[str, Any]:
    out: dict[str, Any] = {"name": name, "parents": parents or []}
    if source:
        out["source"] = source
    return out


def _split_cross(chunk: str) -> list[str]:
    parts = [p for p in _CROSS_SPLIT.split(chunk) if p and p.strip()]
    cleaned: list[str] = []
    for p in parts:
        # nested "(A x B)" as single parent label — keep inner if alone
        inner = p.strip()
        if inner.startswith("(") and inner.endswith(")") and inner.count("(") == 1:
            inner = inner[1:-1].strip()
        nm = _clean_name(inner)
        if nm:
            cleaned.append(nm)
    return cleaned


def parse_lineage_text(
    text: str | None,
    *,
    child_name: str | None = None,
    source: str | None = None,
) -> dict[str, Any]:
    """Return structured lineage: {name, parents:[{name,parents}], source, raw, parse_ok, parse_note}."""
    raw = (text or "").strip()
    child = _clean_name(child_name or "") or (child_name or "strain").strip() or "strain"
    base: dict[str, Any] = {
        "name": child,
        "parents": [],
        "source": source,
        "raw": raw or None,
        "parse_ok": False,
        "parse_note": None,
    }
    if not raw:
        base["parse_note"] = "empty_lineage"
        return base

    # Mother × Father labeled forms
    for rx in (_LABELED_CROSS, _MOTHER_FATHER):
        m = rx.match(raw)
        if m:
            mother = _clean_name(m.group("mother"))
            father = _clean_name(m.group("father"))
            parents = []
            if mother:
                parents.append(_node(mother))
            if father:
                parents.append(_node(father))
            if len(parents) >= 1:
                base["parents"] = parents
                base["parse_ok"] = True
                base["parse_note"] = "mother_father"
                return base

    work = raw
    m = _CROSS_OF.search(work)
    if m:
        work = m.group(1).strip().rstrip(".")

    # Strip outer "Genetics:" / "Lineage:" prefixes
    work = re.sub(r"(?is)^\s*(?:genetics|lineage|pedigree|cross)\s*[:=]\s*", "", work).strip()

    # Simple A x B (optionally more generations flattened — only direct split)
    names = _split_cross(work)
    # If only one token and it still has " x " after paren strip, retry
    if len(names) < 2:
        stripped = _PAREN_STRIP.sub(" ", work)
        names = _split_cross(stripped)

    if len(names) >= 2:
        # Cap direct parents at 4 (some lists are polyhybrids); never invent
        parents = [_node(n) for n in names[:4]]
        base["parents"] = parents
        base["parse_ok"] = True
        base["parse_note"] = "cross_split"
        return base

    if len(names) == 1 and names[0].lower() != child.lower():
        # Single known parent / landrace note — keep as one parent edge
        base["parents"] = [_node(names[0])]
        base["parse_ok"] = True
        base["parse_note"] = "single_parent"
        return base

    base["parse_note"] = "unparseable"
    return base


def _mermaid_id(name: str, used: dict[str, str]) -> str:
    key = re.sub(r"[^a-zA-Z0-9]+", "_", name).strip("_") or "N"
    if key[0].isdigit():
        key = "N_" + key
    base = key[:40]
    if base not in used:
        used[base] = name
        return base
    # collision
    i = 2
    while f"{base}_{i}" in used:
        i += 1
    nid = f"{base}_{i}"
    used[nid] = name
    return nid


def _escape_label(name: str) -> str:
    return name.replace('"', "#quot;").replace("[", "(").replace("]", ")")


def lineage_to_mermaid(tree: dict[str, Any] | None) -> str | None:
    """Build flowchart TD Mermaid from structured lineage. None if no parents."""
    if not isinstance(tree, dict):
        return None
    parents = tree.get("parents") or []
    if not parents:
        return None
    child = str(tree.get("name") or "strain").strip() or "strain"
    used: dict[str, str] = {}
    lines = ["flowchart TD"]
    child_id = _mermaid_id(child, used)
    lines.append(f'  {child_id}["{_escape_label(child)}"]')

    def emit_parent(node: dict, child_id: str) -> None:
        pname = str(node.get("name") or "").strip()
        if not pname:
            return
        pid = _mermaid_id(pname, used)
        lines.append(f'  {pid}["{_escape_label(pname)}"] --> {child_id}')
        for gp in node.get("parents") or []:
            if isinstance(gp, dict):
                emit_parent(gp, pid)

    for p in parents:
        if isinstance(p, dict):
            emit_parent(p, child_id)
    return "\n".join(lines) + "\n"


def enrich_lineage_fields(
    *,
    child_name: str | None,
    lineage_text: str | None,
    source: str | None = None,
    existing_parents: list | None = None,
) -> dict[str, Any]:
    """Produce dump fields: lineage, lineage_structured, lineage_mermaid, followup_gap note."""
    raw = (lineage_text or "").strip() or None
    # Prefer explicit structured parents list when scraper already extracted them
    if existing_parents:
        parents_nodes: list[dict] = []
        for p in existing_parents:
            if isinstance(p, str) and _clean_name(p):
                parents_nodes.append(_node(_clean_name(p) or p))
            elif isinstance(p, dict) and p.get("name"):
                nm = _clean_name(str(p["name"])) or str(p["name"]).strip()
                node = _node(nm)
                if p.get("url"):
                    node["url"] = p["url"]
                parents_nodes.append(node)
        if parents_nodes:
            tree = {
                "name": (child_name or "strain").strip() or "strain",
                "parents": parents_nodes,
                "source": source,
                "raw": raw or " x ".join(n["name"] for n in parents_nodes),
                "parse_ok": True,
                "parse_note": "from_parents_list",
            }
            mermaid = lineage_to_mermaid(tree)
            return {
                "lineage": raw or tree["raw"],
                "lineage_structured": tree,
                "lineage_mermaid": mermaid,
                "followup_gap": None,
            }

    tree = parse_lineage_text(raw, child_name=child_name, source=source)
    mermaid = lineage_to_mermaid(tree) if tree.get("parse_ok") else None
    gap = None
    if raw and not mermaid:
        gap = {
            "field": "lineage_mermaid",
            "reason": f"unparseable_lineage:{tree.get('parse_note') or 'unknown'}",
        }
    return {
        "lineage": raw,
        "lineage_structured": tree,
        "lineage_mermaid": mermaid,
        "followup_gap": gap,
    }


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Lineage text → Mermaid pedigree")
    ap.add_argument("text", nargs="?", help="lineage string")
    ap.add_argument("--child", default="Strain")
    ap.add_argument("--source", default=None)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args(argv)
    text = args.text
    if not text:
        text = input("lineage> ").strip()
    fields = enrich_lineage_fields(child_name=args.child, lineage_text=text, source=args.source)
    if args.json:
        print(json.dumps(fields, indent=2, ensure_ascii=False))
    else:
        print("parse_ok:", (fields["lineage_structured"] or {}).get("parse_ok"))
        print("structured:", json.dumps(fields["lineage_structured"], ensure_ascii=False))
        print("--- mermaid ---")
        print(fields["lineage_mermaid"] or "(null)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
