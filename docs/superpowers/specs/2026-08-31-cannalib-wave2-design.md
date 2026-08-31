# Wave 2 CannaLib — browse / search / icons / images

**Date:** 2026-08-31  
**Status:** landed on tip `28953ae` / `94705f0` — hub trampoline + brain + SPA done; production CDN offset still deferred  
**Parent goal:** DSC operator polish · **SoT:** [`docs/brain/OPERATOR-POLISH.md`](../../brain/OPERATOR-POLISH.md)

## Problem

SPA catalog asks limit=100; live CannaLib defaults ≤50 and **ignores** `offset`/`page`/`skip`. Empty query is a curated head page, not a walkable corpus. Search is name-centric; icons are one glyph per kind; strain portraits unused in React SPA (licensed media exists on live hydrate).

## Goals

1. Browse past first page (Load more / offset) — **done** (brain detects remote head-page repeat → local OFFSET)
2. Multi-field search (name + type + breeder + summary/excerpts when present) — **done**
3. Better row icons (indica / sativa / hybrid / auto) — **done**
4. Strain images from licensed hydrate only (honest blank when `media.n=0`) — **done** (Pi media proxy; cultivar-specific still upstream `media_n=0`)

## Decisions

| Topic | Choice |
|-------|--------|
| Remote offset | Hub `services/cannalib/standalone_server.py` + brain proxy; **live CDN deploy** still FOLLOWUPS |
| Fallback browse | Brain local SQLite `OFFSET` when remote ignores offset or fails |
| Images | Hydrate `GET /v1/catalogs/strains/{id}` + `/v1/media/assets/{id}`; no marketing hotlink |
| Icons | IconNames for strain types; nutrient/light keep distinct glyphs |

## Non-goals

- Full 175k JSON dump in browser
- Rebuilding live CannaLib haystack FTS (note in FOLLOWUPS)

Wave 3 kit PPFD crops landed separately under `/dsc-catalog/ppfd/` (same tip train).

## Acceptance

1. Empty-q Load more appends new strains (not duplicate head page) via brain local and/or deployed CannaLib offset — **verified** offset_ok smoke
2. Typing breeder/type substring finds hits on local + returned remote rows — **verified**
3. Strain rows show type-specific icons — **verified**
4. Detail panel shows image or honest blank — **verified** (genus reference when corpus links; cultivar `media_n=0`)
