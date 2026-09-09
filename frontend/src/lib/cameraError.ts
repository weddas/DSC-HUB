/** Turn a raw capture error into something an operator can act on.
 *
 * The card printed ffmpeg's own stderr verbatim — "Error opening input files: Server
 * returned 401 Unauthorized (authorization failed)" beside a bare
 * `rtsp://192.168.86.200:554/stream1` (observed live 2026-09-10). A 401 means the stream
 * wants credentials, which the card never said; the operator is left to know that RTSP
 * carries them inline in the URL.
 *
 * The raw text is never thrown away — it stays available as the detail line — because a
 * translated message that guesses wrong would be worse than the original.
 */
export type CameraErrorHelp = {
  /** One sentence telling the operator what to do. */
  guidance: string;
  /** The original error, for when the guidance does not fit the case. */
  raw: string;
};

export function cameraErrorHelp(raw: string | null | undefined): CameraErrorHelp | null {
  if (!raw) return null;
  const text = String(raw);
  const lower = text.toLowerCase();

  if (lower.includes("401") || lower.includes("unauthorized") || lower.includes("authorization failed")) {
    return {
      guidance:
        "The camera refused the connection because it wants a username and password. RTSP carries them in the URL: rtsp://user:pass@host:554/stream1",
      raw: text,
    };
  }
  if (lower.includes("403") || lower.includes("forbidden")) {
    return {
      guidance:
        "The camera accepted the credentials but refused this stream. Check the account is allowed to view it, and that the stream path is the right one.",
      raw: text,
    };
  }
  if (lower.includes("404") || lower.includes("not found")) {
    return {
      guidance: "That stream path does not exist on the camera. Check the path after the host (often /stream1, /h264, or /live).",
      raw: text,
    };
  }
  if (lower.includes("timed out") || lower.includes("timeout") || lower.includes("etimedout")) {
    return {
      guidance: "The camera did not answer in time. Check it is powered on and on the same network as the Pi.",
      raw: text,
    };
  }
  if (lower.includes("connection refused") || lower.includes("econnrefused")) {
    return {
      guidance: "Nothing is listening on that address and port. Check the host and that the camera's RTSP server is switched on.",
      raw: text,
    };
  }
  if (lower.includes("no route to host") || lower.includes("ehostunreach") || lower.includes("name or service not known")) {
    return {
      guidance: "The Pi cannot reach that address at all. Check the host name or IP, and that it is on a network the Pi can see.",
      raw: text,
    };
  }
  return { guidance: text, raw: text };
}
