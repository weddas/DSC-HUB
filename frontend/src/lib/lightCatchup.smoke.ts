import assert from "node:assert/strict";
import { fmtHours, holdReleaseWarning, projectCatchup } from "./lightCatchup";

// No debt means no catch-up to describe.
assert.equal(projectCatchup({ debtH: 0, darkRemainingH: 8, minDarkH: 6 }), null);
assert.equal(projectCatchup({ debtH: null, darkRemainingH: 8, minDarkH: 6 }), null);

// Enough room above the floor: it repays in full and stops.
const repaid = projectCatchup({ debtH: 1.5, darkRemainingH: 8, minDarkH: 6, nowMs: 0 });
assert.ok(repaid);
assert.equal(repaid.endsBecause, "debt-repaid");
assert.equal(repaid.runsForH, 1.5);
assert.equal(repaid.cutShort, false);
assert.equal(repaid.carriesH, 0);
assert.equal(repaid.endsAtMs, 1.5 * 3600_000);

// Not enough room: the dark floor cuts it short and the rest carries.
const cut = projectCatchup({ debtH: 4, darkRemainingH: 8, minDarkH: 6, nowMs: 0 });
assert.ok(cut);
assert.equal(cut.endsBecause, "dark-floor");
assert.equal(cut.runsForH, 2, "it may only use the dark above the floor");
assert.equal(cut.cutShort, true);
assert.equal(cut.carriesH, 2);

// Already at/below the floor: it cannot run at all, and must not report negative time.
const noRoom = projectCatchup({ debtH: 3, darkRemainingH: 6, minDarkH: 6, nowMs: 0 });
assert.ok(noRoom);
assert.equal(noRoom.runsForH, 0);
assert.equal(noRoom.cutShort, true);
assert.equal(noRoom.carriesH, 3);

// Missing inputs: we still know the debt, but must NOT invent an end time.
const partial = projectCatchup({ debtH: 2, darkRemainingH: null, minDarkH: 6 });
assert.ok(partial);
assert.equal(partial.runsForH, null);
assert.equal(partial.endsAtMs, null);
assert.equal(partial.endsBecause, null);

// The warning always leads with the fact that the lamp comes ON — that is the surprise.
const warn = holdReleaseWarning(repaid);
assert.ok(warn && warn.includes("turn the lamp ON"), warn ?? "");
assert.ok(warn.includes("1 h 30 m"), warn);

const warnCut = holdReleaseWarning(cut);
assert.ok(warnCut && warnCut.includes("minimum dark floor"), warnCut ?? "");
assert.ok(warnCut.includes("2 h still owed"), warnCut);

// With no projection there is nothing to warn about.
assert.equal(holdReleaseWarning(null), null);

// Durations read like a clock.
assert.equal(fmtHours(0.5), "30 m");
assert.equal(fmtHours(2), "2 h");
assert.equal(fmtHours(2.35), "2 h 21 m");
assert.equal(fmtHours(-1), "—");

console.log("lightCatchup smoke tests ok");
