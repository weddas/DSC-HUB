import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { getPreference } from "../lib/preferences";

/** Default open delay — Preferences › Home › Tooltip open delay. */
const openDelayMs = () => getPreference("tooltipDelayMs");

/**
 * Hover / focus tooltip (plan § Interaction): opens after 300 ms of hover, at once on
 * keyboard focus; on touch the first tap opens it and the second tap falls through to
 * the child's own click ("first tap = tooltip, second tap = open"). The content is
 * mounted only while open, so a content component may fetch history on demand.
 * Purely presentational: it never invents a value — callers pass what the bus knows.
 */
export function Tooltip({
  content,
  children,
  delay = openDelayMs(),
}: {
  content: ReactNode;
  children: ReactElement<Record<string, unknown>>;
  delay?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const timer = useRef<number | null>(null);
  const touchOpened = useRef(false);

  const clear = () => {
    if (timer.current != null) window.clearTimeout(timer.current);
    timer.current = null;
  };
  const place = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const above = r.top > 160;
    setPos({ top: above ? r.top - 8 : r.bottom + 8, left: Math.min(Math.max(r.left + r.width / 2, 140), window.innerWidth - 140), above });
  }, []);
  const show = useCallback(() => {
    clear();
    place();
    setOpen(true);
  }, [place]);
  const hide = useCallback(() => {
    clear();
    setOpen(false);
    touchOpened.current = false;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    const onScroll = () => hide();
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, hide]);
  useEffect(() => clear, []);

  if (!isValidElement(children)) return children;
  const childProps = children.props;
  const compose =
    (name: string, fn: (e: unknown) => void) =>
    (e: unknown) => {
      (childProps[name] as ((e: unknown) => void) | undefined)?.(e);
      fn(e);
    };

  const trigger = cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      anchorRef.current = node;
      const r = (children as ReactElement & { ref?: unknown }).ref;
      if (typeof r === "function") r(node);
      else if (r && typeof r === "object") (r as { current: HTMLElement | null }).current = node;
    },
    "aria-describedby": open ? id : undefined,
    onPointerEnter: compose("onPointerEnter", (e) => {
      if ((e as PointerEvent).pointerType === "touch") return;
      clear();
      timer.current = window.setTimeout(show, delay);
    }),
    onPointerLeave: compose("onPointerLeave", () => hide()),
    onFocus: compose("onFocus", () => show()),
    onBlur: compose("onBlur", () => hide()),
    onTouchEnd: compose("onTouchEnd", (e) => {
      if (!touchOpened.current) {
        (e as TouchEvent).preventDefault();
        touchOpened.current = true;
        show();
      }
    }),
  } as Record<string, unknown>);

  return (
    <>
      {trigger}
      {open && pos
        ? createPortal(
            <div
              id={id}
              role="tooltip"
              className={`dsc-tooltip${pos.above ? " is-above" : " is-below"}`}
              style={{ top: pos.top, left: pos.left }}
            >
              {content}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/** One labelled row inside a tooltip — mono key on the left, value on the right. */
export function TipRow({ k, v, tone }: { k: string; v: ReactNode; tone?: "ok" | "warn" | "bad" | "muted" }) {
  return (
    <div className={`dsc-tooltip-row${tone ? ` is-${tone}` : ""}`}>
      <span className="dsc-tooltip-k">{k}</span>
      <span className="dsc-tooltip-v">{v}</span>
    </div>
  );
}
