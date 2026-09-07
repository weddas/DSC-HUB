import assert from "node:assert/strict";
import { formatApiError } from "./apiError";
import { fmtReading } from "./formatReading";
import { GROWTH_STAGE_FALLBACK } from "./growthStages";

assert.equal(formatApiError('{"detail":"No plant on pot 1"}'), "No plant on pot 1");
assert.equal(formatApiError(""), "Request failed");
assert.equal(formatApiError("plain boom"), "plain boom");
assert.equal(
  formatApiError('{"detail":[{"msg":"field required"},{"msg":"bad"}]}'),
  "field required; bad",
);

assert.equal(fmtReading(24.100000381469727, 0), "24");
assert.equal(fmtReading("24.100000381469727", 1), "24.1");
assert.equal(fmtReading("—"), "—");
assert.equal(fmtReading(null), "—");
assert.equal(fmtReading(6.789, 2), "6.79");

assert.ok(!(GROWTH_STAGE_FALLBACK as readonly string[]).includes("Dry Mode"));
assert.ok(!(GROWTH_STAGE_FALLBACK as readonly string[]).includes("Off"));
assert.equal(GROWTH_STAGE_FALLBACK[0], "Germination");
assert.equal(GROWTH_STAGE_FALLBACK[GROWTH_STAGE_FALLBACK.length - 1], "Final 48-72h Flowering");

console.log("probe/api smoke tests ok");
