import assert from "node:assert/strict";
import { framedSize } from "./camerasApi";

// The drawer's job is to say what a crop costs BEFORE the operator saves and finds out a
// month later in the timelapse. This sum has to match the brain's ffmpeg expressions
// (crop=trunc(iw/z/2)*2:…) or the number on screen is a promise the capture does not keep.

// No framing: the sensor mode is what gets stored.
assert.equal(framedSize("1920x1080", {}), "1920×1080");

// Digital zoom is a crop. 4× on 1080p keeps a quarter of each axis and nothing brings the
// rest back — this is the line that stops "zoom" being read as "enhance".
assert.equal(framedSize("1920x1080", { zoom: 4 }), "480×270");
assert.equal(framedSize("1280x720", { zoom: 2 }), "640×360");

// Even on both axes, like the brain's trunc(…/2)*2: an odd dimension is refused by the
// yuv420p encoder the timelapse assembly uses, and that failure would not surface until the
// first assembly ran.
assert.equal(framedSize("1920x1080", { zoom: 3 }), "640×360");
assert.equal(framedSize("640x480", { zoom: 1.7 }), "376×282");

// A quarter turn swaps the axes; a half turn does not.
assert.equal(framedSize("1920x1080", { rotate: 90 }), "1080×1920");
assert.equal(framedSize("1920x1080", { rotate: 270 }), "1080×1920");
assert.equal(framedSize("1920x1080", { rotate: 180 }), "1920×1080");
assert.equal(framedSize("1920x1080", { zoom: 2, rotate: 90 }), "540×960");

// Mirroring moves pixels without losing any, so it cannot change the size.
assert.equal(framedSize("1920x1080", { flip_h: true, flip_v: true }), "1920×1080");

// Nothing to base the sum on — a camera whose mode we do not know yet — says nothing rather
// than guessing.
assert.equal(framedSize(undefined, { zoom: 2 }), "");
assert.equal(framedSize("best available", { zoom: 2 }), "");

console.log("cameraFraming.smoke: ok");
