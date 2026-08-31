# Wave 2 CannaLib — browse / search / icons / images

**Date:** 2026-08-31  
**Status:** draft — implementing against DSC-HUB stack; live CannaLib deploy needed for remote offset  
**Parent goal:** DSC operator polish

## Problem

SPA catalog asks limit=100; live CannaLib defaults ≤50 and **ignores** `offset`/`page`/`skip`. Empty query is a curated head page, not a walkable corpus. Search is name-centric; icons are one glyph per kind; strain portraits unused in React SPA (licensed media exists on live hydrate).

## Goals

1. Browse past first page (Load more / offset)
2. Multi-field search (name + type + breeder + summary/excerpts when present)
3. Better row icons (indica / sativa / hybrid / auto)
4. Strain images from licensed hydrate only (honest blank when `media.n=0`)

## Decisions

| Topic | Choice |
|-------|--------|
| Remote offset | Add to hub `services/cannalib/standalone_server.py` + brain proxy; live deploy is separate follow-up |
| Fallback browse | Brain local SQLite `OFFSET` when remote ignores offset or fails |
| Images | Hydrate `GET /v1/catalogs/strains/{id}`; show licensed sample only; no marketing hotlink |
| Icons | New IconNames for strain types; nutrient/light keep distinct glyphs |

## Non-goals

- Full 175k JSON dump in browser
- Wave 3 PPFD crops
- Rebuilding live CannaLib haystack FTS (note in FOLLOWUPS)

## Acceptance

1. Empty-q Load more appends new strains (not duplicate head page) via brain local and/or deployed CannaLib offset
2. Typing breeder/type substring finds hits on local + returned remote rows
3. Strain rows show type-specific icons
4. Detail panel shows image or honest “No licensed image”
