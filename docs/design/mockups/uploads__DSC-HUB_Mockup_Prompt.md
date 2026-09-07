# DSC-HUB — UI Mockup Brief

> Paste everything below this line into the DSC-HUB Mockup design project.

---

## 1. What we are building

**DSC-HUB** is a self-hosted grow-room control and monitoring hub for cannabis cultivation. It runs on a local box on the grower's network (currently at `dsc-brain.local`) and is opened in a browser or on a phone. It is at preview **v7.4.0**, with a public release planned for late 2026.

DSC-HUB must work for two very different users **with the same interface**:

- **The home grower** — one or two tents (my rig is a 4×8 flower tent and a 2×4 clone/veg tent), a couple of LED boards on a dimmable driver, a handful of sensors, one person doing everything.
- **The small craft facility** — think Hamilton Farms in New Jersey: ten independent shipping-container grow zones plus two custom flower rooms, ~35 staff, 100+ cultivars, a tissue-culture lab, a dry room, a cure room and a pre-roll line. Every zone has its own climate, its own lighting recipe and its own irrigation strategy, and someone has to watch all ten at once.

The design principle: **a home grower should never feel like they're driving a facility, and a facility should never feel like they've outgrown a hobby app.** Everything scales from "1 tent" to "unlimited rooms and tents" by adding zones, not by switching products.

The hub already includes **CannaLib**, an API-backed catalogue of strains, growing mediums, nutrients and lights that the rest of the app can reference (e.g. a zone is "running Greasy Gary in Floraflex on 2× SF1000").

---

## 2. Where the inspiration comes from

I watched the CannaCribs episode *"How Technology Is Changing Craft Cannabis"* (Hamilton Farms, NJ). It's the clearest picture I've seen of what a modern data-driven grow actually looks like day to day, and DSC-HUB should feel like the software that facility *wishes* it had — one hub instead of the five separate systems they juggle. Use these as design inspiration, not features to copy verbatim:

**Multi-zone reality.** They run 10 containers + 2 rooms and openly say the hard part is "10 independent zones and climates to adjust, to monitor, to keep track of… 10 different sensor systems." The overview screen has to make ten zones glanceable in one view, and one tent just as comfortable.

**Lighting recipes per rack / per cultivar (TSRgrow GrowHub).** Their LED system removes per-fixture drivers, centralises power, and lets them "program our own recipes per cultivar… 16 racks in the room, we can do it per rack." Recipes cover intensity *and* spectrum, scheduled over the crop cycle. The vendor can also see fixtures on the back end and phones the grower when "we see this on and it's not supposed to be on" — i.e. anomaly detection on lights.

**Crop steering (AROYA-style).** Substrate sensors give EC and volumetric water content. The cycle is *generative → bulking → generative finish* (3 weeks each). Early: 4–6 small shots to field capacity, then a deep dry-back to stack EC. Later: maintenance "burst" shots of 30–45 seconds every 30–45 minutes. The UI needs to show the phase, the shot schedule, the dry-back curve and EC stacking clearly.

**VPD as the master climate number.** They run warmer and more humid early (0.8–1.0 kPa VPD in veg / early flower) and taper to 1.0–1.2 kPa late flower, tapering temperature and humidity down as buds form. VPD should be front-and-centre, with temp/RH as the inputs to it.

**PAR / PPFD measurement.** PAR sensors from the light system and from Growlink, plus manual readings at different canopy heights. Light intensity at the canopy is a first-class metric.

**Dehumidification and humidification (Anden).** Removing moisture is "one of the biggest factors for efficiency." Their dry/cure room drops into "the danger threshold for dryness" in winter, so they add steam humidification. Show equipment as things that pull *or* push humidity, with setpoints and thresholds.

**Post-harvest is part of the grow.** Dry room checked daily with water-activity tests; cure in 30-gallon drums with smart cure pucks that report RH and CO₂ ppm, burp automatically on a programmed schedule, and have "an app on my phone so when I'm not at the grow, I can see how my plants are doing." Two-way humidity packs are used during dry and they track terpene retention over time to validate it.

**Propagation cadence.** A rolling 3-week clone schedule ("every 3 weeks I'm filling a room", ~448 sites per room, cutting 600–800 to have spares), beneficial insects released on an auto-order cadence, and a tissue-culture lab that is "the cleanest room in the facility." Goal: remove mothers entirely and go gen-zero tissue culture. Genetics storage matters: "many genetics stored on a single rack."

**Genetics as a living library.** They have 100+ cultivars, a breeding program (Greasy Gary × Lambsbread, the Scarlet line, fast-flowering Piff/Haze phenos that finish in 55–65 days instead of 90–120), and award results (MJ Unpacked cup: best hybrid, best earthy profile, best floral profile). This is exactly what CannaLib should feel like — strain records with lineage, flowering time, terp/aroma notes, how it performed in *our* zones.

**Efficiency metrics that matter.** Dollars per gram, grams per square foot, pounds per light (they went from ~170 lb to 346 lb per room), labour model of one FTE per 750–1,000 sq ft of canopy, pre-rolls at 3¢ per roll and 20% of sales. Facility users want these KPIs; home growers want the same idea at their scale (g/W, g per plant, cost per run).

**Off-site visibility.** Repeatedly the point is: "I can see how my plants are doing" from a phone, and get called when something is wrong. Mobile is not a secondary view.

---

## 3. Screens to mock up

Design the full app. Use the same components across all screens; a zone is a zone whether it is a tent or a container.

1. **Overview / Facility** — grid of zone cards (1 to 10+). Each card: zone name, cultivar(s) from CannaLib, day-of-cycle and phase (Veg / Gen / Bulk / Finish / Dry / Cure), live VPD, temp, RH, CO₂, substrate EC and VWC, light on/off + PPFD, and an alert badge. Show a 1-tent state and a 12-zone state.
2. **Live Climate (per zone)** — the existing route is `#/live/climate`. VPD hero number with temp/RH beneath it, 24 h and 7 d charts, setpoints and target bands that change by phase, equipment tiles (lights, dehumidifier, humidifier, fans, heater) showing state and whether they're pulling toward setpoint.
3. **Crop Steering & Irrigation** — phase timeline (generative → bulking → finish), today's shot schedule, dry-back curve with EC overlaid, field-capacity and dry-back targets, "shot" editor (duration, interval, window), and a "what the substrate did overnight" strip.
4. **Lighting Recipes** — per-zone (or per-rack) recipe: sunrise/sunset ramps, intensity by day of cycle, optional spectrum mix, dimmer driver mapping, PPFD reading vs target at canopy, energy use. Recipe library so a recipe can be applied to any zone.
5. **Propagation & Rotation** — rolling clone/TC schedule, sites per room, cuttings taken vs needed, mother/TC inventory, beneficials cadence, and a calendar that shows when each room next needs filling.
6. **Post-Harvest (Dry & Cure)** — dry-room climate with the "too dry / too wet" danger band, water-activity log per batch, cure vessels as cards (RH, CO₂ ppm, last burp, next burp, burp schedule), terpene-retention trend.
7. **CannaLib** — strain, medium, nutrient and light catalogue. Strain detail: lineage, flowering days, aroma/terp notes, awards, and a "runs in DSC-HUB" section showing how it performed in each zone.
8. **Alerts & Automation** — rules ("light on outside schedule", "VPD out of band for 30 min", "dry room below RH floor", "cure vessel CO₂ over X"), notification history, and what the hub did about it.
9. **Mobile** — phone-sized versions of Overview, one Live Climate zone and one Cure vessel. This is the "I'm not at the grow" view.
10. **Settings / Zones** — add a tent or room, assign sensors and equipment, name it, pick its cultivar from CannaLib.

---

## 4. Visual direction

**Dark, data-dense operations console.** It should feel like the control panel of a grow room, not a marketing site.

- Dark neutral background (near-black with a slight cool or green cast), elevated cards, thin dividers. High contrast for numbers.
- One accent for "healthy / in band" (a living green), one for warning (amber), one for critical (red), one for "light is on" (warm white/amber-gold). Use colour for status only; keep chrome quiet.
- Big numeric readouts with units and a small delta or sparkline. VPD in kPa, temp in °C, RH in %, CO₂ in ppm, EC in mS/cm, VWC in %, PPFD in µmol/m²/s.
- Charts: line charts with target bands shaded behind the trace; phase boundaries as vertical markers; dry-back shown as a sawtooth with EC overlaid on a second axis.
- Phase is a first-class label everywhere (Veg · Gen · Bulk · Finish · Dry · Cure) with a consistent colour or icon per phase.
- Density scales: one tent gets breathing room; ten zones compress into a tight grid without redesigning the card.
- Typography: a clean sans for UI, a tabular-figure face for numbers so columns line up.
- Include an empty state ("No zones yet — add your first tent") and an alert state.

---

## 5. Constraints and non-goals

- Self-hosted, local network first. No "cloud account" flows in the mockup.
- Don't design a shop, a compliance/METRC module, or a seed-to-sale system — those are out of scope for this pass.
- Avoid stoner-culture styling; this is horticultural equipment software.
- Keep vendor names out of the UI. TSRgrow, AROYA, Growlink, Anden etc. are inspiration; DSC-HUB is vendor-neutral.

---

## 6. What to deliver

- Desktop frames for screens 1–8 and 10, plus the three mobile frames in screen 9.
- A small component sheet: zone card, metric tile, phase chip, alert badge, equipment tile, chart with target band.
- Show two data scenarios on the Overview: a single 4×8 tent, and a 12-zone facility.
- Annotate anything you had to invent so I can confirm it against the real hub.

---

## Appendix — quick reference numbers from the episode (for realistic sample data)

| Thing | Value seen in the video |
|---|---|
| VPD, veg / early flower | 0.8–1.0 kPa |
| VPD, late flower | 1.0–1.2 kPa |
| Crop-steering phases | Generative 3 wk → Bulking 3 wk → Generative finish |
| Generative irrigation | 4–6 small shots to field capacity, then large dry-back to stack EC |
| Maintenance irrigation | 30–45 s bursts every 30–45 min |
| Clone cadence | Every 3 weeks; ~448 sites per room; cut 600–800 |
| Cutting spec | 8–10 in cut, 45° at 6 in, soak 10–15 min |
| Cure vessel | 30 gal drum, 6–8 lb per side, 75% full, smart puck reports RH + CO₂ ppm, auto-burp |
| Fast Piff/Haze phenos | 55–65 days (vs 90–120 traditional) |
| Yield per room | 170 lb → 346 lb |
| Labour model | 1 FTE per 750–1,000 sq ft canopy |
| Facility | 73,000 sq ft total, 13,000 sq ft finished, 10 containers + 2 rooms, 16 racks/room |
| Pre-rolls | 3¢ per roll; 12% of 2025 sales → 20% in 2026 |
