# DSC Help Closure Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every remaining DSC Help polish / deferred item in one coherent WordPress-PD publish pass so `/dsc/help/*` is scannable, deep-linkable, mobile-readable, and a11y-honest — without reopening the contrast/TB fights already won.

**Architecture:** Content stays in `content/dsc-help.json` + Python Divi generators (`dsc_help_pages.py`, `dsc_help_widgets.py`, `dsc_help_diagrams.py`). Behavior stays vanilla (`help-fallback.js` + inlined CSS). Prefer structure over JS: stack measure guides with hash anchors, native FAQ `<details>`, workflow groups by tab. Publish via `push_dsc_help.py` (media resolve + REST Theme Builder already work).

**Tech Stack:** WordPress-PD repo, Divi 5.9 via `divi_lib`, PD palette (`#0c1220` / `#121a2c` / `#182238`), vanilla JS, `push_dsc_help.py`.

## Global Constraints

- Repo of record: `C:\Users\cmgwe\Documents\WordPress-PD` (not DSC-HUB for markup).
- Do not reintroduce WP Interactivity API / `help-store.js`.
- Keep forced dark canvas CSS (`help.css`); do not rely on Divi section backgrounds alone.
- No studio LAN IPs in public copy (already scrubbed — do not regress).
- CannaLib honesty: no invented chem; keep links to `/cannalib/honesty/` and `/query/`.
- One publish at end (`python push_dsc_help.py`); fail loud if Theme Builder POST is non-OK.
- Off-plan discoveries → `docs/FOLLOWUPS.md` in DSC-HUB; do not derail the pass.
- Bump `HELP_ASSET_VER` / `PD_DSC_HELP_VERSION` together (target **1.2.0**).

---

## Inventory (source of truth)

### Deferred — must close this pass (`FOLLOWUPS` 2026-08-28 DSC Help)

| # | Item | Chosen approach |
|---|------|-----------------|
| D1 | Workflow wall (11 cards) | Group by Live/Grow/Tune/Fleet; first 3 open; rest `<details>` per group + jump TOC |
| D2 | SVG labels tiny on mobile | Shared text scale (≥12px) + HTML stacked fallback under 480px for architecture + cannalib + measure SVGs |
| D3 | Measure deep-links → guide 1 | Stack all 7 guides; `#fan`/`#light`/`#soil`/`#tank`/`#climate`/`#probe`/`#learning`; FAQ/workflow hrefs use hashes |
| D4 | FAQ accordion a11y | Native `<details>`/`<summary>`; keep filter; empty-state |
| D5 | Hardcoded Eleven/Fourteen/Seven | Derive counts from JSON lengths in page generators |

### Already done — do not redo

- Theme Builder REST descendants
- Media URL resolve via WP API
- Interactivity stripped / vanilla shortcodes
- Dark contrast force, sticky tabs, CLS width/height, Learning SVG, operator banner, no LAN IP

### Interrogate leftovers — fold into this pass if cheap

| Item | Action |
|------|--------|
| Help sibling subnav | Add compact link row on all 5 pages (Hub · Dashboard · Measure · CannaLib · FAQ) |
| TB swallow | `push_dsc_help.py`: re-raise / exit non-zero on TB failure |
| Heading outline | Hub kicker `h6` → keep; measure guides use `h2`; CannaLib “Data path” → `h2` |
| Audit TSV stale TB row | Mark Theme Builder VERIFIED after this pass |

### Explicitly out of scope

- Live Pi iframe / waitlist
- Full WP Interactivity rewrite
- Divi Connect design tokens
- Workflow content rewrite (reorder/edit copy) beyond grouping + collapse

---

## File map

| File | Role this pass |
|------|----------------|
| `content/dsc-help.json` | Add `id` / `group` on workflows + measures if missing |
| `dsc_help_widgets.py` | FAQ `<details>`, measure stack + hashes, subnav helper, version bump |
| `dsc_help_pages.py` | Dynamic counts, workflow groups, subnav, heading levels |
| `dsc_help_diagrams.py` | Larger labels; optional `html_fallback()` siblings |
| `plugin/pd-dsc-help/assets/help.css` | Details/summary, workflow groups, SVG/HTML fallback breakpoints, subnav |
| `plugin/pd-dsc-help/assets/help-fallback.js` | Hash open for measure; FAQ filter on `<details>`; drop carousel-only paths |
| `plugin/pd-dsc-help/includes/render.php` | Mirror FAQ/measure vanilla markup |
| `plugin/pd-dsc-help/pd-dsc-help.php` | Version 1.2.0 |
| `push_dsc_help.py` | Fail loud on TB |
| `tools/verify_dsc_help_polish.py` | Assert hashes, details, counts, subnav |
| DSC-HUB `docs/FOLLOWUPS.md` | Mark D1–D5 done |
| DSC-HUB `docs/superpowers/plans/2026-08-28-dsc-help-pd-site-audit.tsv` | Update TB + new VERIFIED rows |

---

## Narrative (what the public sees after)

1. **Hub** — release teaser, story, guide cards with live counts, WIP table, sibling subnav.
2. **Dashboard** — start steps → tabbed screenshots → **workflow groups** (not a flat wall) → maintainer note; measure cross-refs are real links with hashes.
3. **Measure** — all seven guides visible/stackable; hash jumps from FAQ/workflows; readable diagrams on phone.
4. **FAQ** — native disclosure widgets + filter; measure answers deep-link.
5. **CannaLib** — single diagram chrome, honest CTAs, subnav back to hub.

---

### Task 1: Content model — ids, groups, dynamic counts

**Files:**
- Modify: `content/dsc-help.json`
- Modify: `dsc_help_pages.py`

- [ ] Add `id` to each measure matching diagram key (`fan`, `light`, …).
- [ ] Add `group` to each workflow: `live` | `grow` | `tune` | `fleet` (map from existing titles/paths; if ambiguous, prefer Live).
- [ ] Replace hardcoded “Eleven workflows” / “Fourteen answers” / “Seven field guides” with `len(...)` from loaded JSON.
- [ ] Smoke: `python -c "from dsc_help_pages import page_help_hub, page_help_dashboard; …"` prints correct numbers.

### Task 2: Measure — stack + hash deep-links

**Files:**
- Modify: `dsc_help_widgets.py` (`measure_widget`)
- Modify: `help-fallback.js`
- Modify: `help.css`
- Modify: `dsc_help_pages.py` / FAQ linkify / workflow linkify

- [ ] Render all guides as stacked `<section id="{id}" class="pd-help-measure-card">` (no `hidden` carousel).
- [ ] Keep compact sticky jump nav: buttons/`a href="#fan"` etc. (not prev/next only).
- [ ] On load / `hashchange`, scroll to `#id` and briefly highlight card.
- [ ] Update `_linkify_faq_answer` and workflow “See How to measure → …” to `/dsc/help/measure/#fan` (etc.).
- [ ] Mirror in `render.php` shortcode.
- [ ] Browser: FAQ “Fan CFM” lands on fan section; print shows all guides.

### Task 3: FAQ — native details + filter

**Files:**
- Modify: `dsc_help_widgets.py` (`faq_widget`)
- Modify: `help-fallback.js`
- Modify: `help.css`
- Modify: `includes/render.php`

- [ ] Replace button/body accordion with `<details class="pd-help-faq-item"><summary>…</summary><div>…</div></details>`.
- [ ] Filter toggles `hidden` on `<details>`; empty-state unchanged.
- [ ] Style summary with focus-visible; no custom `aria-expanded` required.
- [ ] Browser: open/close without JS; filter still works with JS.

### Task 4: Workflow wall → grouped disclosures

**Files:**
- Modify: `dsc_help_pages.py` (`page_help_dashboard`)
- Modify: `help.css`

- [ ] Render four groups (Live / Grow / Tune / Fleet) with `h2` + sticky mini-TOC (`#wf-live` …).
- [ ] Within each group: first workflow open `<details open>`; remaining collapsed.
- [ ] Linkify measure cross-refs inside workflow HTML (same map as FAQ).
- [ ] Visual check: dashboard is scannable above the fold; all 11 still reachable.

### Task 5: Diagrams — mobile readable

**Files:**
- Modify: `dsc_help_diagrams.py`
- Modify: `help.css`

- [ ] Raise SVG label `font-size` floor to 12–13 for body labels; 11 min for sublabels.
- [ ] Add `data-diagram` + sibling `.pd-help-diagram-fallback` HTML list (title + short bullets) for architecture, cannalib, and each measure diagram.
- [ ] CSS: `@media (max-width: 480px) { .pd-help-diagram svg { display: none } .pd-help-diagram-fallback { display: block } }` (fallback hidden on desktop).
- [ ] Narrow viewport screenshot / CDP: labels readable or fallback visible.

### Task 6: Chrome — subnav, headings, TB fail-loud

**Files:**
- Modify: `dsc_help_widgets.py` (add `help_subnav(active)`)
- Modify: `dsc_help_pages.py` (inject on all 5 pages)
- Modify: `push_dsc_help.py`
- Modify: `help.css`

- [ ] Subnav row: Hub · Dashboard · Measure · CannaLib · FAQ; mark current with `aria-current="page"`.
- [ ] Measure guide titles as `h2`; CannaLib “Data path” as `h2`.
- [ ] `push_dsc_help.py`: on TB exception or non-OK response, `sys.exit(1)` (no silent `DSC-HELP-OK`).
- [ ] Version bump to **1.2.0** in widgets + plugin PHP.

### Task 7: Publish, verify, close FOLLOWUPS

**Files:**
- Modify: DSC-HUB `docs/FOLLOWUPS.md`
- Modify: DSC-HUB `docs/superpowers/plans/2026-08-28-dsc-help-pd-site-audit.tsv`
- Modify: `tools/verify_dsc_help_polish.py`

- [ ] Extend verifier: require `#fan`, `<details`, `pd-help-subnav`, dynamic count strings, `data-ver="1.2.0"`, `et-tb-has-header`.
- [ ] Run `python push_dsc_help.py` from WordPress-PD.
- [ ] Run verifier + browser spot-check (tabs, FAQ details, measure hash, mobile diagram).
- [ ] Mark D1–D5 **done** in FOLLOWUPS; append VERIFIED audit rows (TB REST, measure hashes, FAQ details, workflow groups).
- [ ] Commit WordPress-PD + DSC-HUB docs (only these files) when user asks.

---

## Suggested execution order (single session)

```text
Task 1 (JSON + counts) → Task 2 (measure hashes) → Task 3 (FAQ details)
  → Task 4 (workflows) → Task 5 (diagrams) → Task 6 (subnav/TB) → Task 7 (publish)
```

Do not publish mid-pass. One version bump, one zip, one push.

## Evidence gate (definition of done)

| Check | Pass criteria |
|-------|----------------|
| `/dsc/help/measure/#light` | Scrolls to light guide; title visible |
| FAQ anemometer answer | Link includes `#fan` |
| FAQ without JS | `<details>` opens natively |
| Dashboard workflows | Grouped; not 11 flat open cards |
| Phone 360px | Diagram fallback or ≥12px labels |
| Hub cards | Counts match JSON lengths |
| `push_dsc_help.py` | Exit 0 only if pages + TB OK |
| FOLLOWUPS | D1–D5 status `done` |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Divi strips `<details>` | Already ships custom HTML in `code` modules successfully; verify live |
| Hash + sticky header offset | CSS `scroll-margin-top` on measure sections |
| Workflow grouping wrong | Prefer conservative Live bucket; note in FOLLOWUPS if editorial remap needed |
| Bundle size grows with stacked guides | Acceptable vs broken deep-links; screenshots stay lazy |

---

## Execution handoff

Plan saved to [`docs/superpowers/plans/2026-08-28-dsc-help-closure-pass.md`](docs/superpowers/plans/2026-08-28-dsc-help-closure-pass.md).

**Two options after approval:**

1. **Subagent-driven** — fresh agent per task, review between tasks  
2. **Inline** — one session, checkpoint after Task 4 and after publish  

**Which approach?**
