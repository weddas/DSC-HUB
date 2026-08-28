/** Parse FastAPI / plain error bodies into a short operator-facing message. */
export function formatApiError(raw: string | undefined | null, fallback = "Request failed"): string {
  const text = (raw || "").trim();
  if (!text) return fallback;
  try {
    const parsed = JSON.parse(text) as { detail?: unknown; message?: unknown };
    const detail = parsed.detail ?? parsed.message;
    if (typeof detail === "string" && detail.trim()) return detail.trim();
    if (Array.isArray(detail)) {
      const parts = detail
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object" && "msg" in item) {
            return String((item as { msg: unknown }).msg);
          }
          return "";
        })
        .filter(Boolean);
      if (parts.length) return parts.join("; ");
    }
  } catch {
    /* plain text */
  }
  return text.length > 180 ? `${text.slice(0, 177)}…` : text;
}
