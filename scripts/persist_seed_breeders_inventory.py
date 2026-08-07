#!/usr/bin/env python3
"""Persist N-087 user-provided breeder/forum/bank inventory from agent transcript."""

from __future__ import annotations

import json
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_JSON = ROOT / "homeassistant" / "data" / "dsc_seed_breeders.json"
OUT_MD = ROOT / "homeassistant" / "data" / "SEED_BREEDERS.md"
TRANSCRIPT = Path(
    r"C:\Users\cmgwe\.cursor\projects\y-Digital-Stealth-Care-Projects-DSC-HUB"
    r"\agent-transcripts\71400859-bdf2-40f1-8662-45f73bff8ff1"
    r"\71400859-bdf2-40f1-8662-45f73bff8ff1.jsonl"
)

# Fallback if transcript missing (from user message lists)
FALLBACK_BANKS = [
    "Alchimia Grow Shop",
    "Attitude Seedbank",
    "Beaver Seeds",
    "Crop King Seeds",
    "DC Seed Exchange",
    "Great Lakes Genetics",
    "Greenhouse Seed Company",
    "Growers Choice Seeds",
    "Herbies",
    "ILGM",
    "Multiverse Beans",
    "Neptune Seed Bank",
    "North Atlantic Seed Co",
    "Oregon Elite Seeds",
    "Organic Earth",
    "Pacific Seed Bank",
    "Quebec Cannabis Seeds",
    "Seed City",
    "Seedsman",
    "SeedSupreme",
    "True North Seedbank",
    "Weed Seeds Express",
    "Zamnesia",
]
FALLBACK_OFFICIAL = [
    "Seedfinder",
    "Leafly",
    "Wikileaf",
    "Allbud",
    "Weedmaps",
    "Way of Leaf",
    "Hytiva",
    "Cannaconnection",
]
FALLBACK_FORUMS = [
    "420 Magazine",
    "Autoflower Network",
    "Cannabis.com Forums",
    "CannabisCafe 2.0",
    "Cannabisanbauen.net",
    "Cannaweed",
    "Chuckersparadise",
    "FCF",
    "Grasscity",
    "GreenPassion",
    "GrowKind",
    "Grower.ch",
    "Grower.cz",
    "Growery",
    "ICMag",
    "Jointjedraaien.nl",
    "Lamarihuana",
    "Marijuana Growing Forums",
    "Marijuana Passion",
    "Mr.Nice",
    "OZ Stoners",
    "Olkpeace",
    "OpenGrow",
    "Overgrow",
    "Phenohunter",
    "Reddit Cannabis",
    "Rollitup",
    "Sensi Seeds Forums",
    "Strain Hunters",
    "Swecan",
    "THCfarmer",
    "THCtalk",
    "The Green Circle",
    "UK420",
    "Wiet Forum NL",
]


def _section(content: str, after: str, until_prefixes: list[str]) -> list[str]:
    i = content.find(after)
    if i < 0:
        return []
    rest = content[i + len(after) :]
    lines: list[str] = []
    for ln in rest.splitlines():
        ln = ln.strip()
        if not ln:
            continue
        if any(ln.startswith(p) for p in until_prefixes):
            break
        if ln.startswith("http") or ln.startswith("#"):
            continue
        lines.append(ln)
    return lines


def load_content() -> str:
    if not TRANSCRIPT.exists():
        return ""
    for line in TRANSCRIPT.open(encoding="utf-8", errors="replace"):
        if "00 Seeds Bank" not in line:
            continue
        return json.loads(line)["message"]["content"][0]["text"]
    return ""


def main() -> int:
    content = load_content()
    breeders: list[str] = []
    forums: list[str] = []
    banks: list[str] = []
    officials: list[str] = []

    if content:
        breeders = _section(
            content,
            "Here is a list of seed breeders:",
            [
                "These forums",
                "Here is a list of forums",
                "These seed banks",
                "And for official",
                "Also use:",
            ],
        )
        if "Zorrino Seeds" in breeders:
            breeders = breeders[: breeders.index("Zorrino Seeds") + 1]
        forums = _section(
            content,
            "These forums should also be a good source of information:",
            ["These seed banks", "And for official", "Also use:"],
        )
        if not forums:
            forums = _section(
                content,
                "Here is a list of forums:",
                ["These seed banks", "And for official"],
            )
        banks = _section(
            content,
            "These seed banks should also have plenty of data:",
            ["And for official", "Also use:"],
        )
        officials = _section(
            content,
            "And for official databases you should make every attempt to aquire:",
            ["Also use:", "Also look"],
        )

    if not banks:
        banks = list(FALLBACK_BANKS)
    if not officials:
        officials = list(FALLBACK_OFFICIAL)
    if not forums:
        forums = list(FALLBACK_FORUMS)

    # Drop accidental section headers from breeders
    breeders = [
        b
        for b in breeders
        if not b.startswith("These ") and b not in set(banks) | set(forums)
    ]

    payload = {
        "schema_version": 2,
        "kind": "discovery_inventory",
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": "user_paste_n087",
        "breeders": breeders,
        "forums": forums,
        "seed_banks": banks,
        "official_directories": officials,
        "counts": {
            "breeders": len(breeders),
            "forums": len(forums),
            "seed_banks": len(banks),
            "official_directories": len(officials),
        },
    }
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    md = [
        "# Seed breeders and discovery inventory (N-087)",
        "",
        (
            f"Breeders: **{len(breeders)}** | Forums: **{len(forums)}** | "
            f"Seed banks: **{len(banks)}** | Official DBs: **{len(officials)}**"
        ),
        "",
        "User-provided lists drive Wave B+ discovery/scrapes. "
        "Bank HTML scrapes stay `redistributable=false` until legal review.",
        "",
        "## Breeders",
        "",
    ]
    md += [f"- {n}" for n in breeders]
    md += ["", "## Forums", ""] + [f"- {n}" for n in forums]
    md += ["", "## Seed banks (priority scrape)", ""] + [f"- {n}" for n in banks]
    md += ["", "## Official directories", ""] + [f"- {n}" for n in officials]
    OUT_MD.write_text("\n".join(md) + "\n", encoding="utf-8")
    print(
        f"wrote {OUT_JSON.name} breeders={len(breeders)} forums={len(forums)} "
        f"banks={len(banks)} official={len(officials)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
